import Graphics from "../core/Graphics";
import Utils from "../core/Utils";
import AudioManager from "../managers/AudioManager";
import ImageManager from "../managers/ImageManager";
import Game_CommonEvent, { Game_CommonEvent_OnLoad } from "./Game_CommonEvent";
import Game_Event, { Game_Event_OnLoad } from "./Game_Event";
import Game_Interpreter, { Game_Interpreter_OnLoad } from "./Game_Interpreter";
import Game_Vehicle, { Game_Vehicle_OnLoad } from "./Game_Vehicle";
import ConfigManager from "../managers/ConfigManager";

export interface Game_Map_OnLoad {
    tileEvents: any[];
    _needsRefresh: boolean;
    _interpreter: Game_Interpreter_OnLoad;
    _mapId: number;
    _tilesetId: number;
    _events: Game_Event_OnLoad[];
    _commonEvents: Game_CommonEvent_OnLoad[];
    _vehicles: Game_Vehicle_OnLoad[];
    _displayX: number;
    _displayY: number;
    _nameDisplay: boolean;
    _scrollDirection: number;
    _scrollRest: number;
    _scrollSpeed: number;
    _parallaxName: string;
    _parallaxZero: boolean;
    _parallaxLoopX: boolean;
    _parallaxLoopY: boolean;
    _parallaxSx: number;
    _parallaxSy: number;
    _parallaxX: number;
    _parallaxY: number;
    _battleback1Name: any;
    _battleback2Name: any;
}

export default class Game_Map {
    public tileEvents: any[];
    private _needsRefresh: boolean;
    private _interpreter: Game_Interpreter;
    private _mapId: number;
    private _tilesetId: number;
    private _events: Game_Event[];
    private _commonEvents: Game_CommonEvent[];
    private _vehicles: Game_Vehicle[];
    private _displayX: number;
    private _displayY: number;
    private _nameDisplay: boolean;
    private _scrollDirection: number;
    private _scrollRest: number;
    private _scrollSpeed: number;
    private _parallaxName: string;
    private _parallaxZero: boolean;
    private _parallaxLoopX: boolean;
    private _parallaxLoopY: boolean;
    private _parallaxSx: number;
    private _parallaxSy: number;
    private _parallaxX: number;
    private _parallaxY: number;
    private _battleback1Name: any;
    private _battleback2Name: any;

    public constructor(gameLoadInput?: Game_Map_OnLoad) {
        this._interpreter = new Game_Interpreter();
        this._mapId = 0;
        this._tilesetId = 0;
        this._events = [];
        this._commonEvents = [];
        this._vehicles = [];
        this._displayX = 0;
        this._displayY = 0;
        this._nameDisplay = true;
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
        this._parallaxName = "";
        this._parallaxZero = false;
        this._parallaxLoopX = false;
        this._parallaxLoopY = false;
        this._parallaxSx = 0;
        this._parallaxSy = 0;
        this._parallaxX = 0;
        this._parallaxY = 0;
        this._battleback1Name = null;
        this._battleback2Name = null;
        this.createVehicles();

        if (gameLoadInput) {
            this.tileEvents = gameLoadInput.tileEvents;
            this._needsRefresh = gameLoadInput._needsRefresh;
            this._interpreter = new Game_Interpreter(
                gameLoadInput._interpreter
            );
            this._mapId = gameLoadInput._mapId;
            this._tilesetId = gameLoadInput._tilesetId;

            this._events = [];

            for (const event of gameLoadInput._events) {
                if (event) {
                    this._events.push(
                        new Game_Event(event._mapId, event._eventId, event)
                    );
                } else {
                    this._events.push(null);
                }
            }

            this._commonEvents = [];
            for (const event of gameLoadInput._commonEvents) {
                this._commonEvents.push(
                    new Game_CommonEvent(event._commonEventId, event)
                );
            }
            this._vehicles = [];
            for (const vehicle of gameLoadInput._vehicles) {
                this._vehicles.push(new Game_Vehicle(vehicle._type, vehicle));
            }
            this._displayX = gameLoadInput._displayX;
            this._displayY = gameLoadInput._displayY;
            this._nameDisplay = gameLoadInput._nameDisplay;
            this._scrollDirection = gameLoadInput._scrollDirection;
            this._scrollRest = gameLoadInput._scrollRest;
            this._scrollSpeed = gameLoadInput._scrollSpeed;
            this._parallaxName = gameLoadInput._parallaxName;
            this._parallaxZero = gameLoadInput._parallaxZero;
            this._parallaxLoopX = gameLoadInput._parallaxLoopX;
            this._parallaxLoopY = gameLoadInput._parallaxLoopY;
            this._parallaxSx = gameLoadInput._parallaxSx;
            this._parallaxSy = gameLoadInput._parallaxSy;
            this._parallaxX = gameLoadInput._parallaxX;
            this._parallaxY = gameLoadInput._parallaxY;
            this._battleback1Name = gameLoadInput._battleback1Name;
            this._battleback2Name = gameLoadInput._battleback2Name;
        }
    }

