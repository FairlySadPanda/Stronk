import { Sprite } from "../core/Sprite";
import { ImageManager } from "../managers/ImageManager";

// -----------------------------------------------------------------------------
// Sprite_StateIcon
//
// The sprite for displaying state icons.

export class Sprite_StateIcon extends Sprite {
    private static _iconWidth = 32;
    private static _iconHeight = 32;

    private _battler: any;
    private _iconIndex: number;
    private _animationCount: number;
    private _animationIndex: number;

    public constructor() {
        super();
        this.initMembers();
        this.loadBitmap();
    }

    public initMembers() {
        this._battler = null;
        this._iconIndex = 0;
        this._animationCount = 0;
        this._animationIndex = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }

    public loadBitmap() {
        this.bitmap = ImageManager.loadSystem("IconSet");
        this.setFrame(0, 0, 0, 0);
    }

    public setup(battler) {
        this._battler = battler;
    }

    public update() {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updateIcon();
            this.updateFrame();
            this._animationCount = 0;
        }
    }

    public animationWait() {
        return 40;
    }

    public updateIcon() {
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
    }

    public updateFrame() {
        const pw = Sprite_StateIcon._iconWidth;
        const ph = Sprite_StateIcon._iconHeight;
        const sx = (this._iconIndex % 16) * pw;
        const sy = Math.floor(this._iconIndex / 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    }
}
