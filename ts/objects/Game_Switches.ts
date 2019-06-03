export interface Game_Switches_OnLoad {
    _data: boolean[];
}

export default class Game_Switches {
    private _data: boolean[];

    public constructor(gameLoadInput?: Game_Switches_OnLoad) {
        this.clear();

        if (gameLoadInput) {
            this._data = gameLoadInput._data;
        }
    }

    public clear() {
        this._data = [];
    }

    public value(switchId) {
        return !!this._data[switchId];
    }

    public setValue(switchId, value) {
        if (switchId > 0 && switchId < $dataSystem.switches.length) {
            this._data[switchId] = value;
            this.onChange();
        }
    }

    public onChange() {
        $gameMap.requestRefresh();
    }
}
