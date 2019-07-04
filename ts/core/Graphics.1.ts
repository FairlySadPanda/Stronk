import * as enableInlineVideo from "iphone-inline-video";
import * as PIXI from "pixi.js";
import SceneManager from "../managers/SceneManager";
import ResourceHandler from "./ResourceHandler";
import Stage from "./Stage";
import Utils from "./Utils";

export default abstract class Graphics {
    public static get width(): number {
        return Graphics._width;
    }

    public static set width(input: number) {
        if (Graphics._width !== input) {
            Graphics._width = input;
            Graphics.updateAllElements();
        }
    }

    public static get height(): number {
        return Graphics._height;
    }

    public static set height(input: number) {
        if (Graphics._height !== input) {
            Graphics._height = input;
            Graphics.updateAllElements();
        }
    }

    public static get boxWidth(): number {
        return Graphics._boxWidth;
    }

    public static set boxWidth(input: number) {
        Graphics._boxWidth = input;
    }

    public static get boxHeight(): number {
        return Graphics._boxHeight;
    }

    public static set boxHeight(input: number) {
        Graphics._boxHeight = input;
    }

    public static get scale(): number {
        return Graphics._scale;
    }

    public static set scale(input: number) {
        Graphics._scale = input;
    }

    public static renderer: PIXI.WebGLRenderer;

    private static _cssFontLoading: any;
    private static _fontLoaded: any;
    private static _videoVolume: number;
    private static _rendererType: any;
    private static _boxWidth: any;
    private static _boxHeight: any;
    private static _scale: number;
    private static _realScale: number;
    private static _errorShowed: boolean;
    private static _errorPrinter: any;
    private static _canvas: any;
    private static _video: any;
    private static _videoUnlocked: boolean;
    private static _videoLoading: boolean;
    private static _upperCanvas: any;
    private static _fpsMeter: any;
    private static _modeBox: any;
    private static _skipCount: number;
    private static _maxSkip: number;
    private static _rendered: boolean;
    private static _loadingImage: any;
    private static _loadingCount: number;
    private static _fpsMeterToggled: boolean;
    private static _stretchEnabled: any;
    private static _canUseDifferenceBlend: boolean;
    private static _canUseSaturationBlend: boolean;
    private static _hiddenCanvas: any;
    private static _width: any;
    private static _height: any;

    /**
     * Initializes the graphics system.
     *
     * @static
     * @method initialize
     * @param {Number} width The width of the game screen
     * @param {Number} height The height of the game screen
     * @param {String} type The type of the renderer.
     *                 'canvas', 'webgl', or 'auto'.
     */
    public static initialize(width: any, height: any, type: any): void {
        Graphics._width = width || 800;
        Graphics._height = height || 600;
        Graphics._rendererType = "webgl";
        Graphics._boxWidth = Graphics.width;
        Graphics._boxHeight = Graphics.height;

        Graphics._scale = 1;
        Graphics._realScale = 1;

        Graphics._errorShowed = false;
        Graphics._errorPrinter = null;
        Graphics._canvas = null;
        Graphics._video = null;
        Graphics._videoUnlocked = false;
        Graphics._videoLoading = false;
        Graphics._upperCanvas = null;
        Graphics.renderer = null;
        Graphics._fpsMeter = null;
        Graphics._modeBox = null;
        Graphics._skipCount = 0;
        Graphics._maxSkip = 3;
        Graphics._rendered = false;
        Graphics._loadingImage = null;
        Graphics._loadingCount = 0;
        Graphics._fpsMeterToggled = false;
        Graphics._stretchEnabled = Graphics.defaultStretchMode();

        Graphics._canUseDifferenceBlend = false;
        Graphics._canUseSaturationBlend = false;
        Graphics._hiddenCanvas = null;

        Graphics.testCanvasBlendModes();
        Graphics.modifyExistingElements();
        Graphics.updateRealScale();
        Graphics.createAllElements();
        Graphics.disableTextSelection();
        Graphics.disableContextMenu();
        Graphics.setupEventHandlers();
        Graphics.setupCssFontLoading();
    }

