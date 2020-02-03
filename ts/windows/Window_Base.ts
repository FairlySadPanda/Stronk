import { Bitmap } from "../core/Bitmap";
import { Sprite } from "../core/Sprite";
import { Utils } from "../core/Utils";
import { Window } from "../core/Window";
import { Item } from "../interfaces/Item";
import { ConfigManager } from "../managers/ConfigManager";
import { ImageManager } from "../managers/ImageManager";
import { TextManager } from "../managers/TextManager";
import { Game_Actor } from "../objects/Game_Actor";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

interface ListItem {
    name: string;
    symbol: string;
    enabled: boolean;
    ext: any;
}

export class Window_Base extends Window {
    public static _iconWidth: number = Yanfly.Param.IconWidth;
    public static _iconHeight: number = Yanfly.Param.IconHeight;
    public static _faceWidth: number = Yanfly.Param.FaceWidth;
    public static _faceHeight: number = Yanfly.Param.FaceHeight;
    public windowskin: Bitmap;
    public padding: number;
    public backOpacity: number;
    public openness: number;
    public opacity: number;
    public contents: Bitmap;
    protected _list: ListItem[];
    private _opening: boolean;
    private _closing: boolean;
    private _dimmerSprite: Sprite;

    public constructor(x: number, y: number, width: number, height: number) {
        super();
        this._list = [];
        this.loadWindowskin();
        this.move(x, y, width, height);
        this.updatePadding();
        this.updateBackOpacity();
        this.updateTone();
        this.createContents();
        this._opening = false;
        this._closing = false;
        this._dimmerSprite = null;
        const t_red = ConfigManager["_windowRed"];
        const t_green = ConfigManager["_windowGreen"];
        const t_blue = ConfigManager["_windowBlue"];
        const tone = [t_red, t_green, t_blue];
        $gameSystem.setWindowTone(tone);
        this.opacity = ConfigManager["_windowOpacity"];
    }

    public getGameSettingsMoe(symbol: string) {
        return ConfigManager[symbol];
    }

    public lineHeight() {
        return Yanfly.Param.LineHeight;
    }

    public standardFontFace() {
        if ($gameSystem.isChinese()) {
            return Yanfly.Param.ChineseFont;
        } else if ($gameSystem.isKorean()) {
            return Yanfly.Param.KoreanFont;
        } else {
            return Yanfly.Param.DefaultFont;
        }
    }

    public standardFontSize() {
        return Yanfly.Param.FontSize;
    }

    public standardPadding() {
        return Yanfly.Param.WindowPadding;
    }

    public textPadding() {
        return Yanfly.Param.TextPadding;
    }

    public standardBackOpacity() {
        return Yanfly.Param.WindowOpacity;
    }

    public loadWindowskin() {
        const files = ConfigManager.cosmeticsOptions.wSkin.list;
        if (files != undefined) {
            if (files.length > 0) {
                const maxValue = files.length;
                let value = this.getGameSettingsMoe("_windowskin");
                if (Number.isInteger(value) === false) {
                    value = 0;
                    ConfigManager["_windowskin"] = 0;
                }
                if (value > maxValue - 1) {
                    value = 0;
                    ConfigManager["_windowskin"] = 0;
                }
                this.windowskin = ImageManager.loadSystem(files[value]);
            } else {
                this.windowskin = ImageManager.loadSystem("Window");
            }
        } else {
            this.windowskin = ImageManager.loadSystem("Window");
        }
    }

    public updatePadding() {
        this.padding = this.standardPadding();
    }

    public updateBackOpacity() {
        this.backOpacity = this.standardBackOpacity();
    }

    public contentsWidth() {
        return this._width - this.standardPadding() * 2;
    }

    public contentsHeight() {
        return this._height - this.standardPadding() * 2;
    }

    public fittingHeight(numLines: number) {
        return numLines * this.lineHeight() + this.standardPadding() * 2;
    }

    public updateTone() {
        const tone = $gameSystem.windowTone();
        this.setTone(tone[0], tone[1], tone[2]);
    }

