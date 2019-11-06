import { Graphics } from "../core/Graphics";
import { ImageManager } from "../managers/ImageManager";
import { Window_Base } from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_NameEdit
//
// The window for editing an actor's name on the name input screen.

export class Window_NameEdit extends Window_Base {
    private _actor: any;
    private _name: string;
    private _index: any;
    private _defaultName: any;
    private _maxLength: any;

    public constructor(actor, maxLength) {
        const width = Window_NameEdit.prototype.windowWidth();
        const height = Window_NameEdit.prototype.windowHeight();
        const x = (Graphics.boxWidth - width) / 2;
        const y =
            (Graphics.boxHeight -
                (height + Window_NameEdit.prototype.fittingHeight(9) + 8)) /
            2;
        super(x, y, width, height);
        this._actor = actor;
        this._name = actor.name().slice(0, this._maxLength);
        this._index = this._name.length;
        this._maxLength = maxLength;
        this._defaultName = this._name;
        this.deactivate();
        this.refresh();
        ImageManager.reserveFace(actor.faceName());
    }

    public windowWidth() {
        return 480;
    }

    public windowHeight() {
        return this.fittingHeight(4);
    }

    public get name() {
        return this._name;
    }

    public restoreDefault() {
        this._name = this._defaultName;
        this._index = this._name.length;
        this.refresh();
        return this._name.length > 0;
    }

    public add(ch) {
        if (this._index < this._maxLength) {
            this._name += ch;
            this._index++;
            this.refresh();
            return true;
        } else {
            return false;
        }
    }

    public back() {
        if (this._index > 0) {
            this._index--;
            this._name = this._name.slice(0, this._index);
            this.refresh();
            return true;
        } else {
            return false;
        }
    }

    public faceWidth() {
        return Window_Base._faceWidth;
    }

    public charWidth() {
        const text = $gameSystem.isJapanese() ? "\uff21" : "A";
        return this.textWidth(text);
    }

    public left() {
        const nameCenter = (this.contentsWidth() + this.faceWidth()) / 2;
        const nameWidth = (this._maxLength + 1) * this.charWidth();
        return Math.min(
            nameCenter - nameWidth / 2,
            this.contentsWidth() - nameWidth
        );
    }

    public itemRect(index) {
        return {
            x: this.left() + index * this.charWidth(),
            y: 54,
            width: this.charWidth(),
            height: this.lineHeight()
        };
    }

    public underlineRect(index) {
        const rect = this.itemRect(index);
        rect.x++;
        rect.y += rect.height - 4;
        rect.width -= 2;
        rect.height = 2;
        return rect;
    }

    public underlineColor() {
        return this.normalColor();
    }

    public drawUnderline(index) {
        const rect = this.underlineRect(index);
        const color = this.underlineColor();
        this.contents.paintOpacity = 48;
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contents.paintOpacity = 255;
    }

    public drawChar(index) {
        const rect = this.itemRect(index);
        this.resetTextColor();
        this.drawText(this._name[index] || "", rect.x, rect.y);
    }

    public refresh() {
        this.contents.clear();
        this.drawActorFace(this._actor, 0, 0);
        for (let i = 0; i < this._maxLength; i++) {
            this.drawUnderline(i);
        }
        for (let j = 0; j < this._name.length; j++) {
            this.drawChar(j);
        }
        const rect = this.itemRect(this._index);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    }
}