    // @ts-ignore
    private static cssFontLoading = document.fonts && document.fonts.ready;
    private static fontLoaded = null;
    private static videoVolume = 1;

    private static setupCssFontLoading() {
        if (Graphics.cssFontLoading) {
            // @ts-ignore
            document.fonts.ready
                .then(function(fonts) {
                    Graphics.fontLoaded = fonts;
                })
                .catch(function(error) {
                    SceneManager.onError(error);
                });
        }
    }

    public static canUseCssFontLoading() {
        return !!Graphics.cssFontLoading;
    }

    /**
     * The total frame count of the game screen.
     *
     * @static
     * @property frameCount
     * @type Number
     */
    public static frameCount: number = 0;

    /**
     * The alias of PIXI.blendModes.NORMAL.
     *
     * @static
     * @property BLEND_NORMAL
     * @type Number
     * @final
     */
    public static BLEND_NORMAL: number = 0;

    /**
     * The alias of PIXI.blendModes.ADD.
     *
     * @static
     * @property BLEND_ADD
     * @type Number
     * @final
     */
    public static BLEND_ADD: number = 1;

    /**
     * The alias of PIXI.blendModes.MULTIPLY.
     *
     * @static
     * @property BLEND_MULTIPLY
     * @type Number
     * @final
     */
    public static BLEND_MULTIPLY: number = 2;

    /**
     * The alias of PIXI.blendModes.SCREEN.
     *
     * @static
     * @property BLEND_SCREEN
     * @type Number
     * @final
     */
    public static BLEND_SCREEN: number = 3;

    /**
     * Marks the beginning of each frame for FPSMeter.
     *
     * @static
     * @method tickStart
     */
    public static tickStart() {
        if (Graphics._fpsMeter) {
            Graphics._fpsMeter.tickStart();
        }
    }

    /**
     * Marks the end of each frame for FPSMeter.
     *
     * @static
     * @method tickEnd
     */
    public static tickEnd() {
        if (Graphics._fpsMeter && Graphics._rendered) {
            Graphics._fpsMeter.tick();
        }
    }

    /**
     * Renders the stage to the game screen.
     *
     * @static
     * @method render
     * @param {Stage} stage The stage object to be rendered
     */
    public static render(stage?: Stage) {
        if (Graphics._skipCount === 0) {
            const startTime = Date.now();
            if (stage) {
                Graphics.renderer.render(stage);
                if (Graphics.renderer.gl && Graphics.renderer.gl.flush) {
                    Graphics.renderer.gl.flush();
                }
            }
            const endTime = Date.now();
            const elapsed = endTime - startTime;
            Graphics._skipCount = Math.min(
                Math.floor(elapsed / 15),
                Graphics._maxSkip
            );
            Graphics._rendered = true;
        } else {
            Graphics._skipCount--;
            Graphics._rendered = false;
        }
        Graphics.frameCount++;
    }

    /**
     * Checks whether the renderer type is WebGL.
     *
     * @static
     * @method isWebGL
     * @return {Boolean} True if the renderer type is WebGL
     */
    public static isWebGL(): boolean {
        return (
            Graphics.renderer &&
            Graphics.renderer.type === PIXI.RENDERER_TYPE.WEBGL
        );
    }

