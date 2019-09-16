import * as PIXI from "pixi.js";
import { Decrypter } from "./Decrypter";
import { Graphics } from "./Graphics";
import { Rectangle } from "./Rectangle";
import { ResourceHandler } from "./ResourceHandler";
import { Stage } from "./Stage";
import { Utils } from "./Utils";

export class Bitmap {
    private get _canvas() {
        if (!this.__canvas) {
            this._createCanvas();
        }
        return this.__canvas;
    }

    private get _context(): CanvasRenderingContext2D {
        if (!this.__context) {
            this._createCanvas();
        }
        return this.__context;
    }

    private get _baseTexture() {
        if (!this.__baseTexture) {
            this._createBaseTexture(this._image || this.__canvas);
        }
        return this.__baseTexture;
    }

    public get url() {
        return this._url;
    }

    public get baseTexture() {
        return this._baseTexture;
    }

    public get canvas() {
        return this._canvas;
    }

    public get context(): CanvasRenderingContext2D {
        return this._context;
    }

    public get width() {
        return this._image ? this._image.width : this._canvas.width;
    }

    public get height() {
        return this._image ? this._image.height : this._canvas.height;
    }

    public get rect() {
        return new Rectangle(0, 0, this.width, this.height);
    }

    public get smooth() {
        return this._smooth;
    }

    public set smooth(value) {
        if (this._smooth !== value) {
            this._smooth = value;
            if (this.__baseTexture) {
                if (this._smooth) {
                    this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
                } else {
                    this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                }
            }
        }
    }

    public set paintOpacity(value) {
        if (this._paintOpacity !== value) {
            this._paintOpacity = value;
            this._context.globalAlpha = this._paintOpacity / 255;
        }
    }

    public get paintOpacity() {
        return this._paintOpacity;
    }

    public get imagePromise(): Promise<void> {
        return this._imagePromise;
    }

    public static minFontSize = 21;
    public static drawSmallTextBitmap = new Bitmap(1632, Bitmap.minFontSize);

    /**
     * Loads a image file and returns a new bitmap object.
     *
     * @static
     * @method load
     * @param {String} url The image url of the texture
     * @return Bitmap
     */
    public static load(url: string): Bitmap {
        const bitmap = new Bitmap(undefined, undefined, true);

        bitmap._decodeAfterRequest = true;
        bitmap._requestImage(url);

        return bitmap;
    }

    /**
     * Takes a snapshot of the game screen and returns a new bitmap object.
     *
     * @static
     * @method snap
     * @param {Stage} stage The stage object
     * @return Bitmap
     */
    public static snap(stage: Stage) {
        const width = Graphics.width;
        const height = Graphics.height;
        const bitmap = new Bitmap(width, height);
        const context = bitmap._context;
        const renderTexture = PIXI.RenderTexture.create(width, height);
        if (stage) {
            // @ts-ignore
            Graphics.renderer.render(stage, renderTexture);
            stage.worldTransform.identity();
            context.drawImage(
                Graphics.renderer.extract.canvas(renderTexture),
                0,
                0
            );
        }
        renderTexture.destroy(true);
        bitmap._setDirty();
        bitmap._imagePromise = Promise.resolve();
        return bitmap;
    }

    public static request(url) {
        const bitmap = new Bitmap(undefined, undefined, true);

        bitmap._url = url;
        bitmap._loadingState = "pending";

        return bitmap;
    }

    // for iOS. img consumes memory. so reuse it.
    private static _reuseImages: HTMLImageElement[] = [];
    public cacheEntry: any;
    public fontFace: string;
    public fontSize: number;
    public fontItalic: boolean;
    public textColor: string;
    public outlineColor: string;
    public outlineWidth: number;
    private _defer: any;
    private _image: HTMLImageElement;
    private _url: string;
    private _paintOpacity: number;
    private _smooth: boolean;
    private _loadListeners: any[];
    private _loadingState: string;
    private _decodeAfterRequest: boolean;
    private __canvas: HTMLCanvasElement;
    private _loader: () => void;
    private _dirty: any;
    private __context: CanvasRenderingContext2D;
    private __baseTexture: PIXI.BaseTexture;
    private _loadListener: EventListener;
    private _errorListener: EventListener;
    private _imagePromise: Promise<void>;

