import * as PIXI from "pixi.js";
import { Bitmap } from "./Bitmap";
import { Graphics } from "./Graphics";
import { Rectangle } from "./Rectangle";
import { Utils } from "./Utils";

// -----------------------------------------------------------------------------
/**
 * The basic object that is rendered to the game screen.
 *
 */
export class Sprite extends PIXI.Sprite {
    public get bitmap(): Bitmap {
        return this._bitmap;
    }

    public set bitmap(value: Bitmap) {
        if (this._bitmap !== value) {
            this._bitmap = value;

            if (value) {
                this._refreshFrame = true;
                value.addLoadListener(this._onBitmapLoad.bind(this));
            } else {
                this._refreshFrame = false;
                this.texture.frame = Rectangle.emptyRectangle;
            }
        }
    }

    public get width() {
        return this._frame.width;
    }

    public set width(value) {
        this._frame.width = value;
        this._refresh();
    }

    public get height() {
        return this._frame.height;
    }

    public set height(value) {
        this._frame.height = value;
        this._refresh();
    }

    public get opacity() {
        return this.alpha * 255;
    }

    public set opacity(value) {
        this.alpha = Utils.clamp(value, 0, 255) / 255;
    }

    public static voidFilter = new PIXI.filters.AlphaFilter(0);
    public static _counter = 0;
    public z: number;
    public spriteId: number;
    public opaque: boolean;
    public ry: number;
    public dy: number;

    protected _isPicture: boolean;

    private _bitmap: any;
    private _refreshFrame: boolean;
    private _frame: any;
    private _realFrame: any;
    private _blendColor: number[];
    private _colorTone: number[];
    private _canvas: any;
    private _context: any;
    private _tintTexture: any;

    public constructor(bitmap?: Bitmap) {
        super(new PIXI.Texture(new PIXI.BaseTexture()));
        this._frame = new Rectangle();
        this._realFrame = new Rectangle();
        this._blendColor = [0, 0, 0, 0];
        this._colorTone = [0, 0, 0, 0];
        this._canvas = null;
        this._context = null;
        this._tintTexture = null;

        /**
         * use heavy renderer that will reduce border artifacts and apply advanced blendModes
         * @type {boolean}
         * @private
         */
        this._isPicture = false;

        this.spriteId = Sprite._counter++;
        this.opaque = false;

        this.bitmap = bitmap;
    }

    /**
     * Updates the sprite for each frame.
     *
     * @method update
     */
    public update() {
        this.children.forEach(function(child) {
            // @ts-ignore
            child.update ? child.update() : null;
        });
    }

