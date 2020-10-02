import * as PIXI from "pixi.js";
import { Graphics } from "./Graphics";
import { Point } from "./Point";
import { Utils } from "./Utils";

export class ScreenSprite extends PIXI.Container {
    public _graphics: PIXI.Graphics;
    public _red: number;
    public _green: number;
    public _blue: number;
    public _colorText: string;

    public constructor() {
        super();

        this._graphics = new PIXI.Graphics();
        this.addChild(this._graphics);
        this.opacity = 0;

        this._red = -1;
        this._green = -1;
        this._blue = -1;
        this._colorText = "";
        this.setBlack();
    }

    /**
     * Sets black to the color of the screen sprite.
     *
     * @method setBlack
     */
    public setBlack() {
        this.setColor(0, 0, 0);
    }

    /**
     * Sets white to the color of the screen sprite.
     *
     * @method setWhite
     */
    public setWhite() {
        this.setColor(255, 255, 255);
    }

    /**
     * Sets the color of the screen sprite by values.
     *
     * @method setColor
     * @param {Number} r The red value in the range (0, 255)
     * @param {Number} g The green value in the range (0, 255)
     * @param {Number} b The blue value in the range (0, 255)
     */
    public setColor(r, g, b) {
        if (this._red !== r || this._green !== g || this._blue !== b) {
            r = Utils.clamp(Math.round(r || 0), 0, 255);
            g = Utils.clamp(Math.round(g || 0), 0, 255);
            b = Utils.clamp(Math.round(b || 0), 0, 255);
            this._red = r;
            this._green = g;
            this._blue = b;
            this._colorText = Utils.rgbToCssColor(r, g, b);

            const graphics = this._graphics;
            graphics.clear();
            const intColor = (r << 16) | (g << 8) | b;
            graphics.beginFill(intColor, 1);
            // whole screen with zoom. BWAHAHAHAHA
            graphics.drawRect(
                -Graphics.width * 5,
                -Graphics.height * 5,
                Graphics.width * 10,
                Graphics.height * 10
            );
        }
    }

    public get opacity() {
        return this.alpha * 255;
    }

    public set opacity(value) {
        this.alpha = Utils.clamp(value, 0, 255) / 255;
    }

    public get anchor(): Point {
        this.scale.x = 1;
        this.scale.y = 1;
        return new Point(0, 0);
    }

    // TODO: Had to hack this to get type validation for the time being. Figure out what this does and do a proper fix!
    public set anchor(value: Point) {
        this.alpha =
            Utils.clamp(value.x > value.y ? value.x : value.y, 0, 255) / 255;
    }

    public get blendMode(): number {
        return this._graphics.blendMode;
    }

    public set blendMode(value: number) {
        this._graphics.blendMode = value;
    }
}
