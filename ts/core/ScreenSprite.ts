import * as PIXI from "pixi.js";
import Graphics from "./Graphics";
import Utils from "./Utils";

export default class ScreenSprite extends PIXI.Container {
    public static YEPWarned: boolean;
    public static warnYep: () => void;
    public setBlack: () => void;
    public setWhite: () => void;
    public setColor: (r: any, g: any, b: any) => void;
    public _graphics: PIXI.Graphics;
    public opacity: number;
    public _red: number;
    public _green: number;
    public _blue: number;
    public _colorText: string;
    public initialize: () => void;

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
}

/**
 * The opacity of the sprite (0 to 255).
 *
 * @property opacity
 * @type Number
 */
Object.defineProperty(ScreenSprite.prototype, "opacity", {
    "get"() {
        return this.alpha * 255;
    },
    "set"(value) {
        this.alpha = Utils.clamp(value, 0, 255) / 255;
    },
    "configurable": true
});

ScreenSprite.YEPWarned = false;
ScreenSprite.warnYep = function () {
    if (!ScreenSprite.YEPWarned) {
        console.log("Deprecation warning. Please update YEP_CoreEngine. ScreenSprite is not a sprite, it has graphics inside.");
        ScreenSprite.YEPWarned = true;
    }
};

Object.defineProperty(ScreenSprite.prototype, "anchor", {
    "get"() {
        ScreenSprite.warnYep();
        this.scale.x = 1;
        this.scale.y = 1;
        return {"x": 0, "y": 0};
    },
    "set"(value) {
        this.alpha = Utils.clamp(value, 0, 255) / 255;
    },
    "configurable": true
});

Object.defineProperty(ScreenSprite.prototype, "blendMode", {
    "get"() {
        return this._graphics.blendMode;
    },
    "set"(value) {
        this._graphics.blendMode = value;
    },
    "configurable": true
});

/**
 * Sets black to the color of the screen sprite.
 *
 * @method setBlack
 */
ScreenSprite.prototype.setBlack = function () {
    this.setColor(0, 0, 0);
};

/**
 * Sets white to the color of the screen sprite.
 *
 * @method setWhite
 */
ScreenSprite.prototype.setWhite = function () {
    this.setColor(255, 255, 255);
};

/**
 * Sets the color of the screen sprite by values.
 *
 * @method setColor
 * @param {Number} r The red value in the range (0, 255)
 * @param {Number} g The green value in the range (0, 255)
 * @param {Number} b The blue value in the range (0, 255)
 */
ScreenSprite.prototype.setColor = function (r, g, b) {
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
        //whole screen with zoom. BWAHAHAHAHA
        graphics.drawRect(-Graphics.width * 5, -Graphics.height * 5, Graphics.width * 10, Graphics.height * 10);
    }
};
