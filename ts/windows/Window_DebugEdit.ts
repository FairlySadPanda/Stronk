import Input from "../core/Input";
import Utils from "../core/Utils";
import SoundManager from "../managers/SoundManager";
import Window_Selectable from "./Window_Selectable";

//-----------------------------------------------------------------------------
// Window_DebugEdit
//
// The window for displaying switches and variables on the debug screen.

export default class Window_DebugEdit extends Window_Selectable {
    public _mode: string;
    public _topId: number;
    public itemName: (dataId: any) => any;
    public itemStatus: (dataId: any) => string;
    public setMode: (mode: any) => void;
    public setTopId: (id: any) => void;
    public currentId: () => any;
    public updateSwitch: () => void;
    public updateVariable: () => void;
    public constructor(x, y, width) {
        super(x, y, width, Window_DebugEdit.prototype.fittingHeigth(10));
        this._mode = "switch";
        this._topId = 1;
        this.refresh();
    }
    public fittingHeigth(arg0: number): any {
        throw new Error("Method not implemented.");
    }
}

Window_DebugEdit.prototype.maxItems = function () {
    return 10;
};

Window_DebugEdit.prototype.refresh = function () {
    this.contents.clear();
    this.drawAllItems();
};

Window_DebugEdit.prototype.drawItem = function (index) {
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
    this.drawText(status, rect.x + rect.width, rect.y, statusWidth, "right");
};

Window_DebugEdit.prototype.itemName = function (dataId) {
    if (this._mode === "switch") {
        return $dataSystem.switches[dataId];
    } else {
        return $dataSystem.variables[dataId];
    }
};

Window_DebugEdit.prototype.itemStatus = function (dataId) {
    if (this._mode === "switch") {
        return $gameSwitches.value(dataId) ? "[ON]" : "[OFF]";
    } else {
        return String($gameVariables.value(dataId));
    }
};

Window_DebugEdit.prototype.setMode = function (mode) {
    if (this._mode !== mode) {
        this._mode = mode;
        this.refresh();
    }
};

Window_DebugEdit.prototype.setTopId = function (id) {
    if (this._topId !== id) {
        this._topId = id;
        this.refresh();
    }
};

Window_DebugEdit.prototype.currentId = function () {
    return this._topId + this.index();
};

Window_DebugEdit.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (this.active) {
        if (this._mode === "switch") {
            this.updateSwitch();
        } else {
            this.updateVariable();
        }
    }
};

Window_DebugEdit.prototype.updateSwitch = function () {
    if (Input.isRepeated("ok")) {
        const switchId = this.currentId();
        SoundManager.playCursor();
        $gameSwitches.setValue(switchId, !$gameSwitches.value(switchId));
        this.redrawCurrentItem();
    }
};

Window_DebugEdit.prototype.updateVariable = function () {
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
};
