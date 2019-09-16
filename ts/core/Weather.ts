import * as PIXI from "pixi.js";
import { Bitmap } from "./Bitmap";
import { Graphics } from "./Graphics";
import { Point } from "./Point";
import { ScreenSprite } from "./ScreenSprite";
import { Sprite } from "./Sprite";
import { Utils } from "./Utils";

export class Weather extends PIXI.Container {
    public type: string;
    public power: number;
    public origin: Point;
    private _width: number;
    private _height: number;
    private _sprites: any[];
    private _rainBitmap: Bitmap;
    private _stormBitmap: Bitmap;
    private _snowBitmap: Bitmap;
    private _dimmerSprite: ScreenSprite;
    public viewport: Bitmap;

    public constructor() {
        super();
        this._width = Graphics.width;
        this._height = Graphics.height;
        this._sprites = [];

        this._createBitmaps();
        this._createDimmer();

        /**
         * The type of the weather in ['none', 'rain', 'storm', 'snow'].
         *
         * @property type
         * @type String
         */
        this.type = "none";

        /**
         * The power of the weather in the range (0, 9).
         *
         * @property power
         * @type Number
         */
        this.power = 0;

        /**
         * The origin point of the weather for scrolling.
         *
         * @property origin
         * @type Point
         */
        this.origin = new Point();
    }

    /**
     * Updates the weather for each frame.
     *
     * @method update
     */
    public update = function() {
        this._updateDimmer();
        this._updateAllSprites();
    };

    /**
     * @method _createBitmaps
     * @private
     */
    private _createBitmaps() {
        this._rainBitmap = new Bitmap(1, 60);
        this._rainBitmap.fillAll("white");
        this._stormBitmap = new Bitmap(2, 100);
        this._stormBitmap.fillAll("white");
        this._snowBitmap = new Bitmap(9, 9);
        this._snowBitmap.drawCircle(4, 4, 4, "white");
    }

    /**
     * @method _createDimmer
     * @private
     */
    private _createDimmer() {
        this._dimmerSprite = new ScreenSprite();
        this._dimmerSprite.setColor(80, 80, 80);
        this.addChild(this._dimmerSprite);
    }

    /**
     * @method _updateDimmer
     * @private
     */
    private _updateDimmer() {
        this._dimmerSprite.opacity = Math.floor(this.power * 6);
    }

    /**
     * @method _updateAllSprites
     * @private
     */
    private _updateAllSprites() {
        const maxSprites = Math.floor(this.power * 10);
        while (this._sprites.length < maxSprites) {
            this._addSprite();
        }
        while (this._sprites.length > maxSprites) {
            this._removeSprite();
        }
        this._sprites.forEach(function(sprite) {
            this._updateSprite(sprite);
            sprite.x = sprite.ax - this.origin.x;
            sprite.y = sprite.ay - this.origin.y;
        }, this);
    }

    /**
     * @method _addSprite
     * @private
     */
    private _addSprite() {
        const sprite = new Sprite(this.viewport);
        sprite.opacity = 0;
        this._sprites.push(sprite);
        this.addChild(sprite);
    }

    /**
     * @method _removeSprite
     * @private
     */
    private _removeSprite() {
        this.removeChild(this._sprites.pop());
    }

    /**
     * @method _updateSprite
     * @param {Sprite} sprite
     * @private
     */
    private _updateSprite(sprite) {
        switch (this.type) {
            case "rain":
                this._updateRainSprite(sprite);
                break;
            case "storm":
                this._updateStormSprite(sprite);
                break;
            case "snow":
                this._updateSnowSprite(sprite);
                break;
        }
        if (sprite.opacity < 40) {
            this._rebornSprite(sprite);
        }
    }

    /**
     * @method _updateRainSprite
     * @param {Sprite} sprite
     * @private
     */
    private _updateRainSprite(sprite) {
        sprite.bitmap = this._rainBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 6 * Math.sin(sprite.rotation);
        sprite.ay += 6 * Math.cos(sprite.rotation);
        sprite.opacity -= 6;
    }

    /**
     * @method _updateStormSprite
     * @param {Sprite} sprite
     * @private
     */
    private _updateStormSprite(sprite) {
        sprite.bitmap = this._stormBitmap;
        sprite.rotation = Math.PI / 8;
        sprite.ax -= 8 * Math.sin(sprite.rotation);
        sprite.ay += 8 * Math.cos(sprite.rotation);
        sprite.opacity -= 8;
    }

    /**
     * @method _updateSnowSprite
     * @param {Sprite} sprite
     * @private
     */
    private _updateSnowSprite(sprite) {
        sprite.bitmap = this._snowBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 3 * Math.sin(sprite.rotation);
        sprite.ay += 3 * Math.cos(sprite.rotation);
        sprite.opacity -= 3;
    }

    /**
     * @method _rebornSprite
     * @param {Sprite} sprite
     * @private
     */
    private _rebornSprite(sprite) {
        sprite.ax = Utils.randomInt(Graphics.width + 100) - 100 + this.origin.x;
        sprite.ay =
            Utils.randomInt(Graphics.height + 200) - 200 + this.origin.y;
        sprite.opacity = 160 + Utils.randomInt(60);
    }
}