    public setup(mapId: number) {
        if (!$dataMap) {
            throw new Error("The map data is not available");
        }
        this._mapId = mapId;
        this._tilesetId = $dataMap.tilesetId;
        this._displayX = 0;
        this._displayY = 0;
        this.refereshVehicles();
        this.setupEvents();
        this.setupScroll();
        this.setupParallax();
        this.setupBattleback();
        this._needsRefresh = false;
    }

    public isEventRunning() {
        return this._interpreter.isRunning() || this.isAnyEventStarting();
    }

    /**
     * The assumed width of a tile in pixels
     * @returns 48
     */
    public tileWidth() {
        return 48;
    }

    /**
     * The assumed height of a tile in pixels
     * @returns 48
     */
    public tileHeight() {
        return 48;
    }

    public mapId() {
        return this._mapId;
    }

    public tilesetId() {
        return this._tilesetId;
    }

    public displayX() {
        return this._displayX;
    }

    public displayY() {
        return this._displayY;
    }

    public parallaxName() {
        return this._parallaxName;
    }

    public battleback1Name() {
        return this._battleback1Name;
    }

    public battleback2Name() {
        return this._battleback2Name;
    }

    public requestRefresh(mapId?: undefined) {
        this._needsRefresh = true;
    }

    public isNameDisplayEnabled() {
        return this._nameDisplay;
    }

    public disableNameDisplay() {
        this._nameDisplay = false;
    }

    public enableNameDisplay() {
        this._nameDisplay = true;
    }

    public createVehicles() {
        this._vehicles = [];
        this._vehicles[0] = new Game_Vehicle("boat");
        this._vehicles[1] = new Game_Vehicle("ship");
        this._vehicles[2] = new Game_Vehicle("airship");
    }

    public refereshVehicles() {
        this._vehicles.forEach(function(vehicle) {
            vehicle.refresh();
        });
    }

    public vehicles() {
        return this._vehicles;
    }

    public vehicle(type: string | number) {
        if (type === 0 || type === "boat") {
            return this.boat();
        } else if (type === 1 || type === "ship") {
            return this.ship();
        } else if (type === 2 || type === "airship") {
            return this.airship();
        } else {
            return null;
        }
    }

    public boat() {
        return this._vehicles[0];
    }

    public ship() {
        return this._vehicles[1];
    }

    public airship() {
        return this._vehicles[2];
    }

    public setupEvents() {
        this._events = [];
        for (let i = 0; i < $dataMap.events.length; i++) {
            if ($dataMap.events[i]) {
                this._events[i] = new Game_Event(this._mapId, i);
            }
        }
        this._commonEvents = this.parallelCommonEvents().map(
            function(commonEvent: { id: number }) {
                return new Game_CommonEvent(commonEvent.id);
            }
        );
        this.refreshTileEvents();
    }