    public createContents() {
        this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight());
        this.resetFontSettings();
    }

    public resetFontSettings() {
        this.contents.fontFace = this.standardFontFace();
        this.contents.fontSize = this.standardFontSize();
        this.resetTextColor();
    }

    public resetTextColor() {
        this.changeTextColor(this.normalColor());
    }

    public update() {
        super.update();
        this.updateTone();
        this.updateOpen();
        this.updateClose();
        this.updateBackgroundDimmer();
    }

    public updateOpen() {
        if (this._opening) {
            this.openness += 32;
            if (this.isOpen()) {
                this._opening = false;
            }
        }
    }

    public updateClose() {
        if (this._closing) {
            this.openness -= 32;
            if (this.isClosed()) {
                this._closing = false;
            }
        }
    }

    public open() {
        if (!this.isOpen()) {
            this._opening = true;
        }
        this._closing = false;
    }

    public close() {
        if (!this.isClosed()) {
            this._closing = true;
        }
        this._opening = false;
    }

    public isOpening() {
        return this._opening;
    }

    public isClosing() {
        return this._closing;
    }

    public show() {
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }

    public activate() {
        this.active = true;
    }

    public deactivate() {
        this.active = false;
    }

    public textColor(n: number) {
        const px = 96 + (n % 8) * 12 + 6;
        const py = 144 + Math.floor(n / 8) * 12 + 6;
        return this.windowskin.getPixel(px, py);
    }

    public normalColor() {
        return this.textColor(Yanfly.Param.ColorNormal);
    }

    public systemColor() {
        return this.textColor(Yanfly.Param.ColorSystem);
    }

    public crisisColor() {
        return this.textColor(Yanfly.Param.ColorCrisis);
    }

    public deathColor() {
        return this.textColor(Yanfly.Param.ColorDeath);
    }

    public gaugeBackColor() {
        return this.textColor(Yanfly.Param.ColorGaugeBack);
    }

    public hpGaugeColor1() {
        return this.textColor(Yanfly.Param.ColorHpGauge1);
    }

    public hpGaugeColor2() {
        return this.textColor(Yanfly.Param.ColorHpGauge2);
    }

    public mpGaugeColor1() {
        return this.textColor(Yanfly.Param.ColorMpGauge1);
    }

    public mpGaugeColor2() {
        return this.textColor(Yanfly.Param.ColorMpGauge2);
    }

    public mpCostColor() {
        return this.textColor(Yanfly.Param.ColorMpCost);
    }

    public powerUpColor() {
        return this.textColor(Yanfly.Param.ColorPowerUp);
    }

    public powerDownColor() {
        return this.textColor(Yanfly.Param.ColorPowerDown);
    }

    public tpGaugeColor1() {
        return this.textColor(Yanfly.Param.ColorTpGauge1);
    }

    public tpGaugeColor2() {
        return this.textColor(Yanfly.Param.ColorTpGauge1);
    }

    public tpCostColor() {
        return this.textColor(Yanfly.Param.ColorTpCost);
    }

    public pendingColor() {
        return this.windowskin.getPixel(120, 120);
    }

    public translucentOpacity() {
        return 160;
    }

    public changeTextColor(color: string) {
        this.contents.textColor = color;
    }

    public changePaintOpacity(enabled: number | boolean) {
        this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
    }

    public async drawText(
        text: string,
        x: number,
        y: number,
        maxWidth?: number,
        lineHeight?: number,
        align?: CanvasTextAlign
    ) {
        await this.contents.drawText(
            text,
            x,
            y,
            maxWidth,
            lineHeight || this.lineHeight(),
            align
        );
    }

    public textWidth(text: string) {
        return this.contents.measureTextWidth(text);
    }

    public drawTextEx(text: string, x: number, y: number) {
        if (text) {
            this.resetFontSettings();
            const textState = {
                index: 0,
                x: x,
                y: y,
                left: x,
                text: this.convertEscapeCharacters(text),
                height: null
            };
            textState.height = this.calcTextHeight(textState, false);
            this.resetFontSettings();
            while (textState.index < textState.text.length) {
                this.processCharacter(textState);
            }
            return textState.x - x;
        } else {
            return 0;
        }
    }

    public textWidthEx(text: string) {
        return this.drawTextEx(
            text,
            0,
            this.contents.height + this.lineHeight()
        );
    }

    public convertEscapeCharacters(text: string) {
        text = text.replace(/\\/g, "\x1b");
        text = text.replace(/\x1b\x1b/g, "\\");
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        });
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        });
        text = text.replace(
            /\x1bN\[(\d+)\]/gi,
            function() {
                return this.actorName(parseInt(arguments[1]));
            }.bind(this)
        );
        text = text.replace(
            /\x1bP\[(\d+)\]/gi,
            function() {
                return this.partyMemberName(parseInt(arguments[1]));
            }.bind(this)
        );
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    }

    public actorName(n: number) {
        const actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor.name() : "";
    }

    public partyMemberName(n: number) {
        const actor = n >= 1 ? $gameParty.members()[n - 1] : null;
        return actor ? actor.name() : "";
    }

    public processCharacter(textState: any) {
        switch (textState.text[textState.index]) {
            case "\n":
                this.processNewLine(textState);
                break;
            case "\f":
                this.processNewPage(textState);
                break;
            case "\x1b":
                this.processEscapeCharacter(
                    this.obtainEscapeCode(textState),
                    textState
                );
                break;
            default:
                this.processNormalCharacter(textState);
                break;
        }
    }

    public processNormalCharacter(textState: {
        text: any[];
        index: number;
        x: number;
        y: number;
        height: number;
    }) {
        const c = textState.text[textState.index++];
        const w = this.textWidth(c);
        this.contents.drawText(
            c,
            textState.x,
            textState.y,
            w * 2,
            textState.height
        );
        textState.x += w;
    }

    public processNewLine(textState: any) {
        textState.x = textState.left;
        textState.y += textState.height;
        textState.height = this.calcTextHeight(textState, false);
        textState.index++;
    }

    public processNewPage(textState: { index: number }) {
        textState.index++;
    }

    public obtainEscapeCode(textState: {
        index: number;
        text: { slice: (arg0: any) => string };
    }) {
        textState.index++;
        const regExp = /^[.|^!><{}\\]|^[A-Z]+/i;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[0].toUpperCase();
        } else {
            return "";
        }
    }

    public obtainEscapeParam(textState: {
        text: { slice: (arg0: any) => string };
        index: number;
    }) {
        const arr = /^\[\d+\]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return parseInt(arr[0].slice(1));
        } else {
            return parseInt("");
        }
    }

    public processEscapeCharacter(code: string, textState: any) {
        switch (code) {
            case "C":
                this.changeTextColor(
                    this.textColor(this.obtainEscapeParam(textState))
                );
                break;
            case "I":
                this.processDrawIcon(
                    this.obtainEscapeParam(textState),
                    textState
                );
                break;
            case "{":
                this.makeFontBigger();
                break;
            case "}":
                this.makeFontSmaller();
                break;
        }
    }

    public processDrawIcon(
        iconIndex: number,
        textState: { x: number; y: number }
    ) {
        this.drawIcon(iconIndex, textState.x + 2, textState.y + 2);
        textState.x += Window_Base._iconWidth + 4;
    }

    public makeFontBigger() {
        if (this.contents.fontSize <= 96) {
            this.contents.fontSize += 12;
        }
    }

    public makeFontSmaller() {
        if (this.contents.fontSize >= 24) {
            this.contents.fontSize -= 12;
        }
    }

    public calcTextHeight(
        textState: {
            index: any;
            x?: number;
            y?: number;
            left?: number;
            text: any;
            height?: any;
        },
        all: boolean
    ) {
        const lastFontSize = this.contents.fontSize;
        let textHeight = 0;
        const lines = textState.text.slice(textState.index).split("\n");
        const maxLines = all ? lines.length : 1;

        for (let i = 0; i < maxLines; i++) {
            let maxFontSize = this.contents.fontSize;
            const regExp = /\x1b[{}]/g;
            while (true) {
                const array = regExp.exec(lines[i]);
                if (array) {
                    if (array[0] === "\x1b{") {
                        this.makeFontBigger();
                    }
                    if (array[0] === "\x1b}") {
                        this.makeFontSmaller();
                    }
                    if (maxFontSize < this.contents.fontSize) {
                        maxFontSize = this.contents.fontSize;
                    }
                } else {
                    break;
                }
            }
            textHeight += maxFontSize + 8;
        }

        this.contents.fontSize = lastFontSize;
        return textHeight;
    }

    public async drawIcon(iconIndex: number, x: number, y: number) {
        const bitmap = ImageManager.loadSystem("IconSet");
        await bitmap.imagePromise;
        const pw = Window_Base._iconWidth;
        const ph = Window_Base._iconHeight;
        const sx = (iconIndex % 16) * pw;
        const sy = Math.floor(iconIndex / 16) * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
    }

    public async drawFace(
        faceName: string,
        faceIndex: number,
        x: number,
        y: number,
        width?: number,
        height?: number
    ) {
        width = width || Window_Base._faceWidth;
        height = height || Window_Base._faceHeight;
        const bitmap = ImageManager.loadFace(faceName);
        await bitmap.imagePromise;
        const pw = Window_Base._faceWidth;
        const ph = Window_Base._faceHeight;
        const sw = Math.min(width, pw);
        const sh = Math.min(height, ph);
        const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
        const sx = (faceIndex % 4) * pw + (pw - sw) / 2;
        const sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
    }

    public async drawCharacter(
        characterName: string,
        characterIndex: number,
        x: number,
        y: number
    ) {
        const bitmap = ImageManager.loadCharacter(characterName);
        await bitmap.imagePromise;
        const big = ImageManager.isBigCharacter(characterName);
        const pw = bitmap.width / (big ? 3 : 12);
        const ph = bitmap.height / (big ? 4 : 8);
        const n = big ? 0 : characterIndex;
        const sx = ((n % 4) * 3 + 1) * pw;
        const sy = Math.floor(n / 4) * 4 * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    }

    public drawGauge(
        dx: number,
        dy: number,
        dw: number,
        rate: number,
        color1: string,
        color2: string
    ) {
        const color3 = this.gaugeBackColor();
        let fillW = Utils.clamp(Math.floor(dw * rate), 0, dw);
        let gaugeH = this.gaugeHeight();
        let gaugeY = dy + this.lineHeight() - gaugeH - 2;
        if (Yanfly.Param.GaugeOutline) {
            this.contents.paintOpacity = this.translucentOpacity();
            this.contents.fillRect(dx, gaugeY - 1, dw, gaugeH, color3);
            fillW = Math.max(fillW - 2, 0);
            gaugeH -= 2;
            dx += 1;
        } else {
            fillW = Math.floor(dw * rate);
            gaugeY = dy + this.lineHeight() - gaugeH - 2;
            this.contents.fillRect(dx, gaugeY, dw, gaugeH, color3);
        }
        this.contents.gradientFillRect(
            dx,
            gaugeY,
            fillW,
            gaugeH,
            color1,
            color2
        );
    }

    public gaugeHeight() {
        return Yanfly.Param.GaugeHeight;
    }

    public hpColor(actor: Game_Actor) {
        if (actor.isDead()) {
            return this.deathColor();
        } else if (actor.isDying()) {
            return this.crisisColor();
        } else {
            return this.normalColor();
        }
    }

    public mpColor(actor: Game_Actor) {
        return this.normalColor();
    }

    public tpColor(actor: any) {
        return this.normalColor();
    }

    public drawActorCharacter(
        actor: { characterName: () => string; characterIndex: () => number },
        x: number,
        y: number
    ) {
        this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
    }

    public async drawActorFace(
        actor: Game_Actor,
        x: number,
        y: number,
        width?: number,
        height?: number
    ) {
        await this.drawFace(
            actor.faceName(),
            actor.faceIndex(),
            x,
            y,
            width,
            height
        );
    }

    public drawActorName(
        actor: Game_Actor,
        x: number,
        y: number,
        width?: number
    ) {
        width = width || 168;
        this.changeTextColor(this.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
    }

    public drawActorClass(
        actor: Game_Actor,
        x: number,
        y: number,
        width?: number
    ) {
        width = width || 168;
        this.resetTextColor();
        this.drawText(actor.currentClass().name, x, y, width);
    }

    public drawActorNickname(
        actor: Game_Actor,
        x: number,
        y: number,
        width?: number
    ) {
        width = width || 270;
        this.resetTextColor();
        this.drawText(actor.nickname(), x, y, width);
    }

    public drawActorLevel(actor: Game_Actor, x: number, y: number) {
        this.changeTextColor(this.systemColor());
        const dw1 = this.textWidth(TextManager.levelA);
        this.drawText(TextManager.levelA, x, y, dw1);
        this.resetTextColor();
        const level = Yanfly.Util.toGroup(actor.level);
        const dw2 = this.textWidth(Yanfly.Util.toGroup(actor.maxLevel()));
        this.drawText(level, x + dw1, y, dw2, undefined, "right");
    }

    public async drawActorIcons(
        actor: Game_Actor,
        x: number,
        y: number,
        width?: number
    ) {
        width = width || 144;
        const icons = actor
            .allIcons()
            .slice(0, Math.floor(width / Window_Base._iconWidth));
        const promises = [];
        for (let i = 0; i < icons.length; i++) {
            promises.push(
                this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2)
            );
        }
        await Promise.all(promises);
    }

    public drawCurrentAndMax(
        current: any,
        max: any,
        x: number,
        y: number,
        width: number,
        color1: string,
        color2: string
    ) {
        const labelWidth = this.textWidth("HP");
        const valueWidth = this.textWidth(Yanfly.Util.toGroup(max));
        const slashWidth = this.textWidth("/");
        const x1 = x + width - valueWidth;
        const x2 = x1 - slashWidth;
        const x3 = x2 - valueWidth;
        if (x3 >= x + labelWidth) {
            this.changeTextColor(color1);
            this.drawText(
                Yanfly.Util.toGroup(current),
                x3,
                y,
                valueWidth,
                undefined,
                "right"
            );
            this.changeTextColor(color2);
            this.drawText("/", x2, y, slashWidth, undefined, "right");
            this.drawText(
                Yanfly.Util.toGroup(max),
                x1,
                y,
                valueWidth,
                undefined,
                "right"
            );
        } else {
            this.changeTextColor(color1);
            this.drawText(
                Yanfly.Util.toGroup(current),
                x1,
                y,
                valueWidth,
                undefined,
                "right"
            );
        }
    }

    public drawActorHp(
        actor: Game_Actor,
        x: number,
        y: number,
        width?: number
    ) {
        width = width || 186;
        const color1 = this.hpGaugeColor1();
        const color2 = this.hpGaugeColor2();
        this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.hpA, x, y, 44);
        this.drawCurrentAndMax(
            actor.hp,
            actor.mhp,
            x,
            y,
            width,
            this.hpColor(actor),
            this.normalColor()
        );
    }

    public drawActorMp(
        actor: Game_Actor,
        x: number,
        y: number,
        width?: number
    ) {
        width = width || 186;
        const color1 = this.mpGaugeColor1();
        const color2 = this.mpGaugeColor2();
        this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.mpA, x, y, 44);
        this.drawCurrentAndMax(
            actor.mp,
            actor.mmp,
            x,
            y,
            width,
            this.mpColor(actor),
            this.normalColor()
        );
    }

    public drawActorTp(actor: Game_Actor, x: number, y: number, width: number) {
        width = width || 96;
        const color1 = this.tpGaugeColor1();
        const color2 = this.tpGaugeColor2();
        this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.tpA, x, y, 44);
        this.changeTextColor(this.tpColor(actor));
        this.drawText(actor.tp, x + width - 64, y, 64, undefined, "right");
    }

    public async drawActorSimpleStatus(
        actor: Game_Actor,
        x: number,
        y: number,
        width: number
    ) {
        const lineHeight = this.lineHeight();
        const xpad = Window_Base._faceWidth + 2 * Yanfly.Param.TextPadding;
        const x2 = x + 180;
        const width2 = Math.max(180, width - xpad - this.textPadding());
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        await this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
        this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
        if (Yanfly.Param.MenuTpGauge) {
            this.drawActorTp(actor, x2, y + lineHeight * 3, width2);
        }
    }

    public drawItemName(item: Item, x: number, y: number, width?: number) {
        width = width || 312;
        if (item) {
            const iconBoxWidth = Window_Base._iconWidth + 4;
            this.resetTextColor();
            this.drawIcon(item.iconIndex, x + 2, y + 2);
            this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
        }
    }

    public drawCurrencyValue(
        value: number,
        unit: string,
        wx: number,
        wy: number,
        ww: number
    ) {
        this.resetTextColor();
        this.contents.fontSize = Yanfly.Param.GoldFontSize;
        if (this.usingGoldIcon(unit)) {
            var cx = Window_Base._iconWidth;
        } else {
            var cx = this.textWidth(unit);
        }
        var text = Yanfly.Util.toGroup(value);
        if (this.textWidth(text) > ww - cx) {
            text = Yanfly.Param.GoldOverlap;
        }
        this.drawText(text, wx, wy, ww - cx - 4, undefined, "right");
        if (this.usingGoldIcon(unit)) {
            this.drawIcon(
                Yanfly.Icon.Gold,
                wx + ww - Window_Base._iconWidth,
                wy + 2
            );
        } else {
            this.changeTextColor(this.systemColor());
            this.drawText(unit, wx, wy, ww, undefined, "right");
        }
        this.resetFontSettings();
    }

    public usingGoldIcon(unit: string) {
        if (unit !== TextManager.currencyUnit) return false;
        return Yanfly.Icon.Gold > 0;
    }

    public paramchangeTextColor(change: number) {
        if (change > 0) {
            return this.powerUpColor();
        } else if (change < 0) {
            return this.powerDownColor();
        } else {
            return this.normalColor();
        }
    }

    public setBackgroundType(type: number) {
        if (type === 0) {
            this.opacity = 255;
        } else {
            this.opacity = 0;
        }
        if (type === 1) {
            this.showBackgroundDimmer();
        } else {
            this.hideBackgroundDimmer();
        }
    }

    public showBackgroundDimmer() {
        if (!this._dimmerSprite) {
            this._dimmerSprite = new Sprite();
            this._dimmerSprite.bitmap = new Bitmap(0, 0);
            this.addChildToBack(this._dimmerSprite);
        }
        const bitmap = this._dimmerSprite.bitmap;
        if (bitmap.width !== this.width || bitmap.height !== this.height) {
            this.refreshDimmerBitmap();
        }
        this._dimmerSprite.visible = true;
        this.updateBackgroundDimmer();
    }

    public hideBackgroundDimmer() {
        if (this._dimmerSprite) {
            this._dimmerSprite.visible = false;
        }
    }

    public updateBackgroundDimmer() {
        if (this._dimmerSprite) {
            this._dimmerSprite.opacity = this.openness;
        }
    }

    public refreshDimmerBitmap() {
        if (this._dimmerSprite) {
            const bitmap = this._dimmerSprite.bitmap;
            const w = this.width;
            const h = this.height;
            const m = this.padding;
            const c1 = this.dimColor1();
            const c2 = this.dimColor2();
            bitmap.resize(w, h);
            bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
            bitmap.fillRect(0, m, w, h - m * 2, c1);
            bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
            this._dimmerSprite.setFrame(0, 0, w, h);
        }
    }

    public dimColor1() {
        return "rgba(0, 0, 0, 0.6)";
    }

    public dimColor2() {
        return "rgba(0, 0, 0, 0)";
    }

    public canvasToLocalX(x: number) {
        let node = this;
        while (node) {
            x -= node.x;
            // @ts-ignores
            node = node.parent;
        }
        return x;
    }

    public canvasToLocalY(y: number) {
        let node = this;
        while (node) {
            y -= node.y;
            // @ts-ignores
            node = node.parent;
        }
        return y;
    }

    public reserveFaceImages() {
        $gameParty.members().forEach(function(actor) {
            ImageManager.reserveFace(actor.faceName());
        }, this);
    }
}
