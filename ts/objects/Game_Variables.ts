export interface Game_Variables_OnLoad {
    _data: number|string[];
}

export default class Game_Variables {
    public _data: number|string[];

    public constructor(gameLoadInput?: Game_Variables_OnLoad) {
        this.clear();

        if (gameLoadInput) {
            this._data = gameLoadInput._data;
        }
    }

    public clear() {
        this._data = [];
    }

    public value(variableId) {
        return this._data[variableId] || 0;
    }

    public setValue(variableId, value) {
        if (variableId > 0 && variableId < $dataSystem.variables.length) {
            if (typeof value === "number") {
                value = Math.floor(value);
            }
            this._data[variableId] = value;
            this.onChange();
        }
    }

    public onChange() {
        $gameMap.requestRefresh();
    }

}