    /**
     * Sets the x and y at once.
     *
     * @method move
     * @param {Number} x The x coordinate of the sprite
     * @param {Number} y The y coordinate of the sprite
     */
    public move(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the rectagle of the bitmap that the sprite displays.
     *
     * @method setFrame
     * @param {Number} x The x coordinate of the frame
     * @param {Number} y The y coordinate of the frame
     * @param {Number} width The width of the frame
     * @param {Number} height The height of the frame
     */
    public setFrame(x: number, y: number, width: number, height: number) {
        this._refreshFrame = false;
        const frame = this._frame;
        if (
            x !== frame.x ||
            y !== frame.y ||
            width !== frame.width ||
            height !== frame.height
        ) {
            frame.x = x;
            frame.y = y;
            frame.width = width;
            frame.height = height;
            this._refresh();
        }
    }

    /**
     * Gets the blend color for the sprite.
     *
     * @method getBlendColor
     * @return {Array} The blend color [r, g, b, a]
     */
    public getBlendColor() {
        return Utils.arrayClone(this._blendColor);
    }

    /**
     * Sets the blend color for the sprite.
     *
     * @method setBlendColor
     * @param {Array} color The blend color [r, g, b, a]
     */
    public setBlendColor(color: any[] | number[]) {
        if (!(color instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        if (!Utils.arrayEquals(this._blendColor, color)) {
            this._blendColor = Utils.arrayClone(color);
            this._refresh();
        }
    }

    /**
     * Gets the color tone for the sprite.
     *
     * @method getColorTone
     * @return {Array} The color tone [r, g, b, gray]
     */
    public getColorTone() {
        return Utils.arrayClone(this._colorTone);
    }
    /**
     * Sets the color tone for the sprite.
     *
     * @method setColorTone
     * @param {Array} tone The color tone [r, g, b, gray]
     */
    public setColorTone(tone: any[] | number[]) {
        if (!(tone instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        if (!Utils.arrayEquals(this._colorTone, tone)) {
            this._colorTone = Utils.arrayClone(tone);
            this._refresh();
        }
    }
    /**
     * @method _onBitmapLoad
     * @private
     */
    public _onBitmapLoad(bitmapLoaded: any) {
        if (bitmapLoaded === this._bitmap) {
            if (this._refreshFrame && this._bitmap) {
                this._refreshFrame = false;
                this._frame.width = this._bitmap.width;
                this._frame.height = this._bitmap.height;
            }
        }

        this._refresh();
    }
    /**
     * @method _refresh
     * @private
     */
    public _refresh() {
        const frameX = Math.floor(this._frame.x);
        const frameY = Math.floor(this._frame.y);
        const frameW = Math.floor(this._frame.width);
        const frameH = Math.floor(this._frame.height);
        const bitmapW = this._bitmap ? this._bitmap.width : 0;
        const bitmapH = this._bitmap ? this._bitmap.height : 0;
        const realX = Utils.clamp(frameX, 0, bitmapW);
        const realY = Utils.clamp(frameY, 0, bitmapH);
        const realW = Utils.clamp(frameW - realX + frameX, 0, bitmapW - realX);
        const realH = Utils.clamp(frameH - realY + frameY, 0, bitmapH - realY);

        this._realFrame.x = realX;
        this._realFrame.y = realY;
        this._realFrame.width = realW;
        this._realFrame.height = realH;
        this.pivot.x = frameX - realX;
        this.pivot.y = frameY - realY;

        if (realW > 0 && realH > 0) {
            if (this._needsTint()) {
                this._createTinter(realW, realH);
                this._executeTint(realX, realY, realW, realH);
                this._tintTexture.update();
                this.texture.baseTexture = this._tintTexture;
                this.texture.frame = new Rectangle(0, 0, realW, realH);
            } else {
                if (this._bitmap) {
                    this.texture.baseTexture = this._bitmap.baseTexture;
                }
                this.texture.frame = this._realFrame;
            }
        } else if (this._bitmap) {
            this.texture.frame = Rectangle.emptyRectangle;
        } else {
            this.texture.baseTexture.setSize(
                Math.max(
                    this.texture.baseTexture.width,
                    this._frame.x + this._frame.width
                ),
                Math.max(
                    this.texture.baseTexture.height,
                    this._frame.y + this._frame.height
                )
            );
            this.texture.frame = this._frame;
        }
        // @ts-ignore Normally this is done via updateUVs but that function causes graphical corruption
        this.texture._updateID++;
    }

    /**
     * @method _isInBitmapRect
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @return {Boolean}
     * @private
     */
    public _isInBitmapRect(x: number, y: number, w: number, h: number) {
        return (
            this._bitmap &&
            x + w > 0 &&
            y + h > 0 &&
            x < this._bitmap.width &&
            y < this._bitmap.height
        );
    }
    /**
     * @method _needsTint
     * @return {Boolean}
     * @private
     */
    public _needsTint() {
        const tone = this._colorTone;
        return (
            tone[0] || tone[1] || tone[2] || tone[3] || this._blendColor[3] > 0
        );
    }
    /**
     * @method _createTinter
     * @param {Number} w
     * @param {Number} h
     * @private
     */
    public _createTinter(w: number, h: number) {
        if (!this._canvas) {
            this._canvas = document.createElement("canvas");
            this._context = this._canvas.getContext("2d");
        }

        this._canvas.width = w;
        this._canvas.height = h;

        if (!this._tintTexture) {
            this._tintTexture = new PIXI.BaseTexture(this._canvas);
        }

        this._tintTexture.width = w;
        this._tintTexture.height = h;
        this._tintTexture.scaleMode = this._bitmap.baseTexture.scaleMode;
    }
    /**
     * @method _executeTint
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @private
     */
    public _executeTint(x: number, y: number, w: number, h: number) {
        const context = this._context;
        const tone = this._colorTone;
        const color = this._blendColor;

        context.globalCompositeOperation = "copy";
        context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);

        if (tone[0] || tone[1] || tone[2] || tone[3]) {
            if (Graphics.canUseSaturationBlend()) {
                const gray = Math.max(0, tone[3]);
                context.globalCompositeOperation = "saturation";
                context.fillStyle = "rgba(255,255,255," + gray / 255 + ")";
                context.fillRect(0, 0, w, h);
            }

            const r1 = Math.max(0, tone[0]);
            const g1 = Math.max(0, tone[1]);
            const b1 = Math.max(0, tone[2]);
            context.globalCompositeOperation = "lighter";
            context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
            context.fillRect(0, 0, w, h);

            if (Graphics.canUseDifferenceBlend()) {
                context.globalCompositeOperation = "difference";
                context.fillStyle = "white";
                context.fillRect(0, 0, w, h);

                const r2 = Math.max(0, -tone[0]);
                const g2 = Math.max(0, -tone[1]);
                const b2 = Math.max(0, -tone[2]);
                context.globalCompositeOperation = "lighter";
                context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
                context.fillRect(0, 0, w, h);

                context.globalCompositeOperation = "difference";
                context.fillStyle = "white";
                context.fillRect(0, 0, w, h);
            }
        }

        const r3 = Math.max(0, color[0]);
        const g3 = Math.max(0, color[1]);
        const b3 = Math.max(0, color[2]);
        const a3 = Math.max(0, color[3]);
        context.globalCompositeOperation = "source-atop";
        context.fillStyle = Utils.rgbToCssColor(r3, g3, b3);
        context.globalAlpha = a3 / 255;
        context.fillRect(0, 0, w, h);

        context.globalCompositeOperation = "destination-in";
        context.globalAlpha = 1;
        context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);
    }

    /**
     * @method _renderWebGL
     * @param {Object} renderer
     * @private
     */
    public _render(renderer: PIXI.Renderer) {
        if (this.bitmap) {
            this.bitmap.touch();
        }
        if (this.bitmap && !this.bitmap.isReady()) {
            return;
        }
        if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
            if (this._bitmap) {
                this._bitmap.checkDirty();
            }

            this.calculateVertices();

            if (this.pluginName === "sprite" && this._isPicture) {
                renderer.batch.setObjectRenderer(renderer.plugins.picture);
                renderer.batch.renderer.render(this);
            } else {
                super._render(renderer);
            }
        }
    }

    public updateTransform() {
        super.updateTransform();
        this.worldTransform.tx = Math.floor(this.worldTransform.tx);
        this.worldTransform.ty = Math.floor(this.worldTransform.ty);
    }
}
