import Graphics from "../core/Graphics";
import Input from "../core/Input";

import Utils from "../core/Utils";
import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_DebugRange
//
// The window for selecting a block of switches/variables on the debug screen.

export default class Window_DebugRange extends Window_Selectable {
    public static lastTopRow = 0;
    public static lastIndex = 0;
    public _maxSwitches: number;
    public _maxVariables: number;
    public mode: () => "switch" | "variable";
    public topId: () => number;
    public setEditWindow: (editWindow: any) => void;
    public constructor(x, y) {
        super(
            x,
            y,
            Window_DebugRange.prototype.windowWidth(),
            Window_DebugRange.prototype.windowHeight()
        );
        this._maxSwitches = Math.ceil(($dataSystem.switches.length - 1) / 10);
        this._maxVariables = Math.ceil(($dataSystem.variables.length - 1) / 10);
        this.refresh();
        this.setTopRow(Window_DebugRange.lastTopRow);
        this.select(Window_DebugRange.lastIndex);
        this.activate();
    }
    public windowWidth(): any {
        throw new Error("Method not implemented.");
    }
    public windowHeight(): any {
        throw new Error("Method not implemented.");
    }
}
Window_DebugRange.lastTopRow = 0;
Window_DebugRange.lastIndex = 0;

Window_DebugRange.prototype.windowWidth = function() {
    return 246;
};

Window_DebugRange.prototype.windowHeight = function() {
    return Graphics.boxHeight;
};

Window_DebugRange.prototype.maxItems = function() {
    return this._maxSwitches + this._maxVariables;
};

Window_DebugRange.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this._editWindow) {
        this._editWindow.setMode(this.mode());
        this._editWindow.setTopId(this.topId());
    }
};

Window_DebugRange.prototype.mode = function() {
    return this.index() < this._maxSwitches ? "switch" : "variable";
};

Window_DebugRange.prototype.topId = function() {
    const index = this.index();
    if (index < this._maxSwitches) {
        return index * 10 + 1;
    } else {
        return (index - this._maxSwitches) * 10 + 1;
    }
};

Window_DebugRange.prototype.refresh = function() {
    this.createContents();
    this.drawAllItems();
};

Window_DebugRange.prototype.drawItem = function(index) {
    const rect = this.itemRectForText(index);
    let start;
    let text;
    if (index < this._maxSwitches) {
        start = index * 10 + 1;
        text = "S";
    } else {
        start = (index - this._maxSwitches) * 10 + 1;
        text = "V";
    }
    const end = start + 9;
    text += " [" + Utils.padZero(start, 4) + "-" + Utils.padZero(end, 4) + "]";
    this.drawText(text, rect.x, rect.y, rect.width);
};

Window_DebugRange.prototype.isCancelTriggered = function() {
    return (
        Window_Selectable.prototype.isCancelTriggered() ||
        Input.isTriggered("debug")
    );
};

Window_DebugRange.prototype.processCancel = function() {
    Window_Selectable.prototype.processCancel.call(this);
    Window_DebugRange.lastTopRow = this.topRow();
    Window_DebugRange.lastIndex = this.index();
};

Window_DebugRange.prototype.setEditWindow = function(editWindow) {
    this._editWindow = editWindow;
};
