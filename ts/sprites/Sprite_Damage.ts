import { Sprite } from "../core/Sprite";
import { ImageManager } from "../managers/ImageManager";

// -----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.

export class Sprite_Damage extends Sprite {
    private _duration: number;
    private _flashColor: number[];
    private _flashDuration: number;
    private _damageBitmap: any;

    public constructor() {
        super();
        this._duration = 90;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._damageBitmap = ImageManager.loadSystem("Damage");
    }

    public setup(target) {
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
    }

    public setupCriticalEffect() {
        this._flashColor = [255, 0, 0, 160];
        this._flashDuration = 60;
    }

    public digitWidth() {
        return this._damageBitmap ? this._damageBitmap.width / 10 : 0;
    }

    public digitHeight() {
        return this._damageBitmap ? this._damageBitmap.height / 5 : 0;
    }

    public createMiss() {
        const w = this.digitWidth();
        const h = this.digitHeight();
        const sprite = this.createChildSprite();
        sprite.setFrame(0, 4 * h, 4 * w, h);
        sprite.dy = 0;
    }

    public createDigits(baseRow, value) {
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
    }

    public createChildSprite() {
        const sprite = new Sprite();
        sprite.bitmap = this._damageBitmap;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.y = -40;
        sprite.ry = sprite.y;
        this.addChild(sprite);
        return sprite;
    }

    public update() {
        super.update();
        if (this._duration > 0) {
            this._duration--;
            for (let i = 0; i < this.children.length; i++) {
                this.updateChild(this.children[i]);
            }
        }
        this.updateFlash();
        this.updateOpacity();
    }

    public updateChild(sprite) {
        sprite.dy += 0.5;
        sprite.ry += sprite.dy;
        if (sprite.ry >= 0) {
            sprite.ry = 0;
            sprite.dy *= -0.6;
        }
        sprite.y = Math.round(sprite.ry);
        sprite.setBlendColor(this._flashColor);
    }

    public updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
        }
    }

    public updateOpacity() {
        if (this._duration < 10) {
            this.opacity = (255 * this._duration) / 10;
        }
    }

    public isPlaying() {
        return this._duration > 0;
    }
}
