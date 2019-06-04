import AudioManager from "../managers/AudioManager";
import Game_Character, { Game_Character_OnLoad } from "./Game_Character";

export interface Game_Vehicle_OnLoad extends Game_Character_OnLoad {
    _type: string;
    _mapId: number;
    _altitude: number;
    _driving: boolean;
    _bgm: any;
}

export default class Game_Vehicle extends Game_Character {
    private _type: string;
    private _mapId: number;
    private _altitude: number;
    private _driving: boolean;
    private _bgm: any;

    public constructor(type: string, gameLoadInput?: Game_Vehicle_OnLoad) {
        super(gameLoadInput);
        this._type = type;
        this.resetDirection();
        this.initMoveSpeed();
        this.loadSystemSettings();

        if (gameLoadInput) {
            this._type = gameLoadInput._type;
            this._mapId = gameLoadInput._mapId;
            this._altitude = gameLoadInput._altitude;
            this._driving = gameLoadInput._driving;
            this._bgm = gameLoadInput._bgm;
        }
    }

    public initMembers() {
        super.initMembers();
        this._type = "";
        this._mapId = 0;
        this._altitude = 0;
        this._driving = false;
        this._bgm = null;
    }

    public isBoat() {
        return this._type === "boat";
    }

    public isShip() {
        return this._type === "ship";
    }

    public isAirship() {
        return this._type === "airship";
    }

    public resetDirection() {
        this.setDirection(4);
    }

    public initMoveSpeed() {
        if (this.isBoat()) {
            this.setMoveSpeed(4);
        } else if (this.isShip()) {
            this.setMoveSpeed(5);
        } else if (this.isAirship()) {
            this.setMoveSpeed(6);
        }
    }

    public vehicle() {
        if (this.isBoat()) {
            return $dataSystem.boat;
        } else if (this.isShip()) {
            return $dataSystem.ship;
        } else if (this.isAirship()) {
            return $dataSystem.airship;
        } else {
            return null;
        }
    }

    public loadSystemSettings() {
        const vehicle = this.vehicle();
        this._mapId = vehicle.startMapId;
        this.setPosition(vehicle.startX, vehicle.startY);
        this.setImage(vehicle.characterName, vehicle.characterIndex);
    }

    public refresh() {
        if (this._driving) {
            this._mapId = $gameMap.mapId();
            this.syncWithPlayer();
        } else if (this._mapId === $gameMap.mapId()) {
            this.locate(this.x, this.y);
        }
        if (this.isAirship()) {
            this.setPriorityType(this._driving ? 2 : 0);
        } else {
            this.setPriorityType(1);
        }
        this.setWalkAnime(this._driving);
        this.setStepAnime(this._driving);
        this.setTransparent(this._mapId !== $gameMap.mapId());
    }

    public setLocation(mapId, x, y) {
        this._mapId = mapId;
        this.setPosition(x, y);
        this.refresh();
    }

    public pos(x, y) {
        if (this._mapId === $gameMap.mapId()) {
            return super.pos(x, y);
        } else {
            return false;
        }
    }

    public isMapPassable(x, y, d) {
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        if (this.isBoat()) {
            return $gameMap.isBoatPassable(x2, y2);
        } else if (this.isShip()) {
            return $gameMap.isShipPassable(x2, y2);
        } else if (this.isAirship()) {
            return true;
        } else {
            return false;
        }
    }

    public getOn() {
        this._driving = true;
        this.setWalkAnime(true);
        this.setStepAnime(true);
        $gameSystem.saveWalkingBgm();
        this.playBgm();
    }

    public getOff() {
        this._driving = false;
        this.setWalkAnime(false);
        this.setStepAnime(false);
        this.resetDirection();
        $gameSystem.replayWalkingBgm();
    }

    public setBgm(bgm) {
        this._bgm = bgm;
    }

    public playBgm() {
        AudioManager.playBgm(this._bgm || this.vehicle().bgm);
    }

    public syncWithPlayer() {
        this.copyPosition($gamePlayer);
        this.refreshBushDepth();
    }

    public screenY() {
        return super.screenY() - this._altitude;
    }

    public shadowX() {
        return this.screenX();
    }

    public shadowY() {
        return this.screenY() + this._altitude;
    }

    public shadowOpacity() {
        return (255 * this._altitude) / this.maxAltitude();
    }

    public canMove() {
        if (this.isAirship()) {
            return this.isHighest();
        } else {
            return true;
        }
    }

    public update() {
        super.update();
        if (this.isAirship()) {
            this.updateAirship();
        }
    }

    public updateAirship() {
        this.updateAirshipAltitude();
        this.setStepAnime(this.isHighest());
        this.setPriorityType(this.isLowest() ? 0 : 2);
    }

    public updateAirshipAltitude() {
        if (this._driving && !this.isHighest()) {
            this._altitude++;
        }
        if (!this._driving && !this.isLowest()) {
            this._altitude--;
        }
    }

    public maxAltitude() {
        return 48;
    }

    public isLowest() {
        return this._altitude <= 0;
    }

    public isHighest() {
        return this._altitude >= this.maxAltitude();
    }

    public isTakeoffOk() {
        return $gamePlayer.areFollowersGathered();
    }

    public isLandOk(x, y, d) {
        if (this.isAirship()) {
            if (!$gameMap.isAirshipLandOk(x, y)) {
                return false;
            }
            if ($gameMap.eventsXy(x, y).length > 0) {
                return false;
            }
        } else {
            const x2 = $gameMap.roundXWithDirection(x, d);
            const y2 = $gameMap.roundYWithDirection(y, d);
            if (!$gameMap.isValid(x2, y2)) {
                return false;
            }
            if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
                return false;
            }
            if (this.isCollidedWithCharacters(x2, y2)) {
                return false;
            }
        }
        return true;
    }
}