    public constructor(width?: number, height?: number, defer?: boolean) {
        this._defer = defer;
        if (!this._defer) {
            this._createCanvas(width, height);
        }

        this._image = null;
        this._url = "";
        this._paintOpacity = 255;
        this._smooth = false;
        this._loadListeners = [];
        this._loadingState = "none";
        this._decodeAfterRequest = false;

        /**
         * Cache entry, for images. In all cases _url is the same as cacheEntry.key
         * @type CacheEntry
         */
        this.cacheEntry = null;

        /**
         * The face name of the font.
         *
         * @property fontFace
         * @type String
         */
        this.fontFace = "GameFont";

        /**
         * The size of the font in pixels.
         *
         * @property fontSize
         * @type Number
         */
        this.fontSize = 28;

        /**
         * Whether the font is italic.
         *
         * @property fontItalic
         * @type Boolean
         */
        this.fontItalic = false;

        /**
         * The color of the text in CSS format.
         *
         * @property textColor
         * @type String
         */
        this.textColor = "#ffffff";

        /**
         * The color of the outline of the text in CSS format.
         *
         * @property outlineColor
         * @type String
         */
        this.outlineColor = "rgba(0, 0, 0, 0.5)";

        /**
         * The width of the outline of the text.
         *
         * @property outlineWidth
         * @type Number
         */
        this.outlineWidth = 4;
    }

    /**
     * Checks whether the bitmap is ready to render.
     *
     * @method isReady
     * @return {Boolean} True if the bitmap is ready to render
     */
    public isReady(): boolean {
        return this._loadingState === "loaded" || this._loadingState === "none";
    }

    /**
     * Checks whether a loading error has occurred.
     *
     * @method isError
     * @return {Boolean} True if a loading error has occurred
     */
    public isError(): boolean {
        return this._loadingState === "error";
    }

    /**
     * touch the resource
     * @method touch
     */
    public touch() {
        if (this.cacheEntry) {
            this.cacheEntry.touch();
        }
    }

    /**
     * Resizes the bitmap.
     *
     * @method resize
     * @param {Number} width The new width of the bitmap
     * @param {Number} height The new height of the bitmap
     */
    public resize(width: number, height: number) {
        width = Math.max(width || 0, 1);
        height = Math.max(height || 0, 1);
        this._canvas.width = width;
        this._canvas.height = height;
        this._baseTexture.width = width;
        this._baseTexture.height = height;
    }

    /**
     * Performs a block transfer.
     *
     * @method blt
     * @param {Bitmap} source The bitmap to draw
     * @param {Number} sx The x coordinate in the source
     * @param {Number} sy The y coordinate in the source
     * @param {Number} sw The width of the source image
     * @param {Number} sh The height of the source image
     * @param {Number} dx The x coordinate in the destination
     * @param {Number} dy The y coordinate in the destination
     * @param {Number} [dw=sw] The width to draw the image in the destination
     * @param {Number} [dh=sh] The height to draw the image in the destination
     */
    public blt(
        source: Bitmap,
        sx: number,
        sy: number,
        sw: number,
        sh: number,
        dx: number,
        dy: number,
        dw?: number,
        dh?: number
    ) {
        dw = dw || sw;
        dh = dh || sh;
        if (
            sx >= 0 &&
            sy >= 0 &&
            sw > 0 &&
            sh > 0 &&
            dw > 0 &&
            dh > 0 &&
            sx + sw <= source.width &&
            sy + sh <= source.height
        ) {
            this._context.globalCompositeOperation = "source-over";
            this._context.drawImage(
                source._canvas,
                sx,
                sy,
                sw,
                sh,
                dx,
                dy,
                dw,
                dh
            );
            this._setDirty();
        }
    }

