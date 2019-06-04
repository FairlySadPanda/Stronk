import Sprite from "../core/Sprite";
import ImageManager from "../managers/ImageManager";

// -----------------------------------------------------------------------------
// Sprite_StateIcon
//
// The sprite for displaying state icons.

export default class Sprite_StateIcon extends Sprite {
    public static _iconWidth: number;
    public static _iconHeight: number;
    public setup: (battler: any) => void;
    public animationWait: () => number;
    public updateIcon: () => void;
    public updateFrame: () => void;
    public constructor() {
        super();
        this.initMembers();
        this.loadBitmap();
    }
    public initMembers(): any {
        throw new Error("Method not implemented.");
    }
    public loadBitmap(): any {
        throw new Error("Method not implemented.");
    }
}

Sprite_StateIcon._iconWidth = 32;
Sprite_StateIcon._iconHeight = 32;

Sprite_StateIcon.prototype.initMembers = function() {
    this._battler = null;
    this._iconIndex = 0;
    this._animationCount = 0;
    this._animationIndex = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};

Sprite_StateIcon.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem("IconSet");
    this.setFrame(0, 0, 0, 0);
};

Sprite_StateIcon.prototype.setup = function(battler) {
    this._battler = battler;
};

Sprite_StateIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updateIcon();
        this.updateFrame();
        this._animationCount = 0;
    }
};

Sprite_StateIcon.prototype.animationWait = function() {
    return 40;
};

Sprite_StateIcon.prototype.updateIcon = function() {
    let icons = [];
    if (this._battler && this._battler.isAlive()) {
        icons = this._battler.allIcons();
    }
    if (icons.length > 0) {
        this._animationIndex++;
        if (this._animationIndex >= icons.length) {
            this._animationIndex = 0;
        }
        this._iconIndex = icons[this._animationIndex];
    } else {
        this._animationIndex = 0;
        this._iconIndex = 0;
    }
};

Sprite_StateIcon.prototype.updateFrame = function() {
    const pw = Sprite_StateIcon._iconWidth;
    const ph = Sprite_StateIcon._iconHeight;
    const sx = (this._iconIndex % 16) * pw;
    const sy = Math.floor(this._iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};
