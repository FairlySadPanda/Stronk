import ImageManager from "../managers/ImageManager";
import Sprite_Base from "./Sprite_Base";

//-----------------------------------------------------------------------------
// Sprite_StateOverlay
//
// The sprite for displaying an overlay image for a state.

export default class Sprite_StateOverlay extends Sprite_Base {
    public setup: (battler: any) => void;
    public animationWait: () => number;
    public updatePattern: () => void;
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

Sprite_StateOverlay.prototype.initMembers = function () {
    this._battler = null;
    this._overlayIndex = 0;
    this._animationCount = 0;
    this._pattern = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
};

Sprite_StateOverlay.prototype.loadBitmap = function () {
    this.bitmap = ImageManager.loadSystem("States");
    this.setFrame(0, 0, 0, 0);
};

Sprite_StateOverlay.prototype.setup = function (battler) {
    this._battler = battler;
};

Sprite_StateOverlay.prototype.update = function () {
    Sprite_Base.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
};

Sprite_StateOverlay.prototype.animationWait = function () {
    return 8;
};

Sprite_StateOverlay.prototype.updatePattern = function () {
    this._pattern++;
    this._pattern %= 8;
    if (this._battler) {
        this._overlayIndex = this._battler.stateOverlayIndex();
    }
};

Sprite_StateOverlay.prototype.updateFrame = function () {
    if (this._overlayIndex > 0) {
        const w = 96;
        const h = 96;
        const sx = this._pattern * w;
        const sy = (this._overlayIndex - 1) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};
