import BattleManager from "../managers/BattleManager";

export interface Game_Timer_OnLoad {
    _frames: number;
    _working: boolean;
}

export default class Game_Timer {
    private _frames: number;
    private _working: boolean;

    public constructor(gameLoadInput?: Game_Timer_OnLoad) {
        if (gameLoadInput) {
            this._frames = gameLoadInput._frames;
            this._working = gameLoadInput._working;
        } else {
            this._frames = 0;
            this._working = false;
        }
    }

    public update(sceneActive) {
        if (sceneActive && this._working && this._frames > 0) {
            this._frames--;
            if (this._frames === 0) {
                this.onExpire();
            }
        }
    }

    public start(count) {
        this._frames = count;
        this._working = true;
    }

    public stop() {
        this._working = false;
    }

    public isWorking() {
        return this._working;
    }

    public seconds() {
        return Math.floor(this._frames / 60);
    }

    public onExpire() {
        BattleManager.abort();
    }

}
