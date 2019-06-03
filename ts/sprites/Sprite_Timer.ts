import Bitmap from "../core/Bitmap";
import Graphics from "../core/Graphics";
import Sprite from "../core/Sprite";
import Utils from "../core/Utils";

//-----------------------------------------------------------------------------
// Sprite_Timer
//
// The sprite for displaying the timer.

export default class Sprite_Timer extends Sprite {
    public _seconds: number;
    public updateBitmap: () => void;
    public redraw: () => void;
    public timerText: () => string;
    public updatePosition: () => void;
    public updateVisibility: () => void;
    public constructor() {
        super();
        this._seconds = 0;
        this.createBitmap();
        this.update();
    }
    public createBitmap(): any {
        throw new Error("Method not implemented.");
    }
}

Sprite_Timer.prototype.createBitmap = function () {
    this.bitmap = new Bitmap(96, 48);
    this.bitmap.fontSize = 32;
};

Sprite_Timer.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updatePosition();
    this.updateVisibility();
};

Sprite_Timer.prototype.updateBitmap = function () {
    if (this._seconds !== $gameTimer.seconds()) {
        this._seconds = $gameTimer.seconds();
        this.redraw();
    }
};

Sprite_Timer.prototype.redraw = function () {
    const text = this.timerText();
    const width = this.bitmap.width;
    const height = this.bitmap.height;
    this.bitmap.clear();
    this.bitmap.drawText(text, 0, 0, width, height, "center");
};

Sprite_Timer.prototype.timerText = function () {
    const min = Math.floor(this._seconds / 60) % 60;
    const sec = this._seconds % 60;
    return Utils.padZero(String(min), 2) + ":" + Utils.padZero(String(sec), 2);
};

Sprite_Timer.prototype.updatePosition = function () {
    this.x = Graphics.width - this.bitmap.width;
    this.y = 0;
};

Sprite_Timer.prototype.updateVisibility = function () {
    this.visible = $gameTimer.isWorking();
};
