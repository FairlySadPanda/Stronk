import { Graphics } from "../core/Graphics";
import { Input } from "../core/Input";
import { Utils } from "../core/Utils";
import { Window_Selectable } from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_DebugRange
//
// The window for selecting a block of switches/variables on the debug screen.

export class Window_DebugRange extends Window_Selectable {
    public static lastTopRow = 0;
    public static lastIndex = 0;

    private _maxSwitches: number;
    private _maxVariables: number;
    private _editWindow: any;

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

    public windowWidth() {
        return 246;
    }

    public windowHeight() {
        return Graphics.boxHeight;
    }

    public maxItems() {
        return this._maxSwitches + this._maxVariables;
    }

    public update() {
        super.update.call(this);
        if (this._editWindow) {
            this._editWindow.setMode(this.mode());
            this._editWindow.setTopId(this.topId());
        }
    }

    public mode() {
        return this.index() < this._maxSwitches ? "switch" : "variable";
    }

    public topId() {
        const index = this.index();
        if (index < this._maxSwitches) {
            return index * 10 + 1;
        } else {
            return (index - this._maxSwitches) * 10 + 1;
        }
    }

    public async refresh() {
        this.createContents();
        await this.drawAllItems();
    }

    public async drawItem(index) {
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
        text +=
            " [" + Utils.padZero(start, 4) + "-" + Utils.padZero(end, 4) + "]";
        await this.drawText(text, rect.x, rect.y, rect.width);
    }

    public isCancelTriggered() {
        return super.isCancelTriggered() || Input.isTriggered("debug");
    }

    public processCancel() {
        super.processCancel.call(this);
        Window_DebugRange.lastTopRow = this.topRow();
        Window_DebugRange.lastIndex = this.index();
    }

    public setEditWindow(editWindow) {
        this._editWindow = editWindow;
    }
}
