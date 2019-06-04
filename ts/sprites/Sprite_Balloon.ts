import ImageManager from "../managers/ImageManager";
import Sprite_Base from "./Sprite_Base";

// -----------------------------------------------------------------------------
// Sprite_Balloon
//
// The sprite for displaying a balloon icon.

export default class Sprite_Balloon extends Sprite_Base {
    public setup: (balloonId: any) => void;
    public updateFrame: () => void;
    public speed: () => number;
    public waitTime: () => number;
    public frameIndex: () => number;
    public isPlaying: () => boolean;
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

Sprite_Balloon.prototype.initMembers = function() {
    this._balloonId = 0;
    this._duration = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.z = 7;
};

Sprite_Balloon.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem("Balloon");
    this.setFrame(0, 0, 0, 0);
};

Sprite_Balloon.prototype.setup = function(balloonId) {
    this._balloonId = balloonId;
    this._duration = 8 * this.speed() + this.waitTime();
};

Sprite_Balloon.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    if (this._duration > 0) {
        this._duration--;
        if (this._duration > 0) {
            this.updateFrame();
        }
    }
};

Sprite_Balloon.prototype.updateFrame = function() {
    const w = 48;
    const h = 48;
    const sx = this.frameIndex() * w;
    const sy = (this._balloonId - 1) * h;
    this.setFrame(sx, sy, w, h);
};

Sprite_Balloon.prototype.speed = function() {
    return 8;
};

Sprite_Balloon.prototype.waitTime = function() {
    return 12;
};

Sprite_Balloon.prototype.frameIndex = function() {
    const index = (this._duration - this.waitTime()) / this.speed();
    return 7 - Math.max(Math.floor(index), 0);
};

Sprite_Balloon.prototype.isPlaying = function() {
    return this._duration > 0;
};
