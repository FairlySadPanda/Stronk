import { SceneManager } from "../managers/SceneManager";
import { Scene_Debug } from "../scenes/Scene_Debug";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

export interface Game_Switches_OnLoad {
    _data: boolean[];
}

export class Game_Switches {
    public _data: boolean[];

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
        if (this.isAdvancedSwitch(switchId)) {
            return this.runAdvancedSwitchCode(switchId);
        }

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

    private isAdvancedSwitch(switchId: number) {
        if (
            SceneManager.scene.debugActive ||
            SceneManager.scene instanceof Scene_Debug
        ) {
            return false;
        } else if ($dataSystem.switches[switchId].match(/EVAL:[ ](.*)/i))
            return true;
        return false;
    }

    private runAdvancedSwitchCode(switchId: number) {
        const value = false;
        let code = "";
        if ($dataSystem.switches[switchId].match(/EVAL:[ ](.*)/i)) {
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
                "ADVANCED SWITCH " + switchId + " EVAL ERROR"
            );
        }
        return value;
    }
}
