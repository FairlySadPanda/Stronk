import TextManager from "../managers/TextManager";
import Window_Base from "./Window_Base";

//-----------------------------------------------------------------------------
// Window_EquipStatus
//
// The window for displaying parameter changes on the equipment screen.

export default class Window_EquipStatus extends Window_Base {
    public _actor: any;
    public _tempActor: any;
    public numVisibleRows: () => number;
    public setActor: (actor: any) => void;
    public setTempActor: (tempActor: any) => void;
    public drawItem: (x: any, y: any, paramId: any) => void;
    public drawParamName: (x: any, y: any, paramId: any) => void;
    public drawCurrentParam: (x: any, y: any, paramId: any) => void;
    public drawRightArrow: (x: any, y: any) => void;
    public drawNewParam: (x: any, y: any, paramId: any) => void;
    public constructor(x, y) {
        super(x, y, Window_EquipStatus.prototype.windowWidth(), Window_EquipStatus.prototype.windowHeight());
        this._actor = null;
        this._tempActor = null;
        this.refresh();

    }
    public windowWidth(): any {
        throw new Error("Method not implemented.");
    }
    public windowHeight(): any {
        throw new Error("Method not implemented.");
    }
    public refresh(): any {
        throw new Error("Method not implemented.");
    }
}

Window_EquipStatus.prototype.windowWidth = function () {
    return 312;
};

Window_EquipStatus.prototype.windowHeight = function () {
    return this.fittingHeight(this.numVisibleRows());
};

Window_EquipStatus.prototype.numVisibleRows = function () {
    return 7;
};

Window_EquipStatus.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_EquipStatus.prototype.refresh = function () {
    this.contents.clear();
    if (this._actor) {
        this.drawActorName(this._actor, this.textPadding(), 0);
        for (let i = 0; i < 6; i++) {
            this.drawItem(0, this.lineHeight() * (1 + i), 2 + i);
        }
    }
};

Window_EquipStatus.prototype.setTempActor = function (tempActor) {
    if (this._tempActor !== tempActor) {
        this._tempActor = tempActor;
        this.refresh();
    }
};

Window_EquipStatus.prototype.drawItem = function (x, y, paramId) {
    this.drawParamName(x + this.textPadding(), y, paramId);
    if (this._actor) {
        this.drawCurrentParam(x + 140, y, paramId);
    }
    this.drawRightArrow(x + 188, y);
    if (this._tempActor) {
        this.drawNewParam(x + 222, y, paramId);
    }
};

Window_EquipStatus.prototype.drawParamName = function (x, y, paramId) {
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.param(paramId), x, y, 120);
};

Window_EquipStatus.prototype.drawCurrentParam = function (x, y, paramId) {
    this.resetTextColor();
    this.drawText(this._actor.param(paramId), x, y, 48, "right");
};

Window_EquipStatus.prototype.drawRightArrow = function (x, y) {
    this.changeTextColor(this.systemColor());
    this.drawText("\u2192", x, y, 32, "center");
};

Window_EquipStatus.prototype.drawNewParam = function (x, y, paramId) {
    const newValue = this._tempActor.param(paramId);
    const diffvalue = newValue - this._actor.param(paramId);
    this.changeTextColor(this.paramchangeTextColor(diffvalue));
    this.drawText(newValue, x, y, 48, "right");
};
