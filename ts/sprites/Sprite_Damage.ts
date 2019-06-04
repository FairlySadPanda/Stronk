import Sprite from "../core/Sprite";
import ImageManager from "../managers/ImageManager";

// -----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.

export default class Sprite_Damage extends Sprite {
    public _duration: number;
    public _flashColor: number[];
    public _flashDuration: number;
    public _damageBitmap: any;
    public setup: (target: any) => void;
    public setupCriticalEffect: () => void;
    public digitWidth: () => number;
    public digitHeight: () => number;
    public createMiss: () => void;
    public createDigits: (baseRow: any, value: any) => void;
    public createChildSprite: () => Sprite;
    public updateChild: (sprite: any) => void;
    public updateFlash: () => void;
    public updateOpacity: () => void;
    public isPlaying: () => boolean;
    public constructor() {
        super();
        this._duration = 90;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._damageBitmap = ImageManager.loadSystem("Damage");
    }
}

Sprite_Damage.prototype.setup = function(target) {
    const result = target.result();
    if (result.missed || result.evaded) {
        this.createMiss();
    } else if (result.hpAffected) {
        this.createDigits(0, result.hpDamage);
    } else if (target.isAlive() && result.mpDamage !== 0) {
        this.createDigits(2, result.mpDamage);
    }
    if (result.critical) {
        this.setupCriticalEffect();
    }
};

Sprite_Damage.prototype.setupCriticalEffect = function() {
    this._flashColor = [255, 0, 0, 160];
    this._flashDuration = 60;
};

Sprite_Damage.prototype.digitWidth = function() {
    return this._damageBitmap ? this._damageBitmap.width / 10 : 0;
};

Sprite_Damage.prototype.digitHeight = function() {
    return this._damageBitmap ? this._damageBitmap.height / 5 : 0;
};

Sprite_Damage.prototype.createMiss = function() {
    const w = this.digitWidth();
    const h = this.digitHeight();
    const sprite = this.createChildSprite();
    sprite.setFrame(0, 4 * h, 4 * w, h);
    sprite.dy = 0;
};

Sprite_Damage.prototype.createDigits = function(baseRow, value) {
    const string = Math.abs(value).toString();
    const row = baseRow + (value < 0 ? 1 : 0);
    const w = this.digitWidth();
    const h = this.digitHeight();
    for (let i = 0; i < string.length; i++) {
        const sprite = this.createChildSprite();
        const n = Number(string[i]);
        sprite.setFrame(n * w, row * h, w, h);
        sprite.x = (i - (string.length - 1) / 2) * w;
        sprite.dy = -i;
    }
};

Sprite_Damage.prototype.createChildSprite = function() {
    const sprite = new Sprite();
    sprite.bitmap = this._damageBitmap;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.y = -40;
    sprite.ry = sprite.y;
    this.addChild(sprite);
    return sprite;
};

Sprite_Damage.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._duration > 0) {
        this._duration--;
        for (let i = 0; i < this.children.length; i++) {
            this.updateChild(this.children[i]);
        }
    }
    this.updateFlash();
    this.updateOpacity();
};

Sprite_Damage.prototype.updateChild = function(sprite) {
    sprite.dy += 0.5;
    sprite.ry += sprite.dy;
    if (sprite.ry >= 0) {
        sprite.ry = 0;
        sprite.dy *= -0.6;
    }
    sprite.y = Math.round(sprite.ry);
    sprite.setBlendColor(this._flashColor);
};

Sprite_Damage.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        const d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
    }
};

Sprite_Damage.prototype.updateOpacity = function() {
    if (this._duration < 10) {
        this.opacity = (255 * this._duration) / 10;
    }
};

Sprite_Damage.prototype.isPlaying = function() {
    return this._duration > 0;
};