    /**
     * Performs a block transfer, using assumption that original image was not modified (no hue)
     *
     * @method blt
     * @param {Bitmap} source The bitmap to draw
     * @param {Number} sx The x coordinate in the source
     * @param {Number} sy The y coordinate in the source
     * @param {Number} sw The width of the source image
     * @param {Number} sh The height of the source image
     * @param {Number} dx The x coordinate in the destination
     * @param {Number} dy The y coordinate in the destination
     * @param {Number} [dw=sw] The width to draw the image in the destination
     * @param {Number} [dh=sh] The height to draw the image in the destination
     */
    public bltImage(
        source: Bitmap,
        sx: number,
        sy: number,
        sw: number,
        sh: number,
        dx: number,
        dy: number,
        dw: number,
        dh: number
    ) {
        dw = dw || sw;
        dh = dh || sh;
        if (
            sx >= 0 &&
            sy >= 0 &&
            sw > 0 &&
            sh > 0 &&
            dw > 0 &&
            dh > 0 &&
            sx + sw <= source.width &&
            sy + sh <= source.height
        ) {
            this._context.globalCompositeOperation = "source-over";
            this._context.drawImage(
                source._image,
                sx,
                sy,
                sw,
                sh,
                dx,
                dy,
                dw,
                dh
            );
            this._setDirty();
        }
    }

    /**
     * Returns pixel color at the specified point.
     *
     * @method getPixel
     * @param {Number} x The x coordinate of the pixel in the bitmap
     * @param {Number} y The y coordinate of the pixel in the bitmap
     * @return {String} The pixel color (hex format)
     */
    public getPixel(x: number, y: number): string {
        const data = this._context.getImageData(x, y, 1, 1).data;
        let result = "#";
        for (let i = 0; i < 3; i++) {
            result += Utils.padZero(data[i].toString(16), 2);
        }
        return result;
    }

    /**
     * Returns alpha pixel value at the specified point.
     *
     * @method getAlphaPixel
     * @param {Number} x The x coordinate of the pixel in the bitmap
     * @param {Number} y The y coordinate of the pixel in the bitmap
     * @return {String} The alpha value
     */
    public getAlphaPixel(x: number, y: number): string {
        const data = this._context.getImageData(x, y, 1, 1).data;
        return data[3].toString();
    }

    /**
     * Clears the specified rectangle.
     *
     * @method clearRect
     * @param {Number} x The x coordinate for the upper-left corner
     * @param {Number} y The y coordinate for the upper-left corner
     * @param {Number} width The width of the rectangle to clear
     * @param {Number} height The height of the rectangle to clear
     */
    public clearRect(x: number, y: number, width: number, height: number) {
        this._context.clearRect(x, y, width, height);
        this._setDirty();
    }

    /**
     * Clears the entire bitmap.
     *
     * @method clear
     */
    public clear() {
        this.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Fills the specified rectangle.
     *
     * @method fillRect
     * @param {Number} x The x coordinate for the upper-left corner
     * @param {Number} y The y coordinate for the upper-left corner
     * @param {Number} width The width of the rectangle to fill
     * @param {Number} height The height of the rectangle to fill
     * @param {String} color The color of the rectangle in CSS format
     */
    public fillRect(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string
    ) {
        const context = this._context;
        context.save();
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.restore();
        this._setDirty();
    }

    /**
     * Fills the entire bitmap.
     *
     * @method fillAll
     * @param {String} color The color of the rectangle in CSS format
     */
    public fillAll(color: string) {
        this.fillRect(0, 0, this.width, this.height, color);
    }

    /**
     * Draws the rectangle with a gradation.
     *
     * @method gradientFillRect
     * @param {Number} x The x coordinate for the upper-left corner
     * @param {Number} y The y coordinate for the upper-left corner
     * @param {Number} width The width of the rectangle to fill
     * @param {Number} height The height of the rectangle to fill
     * @param {String} color1 The gradient starting color
     * @param {String} color2 The gradient ending color
     * @param {Boolean} vertical Wether the gradient should be draw as vertical or not
     */
    public gradientFillRect(
        x: number,
        y: number,
        width: number,
        height: number,
        color1: string,
        color2: string,
        vertical?: boolean
    ) {
        const context = this._context;
        let grad;
        if (vertical) {
            grad = context.createLinearGradient(x, y, x, y + height);
        } else {
            grad = context.createLinearGradient(x, y, x + width, y);
        }
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);
        context.save();
        context.fillStyle = grad;
        context.fillRect(x, y, width, height);
        context.restore();
        this._setDirty();
    }

