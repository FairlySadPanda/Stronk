import * as PIXI from "pixi.js";
import Graphics from "./Graphics";
import Point from "./Point";
import Rectangle from "./Rectangle";
import Sprite from "./Sprite";
import Utils from "./Utils";
import Bitmap from "./Bitmap";

export default class TilingSprite extends PIXI.extras.TilingSprite {
    /**
     * The image for the tiling sprite.
     *
     * @property bitmap
     * @type Bitmap
     */
    public get bitmap() {
        return this._bitmap;
    }

    public set bitmap(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            if (this._bitmap) {
                this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
            } else {
                this.texture.frame = Rectangle.emptyRectangle;
            }
        }
    }

    /**
     * The opacity of the tiling sprite (0 to 255).
     *
     * @property opacity
     * @type Number
     */
    public get opacity(): number {
        return this.alpha * 255;
    }

    public set opacity(value: number) {
        this.alpha = Utils.clamp(value, 0, 255) / 255;
    }

    private _bitmap: Bitmap;
    private _frame: Rectangle;
    public tilingTexture: any;
    public spriteId: number;

    /**
     * The origin point of the tiling sprite for scrolling.
     *
     * @property origin
     * @type Point
     */
    public origin: Point;

    public constructor(bitmap?: any) {
        super(new PIXI.Texture(new PIXI.BaseTexture()));
        this._bitmap = null;
        this._width = 0;
        this._height = 0;
        this._frame = new Rectangle();
        this.spriteId = Sprite._counter++;
        this.origin = new Point();
        this.bitmap = bitmap;
    }

    public _renderWebGL(renderer: any) {
        if (this._bitmap) {
            this._bitmap.touch();
        }
        if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
            if (this._bitmap) {
                this._bitmap.checkDirty();
            }
            this._speedUpCustomBlendModes(renderer);
            super._renderWebGL(renderer);
        }
    }

    /**
     * Updates the tiling sprite for each frame.
     *
     * @method update
     */
    public update = function() {
        for (const child of this.children) {
            if (child instanceof TilingSprite) {
                child.update();
            }
        }
    };
    /**
     * Sets the x, y, width, and height all at once.
     *
     * @method move
     * @param {Number} x The x coordinate of the tiling sprite
     * @param {Number} y The y coordinate of the tiling sprite
     * @param {Number} width The width of the tiling sprite
     * @param {Number} height The height of the tiling sprite
     */
    public move(x?: number, y?: number, width?: number, height?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this._width = width || 0;
        this._height = height || 0;
    }

    /**
     * Specifies the region of the image that the tiling sprite will use.
     *
     * @method setFrame
     * @param {Number} x The x coordinate of the frame
     * @param {Number} y The y coordinate of the frame
     * @param {Number} width The width of the frame
     * @param {Number} height The height of the frame
     */
    public setFrame(x: number, y: number, width: number, height: number) {
        this._frame.x = x;
        this._frame.y = y;
        this._frame.width = width;
        this._frame.height = height;
        this._refresh();
    }

    public updateTransform() {
        this.tilePosition.x = Math.round(-this.origin.x);
        this.tilePosition.y = Math.round(-this.origin.y);
        super.updateTransform();
    }

    private _onBitmapLoad() {
        this.texture.baseTexture = this._bitmap.baseTexture;
        this._refresh();
    }

    private _refresh() {
        const frame = this._frame.clone();
        if (frame.width === 0 && frame.height === 0 && this._bitmap) {
            frame.width = this._bitmap.width;
            frame.height = this._bitmap.height;
        }
        this.texture.frame = frame;
        this.texture._updateUvs();
        this.tilingTexture = null;
    }

    private _speedUpCustomBlendModes(renderer: PIXI.WebGLRenderer) {
        const picture = renderer.plugins.picture;
        const blend = this.blendMode;
        if (renderer.renderingToScreen && renderer._activeRenderTarget.root) {
            if (picture.drawModes[blend]) {
                // @ts-ignore
                const stage = renderer._lastObjectRendered;
                // @ts-ignore
                const f = stage._filters;
                if (!f || !f[0]) {
                    setTimeout(function() {
                        // @ts-ignore
                        const f = stage._filters;
                        if (!f || !f[0]) {
                            stage.filters = [Sprite.voidFilter];
                            stage.filterArea = new PIXI.Rectangle(
                                0,
                                0,
                                Graphics.width,
                                Graphics.height
                            );
                        }
                    }, 0);
                }
            }
        }
    }
}
