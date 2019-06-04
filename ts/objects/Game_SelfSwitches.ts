export interface Game_SelfSwitches_OnLoad {
    _data: boolean[];
}

export default class Game_SelfSwitches {
    private _data: {};

    public constructor(gameLoadInput?: Game_SelfSwitches_OnLoad) {
        this.clear();

        if (gameLoadInput) {
            this._data = gameLoadInput._data;
        }
    }

    public clear() {
        this._data = {};
    }

    public value(key) {
        return !!this._data[key];
    }

    public setValue(key, value) {
        if (value) {
            this._data[key] = true;
        } else {
            delete this._data[key];
        }
        this.onChange();
    }

    public onChange() {
        $gameMap.requestRefresh();
    }
}