    /**
     * Draw a bitmap in the shape of a circle
     *
     * @method drawCircle
     * @param {Number} x The x coordinate based on the circle center
     * @param {Number} y The y coordinate based on the circle center
     * @param {Number} radius The radius of the circle
     * @param {String} color The color of the circle in CSS format
     */
    public drawCircle(x: number, y: number, radius: number, color: string) {
        const context = this._context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
        this._setDirty();
    }

    /**
     * Draws the outline text to the bitmap.
     *
     * @method drawText
     * @param {String} text The text that will be drawn
     * @param {Number} x The x coordinate for the left of the text
     * @param {Number} y The y coordinate for the top of the text
     * @param {Number} maxWidth The maximum allowed width of the text
     * @param {Number} lineHeight The height of the text line
     * @param {String} align The alignment of the text
     */
    public drawText(
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number,
        align?: CanvasTextAlign
    ) {
        // Note: Firefox has a bug with textBaseline: Bug 737852
        //       So we use 'alphabetic' here.
        if (text !== undefined) {
            if (this.fontSize < Bitmap.minFontSize) {
                this.drawSmallText(text, x, y, maxWidth, lineHeight, align);
                return;
            }
            let tx = x;
            const ty =
                y +
                lineHeight -
                Math.round((lineHeight - this.fontSize * 0.7) / 2);
            const context = this._context;
            const alpha = context.globalAlpha;
            maxWidth = maxWidth || 0xffffffff;
            if (align === "center") {
                tx += maxWidth / 2;
            }
            if (align === "right") {
                tx += maxWidth;
            }
            context.save();
            context.font = this._makeFontNameText();
            context.textAlign = align;
            context.textBaseline = "alphabetic";
            context.globalAlpha = 1;
            this._drawTextOutline(text, tx, ty, maxWidth);
            context.globalAlpha = alpha;
            this._drawTextBody(text, tx, ty, maxWidth);
            context.restore();
            this._setDirty();
        }
    }

    /**
     * Draws the small text big once and resize it because modern broswers are poor at drawing small text.
     *
     * @method drawSmallText
     * @param {String} text The text that will be drawn
     * @param {Number} x The x coordinate for the left of the text
     * @param {Number} y The y coordinate for the top of the text
     * @param {Number} maxWidth The maximum allowed width of the text
     * @param {Number} lineHeight The height of the text line
     * @param {String} align The alignment of the text
     */
    public async drawSmallText(
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number,
        align: CanvasTextAlign
    ) {
        const minFontSize = Bitmap.minFontSize;
        const bitmap = Bitmap.drawSmallTextBitmap;
        bitmap.fontFace = this.fontFace;
        bitmap.fontSize = minFontSize;
        bitmap.fontItalic = this.fontItalic;
        bitmap.textColor = this.textColor;
        bitmap.outlineColor = this.outlineColor;
        bitmap.outlineWidth = (this.outlineWidth * minFontSize) / this.fontSize;
        maxWidth = maxWidth || 816;
        const height = this.fontSize * 1.5;
        const scaledMaxWidth = (maxWidth * minFontSize) / this.fontSize;
        const scaledMaxWidthWithOutline =
            scaledMaxWidth + bitmap.outlineWidth * 2;
        const scaledHeight = (height * minFontSize) / this.fontSize;
        const scaledHeightWithOutline = scaledHeight + bitmap.outlineWidth * 2;

        let bitmapWidth = bitmap.width;
        let bitmapHeight = bitmap.height;
        while (scaledMaxWidthWithOutline > bitmapWidth) {
            bitmapWidth *= 2;
        }
        while (scaledHeightWithOutline > bitmapHeight) {
            bitmapHeight *= 2;
        }
        if (bitmap.width !== bitmapWidth || bitmap.height !== bitmapHeight) {
            bitmap.resize(bitmapWidth, bitmapHeight);
        }

        await bitmap.drawText(
            text,
            bitmap.outlineWidth,
            bitmap.outlineWidth,
            scaledMaxWidth,
            minFontSize,
            align
        );
        this.blt(
            bitmap,
            0,
            0,
            scaledMaxWidthWithOutline,
            scaledHeightWithOutline,
            x - this.outlineWidth,
            y - this.outlineWidth + (lineHeight - this.fontSize) / 2,
            maxWidth + this.outlineWidth * 2,
            height + this.outlineWidth * 2
        );
        bitmap.clear();
    }

