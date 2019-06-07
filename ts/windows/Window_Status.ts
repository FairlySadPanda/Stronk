import Graphics from "../core/Graphics";
import Utils from "../core/Utils";
import TextManager from "../managers/TextManager";
import Game_Actor from "../objects/Game_Actor";
import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_Status
//
// The window for displaying full status on the status screen.

export default class Window_Status extends Window_Selectable {
    public _actor: Game_Actor;
    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    public refresh() {
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
    }

    public drawBlock1(y) {
        this.drawActorName(this._actor, 6, y);
        this.drawActorClass(this._actor, 192, y);
        this.drawActorNickname(this._actor, 432, y);
    }

    public drawBlock2(y) {
        this.drawActorFace(this._actor, 12, y);
        this.drawBasicInfo(204, y);
        this.drawExpInfo(456, y);
    }

    public drawBlock3(y) {
        this.drawParameters(48, y);
        this.drawEquipments(432, y);
    }

    public drawBlock4(y) {
        this.drawProfile(6, y);
    }

    public drawHorzLine(y) {
        const lineY = y + this.lineHeight() / 2 - 1;
        this.contents.paintOpacity = 48;
        this.contents.fillRect(
            0,
            lineY,
            this.contentsWidth(),
            2,
            this.lineColor()
        );
        this.contents.paintOpacity = 255;
    }

    public lineColor() {
        return this.normalColor();
    }

    public drawBasicInfo(x, y) {
        const lineHeight = this.lineHeight();
        this.drawActorLevel(this._actor, x, y + lineHeight * 0);
        this.drawActorIcons(this._actor, x, y + lineHeight * 1);
        this.drawActorHp(this._actor, x, y + lineHeight * 2);
        this.drawActorMp(this._actor, x, y + lineHeight * 3);
    }

    public drawParameters(x, y) {
        const lineHeight = this.lineHeight();
        for (let i = 0; i < 6; i++) {
            const paramId = i + 2;
            const y2 = y + lineHeight * i;
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.param(paramId), x, y2, 160);
            this.resetTextColor();
            this.drawText(
                this._actor.param(paramId).toString(),
                x + 160,
                y2,
                60,
                undefined,
                "right"
            );
        }
    }

    public drawExpInfo(x, y) {
        const lineHeight = this.lineHeight();
        const expTotal = Utils.format(TextManager.expTotal, TextManager.exp);
        const expNext = Utils.format(TextManager.expNext, TextManager.level);
        let value1 = this._actor.currentExp();
        let value2 = this._actor.nextRequiredExp();
        this.changeTextColor(this.systemColor());
        this.drawText(expTotal, x, y + lineHeight * 0, 270);
        this.drawText(expNext, x, y + lineHeight * 2, 270);
        this.resetTextColor();
        this.drawText(
            this._actor.isMaxLevel() ? "-------" : value1.toString(),
            x,
            y + lineHeight * 1,
            270,
            undefined,
            "right"
        );
        this.drawText(
            this._actor.isMaxLevel() ? "-------" : value2.toString(),
            x,
            y + lineHeight * 3,
            270,
            undefined,
            "right"
        );
    }

    public drawEquipments(x, y) {
        const equips = this._actor.equips();
        const count = Math.min(equips.length, this.maxEquipmentLines());
        for (let i = 0; i < count; i++) {
            this.drawItemName(equips[i], x, y + this.lineHeight() * i);
        }
    }

    public drawProfile(x, y) {
        this.drawTextEx(this._actor.profile(), x, y);
    }

    public maxEquipmentLines() {
        return 6;
    }

    public constructor() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        super(0, 0, width, height);
        this._actor = null;
        this.refresh();
        this.activate();
    }
}
