import Input from "../core/Input";
import Utils from "../core/Utils";
import SoundManager from "../managers/SoundManager";
import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_DebugEdit
//
// The window for displaying switches and variables on the debug screen.

export default class Window_DebugEdit extends Window_Selectable {
    private _mode: string;
    private _topId: number;

    public constructor(x, y, width) {
        super(x, y, width, Window_DebugEdit.prototype.fittingHeight(10));
        this._mode = "switch";
        this._topId = 1;
        this.refresh();
    }

    public maxItems() {
        return 10;
    }

    public refresh() {
        this.contents.clear();
        this.drawAllItems();
    }

    public drawItem(index) {
        const dataId = this._topId + index;
        const idText = Utils.padZero(dataId, 4) + ":";
        const idWidth = this.textWidth(idText);
        const statusWidth = this.textWidth("-00000000");
        const name = this.itemName(dataId);
        const status = this.itemStatus(dataId);
        const rect = this.itemRectForText(index);
        this.resetTextColor();
        this.drawText(idText, rect.x, rect.y, rect.width);
        rect.x += idWidth;
        rect.width -= idWidth + statusWidth;
        this.drawText(name, rect.x, rect.y, rect.width);
        this.drawText(
            status,
            rect.x + rect.width,
            rect.y,
            statusWidth,
            undefined,
            "right"
        );
    }

    public itemName(dataId) {
        if (this._mode === "switch") {
            return $dataSystem.switches[dataId];
        } else {
            return $dataSystem.variables[dataId];
        }
    }

    public itemStatus(dataId) {
        if (this._mode === "switch") {
            return $gameSwitches.value(dataId) ? "[ON]" : "[OFF]";
        } else {
            return String($gameVariables.value(dataId));
        }
    }

    public setMode(mode) {
        if (this._mode !== mode) {
            this._mode = mode;
            this.refresh();
        }
    }

    public setTopId(id) {
        if (this._topId !== id) {
            this._topId = id;
            this.refresh();
        }
    }

    public currentId() {
        return this._topId + this.index();
    }

    public update() {
        super.update();
        if (this.active) {
            if (this._mode === "switch") {
                this.updateSwitch();
            } else {
                this.updateVariable();
            }
        }
    }

    public updateSwitch() {
        if (Input.isRepeated("ok")) {
            const switchId = this.currentId();
            SoundManager.playCursor();
            $gameSwitches.setValue(switchId, !$gameSwitches.value(switchId));
            this.redrawCurrentItem();
        }
    }

    public updateVariable() {
        const variableId = this.currentId();
        let value = $gameVariables.value(variableId);
        if (typeof value === "number") {
            if (Input.isRepeated("right")) {
                value++;
            }
            if (Input.isRepeated("left")) {
                value--;
            }
            if (Input.isRepeated("pagedown")) {
                value += 10;
            }
            if (Input.isRepeated("pageup")) {
                value -= 10;
            }
            if ($gameVariables.value(variableId) !== value) {
                $gameVariables.setValue(variableId, value);
                SoundManager.playCursor();
                this.redrawCurrentItem();
            }
        }
    }
}