    /**
     * Returns the width of the specified text.
     *
     * @method measureTextWidth
     * @param {String} text The text to be measured
     * @return {Number} The width of the text in pixels
     */
    public measureTextWidth(text: string): number {
        const context = this._context;
        context.save();
        context.font = this._makeFontNameText();
        const width = context.measureText(text).width;
        context.restore();
        return width;
    }

    /**
     * Changes the color tone of the entire bitmap.
     *
     * @method adjustTone
     * @param {Number} r The red strength in the range (-255, 255)
     * @param {Number} g The green strength in the range (-255, 255)
     * @param {Number} b The blue strength in the range (-255, 255)
     */
    public adjustTone(r: number, g: number, b: number) {
        if ((r || g || b) && this.width > 0 && this.height > 0) {
            const context = this._context;
            const imageData = context.getImageData(
                0,
                0,
                this.width,
                this.height
            );
            const pixels = imageData.data;
            for (let i = 0; i < pixels.length; i += 4) {
                pixels[i + 0] += r;
                pixels[i + 1] += g;
                pixels[i + 2] += b;
            }
            context.putImageData(imageData, 0, 0);
            this._setDirty();
        }
    }

    /**
     * Rotates the hue of the entire bitmap.
     *
     * @method rotateHue
     * @param {Number} offset The hue offset in 360 degrees
     */
    public rotateHue(offset: number) {
        function rgbToHsl(r, g, b) {
            const cmin = Math.min(r, g, b);
            const cmax = Math.max(r, g, b);
            let h = 0;
            let s = 0;
            const l = (cmin + cmax) / 2;
            const delta = cmax - cmin;

            if (delta > 0) {
                if (r === cmax) {
                    h = 60 * (((g - b) / delta + 6) % 6);
                } else if (g === cmax) {
                    h = 60 * ((b - r) / delta + 2);
                } else {
                    h = 60 * ((r - g) / delta + 4);
                }
                s = delta / (255 - Math.abs(2 * l - 255));
            }
            return [h, s, l];
        }

        function hslToRgb(h, s, l) {
            const c = (255 - Math.abs(2 * l - 255)) * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = l - c / 2;
            const cm = c + m;
            const xm = x + m;

            if (h < 60) {
                return [cm, xm, m];
            } else if (h < 120) {
                return [xm, cm, m];
            } else if (h < 180) {
                return [m, cm, xm];
            } else if (h < 240) {
                return [m, xm, cm];
            } else if (h < 300) {
                return [xm, m, cm];
            } else {
                return [cm, m, xm];
            }
        }

        if (offset && this.width > 0 && this.height > 0) {
            offset = ((offset % 360) + 360) % 360;
            const context = this._context;
            const imageData = context.getImageData(
                0,
                0,
                this.width,
                this.height
            );
            const pixels = imageData.data;
            for (let i = 0; i < pixels.length; i += 4) {
                const hsl = rgbToHsl(
                    pixels[i + 0],
                    pixels[i + 1],
                    pixels[i + 2]
                );
                const h = (hsl[0] + offset) % 360;
                const s = hsl[1];
                const l = hsl[2];
                const rgb = hslToRgb(h, s, l);
                pixels[i + 0] = rgb[0];
                pixels[i + 1] = rgb[1];
                pixels[i + 2] = rgb[2];
            }
            context.putImageData(imageData, 0, 0);
            this._setDirty();
        }
    }

