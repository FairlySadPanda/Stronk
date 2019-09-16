import * as PIXI from "pixi.js";
import { Utils } from "./Utils";

export class ToneFilter extends PIXI.filters.ColorMatrixFilter {
    /**
     * Changes the hue.
     *
     * @method adjustHue
     * @param {Number} value The hue value in the range (-360, 360)
     */
    public adjustHue(value: number) {
        this.hue(value, true);
    }

    /**
     * Changes the saturation.
     *
     * @method adjustSaturation
     * @param {Number} value The saturation value in the range (-255, 255)
     */
    public adjustSaturation(value: number) {
        value = Utils.clamp(value || 0, -255, 255) / 255;
        this.saturate(value, true);
    }

    /**
     * Changes the tone.
     *
     * @method adjustTone
     * @param {Number} r The red strength in the range (-255, 255)
     * @param {Number} g The green strength in the range (-255, 255)
     * @param {Number} b The blue strength in the range (-255, 255)
     */
    public adjustTone(r: number, g: number, b: number) {
        r = Utils.clamp(r || 0, -255, 255) / 255;
        g = Utils.clamp(g || 0, -255, 255) / 255;
        b = Utils.clamp(b || 0, -255, 255) / 255;

        if (r !== 0 || g !== 0 || b !== 0) {
            const matrix = [
                1,
                0,
                0,
                r,
                0,
                0,
                1,
                0,
                g,
                0,
                0,
                0,
                1,
                b,
                0,
                0,
                0,
                0,
                1,
                0
            ];

            this._loadMatrix(matrix, true);
        }
    }
}
