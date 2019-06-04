import Graphics from "../core/Graphics";
import ImageManager from "../managers/ImageManager";
import Window_Base from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_NameEdit
//
// The window for editing an actor's name on the name input screen.

export default class Window_NameEdit extends Window_Base {
    public _actor: any;
    public _name: any;
    public _index: any;
    public _defaultName: any;
    public restoreDefault: () => boolean;
    public add: (ch: any) => boolean;
    public back: () => boolean;
    public faceWidth: () => number;
    public charWidth: () => any;
    public left: () => number;
    public itemRect: (
        index: any
    ) => { x: any; y: number; width: any; height: any };
    public underlineRect: (index: any) => any;
    public underlineColor: () => any;
    public drawUnderline: (index: any) => void;
    public drawChar: (index: any) => void;
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
    public windowWidth(): any {
        throw new Error("Method not implemented.");
    }
    public windowHeight(): any {
        throw new Error("Method not implemented.");
    }
    public _maxLength(arg0: number, _maxLength: any): any {
        throw new Error("Method not implemented.");
    }
    public refresh(): any {
        throw new Error("Method not implemented.");
    }
}

Window_NameEdit.prototype.windowWidth = function() {
    return 480;
};

Window_NameEdit.prototype.windowHeight = function() {
    return this.fittingHeight(4);
};

// @ts-ignore
Window_NameEdit.prototype.name = function() {
    return this._name;
};

Window_NameEdit.prototype.restoreDefault = function() {
    this._name = this._defaultName;
    this._index = this._name.length;
    this.refresh();
    return this._name.length > 0;
};

Window_NameEdit.prototype.add = function(ch) {
    if (this._index < this._maxLength) {
        this._name += ch;
        this._index++;
        this.refresh();
        return true;
    } else {
        return false;
    }
};

Window_NameEdit.prototype.back = function() {
    if (this._index > 0) {
        this._index--;
        this._name = this._name.slice(0, this._index);
        this.refresh();
        return true;
    } else {
        return false;
    }
};

Window_NameEdit.prototype.faceWidth = function() {
    return 144;
};

Window_NameEdit.prototype.charWidth = function() {
    const text = $gameSystem.isJapanese() ? "\uff21" : "A";
    return this.textWidth(text);
};

Window_NameEdit.prototype.left = function() {
    const nameCenter = (this.contentsWidth() + this.faceWidth()) / 2;
    const nameWidth = (this._maxLength + 1) * this.charWidth();
    return Math.min(
        nameCenter - nameWidth / 2,
        this.contentsWidth() - nameWidth
    );
};

Window_NameEdit.prototype.itemRect = function(index) {
    return {
        x: this.left() + index * this.charWidth(),
        y: 54,
        width: this.charWidth(),
        height: this.lineHeight()
    };
};

Window_NameEdit.prototype.underlineRect = function(index) {
    const rect = this.itemRect(index);
    rect.x++;
    rect.y += rect.height - 4;
    rect.width -= 2;
    rect.height = 2;
    return rect;
};

Window_NameEdit.prototype.underlineColor = function() {
    return this.normalColor();
};

Window_NameEdit.prototype.drawUnderline = function(index) {
    const rect = this.underlineRect(index);
    const color = this.underlineColor();
    this.contents.paintOpacity = 48;
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.contents.paintOpacity = 255;
};

Window_NameEdit.prototype.drawChar = function(index) {
    const rect = this.itemRect(index);
    this.resetTextColor();
    this.drawText(this._name[index] || "", rect.x, rect.y);
};

Window_NameEdit.prototype.refresh = function() {
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
};