    /**
     * Applies a blur effect to the bitmap.
     *
     * @method blur
     */
    public blur() {
        for (let i = 0; i < 2; i++) {
            const w = this.width;
            const h = this.height;
            const canvas = this._canvas;
            const context = this._context;
            const tempCanvas = document.createElement("canvas");
            const tempContext = tempCanvas.getContext("2d");
            tempCanvas.width = w + 2;
            tempCanvas.height = h + 2;
            tempContext.drawImage(canvas, 0, 0, w, h, 1, 1, w, h);
            tempContext.drawImage(canvas, 0, 0, w, 1, 1, 0, w, 1);
            tempContext.drawImage(canvas, 0, 0, 1, h, 0, 1, 1, h);
            tempContext.drawImage(canvas, 0, h - 1, w, 1, 1, h + 1, w, 1);
            tempContext.drawImage(canvas, w - 1, 0, 1, h, w + 1, 1, 1, h);
            context.save();
            context.fillStyle = "black";
            context.fillRect(0, 0, w, h);
            context.globalCompositeOperation = "lighter";
            context.globalAlpha = 1 / 9;
            for (let y = 0; y < 3; y++) {
                for (let x = 0; x < 3; x++) {
                    context.drawImage(tempCanvas, x, y, w, h, 0, 0, w, h);
                }
            }
            context.restore();
        }
        this._setDirty();
    }

    /**
     * Add a callback function that will be called when the bitmap is loaded.
     *
     * @method addLoadListener
     * @param {Function} listner The callback function
     */
    public addLoadListener(listner: Function) {
        if (!this.isReady()) {
            this._loadListeners.push(listner);
        } else {
            listner(this);
        }
    }

    public decode() {
        switch (this._loadingState) {
            case "requestCompleted":
            case "decryptCompleted":
                this._loadingState = "loaded";

                if (!this.__canvas) {
                    this._createBaseTexture(this._image);
                }
                this._setDirty();
                this._callLoadListeners();
                break;

            case "requesting":
            case "decrypting":
                this._decodeAfterRequest = true;
                if (!this._loader) {
                    this._loader = ResourceHandler.createLoader(
                        this._url,
                        this._requestImage.bind(this, this._url),
                        this._onError.bind(this)
                    );
                    this._image.removeEventListener(
                        "error",
                        this._errorListener
                    );
                    this._image.addEventListener(
                        "error",
                        (this._errorListener = this._loader)
                    );
                }
                break;

            case "pending":
            case "purged":
            case "error":
                this._decodeAfterRequest = true;
                this._requestImage(this._url);
                break;
        }
    }

    /**
     * updates texture is bitmap was dirty
     * @method checkDirty
     */
    public checkDirty() {
        if (this._dirty) {
            this._baseTexture.update();
            const baseTexture = this._baseTexture;
            setTimeout(function() {
                baseTexture.update();
            }, 0);
            this._dirty = false;
        }
    }

    public isRequestOnly() {
        return !(this._decodeAfterRequest || this.isReady());
    }

    public isRequestReady() {
        return (
            this._loadingState !== "pending" &&
            this._loadingState !== "requesting" &&
            this._loadingState !== "decrypting"
        );
    }

    public startRequest() {
        if (this._loadingState === "pending") {
            this._decodeAfterRequest = false;
            this._requestImage(this._url);
        }
    }

    /**
     * @method _onLoad
     * @private
     */
    public _onLoad() {
        this._image.removeEventListener("load", this._loadListener);
        this._image.removeEventListener("error", this._errorListener);

        this._renewCanvas();

        switch (this._loadingState) {
            case "requesting":
                this._loadingState = "requestCompleted";
                if (this._decodeAfterRequest) {
                    this.decode();
                } else {
                    this._loadingState = "purged";
                    this._clearImgInstance();
                }
                break;

            case "decrypting":
                window.URL.revokeObjectURL(this._image.src);
                this._loadingState = "decryptCompleted";
                if (this._decodeAfterRequest) {
                    this.decode();
                } else {
                    this._loadingState = "purged";
                    this._clearImgInstance();
                }
                break;
        }
    }

    /**
     * @method _onError
     * @private
     */
    public _onError() {
        this._image.removeEventListener("load", this._loadListener);
        this._image.removeEventListener("error", this._errorListener);
        this._loadingState = "error";
    }

