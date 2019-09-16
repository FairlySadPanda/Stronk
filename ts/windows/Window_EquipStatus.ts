import { TextManager } from "../managers/TextManager";
import { Window_Base } from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_EquipStatus
//
// The window for displaying parameter changes on the equipment screen.

export class Window_EquipStatus extends Window_Base {
    private _actor: any;
    private _tempActor: any;

    public constructor(x, y) {
        super(
            x,
            y,
            Window_EquipStatus.prototype.windowWidth(),
            Window_EquipStatus.prototype.windowHeight()
        );
        this._actor = null;
        this._tempActor = null;
        this.refresh();
    }

    public windowWidth() {
        return 312;
    }

    public windowHeight() {
        return this.fittingHeight(this.numVisibleRows());
    }

    public numVisibleRows() {
        return 7;
    }

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    public refresh() {
        this.contents.clear();
        if (this._actor) {
            this.drawActorName(this._actor, this.textPadding(), 0);
            for (let i = 0; i < 6; i++) {
                this.drawItem(0, this.lineHeight() * (1 + i), 2 + i);
            }
        }
    }

    public setTempActor(tempActor) {
        if (this._tempActor !== tempActor) {
            this._tempActor = tempActor;
            this.refresh();
        }
    }

    public drawItem(x, y, paramId) {
        this.drawParamName(x + this.textPadding(), y, paramId);
        if (this._actor) {
            this.drawCurrentParam(x + 140, y, paramId);
        }
        this.drawRightArrow(x + 188, y);
        if (this._tempActor) {
            this.drawNewParam(x + 222, y, paramId);
        }
    }

    public drawParamName(x, y, paramId) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.param(paramId), x, y, 120);
    }

    public drawCurrentParam(x, y, paramId) {
        this.resetTextColor();
        this.drawText(this._actor.param(paramId), x, y, 48, undefined, "right");
    }

    public drawRightArrow(x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText("\u2192", x, y, 32, undefined, "center");
    }

    public drawNewParam(x, y, paramId) {
        const newValue = this._tempActor.param(paramId);
        const diffvalue = newValue - this._actor.param(paramId);
        this.changeTextColor(this.paramchangeTextColor(diffvalue));
        this.drawText(newValue, x, y, 48, undefined, "right");
    }
}
