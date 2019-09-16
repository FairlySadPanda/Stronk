import { Bitmap } from "../core/Bitmap";
import { Graphics } from "../core/Graphics";
import { Sprite } from "../core/Sprite";

// -----------------------------------------------------------------------------
// Sprite_Destination
//
// The sprite for displaying the destination place of the touch input.

export class Sprite_Destination extends Sprite {
    private _frameCount: number;
    public z: number;

    public constructor() {
        super();
        this.createBitmap();
        this._frameCount = 0;
    }

    public update() {
        super.update();
        if ($gameTemp.isDestinationValid()) {
            this.updatePosition();
            this.updateAnimation();
            this.visible = true;
        } else {
            this._frameCount = 0;
            this.visible = false;
        }
    }

    public createBitmap() {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        this.bitmap = new Bitmap(tileWidth, tileHeight);
        this.bitmap.fillAll("white");
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.blendMode = Graphics.BLEND_ADD;
    }

    public updatePosition() {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const x = $gameTemp.destinationX();
        const y = $gameTemp.destinationY();
        this.x = ($gameMap.adjustX(x) + 0.5) * tileWidth;
        this.y = ($gameMap.adjustY(y) + 0.5) * tileHeight;
    }

    public updateAnimation() {
        this._frameCount++;
        this._frameCount %= 20;
        this.opacity = (20 - this._frameCount) * 6;
        this.scale.x = 1 + this._frameCount / 20;
        this.scale.y = this.scale.x;
    }
}
