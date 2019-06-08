import ImageManager from "../managers/ImageManager";
import Sprite_Base from "./Sprite_Base";

// -----------------------------------------------------------------------------
// Sprite_Balloon
//
// The sprite for displaying a balloon icon.

export default class Sprite_Balloon extends Sprite_Base {
    private _balloonId: number;
    private _duration: number;

    public constructor() {
        super();
        this.initMembers();
        this.loadBitmap();
    }

    public initMembers() {
        this._balloonId = 0;
        this._duration = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.z = 7;
    }

    public loadBitmap() {
        this.bitmap = ImageManager.loadSystem("Balloon");
        this.setFrame(0, 0, 0, 0);
    }

    public setup(balloonId) {
        this._balloonId = balloonId;
        this._duration = 8 * this.speed() + this.waitTime();
    }

    public update() {
        super.update();
        if (this._duration > 0) {
            this._duration--;
            if (this._duration > 0) {
                this.updateFrame();
            }
        }
    }

    public updateFrame() {
        const w = 48;
        const h = 48;
        const sx = this.frameIndex() * w;
        const sy = (this._balloonId - 1) * h;
        this.setFrame(sx, sy, w, h);
    }

    public speed() {
        return 8;
    }

    public waitTime() {
        return 12;
    }

    public frameIndex() {
        const index = (this._duration - this.waitTime()) / this.speed();
        return 7 - Math.max(Math.floor(index), 0);
    }

    public isPlaying() {
        return this._duration > 0;
    }
}
