import Bitmap from "../core/Bitmap";
import Graphics from "../core/Graphics";
import Sprite from "../core/Sprite";
import Utils from "../core/Utils";

// -----------------------------------------------------------------------------
// Sprite_Timer
//
// The sprite for displaying the timer.

export default class Sprite_Timer extends Sprite {
    private _seconds: number;

    public constructor() {
        super();
        this._seconds = 0;
        this.createBitmap();
        this.update();
    }

    public createBitmap() {
        this.bitmap = new Bitmap(96, 48);
        this.bitmap.fontSize = 32;
    }

    public update() {
        super.update();
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    }

    public updateBitmap() {
        if (this._seconds !== $gameTimer.seconds()) {
            this._seconds = $gameTimer.seconds();
            this.redraw();
        }
    }

    public redraw() {
        const text = this.timerText();
        const width = this.bitmap.width;
        const height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(text, 0, 0, width, height, "center");
    }

    public timerText() {
        const min = Math.floor(this._seconds / 60) % 60;
        const sec = this._seconds % 60;
        return (
            Utils.padZero(String(min), 2) + ":" + Utils.padZero(String(sec), 2)
        );
    }

    public updatePosition() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 0;
    }

    public updateVisibility() {
        this.visible = $gameTimer.isWorking();
    }
}