    public events() {
        return this._events.filter(function(event) {
            return !!event;
        });
    }

    public event(eventId: string | number) {
        return this._events[eventId];
    }

    public eraseEvent(eventId: number) {
        this._events[eventId].erase();
    }

    public parallelCommonEvents() {
        return $dataCommonEvents.filter(function(commonEvent: {
            trigger: number;
        }) {
            return commonEvent && commonEvent.trigger === 2;
        });
    }

    public setupScroll() {
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
    }

    public setupParallax() {
        this._parallaxName = $dataMap.parallaxName || "";
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        this._parallaxLoopX = $dataMap.parallaxLoopX;
        this._parallaxLoopY = $dataMap.parallaxLoopY;
        this._parallaxSx = $dataMap.parallaxSx;
        this._parallaxSy = $dataMap.parallaxSy;
        this._parallaxX = 0;
        this._parallaxY = 0;
    }

    public setupBattleback() {
        if ($dataMap.specifyBattleback) {
            this._battleback1Name = $dataMap.battleback1Name;
            this._battleback2Name = $dataMap.battleback2Name;
        } else {
            this._battleback1Name = null;
            this._battleback2Name = null;
        }
    }

    public setDisplayPos(x: number, y: number) {
        if (this.isLoopHorizontal()) {
            this._displayX = x % this.width();
            this._parallaxX = x;
        } else {
            const endX = this.width() - this.screenTileX();
            this._displayX = endX < 0 ? endX / 2 : Utils.clamp(x, 0, endX);
            this._parallaxX = this._displayX;
        }
        if (this.isLoopVertical()) {
            this._displayY = y % this.height();
            this._parallaxY = y;
        } else {
            const endY = this.height() - this.screenTileY();
            this._displayY = endY < 0 ? endY / 2 : Utils.clamp(y, 0, endY);
            this._parallaxY = this._displayY;
        }
    }

    public parallaxOx() {
        if (this._parallaxZero) {
            return this._parallaxX * this.tileWidth();
        } else if (this._parallaxLoopX) {
            return (this._parallaxX * this.tileWidth()) / 2;
        } else {
            return 0;
        }
    }

    public parallaxOy() {
        if (this._parallaxZero) {
            return this._parallaxY * this.tileHeight();
        } else if (this._parallaxLoopY) {
            return (this._parallaxY * this.tileHeight()) / 2;
        } else {
            return 0;
        }
    }

    public tileset() {
        return $dataTilesets[this._tilesetId];
    }

    public tilesetFlags() {
        const tileset = this.tileset();
        if (tileset) {
            return tileset.flags;
        } else {
            return [];
        }
    }

    public displayName() {
        return $dataMap.displayName;
    }

    public width() {
        return $dataMap.width;
    }

    public height() {
        return $dataMap.height;
    }

    public data() {
        return $dataMap.data;
    }

    public isLoopHorizontal() {
        return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
    }

    public isLoopVertical() {
        return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
    }

    public isDashDisabled() {
        return $dataMap.disableDashing;
    }

    public encounterList() {
        return $dataMap.encounterList;
    }

    public encounterStep() {
        return $dataMap.encounterStep;
    }

    public isOverworld() {
        return this.tileset() && this.tileset().mode === 0;
    }

    public screenTileX() {
        // return Graphics.width / this.tileWidth();
        return ConfigManager.fieldResolution.widthPx / this.tileWidth();
    }

    public screenTileY() {
        // return Graphics.height / this.tileHeight();
        return ConfigManager.fieldResolution.heightPx / this.tileHeight();
    }

    public adjustX(x: number) {
        if (
            this.isLoopHorizontal() &&
            x < this._displayX - (this.width() - this.screenTileX()) / 2
        ) {
            return x - this._displayX + $dataMap.width;
        } else {
            return x - this._displayX;
        }
    }

