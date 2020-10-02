import { ImageManager } from "../managers/ImageManager";
import { Sprite_Base } from "./Sprite_Base";

// -----------------------------------------------------------------------------
// Sprite_StateOverlay
//
// The sprite for displaying an overlay image for a state.

export class Sprite_StateOverlay extends Sprite_Base {
    private _battler: any;
    private _overlayIndex: number;
    private _animationCount: number;
    private _pattern: number;

    public constructor() {
        super();
        this.initMembers();
        this.loadBitmap();
    }

    public initMembers() {
        this._battler = null;
        this._overlayIndex = 0;
        this._animationCount = 0;
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
    }

    public loadBitmap() {
        this.bitmap = ImageManager.loadSystem("States");
        this.setFrame(0, 0, 0, 0);
    }

    public setup(battler) {
        this._battler = battler;
    }

    public update() {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this.updateFrame();
            this._animationCount = 0;
        }
        this.updateMirror();
    }

    public updateMirror() {
        if (this.parent.scale.x < 0) this.scale.x = -1 * Math.abs(this.scale.x);
        if (this.parent.scale.x > 0) this.scale.x = Math.abs(this.scale.x);
    }

    public animationWait() {
        return 8;
    }

    public updatePattern() {
        this._pattern++;
        this._pattern %= 8;
        if (this._battler) {
            this._overlayIndex = this._battler.stateOverlayIndex();
        }
    }

    public updateFrame() {
        if (this._overlayIndex > 0) {
            const w = 96;
            const h = 96;
            const sx = this._pattern * w;
            const sy = (this._overlayIndex - 1) * h;
            this.setFrame(sx, sy, w, h);
        } else {
            this.setFrame(0, 0, 0, 0);
        }
    }
}
