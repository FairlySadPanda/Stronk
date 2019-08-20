import Graphics from "../core/Graphics";
import Utils from "../core/Utils";
import TextManager from "../managers/TextManager";
import Game_Actor from "../objects/Game_Actor";
import Window_Selectable from "./Window_Selectable";
import Item from "../interfaces/Item";

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

    public constructor() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        super(0, 0, width, height);
        this._actor = null;
        this.refresh();
        this.activate();
    }

    public async refresh() {
        this.contents.clear();
        if (this._actor) {
            const lineHeight = this.lineHeight();
            await this.drawBlock1(lineHeight * 0);
            await this.drawHorzLine(lineHeight * 1);
            await this.drawBlock2(lineHeight * 2);
            await this.drawHorzLine(lineHeight * 6);
            await this.drawBlock3(lineHeight * 7);
            await this.drawHorzLine(lineHeight * 13);
            await this.drawBlock4(lineHeight * 14);
        }
    }

    public async drawBlock1(y) {
        await this.drawActorName(this._actor, 6, y);
        await this.drawActorClass(this._actor, 192, y);
        await this.drawActorNickname(this._actor, 432, y);
    }

    public async drawBlock2(y) {
        await this.drawActorFace(this._actor, 12, y);
        await this.drawBasicInfo(204, y);
        await this.drawExpInfo(456, y);
    }

    public async drawBlock3(y) {
        await this.drawParameters(48, y);
        await this.drawEquipments(432, y);
    }

    public async drawBlock4(y) {
        await this.drawProfile(6, y);
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

    public async drawBasicInfo(x, y) {
        const lineHeight = this.lineHeight();
        await this.drawActorLevel(this._actor, x, y + lineHeight * 0);
        await this.drawActorIcons(this._actor, x, y + lineHeight * 1);
        await this.drawActorHp(this._actor, x, y + lineHeight * 2);
        await this.drawActorMp(this._actor, x, y + lineHeight * 3);
    }

    public async drawParameters(x, y) {
        const lineHeight = this.lineHeight();
        const promises = [];
        for (let i = 0; i < 6; i++) {
            const paramId = i + 2;
            const y2 = y + lineHeight * i;
            this.changeTextColor(this.systemColor());
            promises.push(
                this.drawText(TextManager.param(paramId), x, y2, 160)
            );
            this.resetTextColor();
            promises.push(
                this.drawText(
                    this._actor.param(paramId).toString(),
                    x + 160,
                    y2,
                    60,
                    undefined,
                    "right"
                )
            );
        }
        await Promise.all(promises);
    }

    public async drawExpInfo(x, y) {
        const lineHeight = this.lineHeight();
        const expTotal = Utils.format(TextManager.expTotal, TextManager.exp);
        const expNext = Utils.format(TextManager.expNext, TextManager.level);
        let value1 = this._actor.currentExp();
        let value2 = this._actor.nextRequiredExp();
        this.changeTextColor(this.systemColor());
        await this.drawText(expTotal, x, y + lineHeight * 0, 270);
        await this.drawText(expNext, x, y + lineHeight * 2, 270);
        this.resetTextColor();
        await this.drawText(
            this._actor.isMaxLevel() ? "-------" : value1.toString(),
            x,
            y + lineHeight * 1,
            270,
            undefined,
            "right"
        );
        await this.drawText(
            this._actor.isMaxLevel() ? "-------" : value2.toString(),
            x,
            y + lineHeight * 3,
            270,
            undefined,
            "right"
        );
    }

    public async drawEquipments(x, y) {
        const equips = this._actor.equips();
        const count = Math.min(equips.length, this.maxEquipmentLines());
        const promises = [];
        for (let i = 0; i < count; i++) {
            promises.push(
                this.drawItemName(
                    equips[i] as Item,
                    x,
                    y + this.lineHeight() * i
                )
            );
        }
        await Promise.all(promises);
    }

    public async drawProfile(x, y) {
        await this.drawTextEx(this._actor.profile(), x, y);
    }

    public maxEquipmentLines() {
        return 6;
    }
}