    public adjustY(y: number) {
        if (
            this.isLoopVertical() &&
            y < this._displayY - (this.height() - this.screenTileY()) / 2
        ) {
            return y - this._displayY + $dataMap.height;
        } else {
            return y - this._displayY;
        }
    }

    public roundX(x: number) {
        return this.isLoopHorizontal() ? x % this.width() : x;
    }

    public roundY(y: number) {
        return this.isLoopVertical() ? y % this.height() : y;
    }

    public xWithDirection(x: number, d: number) {
        return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
    }

    public yWithDirection(y: number, d: number) {
        return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
    }

    public roundXWithDirection(x: number, d: number) {
        return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
    }

    public roundYWithDirection(y: number, d: number) {
        return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
    }

    public deltaX(x1: number, x2: number) {
        let result = x1 - x2;
        if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
            if (result < 0) {
                result += this.width();
            } else {
                result -= this.width();
            }
        }
        return result;
    }

    public deltaY(y1: number, y2: number) {
        let result = y1 - y2;
        if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
            if (result < 0) {
                result += this.height();
            } else {
                result -= this.height();
            }
        }
        return result;
    }

    public distance(x1: number, y1: number, x2: any, y2: any) {
        return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
    }

    public canvasToMapX(x: number) {
        const tileWidth = this.tileWidth();
        const originX = this._displayX * tileWidth;
        const mapX = Math.floor((originX + x) / tileWidth);
        return this.roundX(mapX);
    }

    public canvasToMapY(y: number) {
        const tileHeight = this.tileHeight();
        const originY = this._displayY * tileHeight;
        const mapY = Math.floor((originY + y) / tileHeight);
        return this.roundY(mapY);
    }

    public autoplay() {
        if ($dataMap.autoplayBgm) {
            if ($gamePlayer.isInVehicle()) {
                $gameSystem.saveWalkingBgm2();
            } else {
                AudioManager.playBgm($dataMap.bgm);
            }
        }
        if ($dataMap.autoplayBgs) {
            AudioManager.playBgs($dataMap.bgs);
        }
    }

    public refreshIfNeeded() {
        if (this._needsRefresh) {
            this.refresh();
        }
    }

    public refresh() {
        this.events().forEach(function(event) {
            event.refresh();
        });
        this._commonEvents.forEach(function(event) {
            event.refresh();
        });
        this.refreshTileEvents();
        this._needsRefresh = false;
    }

    public refreshTileEvents() {
        this.tileEvents = this.events().filter(function(event) {
            return event.isTile();
        });
    }

    public eventsXy(x: number, y: number) {
        return this.events().filter(function(event) {
            return event.pos(x, y);
        });
    }

    public eventsXyNt(x: any, y: any) {
        return this.events().filter(function(event) {
            return event.posNt(x, y);
        });
    }

    public tileEventsXy(x: any, y: any) {
        return this.tileEvents.filter(function(event) {
            return event.posNt(x, y);
        });
    }

    public eventIdXy(x: any, y: any) {
        const list = this.eventsXy(x, y);
        return list.length === 0 ? 0 : list[0].eventId();
    }

    public scrollDown(distance: number) {
        if (this.isLoopVertical()) {
            this._displayY += distance;
            this._displayY %= $dataMap.height;
            if (this._parallaxLoopY) {
                this._parallaxY += distance;
            }
        } else if (this.height() >= this.screenTileY()) {
            const lastY = this._displayY;
            this._displayY = Math.min(
                this._displayY + distance,
                this.height() - this.screenTileY()
            );
            this._parallaxY += this._displayY - lastY;
        }
    }

    public scrollLeft(distance: number) {
        if (this.isLoopHorizontal()) {
            this._displayX += $dataMap.width - distance;
            this._displayX %= $dataMap.width;
            if (this._parallaxLoopX) {
                this._parallaxX -= distance;
            }
        } else if (this.width() >= this.screenTileX()) {
            const lastX = this._displayX;
            this._displayX = Math.max(this._displayX - distance, 0);
            this._parallaxX += this._displayX - lastX;
        }
    }

    public scrollRight(distance: number) {
        if (this.isLoopHorizontal()) {
            this._displayX += distance;
            this._displayX %= $dataMap.width;
            if (this._parallaxLoopX) {
                this._parallaxX += distance;
            }
        } else if (this.width() >= this.screenTileX()) {
            const lastX = this._displayX;
            this._displayX = Math.min(
                this._displayX + distance,
                this.width() - this.screenTileX()
            );
            this._parallaxX += this._displayX - lastX;
        }
    }

    public scrollUp(distance: number) {
        if (this.isLoopVertical()) {
            this._displayY += $dataMap.height - distance;
            this._displayY %= $dataMap.height;
            if (this._parallaxLoopY) {
                this._parallaxY -= distance;
            }
        } else if (this.height() >= this.screenTileY()) {
            const lastY = this._displayY;
            this._displayY = Math.max(this._displayY - distance, 0);
            this._parallaxY += this._displayY - lastY;
        }
    }

    public isValid(x: number, y: number) {
        return x >= 0 && x < this.width() && y >= 0 && y < this.height();
    }

    public checkPassage(x: any, y: any, bit: number) {
        const flags = this.tilesetFlags();
        const tiles = this.allTiles(x, y);
        for (let i = 0; i < tiles.length; i++) {
            const flag = flags[tiles[i]];
            if ((flag & 0x10) !== 0) {
                // [*] No effect on passage
                continue;
            }
            if ((flag & bit) === 0) {
                // [o] Passable
                return true;
            }
            if ((flag & bit) === bit) {
                // [x] Impassable
                return false;
            }
        }
        return false;
    }

    public tileId(x: number, y: number, z: number) {
        const width = $dataMap.width;
        const height = $dataMap.height;
        return $dataMap.data[(z * height + y) * width + x] || 0;
    }

    public layeredTiles(x: any, y: any) {
        const tiles = [];
        for (let i = 0; i < 4; i++) {
            tiles.push(this.tileId(x, y, 3 - i));
        }
        return tiles;
    }

    public allTiles(x: any, y: any) {
        const tiles = this.tileEventsXy(x, y).map(function(event) {
            return event.tileId();
        });
        return tiles.concat(this.layeredTiles(x, y));
    }

    public autotileType(x: number, y: number, z: any) {
        const tileId = this.tileId(x, y, z);
        return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
    }

    public isPassable(x: any, y: any, d: number) {
        return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
    }

    public isBoatPassable(x: any, y: any) {
        return this.checkPassage(x, y, 0x0200);
    }

    public isShipPassable(x: any, y: any) {
        return this.checkPassage(x, y, 0x0400);
    }

    public isAirshipLandOk(x: any, y: any) {
        return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
    }

    public checkLayeredTilesFlags(x: any, y: any, bit: number) {
        const flags = this.tilesetFlags();
        return this.layeredTiles(x, y).some(function(tileId) {
            return (flags[tileId] & bit) !== 0;
        });
    }

    public isLadder(x: number, y: number) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
    }

    public isBush(x: number, y: number) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
    }

    public isCounter(x: any, y: any) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
    }

    public isDamageFloor(x: number, y: number) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
    }

    public terrainTag(x: number, y: number) {
        if (this.isValid(x, y)) {
            const flags = this.tilesetFlags();
            const tiles = this.layeredTiles(x, y);
            for (let i = 0; i < tiles.length; i++) {
                const tag = flags[tiles[i]] >> 12;
                if (tag > 0) {
                    return tag;
                }
            }
        }
        return 0;
    }

    public regionId(x: number, y: number) {
        return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
    }

    public startScroll(direction: number, distance: number, speed: number) {
        this._scrollDirection = direction;
        this._scrollRest = distance;
        this._scrollSpeed = speed;
    }

    public isScrolling() {
        return this._scrollRest > 0;
    }

    public update(sceneActive: boolean) {
        this.refreshIfNeeded();
        if (sceneActive) {
            this.updateInterpreter();
        }
        this.updateScroll();
        this.updateEvents();
        this.updateVehicles();
        this.updateParallax();
    }

    public updateScroll() {
        if (this.isScrolling()) {
            const lastX = this._displayX;
            const lastY = this._displayY;
            this.doScroll(this._scrollDirection, this.scrollDistance());
            if (this._displayX === lastX && this._displayY === lastY) {
                this._scrollRest = 0;
            } else {
                this._scrollRest -= this.scrollDistance();
            }
        }
    }

    public scrollDistance() {
        return Math.pow(2, this._scrollSpeed) / 256;
    }

    public doScroll(direction: number, distance: number) {
        switch (direction) {
            case 2:
                this.scrollDown(distance);
                break;
            case 4:
                this.scrollLeft(distance);
                break;
            case 6:
                this.scrollRight(distance);
                break;
            case 8:
                this.scrollUp(distance);
                break;
        }
    }

    public updateEvents() {
        this.events().forEach(function(event) {
            event.update();
        });
        this._commonEvents.forEach(function(event) {
            event.update();
        });
    }

    public updateVehicles() {
        this._vehicles.forEach(function(vehicle) {
            vehicle.update();
        });
    }

    public updateParallax() {
        if (this._parallaxLoopX) {
            this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
        }
        if (this._parallaxLoopY) {
            this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
        }
    }

    public changeTileset(tilesetId: number) {
        this._tilesetId = tilesetId;
        this.refresh();
    }

    public changeBattleback(battleback1Name: any, battleback2Name: any) {
        this._battleback1Name = battleback1Name;
        this._battleback2Name = battleback2Name;
    }

    public changeParallax(
        name: string,
        loopX: boolean,
        loopY: boolean,
        sx: number,
        sy: number
    ) {
        this._parallaxName = name;
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        if (this._parallaxLoopX && !loopX) {
            this._parallaxX = 0;
        }
        if (this._parallaxLoopY && !loopY) {
            this._parallaxY = 0;
        }
        this._parallaxLoopX = loopX;
        this._parallaxLoopY = loopY;
        this._parallaxSx = sx;
        this._parallaxSy = sy;
    }

    public updateInterpreter() {
        while (true) {
            this._interpreter.update();
            if (this._interpreter.isRunning()) {
                return;
            }
            if (this._interpreter.eventId() > 0) {
                this.unlockEvent(this._interpreter.eventId());
                this._interpreter.clear();
            }
            if (!this.setupStartingEvent()) {
                return;
            }
        }
    }

    public unlockEvent(eventId: number) {
        if (this._events[eventId]) {
            this._events[eventId].unlock();
        }
    }

    public setupStartingEvent() {
        this.refreshIfNeeded();
        if (this._interpreter.setupReservedCommonEvent()) {
            return true;
        }
        if (this.setupTestEvent()) {
            return true;
        }
        if (this.setupStartingMapEvent()) {
            return true;
        }
        if (this.setupAutorunCommonEvent()) {
            return true;
        }
        return false;
    }

    public setupTestEvent() {
        if ($testEvent) {
            this._interpreter.setup($testEvent, 0);
            $testEvent = null;
            return true;
        }
        return false;
    }

    public setupStartingMapEvent() {
        const events = this.events();
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            if (event.isStarting()) {
                event.clearStartingFlag();
                this._interpreter.setup(event.list(), event.eventId());
                return true;
            }
        }
        return false;
    }

    public setupAutorunCommonEvent() {
        for (let i = 0; i < $dataCommonEvents.length; i++) {
            const event = $dataCommonEvents[i];
            if (
                event &&
                event.trigger === 1 &&
                $gameSwitches.value(event.switchId)
            ) {
                this._interpreter.setup(event.list);
                return true;
            }
        }
        return false;
    }

    public isAnyEventStarting() {
        return this.events().some(function(event) {
            return event.isStarting();
        });
    }
}