    /**
     * Checks whether the current browser supports WebGL.
     *
     * @static
     * @method hasWebGL
     * @return {Boolean} True if the current browser supports WebGL.
     */
    public static hasWebGL(): boolean {
        try {
            const canvas = document.createElement("canvas");
            return !!(
                canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl")
            );
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks whether the canvas blend mode 'difference' is supported.
     *
     * @static
     * @method canUseDifferenceBlend
     * @return {Boolean} True if the canvas blend mode 'difference' is supported
     */
    public static canUseDifferenceBlend(): boolean {
        return Graphics._canUseDifferenceBlend;
    }

    /**
     * Checks whether the canvas blend mode 'saturation' is supported.
     *
     * @static
     * @method canUseSaturationBlend
     * @return {Boolean} True if the canvas blend mode 'saturation' is supported
     */
    public static canUseSaturationBlend(): boolean {
        return Graphics._canUseSaturationBlend;
    }

    /**
     * Sets the source of the "Now Loading" image.
     *
     * @static
     * @method setLoadingImage
     */
    public static setLoadingImage(src) {
        Graphics._loadingImage = new Image();
        Graphics._loadingImage.src = src;
    }

    /**
     * Initializes the counter for displaying the "Now Loading" image.
     *
     * @static
     * @method startLoading
     */
    public static startLoading() {
        Graphics._loadingCount = 0;
    }

    /**
     * Increments the loading counter and displays the "Now Loading" image if necessary.
     *
     * @static
     * @method updateLoading
     */
    public static updateLoading() {
        Graphics._loadingCount++;
        Graphics.paintUpperCanvas();
        Graphics._upperCanvas.style.opacity = 1;
    }

    /**
     * Erases the "Now Loading" image.
     *
     * @static
     * @method endLoading
     */
    public static endLoading() {
        Graphics.clearUpperCanvas();
        Graphics._upperCanvas.style.opacity = 0;
    }

    /**
     * Displays the loading error text to the screen.
     *
     * @static
     * @method printLoadingError
     * @param {String} url The url of the resource failed to load
     */
    public static printLoadingError(url: string) {
        if (Graphics._errorPrinter && !Graphics._errorShowed) {
            Graphics._errorPrinter.innerHTML = Graphics.makeErrorHtml(
                "Loading Error",
                "Failed to load: " + url
            );
            const button = document.createElement("button");
            button.innerHTML = "Retry";
            button.style.fontSize = "24px";
            button.style.color = "#ffffff";
            button.style.backgroundColor = "#000000";
            // @ts-ignore
            button.onmousedown = button.ontouchstart = function(event) {
                ResourceHandler.retry();
                event.stopPropagation();
            };
            Graphics._errorPrinter.appendChild(button);
            Graphics._loadingCount = -Infinity;
        }
    }

    /**
     * Erases the loading error text.
     *
     * @static
     * @method eraseLoadingError
     */
    public static eraseLoadingError() {
        if (Graphics._errorPrinter && !Graphics._errorShowed) {
            Graphics._errorPrinter.innerHTML = "";
            Graphics.startLoading();
        }
    }

    /**
     * Displays the error text to the screen.
     *
     * @static
     * @method printError
     * @param {String} name The name of the error
     * @param {String} message The message of the error
     */
    public static printError(name: string, message: string) {
        Graphics._errorShowed = true;
        if (Graphics._errorPrinter) {
            Graphics._errorPrinter.innerHTML = Graphics.makeErrorHtml(
                name,
                message
            );
        }
        Graphics.applyCanvasFilter();
        Graphics.clearUpperCanvas();
    }

    /**
     * Shows the FPSMeter element.
     *
     * @static
     * @method showFps
     */
    public static showFps() {
        if (Graphics._fpsMeter) {
            Graphics._fpsMeter.show();
            Graphics._modeBox.style.opacity = 1;
        }
    }

    /**
     * Hides the FPSMeter element.
     *
     * @static
     * @method hideFps
     */
    public static hideFps() {
        if (Graphics._fpsMeter) {
            Graphics._fpsMeter.hide();
            Graphics._modeBox.style.opacity = 0;
        }
    }

    /**
     * Loads a font file.
     *
     * @static
     * @method loadFont
     * @param {String} name The face name of the font
     * @param {String} url The url of the font file
     */
    public static loadFont(name: string, url: string) {
        const style = document.createElement("style");
        const head = document.getElementsByTagName("head");
        const rule =
            '@font-face { font-family: "' +
            name +
            '"; src: url("' +
            url +
            '"); }';
        style.type = "text/css";
        head.item(0).appendChild(style);
        if (style.sheet instanceof CSSStyleSheet) {
            style.sheet.insertRule(rule, 0);
        }
        Graphics.createFontLoader(name);
    }

    /**
     * Checks whether the font file is loaded.
     *
     * @static
     * @method isFontLoaded
     * @param {String} name The face name of the font
     * @return {Boolean} True if the font file is loaded
     */
    public static isFontLoaded(name: string): boolean {
        if (Graphics.cssFontLoading) {
            if (Graphics.fontLoaded) {
                return Graphics.fontLoaded.check('10px "' + name + '"');
            }

            return false;
        } else {
            if (!Graphics._hiddenCanvas) {
                Graphics._hiddenCanvas = document.createElement("canvas");
            }
            const context = Graphics._hiddenCanvas.getContext("2d");
            const text = "abcdefghijklmnopqrstuvwxyz";
            let width1, width2;
            context.font = "40px " + name + ", sans-serif";
            width1 = context.measureText(text).width;
            context.font = "40px sans-serif";
            width2 = context.measureText(text).width;
            return width1 !== width2;
        }
    }

    /**
     * Starts playback of a video.
     *
     * @static
     * @method playVideo
     * @param {String} src
     */
    public static playVideo(src: string) {
        Graphics.onVideoLoad = ResourceHandler.createLoader(
            null,
            Graphics.playVideo.bind(this, src),
            Graphics.onVideoError.bind(this)
        );
        Graphics._playVideo(src);
    }

    /**
     * @static
     * @method _playVideo
     * @param {String} src
     * @private
     */
    private static _playVideo(src: string) {
        Graphics._video.src = src;
        Graphics._video.onloadeddata = Graphics.onVideoLoad.bind(this);
        Graphics._video.onerror = Graphics.onVideoLoad;
        Graphics._video.onended = Graphics.onVideoEnd.bind(this);
        Graphics._video.load();
        Graphics._videoLoading = true;
    }

    /**
     * Checks whether the video is playing.
     *
     * @static
     * @method isVideoPlaying
     * @return {Boolean} True if the video is playing
     */
    public static isVideoPlaying(): boolean {
        return Graphics._videoLoading || Graphics.isVideoVisible();
    }

    /**
     * Checks whether the browser can play the specified video type.
     *
     * @static
     * @method canPlayVideoType
     * @param {String} type The video type to test support for
     * @return {Boolean} True if the browser can play the specified video type
     */
    public static canPlayVideoType(type: string): boolean {
        return Graphics._video && Graphics._video.canPlayType(type);
    }

    /**
     * Sets volume of a video.
     *
     * @static
     * @method setVideoVolume
     * @param {Number} value
     */
    public static setVideoVolume(value: number) {
        Graphics.videoVolume = value;
        if (Graphics._video) {
            Graphics._video.volume = Graphics.videoVolume;
        }
    }

    /**
     * Converts an x coordinate on the page to the corresponding
     * x coordinate on the canvas area.
     *
     * @static
     * @method pageToCanvasX
     * @param {Number} x The x coordinate on the page to be converted
     * @return {Number} The x coordinate on the canvas area
     */
    public static pageToCanvasX(x: number): number {
        if (Graphics._canvas) {
            const left = Graphics._canvas.offsetLeft;
            return Math.round((x - left) / Graphics._realScale);
        } else {
            return 0;
        }
    }

    /**
     * Converts a y coordinate on the page to the corresponding
     * y coordinate on the canvas area.
     *
     * @static
     * @method pageToCanvasY
     * @param {Number} y The y coordinate on the page to be converted
     * @return {Number} The y coordinate on the canvas area
     */
    public static pageToCanvasY(y: number): number {
        if (Graphics._canvas) {
            const top = Graphics._canvas.offsetTop;
            return Math.round((y - top) / Graphics._realScale);
        } else {
            return 0;
        }
    }

    /**
     * Checks whether the specified point is inside the game canvas area.
     *
     * @static
     * @method isInsideCanvas
     * @param {Number} x The x coordinate on the canvas area
     * @param {Number} y The y coordinate on the canvas area
     * @return {Boolean} True if the specified point is inside the game canvas area
     */
    public static isInsideCanvas(x: number, y: number): boolean {
        return x >= 0 && x < Graphics.width && y >= 0 && y < Graphics.height;
    }

    /**
     * Calls pixi.js garbage collector
     */
    public static callGC() {
        if (Graphics.isWebGL()) {
            Graphics.renderer.textureGC.run();
        }
    }

    /**
     * @static
     * @method _createAllElements
     * @private
     */
    private static createAllElements() {
        Graphics.createErrorPrinter();
        Graphics.createCanvas();
        Graphics.createVideo();
        Graphics.createUpperCanvas();
        Graphics.createRenderer();
        Graphics.createFPSMeter();
        Graphics.createModeBox();
        Graphics.createGameFontLoader();
    }

    /**
     * @static
     * @method _updateAllElements
     * @private
     */
    private static updateAllElements() {
        Graphics.updateRealScale();
        Graphics.updateErrorPrinter();
        Graphics.updateCanvas();
        Graphics.updateVideo();
        Graphics.updateUpperCanvas();
        Graphics.updateRenderer();
        Graphics.paintUpperCanvas();
    }

    /**
     * @static
     * @method _updateRealScale
     * @private
     */
    private static updateRealScale() {
        if (Graphics._stretchEnabled) {
            let h = window.innerWidth / Graphics.width;
            let v = window.innerHeight / Graphics.height;
            if (h >= 1 && h - 0.01 <= 1) {
                h = 1;
            }
            if (v >= 1 && v - 0.01 <= 1) {
                v = 1;
            }
            Graphics._realScale = Math.min(h, v);
        } else {
            Graphics._realScale = Graphics.scale;
        }
    }

    /**
     * @static
     * @method _makeErrorHtml
     * @param {String} name
     * @param {String} message
     * @return {String}
     * @private
     */
    private static makeErrorHtml(name: string, message: string): string {
        return (
            '<font color="yellow"><b>' +
            name +
            "</b></font><br>" +
            '<font color="white">' +
            message +
            "</font><br>"
        );
    }

    /**
     * @static
     * @method _defaultStretchMode
     * @private
     */
    private static defaultStretchMode() {
        return Utils.isNwjs() || Utils.isMobileDevice();
    }

    /**
     * @static
     * @method _testCanvasBlendModes
     * @private
     */
    private static testCanvasBlendModes() {
        let canvas, context, imageData1, imageData2;
        canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        context = canvas.getContext("2d");
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "white";
        context.fillRect(0, 0, 1, 1);
        context.globalCompositeOperation = "difference";
        context.fillStyle = "white";
        context.fillRect(0, 0, 1, 1);
        imageData1 = context.getImageData(0, 0, 1, 1);
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "black";
        context.fillRect(0, 0, 1, 1);
        context.globalCompositeOperation = "saturation";
        context.fillStyle = "white";
        context.fillRect(0, 0, 1, 1);
        imageData2 = context.getImageData(0, 0, 1, 1);
        Graphics._canUseDifferenceBlend = imageData1.data[0] === 0;
        Graphics._canUseSaturationBlend = imageData2.data[0] === 0;
    }

    /**
     * @static
     * @method _modifyExistingElements
     * @private
     */
    private static modifyExistingElements() {
        const elements = document.getElementsByTagName("*");
        for (const element of elements) {
            if (
                element instanceof HTMLElement &&
                Number(element.style.zIndex) > 0
            ) {
                element.style.zIndex = "0";
            }
        }
    }

    /**
     * @static
     * @method _createErrorPrinter
     * @private
     */
    private static createErrorPrinter() {
        Graphics._errorPrinter = document.createElement("p");
        Graphics._errorPrinter.id = "ErrorPrinter";
        Graphics.updateErrorPrinter();
        document.body.appendChild(Graphics._errorPrinter);
    }

    /**
     * @static
     * @method _updateErrorPrinter
     * @private
     */
    private static updateErrorPrinter() {
        Graphics._errorPrinter.width = Graphics.width * 0.9;
        Graphics._errorPrinter.height = 40;
        Graphics._errorPrinter.style.textAlign = "center";
        Graphics._errorPrinter.style.textShadow = "1px 1px 3px #000";
        Graphics._errorPrinter.style.fontSize = "20px";
        Graphics._errorPrinter.style.zIndex = 99;
        Graphics.centerElement(Graphics._errorPrinter);
    }

    /**
     * @static
     * @method _createCanvas
     * @private
     */
    private static createCanvas() {
        Graphics._canvas = document.createElement("canvas");
        Graphics._canvas.id = "GameCanvas";
        Graphics.updateCanvas();
        document.body.appendChild(Graphics._canvas);
    }

    /**
     * @static
     * @method _updateCanvas
     * @private
     */
    private static updateCanvas() {
        Graphics._canvas.width = Graphics.width;
        Graphics._canvas.height = Graphics.height;
        Graphics._canvas.style.zIndex = 1;
        Graphics.centerElement(Graphics._canvas);
    }

    /**
     * @static
     * @method _createVideo
     * @private
     */
    private static createVideo() {
        Graphics._video = document.createElement("video");
        Graphics._video.id = "GameVideo";
        Graphics._video.style.opacity = 0;
        Graphics._video.setAttribute("playsinline", "");
        Graphics._video.volume = Graphics.videoVolume;
        Graphics.updateVideo();
        enableInlineVideo(Graphics._video);
        document.body.appendChild(Graphics._video);
    }

    /**
     * @static
     * @method _updateVideo
     * @private
     */
    private static updateVideo() {
        Graphics._video.width = Graphics.width;
        Graphics._video.height = Graphics.height;
        Graphics._video.style.zIndex = 2;
        Graphics.centerElement(Graphics._video);
    }

    /**
     * @static
     * @method _createUpperCanvas
     * @private
     */
    private static createUpperCanvas() {
        Graphics._upperCanvas = document.createElement("canvas");
        Graphics._upperCanvas.id = "UpperCanvas";
        Graphics.updateUpperCanvas();
        document.body.appendChild(Graphics._upperCanvas);
    }

    /**
     * @static
     * @method _updateUpperCanvas
     * @private
     */
    private static updateUpperCanvas() {
        Graphics._upperCanvas.width = Graphics.width;
        Graphics._upperCanvas.height = Graphics.height;
        Graphics._upperCanvas.style.zIndex = 3;
        Graphics.centerElement(Graphics._upperCanvas);
    }

    /**
     * @static
     * @method _clearUpperCanvas
     * @private
     */
    private static clearUpperCanvas() {
        const context = Graphics._upperCanvas.getContext("2d");
        context.clearRect(0, 0, Graphics.width, Graphics.height);
    }

    /**
     * @static
     * @method _paintUpperCanvas
     * @private
     */
    private static paintUpperCanvas() {
        Graphics.clearUpperCanvas();
        if (Graphics._loadingImage && Graphics._loadingCount >= 20) {
            const context = Graphics._upperCanvas.getContext("2d");
            const dx = (Graphics.width - Graphics._loadingImage.width) / 2;
            const dy = (Graphics.height - Graphics._loadingImage.height) / 2;
            const alpha = Utils.clamp((Graphics._loadingCount - 20) / 30, 0, 1);
            context.save();
            context.globalAlpha = alpha;
            context.drawImage(Graphics._loadingImage, dx, dy);
            context.restore();
        }
    }

    /**
     * @static
     * @method _createRenderer
     * @private
     */
    private static createRenderer() {
        const width = Graphics.width;
        const height = Graphics.height;
        const options = { view: Graphics._canvas };
        try {
            Graphics.renderer = new PIXI.WebGLRenderer(width, height, options);
            if (Graphics.renderer && Graphics.renderer.textureGC) {
                Graphics.renderer.textureGC.maxIdle = 1;
            }
        } catch (e) {
            Graphics.renderer = null;
        }
    }

    /**
     * @static
     * @method _updateRenderer
     * @private
     */
    private static updateRenderer() {
        if (Graphics.renderer) {
            Graphics.renderer.resize(Graphics.width, Graphics.height);
        }
    }

    /**
     * @static
     * @method _createFPSMeter
     * @private
     */
    private static createFPSMeter() {
        const options = {
            graph: 1,
            decimals: 0,
            theme: "transparent",
            toggleOn: null
        };
    }

    /**
     * @static
     * @method _createModeBox
     * @private
     */
    private static createModeBox() {
        const box = document.createElement("div");
        box.id = "modeTextBack";
        box.style.position = "absolute";
        box.style.left = "5px";
        box.style.top = "5px";
        box.style.width = "119px";
        box.style.height = "58px";
        box.style.background = "rgba(0,0,0,0.2)";
        box.style.zIndex = "9";
        box.style.opacity = "0";

        const text = document.createElement("div");
        text.id = "modeText";
        text.style.position = "absolute";
        text.style.left = "0px";
        text.style.top = "41px";
        text.style.width = "119px";
        text.style.fontSize = "12px";
        text.style.fontFamily = "monospace";
        text.style.color = "white";
        text.style.textAlign = "center";
        text.style.textShadow = "1px 1px 0 rgba(0,0,0,0.5)";
        text.innerHTML = Graphics.isWebGL() ? "WebGL mode" : "Canvas mode";

        document.body.appendChild(box);
        box.appendChild(text);

        Graphics._modeBox = box;
    }

    /**
     * @static
     * @method _createGameFontLoader
     * @private
     */
    private static createGameFontLoader() {
        Graphics.createFontLoader("GameFont");
    }

    /**
     * @static
     * @method _createFontLoader
     * @param {String} name
     * @private
     */
    private static createFontLoader(name: string) {
        const div = document.createElement("div");
        const text = document.createTextNode(".");
        div.style.fontFamily = name;
        div.style.fontSize = "0px";
        div.style.color = "transparent";
        div.style.position = "absolute";
        div.style.margin = "auto";
        div.style.top = "0px";
        div.style.left = "0px";
        div.style.width = "1px";
        div.style.height = "1px";
        div.appendChild(text);
        document.body.appendChild(div);
    }

    /**
     * @static
     * @method _centerElement
     * @param {HTMLElement} element
     * @private
     */
    private static centerElement(element: HTMLElement) {
        const width = element.width * Graphics._realScale;
        const height = element.height * Graphics._realScale;
        element.style.position = "absolute";
        element.style.margin = "auto";
        element.style.top = 0;
        element.style.left = 0;
        element.style.right = 0;
        element.style.bottom = 0;
        element.style.width = width + "px";
        element.style.height = height + "px";
    }

    /**
     * @static
     * @method _disableTextSelection
     * @private
     */
    private static disableTextSelection() {
        const body = document.body;
        body.style.userSelect = "none";
        body.style.webkitUserSelect = "none";
        body.style.msUserSelect = "none";
    }

    /**
     * @static
     * @method _disableContextMenu
     * @private
     */
    private static disableContextMenu() {
        const elements = document.body.getElementsByTagName("*");
        const oncontextmenu = function() {
            return false;
        };
        for (const element of elements) {
            // @ts-ignore
            element.oncontextmenu = oncontextmenu;
        }
    }

    /**
     * @static
     * @method _applyCanvasFilter
     * @private
     */
    private static applyCanvasFilter() {
        if (Graphics._canvas) {
            Graphics._canvas.style.opacity = 0.5;
            Graphics._canvas.style.filter = "blur(8px)";
            Graphics._canvas.style.webkitFilter = "blur(8px)";
        }
    }

    /**
     * @static
     * @method _onVideoLoad
     * @private
     */
    private static onVideoLoad() {
        Graphics._video.play();
        Graphics.updateVisibility(true);
        Graphics._videoLoading = false;
    }

    /**
     * @static
     * @method _onVideoError
     * @private
     */
    private static onVideoError() {
        Graphics.updateVisibility(false);
        Graphics._videoLoading = false;
    }

    /**
     * @static
     * @method _onVideoEnd
     * @private
     */
    private static onVideoEnd() {
        Graphics.updateVisibility(false);
    }

    /**
     * @static
     * @method _updateVisibility
     * @param {Boolean} videoVisible
     * @private
     */
    private static updateVisibility(videoVisible: boolean) {
        Graphics._video.style.opacity = videoVisible ? 1 : 0;
        Graphics._canvas.style.opacity = videoVisible ? 0 : 1;
    }

    /**
     * @static
     * @method _isVideoVisible
     * @return {Boolean}
     * @private
     */
    private static isVideoVisible(): boolean {
        return Graphics._video.style.opacity > 0;
    }

    /**
     * @static
     * @method _setupEventHandlers
     * @private
     */
    private static setupEventHandlers() {
        window.addEventListener("resize", Graphics.onWindowResize.bind(this));
        document.addEventListener("keydown", Graphics.onKeyDown.bind(this));
        document.addEventListener("keydown", Graphics.onTouchEnd.bind(this));
        document.addEventListener("mousedown", Graphics.onTouchEnd.bind(this));
        document.addEventListener("touchend", Graphics.onTouchEnd.bind(this));
    }

    /**
     * @static
     * @method _onWindowResize
     * @private
     */
    private static onWindowResize() {
        Graphics.updateAllElements();
    }

    /**
     * @static
     * @method _onKeyDown
     * @param {KeyboardEvent} event
     * @private
     */
    private static onKeyDown(event: KeyboardEvent) {
        if (!event.ctrlKey && !event.altKey) {
            switch (event.keyCode) {
                case 113: // F2
                    event.preventDefault();
                    Graphics.switchFPSMeter();
                    break;
                case 114: // F3
                    event.preventDefault();
                    Graphics.switchStretchMode();
                    break;
                case 115: // F4
                    event.preventDefault();
                    Graphics.switchFullScreen();
                    break;
            }
        }
    }

    /**
     * @static
     * @method _onTouchEnd
     * @param {TouchEvent} event
     * @private
     */
    private static onTouchEnd(event: TouchEvent) {
        if (!Graphics._videoUnlocked) {
            Graphics._video.play();
            Graphics._videoUnlocked = true;
        }
        if (Graphics.isVideoVisible() && Graphics._video.paused) {
            Graphics._video.play();
        }
    }

    /**
     * @static
     * @method _switchFPSMeter
     * @private
     */
    private static switchFPSMeter() {
        if (Graphics._fpsMeter.isPaused) {
            Graphics.showFps();
            Graphics._fpsMeter.showFps();
            Graphics._fpsMeterToggled = false;
        } else if (!Graphics._fpsMeterToggled) {
            Graphics._fpsMeter.showDuration();
            Graphics._fpsMeterToggled = true;
        } else {
            Graphics.hideFps();
        }
    }

    /**
     * @static
     * @method _switchStretchMode
     * @return {Boolean}
     * @private
     */
    private static switchStretchMode(): boolean {
        Graphics._stretchEnabled = !Graphics._stretchEnabled;
        Graphics.updateAllElements();
        return true;
    }

    /**
     * @static
     * @method _switchFullScreen
     * @private
     */
    private static switchFullScreen() {
        if (Graphics.isFullScreen()) {
            Graphics.requestFullScreen();
        } else {
            Graphics.cancelFullScreen();
        }
    }

    /**
     * @static
     * @method _isFullScreen
     * @return {Boolean}
     * @private
     */
    private static isFullScreen(): boolean {
        return document.fullscreenEnabled;
    }

    /**
     * @static
     * @method _requestFullScreen
     * @private
     */
    private static requestFullScreen() {
        document.body.requestFullscreen();
    }

    /**
     * @static
     * @method _cancelFullScreen
     * @private
     */
    private static cancelFullScreen() {
        document.exitFullscreen();
    }
}
