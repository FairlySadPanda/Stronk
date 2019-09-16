import { Bitmap } from "../core/Bitmap";
import { Sprite } from "../core/Sprite";
import { Window } from "../core/Window";
import { Item } from "../interfaces/Item";
import { ImageManager } from "../managers/ImageManager";
import { TextManager } from "../managers/TextManager";
import { Game_Actor } from "../objects/Game_Actor";
import { ConfigManager } from "../managers/ConfigManager";

interface ListItem {
    name: string;
    symbol: string;
    enabled: boolean;
    ext: any;
}

export class Window_Base extends Window {
    public static _iconWidth: number = 32;
    public static _iconHeight: number = 32;
    public static _faceWidth: number = 144;
    public static _faceHeight: number = 144;
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

    public constructor(x, y, width, height) {
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
        return 36;
    }

    public standardFontFace() {
        if ($gameSystem.isChinese()) {
            return "SimHei, Heiti TC, sans-serif";
        } else if ($gameSystem.isKorean()) {
            return "Dotum, AppleGothic, sans-serif";
        } else {
            return "GameFont";
        }
    }

    public standardFontSize() {
        return 28;
    }

    public standardPadding() {
        return 18;
    }

    public textPadding() {
        return 6;
    }

    public standardBackOpacity() {
        return 192;
    }

    public loadWindowskin() {
        const files = ConfigManager.cosmeticsOptions.wSkin.list;
        if (files != undefined) {
            if (files.length > 0) {
                const maxValue = files.length;
                let value = this.getGameSettingsMoe("_windowskin");
                if (Number.isInteger(value) == false) {
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

    public fittingHeight(numLines) {
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

    public textColor(n) {
        const px = 96 + (n % 8) * 12 + 6;
        const py = 144 + Math.floor(n / 8) * 12 + 6;
        return this.windowskin.getPixel(px, py);
    }

    public normalColor() {
        return this.textColor(0);
    }

    public systemColor() {
        return this.textColor(16);
    }

    public crisisColor() {
        return this.textColor(17);
    }

    public deathColor() {
        return this.textColor(18);
    }

    public gaugeBackColor() {
        return this.textColor(19);
    }

    public hpGaugeColor1() {
        return this.textColor(20);
    }

    public hpGaugeColor2() {
        return this.textColor(21);
    }

    public mpGaugeColor1() {
        return this.textColor(22);
    }

    public mpGaugeColor2() {
        return this.textColor(23);
    }

    public mpCostColor() {
        return this.textColor(23);
    }

    public powerUpColor() {
        return this.textColor(24);
    }

    public powerDownColor() {
        return this.textColor(25);
    }

    public tpGaugeColor1() {
        return this.textColor(28);
    }

    public tpGaugeColor2() {
        return this.textColor(29);
    }

    public tpCostColor() {
        return this.textColor(29);
    }

    public pendingColor() {
        return this.windowskin.getPixel(120, 120);
    }

    public translucentOpacity() {
        return 160;
    }

    public changeTextColor(color) {
        this.contents.textColor = color;
    }

    public changePaintOpacity(enabled) {
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

    public textWidth(text) {
        return this.contents.measureTextWidth(text);
    }

    public drawTextEx(text, x, y) {
        if (text) {
            const textState = {
                index: 0,
                x: x,
                y: y,
                left: x,
                text: null,
                height: null
            };
            textState.text = this.convertEscapeCharacters(text);
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

    public convertEscapeCharacters(text) {
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

    public actorName(n) {
        const actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor.name() : "";
    }

    public partyMemberName(n) {
        const actor = n >= 1 ? $gameParty.members()[n - 1] : null;
        return actor ? actor.name() : "";
    }

    public processCharacter(textState) {
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

    public processNormalCharacter(textState) {
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

    public processNewLine(textState) {
        textState.x = textState.left;
        textState.y += textState.height;
        textState.height = this.calcTextHeight(textState, false);
        textState.index++;
    }

    public processNewPage(textState) {
        textState.index++;
    }

    public obtainEscapeCode(textState) {
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

    public obtainEscapeParam(textState) {
        const arr = /^\[\d+\]/.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return parseInt(arr[0].slice(1));
        } else {
            return parseInt("");
        }
    }

    public processEscapeCharacter(code, textState) {
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

    public processDrawIcon(iconIndex, textState) {
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

    public calcTextHeight(textState, all) {
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

    public async drawIcon(iconIndex, x, y) {
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

    public drawGauge(x, y, width, rate, color1, color2) {
        const fillW = Math.floor(width * rate);
        const gaugeY = y + this.lineHeight() - 8;
        this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
        this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
    }

    public hpColor(actor) {
        if (actor.isDead()) {
            return this.deathColor();
        } else if (actor.isDying()) {
            return this.crisisColor();
        } else {
            return this.normalColor();
        }
    }

    public mpColor(actor) {
        return this.normalColor();
    }

    public tpColor(actor) {
        return this.normalColor();
    }

    public drawActorCharacter(actor, x, y) {
        this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
    }

    public async drawActorFace(actor, x, y, width?, height?) {
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

    public drawActorNickname(actor, x, y, width?) {
        width = width || 270;
        this.resetTextColor();
        this.drawText(actor.nickname(), x, y, width);
    }

    public drawActorLevel(actor: Game_Actor, x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(
            actor.level.toString(),
            x + 84,
            y,
            36,
            undefined,
            "right"
        );
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

    public drawCurrentAndMax(current, max, x, y, width, color1, color2) {
        const labelWidth = this.textWidth("HP");
        const valueWidth = this.textWidth("0000");
        const slashWidth = this.textWidth("/");
        const x1 = x + width - valueWidth;
        const x2 = x1 - slashWidth;
        const x3 = x2 - valueWidth;
        if (x3 >= x + labelWidth) {
            this.changeTextColor(color1);
            this.drawText(current, x3, y, valueWidth, undefined, "right");
            this.changeTextColor(color2);
            this.drawText("/", x2, y, slashWidth, undefined, "right");
            this.drawText(max, x1, y, valueWidth, undefined, "right");
        } else {
            this.changeTextColor(color1);
            this.drawText(current, x1, y, valueWidth, undefined, "right");
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

    public drawActorTp(actor, x, y, width) {
        width = width || 96;
        const color1 = this.tpGaugeColor1();
        const color2 = this.tpGaugeColor2();
        this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.tpA, x, y, 44);
        this.changeTextColor(this.tpColor(actor));
        this.drawText(actor.tp, x + width - 64, y, 64, undefined, "right");
    }

    public async drawActorSimpleStatus(actor, x, y, width) {
        const lineHeight = this.lineHeight();
        const x2 = x + 180;
        const width2 = Math.min(200, width - 180 - this.textPadding());
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        await this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
        this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
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

    public drawCurrencyValue(value, unit, x, y, width) {
        const unitWidth = Math.min(80, this.textWidth(unit));
        this.resetTextColor();
        this.drawText(value, x, y, width - unitWidth - 6, undefined, "right");
        this.changeTextColor(this.systemColor());
        this.drawText(
            unit,
            x + width - unitWidth,
            y,
            unitWidth,
            undefined,
            "right"
        );
    }

    public paramchangeTextColor(change) {
        if (change > 0) {
            return this.powerUpColor();
        } else if (change < 0) {
            return this.powerDownColor();
        } else {
            return this.normalColor();
        }
    }

    public setBackgroundType(type) {
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

    public canvasToLocalX(x) {
        let node = this;
        while (node) {
            x -= node.x;
            // @ts-ignores
            node = node.parent;
        }
        return x;
    }

    public canvasToLocalY(y) {
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
