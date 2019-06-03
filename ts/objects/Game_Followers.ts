
import Game_Follower from "./Game_Follower";

export interface Game_Followers_OnLoad {
    _visible: any;
    _gathering: boolean;
    _data: any[];
}

//-----------------------------------------------------------------------------
// Game_Followers
//
// The wrapper class for a follower array.

export default class Game_Followers {
    private _visible: any;
    private _gathering: boolean;
    private _data: any[];

    public constructor(gameLoadInput?: Game_Followers_OnLoad) {
        this._visible = $dataSystem.optFollowers;
        this._gathering = false;
        this._data = [];
        for (let i = 1; i < $gameParty.maxBattleMembers(); i++) {
            this._data.push(new Game_Follower(i));
        }

        if (gameLoadInput) {
            this._visible = gameLoadInput._visible;
            this._gathering = gameLoadInput._gathering;
            this._data = [];
            for (const follower of gameLoadInput._data) {
                this._data.push(new Game_Follower(follower));
            }
        }
    }

    public isVisible() {
        return this._visible;
    }

    public show() {
        this._visible = true;
    }

    public hide() {
        this._visible = false;
    }

    public follower(index) {
        return this._data[index];
    }

    public forEach(callback, thisObject) {
        this._data.forEach(callback, thisObject);
    }

    public reverseEach(callback, thisObject) {
        this._data.reverse();
        this._data.forEach(callback, thisObject);
        this._data.reverse();
    }

    public refresh() {
        this.forEach(function (follower) {
            return follower.refresh();
        }, this);
    }

    public update() {
        if (this.areGathering()) {
            if (!this.areMoving()) {
                this.updateMove();
            }
            if (this.areGathered()) {
                this._gathering = false;
            }
        }
        this.forEach(function (follower) {
            follower.update();
        }, this);
    }

    public updateMove() {
        for (let i = this._data.length - 1; i >= 0; i--) {
            const precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
            this._data[i].chaseCharacter(precedingCharacter);
        }
    }

    public jumpAll() {
        if ($gamePlayer.isJumping()) {
            for (let i = 0; i < this._data.length; i++) {
                const follower = this._data[i];
                const sx = $gamePlayer.deltaXFrom(follower.x);
                const sy = $gamePlayer.deltaYFrom(follower.y);
                follower.jump(sx, sy);
            }
        }
    }

    public synchronize(x, y, d) {
        this.forEach(function (follower) {
            follower.locate(x, y);
            follower.setDirection(d);
        }, this);
    }

    public gather() {
        this._gathering = true;
    }

    public areGathering() {
        return this._gathering;
    }

    public visibleFollowers() {
        return this._data.filter(function (follower) {
            return follower.isVisible();
        }, this);
    }

    public areMoving() {
        return this.visibleFollowers().some(function (follower) {
            return follower.isMoving();
        }, this);
    }

    public areGathered() {
        return this.visibleFollowers().every(function (follower) {
            return !follower.isMoving() && follower.pos($gamePlayer.x, $gamePlayer.y);
        }, this);
    }

    public isSomeoneCollided(x, y) {
        return this.visibleFollowers().some(function (follower) {
            return follower.pos(x, y);
        }, this);
    }
}
