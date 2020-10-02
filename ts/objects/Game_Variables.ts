import { SceneManager } from "../managers/SceneManager";

import { Scene_Debug } from "../scenes/Scene_Debug";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

export interface Game_Variables_OnLoad {
    _data: number | string[];
}

export class Game_Variables {
    public _data: number | string[];

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
        if (this.isAdvancedVariable(variableId)) {
            return this.runAdvancedVariableCode(variableId);
        }
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

    public isAdvancedVariable(variableId) {
        if (
            SceneManager.scene.debugActive ||
            SceneManager.scene instanceof Scene_Debug
        ) {
            return false;
        }
        const name = $dataSystem.variables[variableId];
        if (name.match(/EVAL:[ ](.*)/i)) {
            return true;
        }
        return false;
    }

    public runAdvancedVariableCode(variableId) {
        const value = 0;
        const name = $dataSystem.variables[variableId];
        let code = "";
        if (name.match(/EVAL:[ ](.*)/i)) {
            code = "value = " + String(RegExp.$1);
        } else {
            return false;
        }
        try {
            eval(code);
        } catch (e) {
            Yanfly.Util.displayError(
                e,
                code,
                "ADVANCED VARIABLE" + variableId + " EVAL ERROR"
            );
        }
        return value;
    }
}
