import Graphics from "../core/Graphics";
import Input from "../core/Input";
import TouchInput from "../core/TouchInput";
import Utils from "../core/Utils";
import BattleManager from "../managers/BattleManager";
import ConfigManager from "../managers/ConfigManager";

import Game_Character, { Game_Character_OnLoad } from "./Game_Character";
import Game_Followers, { Game_Followers_OnLoad } from "./Game_Followers";

export interface Game_Player_OnLoad extends Game_Character_OnLoad {
    _followers: Game_Followers_OnLoad;
    _vehicleType: string;
    _vehicleGettingOn: boolean;
    _vehicleGettingOff: boolean;
    _dashing: boolean;
    _needsMapReload: boolean;
    _transferring: boolean;
    _newMapId: number;
    _newX: number;
    _newY: number;
    _newDirection: number;
    _fadeType: number;
    _encounterCount: number;
}

export default class Game_Player extends Game_Character {
    private _followers: Game_Followers;
    private _vehicleType: string;
    private _vehicleGettingOn: boolean;
    private _vehicleGettingOff: boolean;
    private _dashing: boolean;
    private _needsMapReload: boolean;
    private _transferring: boolean;
    private _newMapId: number;
    private _newX: number;
    private _newY: number;
    private _newDirection: number;
    private _fadeType: number;
    private _encounterCount: number;

    public constructor(gameLoadInput?: Game_Player_OnLoad) {
        super(gameLoadInput);

        this.setTransparent($dataSystem.optTransparent);

        if (gameLoadInput) {
            this._followers = new Game_Followers(gameLoadInput._followers);
            this._vehicleType = gameLoadInput._vehicleType;
            this._vehicleGettingOn = gameLoadInput._vehicleGettingOn;
            this._vehicleGettingOff = gameLoadInput._vehicleGettingOff;
            this._dashing = gameLoadInput._dashing;
            this._needsMapReload = gameLoadInput._needsMapReload;
            this._transferring = gameLoadInput._transferring;
            this._newMapId = gameLoadInput._newMapId;
            this._newX = gameLoadInput._newX;
            this._newY = gameLoadInput._newY;
            this._newDirection = gameLoadInput._newDirection;
            this._fadeType = gameLoadInput._fadeType;
            this._encounterCount = gameLoadInput._encounterCount;
        }
    }

    public followers(): Game_Followers {
        return this._followers;
    }

    public initMembers() {
        super.initMembers();
        this._vehicleType = "walk";
        this._vehicleGettingOn = false;
        this._vehicleGettingOff = false;
        this._dashing = false;
        this._needsMapReload = false;
        this._transferring = false;
        this._newMapId = 0;
        this._newX = 0;
        this._newY = 0;
        this._newDirection = 0;
        this._fadeType = 0;
        this._followers = new Game_Followers();
        this._encounterCount = 0;
    }

    public clearTransferInfo() {
        this._transferring = false;
        this._newMapId = 0;
        this._newX = 0;
        this._newY = 0;
        this._newDirection = 0;
    }

    public refresh() {
        const actor = $gameParty.leader();
        const characterName = actor ? actor.characterName() : "";
        const characterIndex = actor ? actor.characterIndex() : 0;
        this.setImage(characterName, characterIndex);
        this._followers.refresh();
    }

    public isStopping() {
        if (this._vehicleGettingOn || this._vehicleGettingOff) {
            return false;
        }
        return super.isStopping();
    }

    public reserveTransfer(
        mapId: number,
        x: number,
        y: number,
        d?: number,
        fadeType?: number
    ) {
        this._transferring = true;
        this._newMapId = mapId;
        this._newX = x;
        this._newY = y;
        this._newDirection = d;
        this._fadeType = fadeType;
    }

    public requestMapReload() {
        this._needsMapReload = true;
    }

    public isTransferring() {
        return this._transferring;
    }

    public newMapId() {
        return this._newMapId;
    }

    public fadeType() {
        return this._fadeType;
    }