    /**
     * Bitmap states(Bitmap._loadingState):
     *
     * none:
     * Empty Bitmap
     *
     * pending:
     * Url requested, but pending to load until startRequest called
     *
     * purged:
     * Url request completed and purged.
     *
     * requesting:
     * Requesting supplied URI now.
     *
     * requestCompleted:
     * Request completed
     *
     * decrypting:
     * requesting encrypted data from supplied URI or decrypting it.
     *
     * decryptCompleted:
     * Decrypt completed
     *
     * loaded:
     * loaded. isReady() === true, so It's usable.
     *
     * error:
     * error occurred
     *
     */

    private _createCanvas(width?, height?) {
        this.__canvas = this.__canvas || document.createElement("canvas");
        this.__context = this.__canvas.getContext("2d");

        this.__canvas.width = Math.max(width || 0, 1);
        this.__canvas.height = Math.max(height || 0, 1);

        if (this._image) {
            const w = Math.max(this._image.width || 0, 1);
            const h = Math.max(this._image.height || 0, 1);
            this.__canvas.width = w;
            this.__canvas.height = h;
            this._createBaseTexture(this._canvas);

            this.__context.drawImage(this._image, 0, 0);
        }

        this._setDirty();
    }

    private _createBaseTexture(source) {
        this.__baseTexture = new PIXI.BaseTexture(source);
        this.__baseTexture.mipmap = false;
        this.__baseTexture.width = source.width;
        this.__baseTexture.height = source.height;

        if (this._smooth) {
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
        } else {
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
    }
    private _clearImgInstance() {
        this._image.src = "";
        this._image.onload = null;
        this._image.onerror = null;
        this._errorListener = null;
        this._loadListener = null;

        Bitmap._reuseImages.push(this._image);
        this._image = null;
    }
    private _renewCanvas() {
        const newImage = this._image;
        if (
            newImage &&
            this.__canvas &&
            (this.__canvas.width < newImage.width ||
                this.__canvas.height < newImage.height)
        ) {
            this._createCanvas();
        }
    }
    /**
     * @method _makeFontNameText
     * @private
     */
    protected _makeFontNameText() {
        return (
            (this.fontItalic ? "Italic " : "") +
            this.fontSize +
            "px " +
            this.fontFace
        );
    }

    /**
     * @method _drawTextOutline
     * @param {String} text
     * @param {Number} tx
     * @param {Number} ty
     * @param {Number} maxWidth
     * @private
     */
    private _drawTextOutline(
        text: string,
        tx: number,
        ty: number,
        maxWidth: number
    ) {
        const context = this._context;
        context.strokeStyle = this.outlineColor;
        context.lineWidth = this.outlineWidth;
        context.lineJoin = "round";
        context.strokeText(text, tx, ty, maxWidth);
    }

    /**
     * @method _drawTextBody
     * @param {String} text
     * @param {Number} tx
     * @param {Number} ty
     * @param {Number} maxWidth
     * @private
     */
    private _drawTextBody(
        text: string,
        tx: number,
        ty: number,
        maxWidth: number
    ) {
        const context = this._context;
        context.fillStyle = this.textColor;
        context.fillText(text, tx, ty, maxWidth);
    }

    /**
     * @method _callLoadListeners
     * @private
     */
    private _callLoadListeners() {
        while (this._loadListeners.length > 0) {
            const listener = this._loadListeners.shift();
            listener(this);
        }
    }

    /**
     * @method _setDirty
     * @private
     */
    private _setDirty() {
        this._dirty = true;
    }

    private _requestImage(url: string) {
        if (Bitmap._reuseImages.length !== 0) {
            this._image = Bitmap._reuseImages.pop();
        } else {
            this._image = new Image();
        }

        if (this._decodeAfterRequest && !this._loader) {
            this._loader = ResourceHandler.createLoader(
                url,
                this._requestImage.bind(this, url),
                this._onError.bind(this)
            );
        }

        this._url = url;
        this._loadingState = "requesting";

        if (!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages) {
            this._loadingState = "decrypting";
            Decrypter.decryptImg(url, this);
        } else {
            this._image.src = url;
            this._imagePromise = this._image.decode();

            this._image.addEventListener(
                "load",
                (this._loadListener = this._onLoad.bind(this))
            );
            this._image.addEventListener(
                "error",
                (this._errorListener = this._loader || this._onError.bind(this))
            );
        }
    }
}
