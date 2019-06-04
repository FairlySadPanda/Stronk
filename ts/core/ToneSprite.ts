import * as PIXI from "pixi";
import Graphics from "./Graphics";
import Utils from "./Utils";

export default class ToneSprite extends PIXI.Container {
    public setTone: (r: any, g: any, b: any, gray: any) => void;
    public constructor() {
        super();
        this.clear();
    }
    public clear(): any {
        throw new Error("Method not implemented.");
    }

    public _renderWebGL(renderer) {
        // Not supported
    }

    protected _renderCanvas = function(renderer) {
        if (this.visible) {
            const context = renderer.context;
            const t = this.worldTransform;
            const r = renderer.resolution;
            const width = Graphics.width;
            const height = Graphics.height;
            context.save();
            context.setTransform(t.a, t.b, t.c, t.d, t.tx * r, t.ty * r);
            if (Graphics.canUseSaturationBlend && this._gray > 0) {
                context.globalCompositeOperation = "saturation";
                context.globalAlpha = this._gray / 255;
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, width, height);
            }
            context.globalAlpha = 1;
            const r1 = Math.max(0, this._red);
            const g1 = Math.max(0, this._green);
            const b1 = Math.max(0, this._blue);
            if (r1 || g1 || b1) {
                context.globalCompositeOperation = "lighter";
                context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
                context.fillRect(0, 0, width, height);
            }
            if (Graphics.canUseDifferenceBlend) {
                const r2 = Math.max(0, -this._red);
                const g2 = Math.max(0, -this._green);
                const b2 = Math.max(0, -this._blue);
                if (r2 || g2 || b2) {
                    context.globalCompositeOperation = "difference";
                    context.fillStyle = "#ffffff";
                    context.fillRect(0, 0, width, height);
                    context.globalCompositeOperation = "lighter";
                    context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
                    context.fillRect(0, 0, width, height);
                    context.globalCompositeOperation = "difference";
                    context.fillStyle = "#ffffff";
                    context.fillRect(0, 0, width, height);
                }
            }
            context.restore();
        }
    };
}
/**
 * Clears the tone.
 *
 * @method reset
 */
ToneSprite.prototype.clear = function() {
    this._red = 0;
    this._green = 0;
    this._blue = 0;
    this._gray = 0;
};

/**
 * Sets the tone.
 *
 * @method setTone
 * @param {Number} r The red strength in the range (-255, 255)
 * @param {Number} g The green strength in the range (-255, 255)
 * @param {Number} b The blue strength in the range (-255, 255)
 * @param {Number} gray The grayscale level in the range (0, 255)
 */
ToneSprite.prototype.setTone = function(r, g, b, gray) {
    this._red = Utils.clamp(Math.round(r || 0), -255, 255);
    this._green = Utils.clamp(Math.round(g || 0), -255, 255);
    this._blue = Utils.clamp(Math.round(b || 0), -255, 255);
    this._gray = Utils.clamp(Math.round(gray || 0), 0, 255);
};

/**
 * @method _renderWebGL
 * @param {Object} renderSession
 * @private
 */
ToneSprite.prototype._renderWebGL = function(renderer) {
    // Not supported
};