    public performTransfer() {
        if (this.isTransferring()) {
            this.setDirection(this._newDirection);
            if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
                $gameMap.setup(this._newMapId);
                this._needsMapReload = false;
            }
            this.locate(this._newX, this._newY);
            this.refresh();
            this.clearTransferInfo();
        }
    }

    public isMapPassable(x: any, y: any, d: any) {
        const vehicle = this.vehicle();
        if (vehicle) {
            return vehicle.isMapPassable(x, y, d);
        } else {
            return super.isMapPassable(x, y, d);
        }
    }

    public vehicle() {
        return $gameMap.vehicle(this._vehicleType);
    }

    public isInBoat() {
        return this._vehicleType === "boat";
    }

    public isInShip() {
        return this._vehicleType === "ship";
    }

    public isInAirship() {
        return this._vehicleType === "airship";
    }

    public isInVehicle() {
        return this.isInBoat() || this.isInShip() || this.isInAirship();
    }

    public isNormal() {
        return this._vehicleType === "walk" && !this.isMoveRouteForcing();
    }

    public isDashing() {
        return this._dashing;
    }

    public isDebugThrough() {
        return Input.isPressed("control") && $gameTemp.isPlaytest();
    }

    public isCollided(x: any, y: any) {
        if (this.isThrough()) {
            return false;
        } else {
            return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
        }
    }

    public centerX() {
        return (
            (ConfigManager.fieldResolution.widthPx / $gameMap.tileWidth() - 1) /
            2
        );
    }

    public centerY() {
        return (
            (ConfigManager.fieldResolution.heightPx / $gameMap.tileHeight() -
                1) /
            2
        );
    }

    public center(x: number, y: number) {
        return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
    }

    public locate(x: number, y: number) {
        super.locate(x, y);
        this.center(x, y);
        this.makeEncounterCount();
        if (this.isInVehicle()) {
            this.vehicle().refresh();
        }
        this._followers.synchronize(x, y, this.direction());
    }

    public increaseSteps() {
        super.increaseSteps();
        if (this.isNormal()) {
            $gameParty.increaseSteps();
        }
    }

    public makeEncounterCount() {
        const n = $gameMap.encounterStep();
        this._encounterCount = Utils.randomInt(n) + Utils.randomInt(n) + 1;
    }

    public makeEncounterTroopId() {
        const encounterList = [];
        let weightSum = 0;
        $gameMap
            .encounterList()
            .forEach(function(encounter: { weight: number }) {
                if (this.meetsEncounterConditions(encounter)) {
                    encounterList.push(encounter);
                    weightSum += encounter.weight;
                }
            }, this);
        if (weightSum > 0) {
            let value = Utils.randomInt(weightSum);
            for (let i = 0; i < encounterList.length; i++) {
                value -= encounterList[i].weight;
                if (value < 0) {
                    return encounterList[i].troopId;
                }
            }
        }
        return 0;
    }

    public meetsEncounterConditions(encounter: {
        regionSet: { length: number; indexOf: (arg0: any) => number };
    }) {
        return (
            encounter.regionSet.length === 0 ||
            encounter.regionSet.indexOf(this.regionId()) > -1
        );
    }

    public executeEncounter() {
        if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
            this.makeEncounterCount();
            const troopId = this.makeEncounterTroopId();
            if ($dataTroops[troopId]) {
                BattleManager.setup(troopId, true, false);
                BattleManager.onEncounter();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public startMapEvent(
        x: number,
        y: number,
        triggers: number[],
        normal: boolean
    ) {
        if (!$gameMap.isEventRunning()) {
            $gameMap.eventsXy(x, y).forEach(function(event) {
                if (
                    event.isTriggerIn(triggers) &&
                    event.isNormalPriority() === normal
                ) {
                    event.start();
                }
            });
        }
    }

    public moveByInput() {
        if (!this.isMoving() && this.canMove()) {
            let direction = this.getInputDirection();
            if (direction > 0) {
                $gameTemp.clearDestination();
            } else if ($gameTemp.isDestinationValid()) {
                const x = $gameTemp.destinationX();
                const y = $gameTemp.destinationY();
                direction = this.findDirectionTo(x, y);
            }
            if (direction > 0) {
                this.executeMove(direction);
            }
        }
    }

    public canMove() {
        if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
            return false;
        }
        if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
            return false;
        }
        if (this._vehicleGettingOn || this._vehicleGettingOff) {
            return false;
        }
        if (this.isInVehicle() && !this.vehicle().canMove()) {
            return false;
        }
        return true;
    }

    public getInputDirection() {
        return Input.dir4;
    }

    public executeMove(direction: number) {
        this.moveStraight(direction);
    }

    public update(sceneActive?: boolean) {
        const lastScrolledX = this.scrolledX();
        const lastScrolledY = this.scrolledY();
        const wasMoving = this.isMoving();
        this.updateDashing();
        if (sceneActive) {
            this.moveByInput();
        }
        super.update();
        this.updateScroll(lastScrolledX, lastScrolledY);
        this.updateVehicle();
        if (!this.isMoving()) {
            this.updateNonmoving(wasMoving);
        }
        this._followers.update();
    }

    public updateDashing() {
        if (this.isMoving()) {
            return;
        }
        if (
            this.canMove() &&
            !this.isInVehicle() &&
            !$gameMap.isDashDisabled()
        ) {
            this._dashing =
                this.isDashButtonPressed() || $gameTemp.isDestinationValid();
        } else {
            this._dashing = false;
        }
    }

    public isDashButtonPressed() {
        const shift = Input.isPressed("shift");
        if (ConfigManager.alwaysDash) {
            return !shift;
        } else {
            return shift;
        }
    }

    public updateScroll(lastScrolledX: any, lastScrolledY: any) {
        const x1 = lastScrolledX;
        const y1 = lastScrolledY;
        const x2 = this.scrolledX();
        const y2 = this.scrolledY();
        if (y2 > y1 && y2 > this.centerY()) {
            $gameMap.scrollDown(y2 - y1);
        }
        if (x2 < x1 && x2 < this.centerX()) {
            $gameMap.scrollLeft(x1 - x2);
        }
        if (x2 > x1 && x2 > this.centerX()) {
            $gameMap.scrollRight(x2 - x1);
        }
        if (y2 < y1 && y2 < this.centerY()) {
            $gameMap.scrollUp(y1 - y2);
        }
    }

    public updateVehicle() {
        if (this.isInVehicle() && !this.areFollowersGathering()) {
            if (this._vehicleGettingOn) {
                this.updateVehicleGetOn();
            } else if (this._vehicleGettingOff) {
                this.updateVehicleGetOff();
            } else {
                this.vehicle().syncWithPlayer();
            }
        }
    }

    public updateVehicleGetOn() {
        if (!this.areFollowersGathering() && !this.isMoving()) {
            this.setDirection(this.vehicle().direction());
            this.setMoveSpeed(this.vehicle().moveSpeed());
            this._vehicleGettingOn = false;
            this.setTransparent(true);
            if (this.isInAirship()) {
                this.setThrough(true);
            }
            this.vehicle().getOn();
        }
    }

    public updateVehicleGetOff() {
        if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
            this._vehicleGettingOff = false;
            this._vehicleType = "walk";
            this.setTransparent(false);
        }
    }

    public updateNonmoving(wasMoving: boolean) {
        if (!$gameMap.isEventRunning()) {
            if (wasMoving) {
                $gameParty.onPlayerWalk();
                this.checkEventTriggerHere([1, 2]);
                if ($gameMap.setupStartingEvent()) {
                    return;
                }
            }
            if (this.triggerAction()) {
                return;
            }
            if (wasMoving) {
                this.updateEncounterCount();
            } else {
                $gameTemp.clearDestination();
            }
        }
    }

    public triggerAction() {
        if (this.canMove()) {
            if (this.triggerButtonAction()) {
                return true;
            }
            if (this.triggerTouchAction()) {
                return true;
            }
        }
        return false;
    }

    public triggerButtonAction() {
        if (Input.isTriggered("ok")) {
            if (this.getOnOffVehicle()) {
                return true;
            }
            this.checkEventTriggerHere([0]);
            if ($gameMap.setupStartingEvent()) {
                return true;
            }
            this.checkEventTriggerThere([0, 1, 2]);
            if ($gameMap.setupStartingEvent()) {
                return true;
            }
        }
        return false;
    }

    public triggerTouchAction() {
        if ($gameTemp.isDestinationValid()) {
            const direction = this.direction();
            const x1 = this.x;
            const y1 = this.y;
            const x2 = $gameMap.roundXWithDirection(x1, direction);
            const y2 = $gameMap.roundYWithDirection(y1, direction);
            const x3 = $gameMap.roundXWithDirection(x2, direction);
            const y3 = $gameMap.roundYWithDirection(y2, direction);
            const destX = $gameTemp.destinationX();
            const destY = $gameTemp.destinationY();
            if (destX === x1 && destY === y1) {
                return this.triggerTouchActionD1(x1, y1);
            } else if (destX === x2 && destY === y2) {
                return this.triggerTouchActionD2(x2, y2);
            } else if (destX === x3 && destY === y3) {
                return this.triggerTouchActionD3(x2, y2);
            }
        }
        return false;
    }

    public triggerTouchActionD1(x1: number, y1: number) {
        if ($gameMap.airship().pos(x1, y1)) {
            if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
                return true;
            }
        }
        this.checkEventTriggerHere([0]);
        return $gameMap.setupStartingEvent();
    }

    public triggerTouchActionD2(x2: any, y2: any) {
        if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
            if (TouchInput.isTriggered() && this.getOnVehicle()) {
                return true;
            }
        }
        if (this.isInBoat() || this.isInShip()) {
            if (TouchInput.isTriggered() && this.getOffVehicle()) {
                return true;
            }
        }
        this.checkEventTriggerThere([0, 1, 2]);
        return $gameMap.setupStartingEvent();
    }

    public triggerTouchActionD3(x2: any, y2: any) {
        if ($gameMap.isCounter(x2, y2)) {
            this.checkEventTriggerThere([0, 1, 2]);
        }
        return $gameMap.setupStartingEvent();
    }

    public updateEncounterCount() {
        if (this.canEncounter()) {
            this._encounterCount -= this.encounterProgressValue();
        }
    }

    public canEncounter() {
        return (
            !$gameParty.hasEncounterNone() &&
            $gameSystem.isEncounterEnabled() &&
            !this.isInAirship() &&
            !this.isMoveRouteForcing() &&
            !this.isDebugThrough()
        );
    }

    public encounterProgressValue() {
        let value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
        if ($gameParty.hasEncounterHalf()) {
            value *= 0.5;
        }
        if (this.isInShip()) {
            value *= 0.5;
        }
        return value;
    }

    public checkEventTriggerHere(triggers: number[]) {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(this.x, this.y, triggers, false);
        }
    }

    public checkEventTriggerThere(triggers: number[]) {
        if (this.canStartLocalEvents()) {
            const direction = this.direction();
            const x1 = this.x;
            const y1 = this.y;
            const x2 = $gameMap.roundXWithDirection(x1, direction);
            const y2 = $gameMap.roundYWithDirection(y1, direction);
            this.startMapEvent(x2, y2, triggers, true);
            if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
                const x3 = $gameMap.roundXWithDirection(x2, direction);
                const y3 = $gameMap.roundYWithDirection(y2, direction);
                this.startMapEvent(x3, y3, triggers, true);
            }
        }
    }

    public checkEventTriggerTouch(x: any, y: any) {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(x, y, [1, 2], true);
        }
    }

    public canStartLocalEvents() {
        return !this.isInAirship();
    }

    public getOnOffVehicle() {
        if (this.isInVehicle()) {
            return this.getOffVehicle();
        } else {
            return this.getOnVehicle();
        }
    }

    public getOnVehicle() {
        const direction = this.direction();
        const x1 = this.x;
        const y1 = this.y;
        const x2 = $gameMap.roundXWithDirection(x1, direction);
        const y2 = $gameMap.roundYWithDirection(y1, direction);
        if ($gameMap.airship().pos(x1, y1)) {
            this._vehicleType = "airship";
        } else if ($gameMap.ship().pos(x2, y2)) {
            this._vehicleType = "ship";
        } else if ($gameMap.boat().pos(x2, y2)) {
            this._vehicleType = "boat";
        }
        if (this.isInVehicle()) {
            this._vehicleGettingOn = true;
            if (!this.isInAirship()) {
                this.forceMoveForward();
            }
            this.gatherFollowers();
        }
        return this._vehicleGettingOn;
    }

    public getOffVehicle() {
        if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
            if (this.isInAirship()) {
                this.setDirection(2);
            }
            this._followers.synchronize(this.x, this.y, this.direction());
            this.vehicle().getOff();
            if (!this.isInAirship()) {
                this.forceMoveForward();
                this.setTransparent(false);
            }
            this._vehicleGettingOff = true;
            this.setMoveSpeed(4);
            this.setThrough(false);
            this.makeEncounterCount();
            this.gatherFollowers();
        }
        return this._vehicleGettingOff;
    }

    public forceMoveForward() {
        this.setThrough(true);
        this.moveForward();
        this.setThrough(false);
    }

    public isOnDamageFloor() {
        return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
    }

    public moveStraight(d: number) {
        if (this.canPass(this.x, this.y, d)) {
            this._followers.updateMove();
        }
        super.moveStraight(d);
    }

    public moveDiagonally(horz: number, vert: number) {
        if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
            this._followers.updateMove();
        }
        super.moveDiagonally(horz, vert);
    }

    public jump(xPlus: any, yPlus: any) {
        super.jump(xPlus, yPlus);
        this._followers.jumpAll();
    }

    public showFollowers() {
        this._followers.show();
    }

    public hideFollowers() {
        this._followers.hide();
    }

    public gatherFollowers() {
        this._followers.gather();
    }

    public areFollowersGathering() {
        return this._followers.areGathering();
    }

    public areFollowersGathered() {
        return this._followers.areGathered();
    }
}
