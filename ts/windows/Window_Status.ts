import Graphics from "../core/Graphics";
import Utils from "../core/Utils";
import TextManager from "../managers/TextManager";
import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_Status
//
// The window for displaying full status on the status screen.

export default class Window_Status extends Window_Selectable {
    public _actor: any;
    public setActor: (actor: any) => void;
    public drawBlock1: (y: any) => void;
    public drawBlock2: (y: any) => void;
    public drawBlock3: (y: any) => void;
    public drawBlock4: (y: any) => void;
    public drawHorzLine: (y: any) => void;
    public lineColor: () => any;
    public drawBasicInfo: (x: any, y: any) => void;
    public drawParameters: (x: any, y: any) => void;
    public drawExpInfo: (x: any, y: any) => void;
    public drawEquipments: (x: any, y: any) => void;
    public drawProfile: (x: any, y: any) => void;
    public maxEquipmentLines: () => number;
    public constructor() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        super(0, 0, width, height);
        this._actor = null;
        this.refresh();
        this.activate();
    }
}

Window_Status.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_Status.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        const lineHeight = this.lineHeight();
        this.drawBlock1(lineHeight * 0);
        this.drawHorzLine(lineHeight * 1);
        this.drawBlock2(lineHeight * 2);
        this.drawHorzLine(lineHeight * 6);
        this.drawBlock3(lineHeight * 7);
        this.drawHorzLine(lineHeight * 13);
        this.drawBlock4(lineHeight * 14);
    }
};

Window_Status.prototype.drawBlock1 = function(y) {
    this.drawActorName(this._actor, 6, y);
    this.drawActorClass(this._actor, 192, y);
    this.drawActorNickname(this._actor, 432, y);
};

Window_Status.prototype.drawBlock2 = function(y) {
    this.drawActorFace(this._actor, 12, y);
    this.drawBasicInfo(204, y);
    this.drawExpInfo(456, y);
};

Window_Status.prototype.drawBlock3 = function(y) {
    this.drawParameters(48, y);
    this.drawEquipments(432, y);
};

Window_Status.prototype.drawBlock4 = function(y) {
    this.drawProfile(6, y);
};

Window_Status.prototype.drawHorzLine = function(y) {
    const lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
    this.contents.paintOpacity = 255;
};

Window_Status.prototype.lineColor = function() {
    return this.normalColor();
};

Window_Status.prototype.drawBasicInfo = function(x, y) {
    const lineHeight = this.lineHeight();
    this.drawActorLevel(this._actor, x, y + lineHeight * 0);
    this.drawActorIcons(this._actor, x, y + lineHeight * 1);
    this.drawActorHp(this._actor, x, y + lineHeight * 2);
    this.drawActorMp(this._actor, x, y + lineHeight * 3);
};

Window_Status.prototype.drawParameters = function(x, y) {
    const lineHeight = this.lineHeight();
    for (let i = 0; i < 6; i++) {
        const paramId = i + 2;
        const y2 = y + lineHeight * i;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.param(paramId), x, y2, 160);
        this.resetTextColor();
        this.drawText(this._actor.param(paramId), x + 160, y2, 60, "right");
    }
};

Window_Status.prototype.drawExpInfo = function(x, y) {
    const lineHeight = this.lineHeight();
    const expTotal = Utils.format(TextManager.expTotal, TextManager.exp);
    const expNext = Utils.format(TextManager.expNext, TextManager.level);
    let value1 = this._actor.currentExp();
    let value2 = this._actor.nextRequiredExp();
    if (this._actor.isMaxLevel()) {
        value1 = "-------";
        value2 = "-------";
    }
    this.changeTextColor(this.systemColor());
    this.drawText(expTotal, x, y + lineHeight * 0, 270);
    this.drawText(expNext, x, y + lineHeight * 2, 270);
    this.resetTextColor();
    this.drawText(value1, x, y + lineHeight * 1, 270, "right");
    this.drawText(value2, x, y + lineHeight * 3, 270, "right");
};

Window_Status.prototype.drawEquipments = function(x, y) {
    const equips = this._actor.equips();
    const count = Math.min(equips.length, this.maxEquipmentLines());
    for (let i = 0; i < count; i++) {
        this.drawItemName(equips[i], x, y + this.lineHeight() * i);
    }
};

Window_Status.prototype.drawProfile = function(x, y) {
    this.drawTextEx(this._actor.profile(), x, y);
};

Window_Status.prototype.maxEquipmentLines = function() {
    return 6;
};
