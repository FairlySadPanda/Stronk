import { Sprite } from "../core/Sprite";
import { Bitmap } from "../core/Bitmap";
import { ImageManager } from "../managers/ImageManager";
import { ConfigManager } from "../managers/ConfigManager";

/**
 * YEP class imported from YEP_CoreEngine
 */
export class Sprite_Battleback extends Sprite {
    private _bitmapName: string;
    private _battlebackType: number;

    public constructor(bitmapName: string, type: number) {
        super();
        this._bitmapName = bitmapName;
        this._battlebackType = type;
        this.createBitmap();
    }

    public createBitmap() {
        if (this._bitmapName === "") {
            this.bitmap = new Bitmap(
                ConfigManager.currentResolution.widthPx,
                ConfigManager.currentResolution.heightPx
            );
        } else {
            if (this._battlebackType === 1) {
                this.bitmap = ImageManager.loadBattleback1(this._bitmapName);
            } else {
                this.bitmap = ImageManager.loadBattleback2(this._bitmapName);
            }
            this.scaleSprite();
        }
    }

    public scaleSprite() {
        if (this.bitmap.width <= 0)
            return setTimeout(this.scaleSprite.bind(this), 5);
        const width = ConfigManager.currentResolution.widthPx;
        const height = ConfigManager.currentResolution.heightPx;
        if (this.bitmap.width < width) {
            this.scale.x = width / this.bitmap.width;
        }
        if (this.bitmap.height < height) {
            this.scale.y = height / this.bitmap.height;
        }
        this.anchor.x = 0.5;
        this.x = width / 2;
        if ($gameSystem.isSideView()) {
            this.anchor.y = 1;
            this.y = height;
        } else {
            this.anchor.y = 0.5;
            this.y = height / 2;
        }
    }
}
