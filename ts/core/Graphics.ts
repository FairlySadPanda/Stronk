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
            Graphics._updateAllElements();
        }
    }

    public static get height(): number {
        return Graphics._height;
    }

    public static set height(input: number) {
        if (Graphics._height !== input) {
            Graphics._height = input;
            Graphics._updateAllElements();
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
    public static _cssFontLoading: any;
    public static _fontLoaded: any;
    public static _videoVolume: number;
    public static frameCount: number;
    public static BLEND_NORMAL: number;
    public static BLEND_ADD: number;
    public static BLEND_MULTIPLY: number;
    public static BLEND_SCREEN: number;
    public static renderer: PIXI.WebGLRenderer;
    public static _setupCssFontLoading: () => void;
    public static canUseCssFontLoading: () => boolean;
    public static tickStart: () => void;
    public static tickEnd: () => void;
    public static render: (stage: any) => void;
    public static isWebGL: () => boolean;
    public static hasWebGL: () => boolean;
    public static canUseDifferenceBlend: () => any;
    public static canUseSaturationBlend: () => any;
    public static setLoadingImage: (src: any) => void;
    public static startLoading: () => void;
    public static updateLoading: () => void;
    public static endLoading: () => void;
    public static printLoadingError: (url: any) => void;
    public static eraseLoadingError: () => void;
    public static printError: (name: any, message: any) => void;
    public static showFps: () => void;
    public static hideFps: () => void;
    public static loadFont: (name: any, url: any) => void;
    public static isFontLoaded: (name: any) => any;
    public static playVideo: (src: any) => void;
    public static _playVideo: (src: any) => void;
    public static isVideoPlaying: () => any;
    public static canPlayVideoType: (type: any) => any;
    public static setVideoVolume: (value: any) => void;
    public static pageToCanvasX: (x: any) => number;
    public static pageToCanvasY: (y: any) => number;
    public static isInsideCanvas: (x: any, y: any) => boolean;
    public static callGC: () => void;
    public static _createAllElements: () => void;
    public static _updateAllElements: () => void;
    public static _updateRealScale: () => void;
    public static _makeErrorHtml: (name: any, message: any) => string;
    public static _defaultStretchMode: () => any;
    public static _testCanvasBlendModes: () => void;
    public static _modifyExistingElements: () => void;
    public static _createErrorPrinter: () => void;
    public static _updateErrorPrinter: () => void;
    public static _createCanvas: () => void;
    public static _updateCanvas: () => void;
    public static _createVideo: () => void;
    public static _updateVideo: () => void;
    public static _createUpperCanvas: () => void;
    public static _updateUpperCanvas: () => void;
    public static _clearUpperCanvas: () => void;
    public static _paintUpperCanvas: () => void;
    public static _createRenderer: () => void;
    public static _updateRenderer: () => void;
    public static _createFPSMeter: () => void;
    public static _createModeBox: () => void;
    public static _createGameFontLoader: () => void;
    public static _createFontLoader: (name: any) => void;
    public static _centerElement: (element: any) => void;
    public static _disableTextSelection: () => void;
    public static _disableContextMenu: () => void;
    public static _applyCanvasFilter: () => void;
    public static _onVideoLoad: () => void;
    public static _onVideoError: () => void;
    public static _onVideoEnd: () => void;
    public static _updateVisibility: (videoVisible: any) => void;
    public static _isVideoVisible: () => boolean;
    public static _setupEventHandlers: () => void;
    public static _onWindowResize: () => void;
    public static _onKeyDown: (event: any) => void;
    public static _onTouchEnd: (event: any) => void;
    public static _switchFPSMeter: () => void;
    public static _switchStretchMode: () => void;
    public static _switchFullScreen: () => void;
    public static _isFullScreen: () => boolean;
    public static _requestFullScreen: () => void;
    public static _cancelFullScreen: () => void;
    public static _rendererType: any;
    public static _boxWidth: any;
    public static _boxHeight: any;
    public static _scale: number;
    public static _realScale: number;
    public static _errorShowed: boolean;
    public static _errorPrinter: any;
    public static _canvas: any;
    public static _video: any;
    public static _videoUnlocked: boolean;
    public static _videoLoading: boolean;
    public static _upperCanvas: any;
    public static _fpsMeter: any;
    public static _modeBox: any;
    public static _skipCount: number;
    public static _maxSkip: number;
    public static _rendered: boolean;
    public static _loadingImage: any;
    public static _loadingCount: number;
    public static _fpsMeterToggled: boolean;
    public static _stretchEnabled: any;
    public static _canUseDifferenceBlend: boolean;
    public static _canUseSaturationBlend: boolean;
    public static _hiddenCanvas: any;
    public static _videoLoader: () => void;

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
        Graphics._stretchEnabled = Graphics._defaultStretchMode();

        Graphics._canUseDifferenceBlend = false;
        Graphics._canUseSaturationBlend = false;
        Graphics._hiddenCanvas = null;

        Graphics._testCanvasBlendModes();
        Graphics._modifyExistingElements();
        Graphics._updateRealScale();
        Graphics._createAllElements();
        Graphics._disableTextSelection();
        Graphics._disableContextMenu();
        Graphics._setupEventHandlers();
        Graphics._setupCssFontLoading();
    }
    private static _width: any;
    private static _height: any;
}

//@ts-ignore
Graphics._cssFontLoading = document.fonts && document.fonts.ready;
Graphics._fontLoaded = null;
Graphics._videoVolume = 1;

Graphics._setupCssFontLoading = function (){
    if(Graphics._cssFontLoading){
        //@ts-ignore
        document.fonts.ready.then(function (fonts){
            Graphics._fontLoaded = fonts;
        }).catch(function (error){
            SceneManager.onError(error);
        });
    }
};

Graphics.canUseCssFontLoading = function (){
    return !!Graphics._cssFontLoading;
};

/**
 * The total frame count of the game screen.
 *
 * @static
 * @property frameCount
 * @type Number
 */
Graphics.frameCount     = 0;

/**
 * The alias of PIXI.blendModes.NORMAL.
 *
 * @static
 * @property BLEND_NORMAL
 * @type Number
 * @final
 */
Graphics.BLEND_NORMAL   = 0;

/**
 * The alias of PIXI.blendModes.ADD.
 *
 * @static
 * @property BLEND_ADD
 * @type Number
 * @final
 */
Graphics.BLEND_ADD      = 1;

/**
 * The alias of PIXI.blendModes.MULTIPLY.
 *
 * @static
 * @property BLEND_MULTIPLY
 * @type Number
 * @final
 */
Graphics.BLEND_MULTIPLY = 2;

/**
 * The alias of PIXI.blendModes.SCREEN.
 *
 * @static
 * @property BLEND_SCREEN
 * @type Number
 * @final
 */
Graphics.BLEND_SCREEN   = 3;

/**
 * Marks the beginning of each frame for FPSMeter.
 *
 * @static
 * @method tickStart
 */
Graphics.tickStart = function () {
    if (Graphics._fpsMeter) {
        Graphics._fpsMeter.tickStart();
    }
};

/**
 * Marks the end of each frame for FPSMeter.
 *
 * @static
 * @method tickEnd
 */
Graphics.tickEnd = function () {
    if (Graphics._fpsMeter && Graphics._rendered) {
        Graphics._fpsMeter.tick();
    }
};

/**
 * Renders the stage to the game screen.
 *
 * @static
 * @method render
 * @param {Stage} stage The stage object to be rendered
 */
Graphics.render = function (stage?: Stage) {
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
        Graphics._skipCount = Math.min(Math.floor(elapsed / 15), Graphics._maxSkip);
        Graphics._rendered = true;
    } else {
        Graphics._skipCount--;
        Graphics._rendered = false;
    }
    Graphics.frameCount++;
};

/**
 * Checks whether the renderer type is WebGL.
 *
 * @static
 * @method isWebGL
 * @return {Boolean} True if the renderer type is WebGL
 */
Graphics.isWebGL = function () {
    return Graphics.renderer && Graphics.renderer.type === PIXI.RENDERER_TYPE.WEBGL;
};

/**
 * Checks whether the current browser supports WebGL.
 *
 * @static
 * @method hasWebGL
 * @return {Boolean} True if the current browser supports WebGL.
 */
Graphics.hasWebGL = function () {
    try {
        const canvas = document.createElement("canvas");
        return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch (e) {
        return false;
    }
};

/**
 * Checks whether the canvas blend mode 'difference' is supported.
 *
 * @static
 * @method canUseDifferenceBlend
 * @return {Boolean} True if the canvas blend mode 'difference' is supported
 */
Graphics.canUseDifferenceBlend = function () {
    return Graphics._canUseDifferenceBlend;
};

/**
 * Checks whether the canvas blend mode 'saturation' is supported.
 *
 * @static
 * @method canUseSaturationBlend
 * @return {Boolean} True if the canvas blend mode 'saturation' is supported
 */
Graphics.canUseSaturationBlend = function () {
    return Graphics._canUseSaturationBlend;
};

/**
 * Sets the source of the "Now Loading" image.
 *
 * @static
 * @method setLoadingImage
 */
Graphics.setLoadingImage = function (src) {
    Graphics._loadingImage = new Image();
    Graphics._loadingImage.src = src;
};

/**
 * Initializes the counter for displaying the "Now Loading" image.
 *
 * @static
 * @method startLoading
 */
Graphics.startLoading = function () {
    Graphics._loadingCount = 0;
};

/**
 * Increments the loading counter and displays the "Now Loading" image if necessary.
 *
 * @static
 * @method updateLoading
 */
Graphics.updateLoading = function () {
    Graphics._loadingCount++;
    Graphics._paintUpperCanvas();
    Graphics._upperCanvas.style.opacity = 1;
};

/**
 * Erases the "Now Loading" image.
 *
 * @static
 * @method endLoading
 */
Graphics.endLoading = function () {
    Graphics._clearUpperCanvas();
    Graphics._upperCanvas.style.opacity = 0;
};

/**
 * Displays the loading error text to the screen.
 *
 * @static
 * @method printLoadingError
 * @param {String} url The url of the resource failed to load
 */
Graphics.printLoadingError = function (url) {
    if (Graphics._errorPrinter && !Graphics._errorShowed) {
        Graphics._errorPrinter.innerHTML = Graphics._makeErrorHtml("Loading Error", "Failed to load: " + url);
        const button = document.createElement("button");
        button.innerHTML = "Retry";
        button.style.fontSize = "24px";
        button.style.color = "#ffffff";
        button.style.backgroundColor = "#000000";
        //@ts-ignore
        button.onmousedown = button.ontouchstart = function (event) {
            ResourceHandler.retry();
            event.stopPropagation();
        };
        Graphics._errorPrinter.appendChild(button);
        Graphics._loadingCount = -Infinity;
    }
};

/**
 * Erases the loading error text.
 *
 * @static
 * @method eraseLoadingError
 */
Graphics.eraseLoadingError = function () {
    if (Graphics._errorPrinter && !Graphics._errorShowed) {
        Graphics._errorPrinter.innerHTML = "";
        Graphics.startLoading();
    }
};

/**
 * Displays the error text to the screen.
 *
 * @static
 * @method printError
 * @param {String} name The name of the error
 * @param {String} message The message of the error
 */
Graphics.printError = function (name, message) {
    Graphics._errorShowed = true;
    if (Graphics._errorPrinter) {
        Graphics._errorPrinter.innerHTML = Graphics._makeErrorHtml(name, message);
    }
    Graphics._applyCanvasFilter();
    Graphics._clearUpperCanvas();
};

/**
 * Shows the FPSMeter element.
 *
 * @static
 * @method showFps
 */
Graphics.showFps = function () {
    if (Graphics._fpsMeter) {
        Graphics._fpsMeter.show();
        Graphics._modeBox.style.opacity = 1;
    }
};

/**
 * Hides the FPSMeter element.
 *
 * @static
 * @method hideFps
 */
Graphics.hideFps = function () {
    if (Graphics._fpsMeter) {
        Graphics._fpsMeter.hide();
        Graphics._modeBox.style.opacity = 0;
    }
};

/**
 * Loads a font file.
 *
 * @static
 * @method loadFont
 * @param {String} name The face name of the font
 * @param {String} url The url of the font file
 */
Graphics.loadFont = function (name, url) {
    const style = document.createElement("style");
    const head = document.getElementsByTagName("head");
    const rule = '@font-face { font-family: "' + name + '"; src: url("' + url + '"); }';
    style.type = "text/css";
    head.item(0).appendChild(style);
    if (style.sheet instanceof CSSStyleSheet) {
        style.sheet.insertRule(rule, 0);
    }
    Graphics._createFontLoader(name);
};

/**
 * Checks whether the font file is loaded.
 *
 * @static
 * @method isFontLoaded
 * @param {String} name The face name of the font
 * @return {Boolean} True if the font file is loaded
 */
Graphics.isFontLoaded = function (name) {
    if (Graphics._cssFontLoading) {
        if(Graphics._fontLoaded){
            return Graphics._fontLoaded.check('10px "'+name+'"');
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
};

/**
 * Starts playback of a video.
 *
 * @static
 * @method playVideo
 * @param {String} src
 */
Graphics.playVideo = function (src) {
    Graphics._videoLoader = ResourceHandler.createLoader(null, Graphics._playVideo.bind(this, src), Graphics._onVideoError.bind(this));
    Graphics._playVideo(src);
};

/**
 * @static
 * @method _playVideo
 * @param {String} src
 * @private
 */
Graphics._playVideo = function (src) {
    Graphics._video.src = src;
    Graphics._video.onloadeddata = Graphics._onVideoLoad.bind(this);
    Graphics._video.onerror = Graphics._videoLoader;
    Graphics._video.onended = Graphics._onVideoEnd.bind(this);
    Graphics._video.load();
    Graphics._videoLoading = true;
};

/**
 * Checks whether the video is playing.
 *
 * @static
 * @method isVideoPlaying
 * @return {Boolean} True if the video is playing
 */
Graphics.isVideoPlaying = function () {
    return Graphics._videoLoading || Graphics._isVideoVisible();
};

/**
 * Checks whether the browser can play the specified video type.
 *
 * @static
 * @method canPlayVideoType
 * @param {String} type The video type to test support for
 * @return {Boolean} True if the browser can play the specified video type
 */
Graphics.canPlayVideoType = function (type) {
    return Graphics._video && Graphics._video.canPlayType(type);
};

/**
 * Sets volume of a video.
 *
 * @static
 * @method setVideoVolume
 * @param {Number} value
 */
Graphics.setVideoVolume = function (value) {
    Graphics._videoVolume = value;
    if (Graphics._video) {
        Graphics._video.volume = Graphics._videoVolume;
    }
};

/**
 * Converts an x coordinate on the page to the corresponding
 * x coordinate on the canvas area.
 *
 * @static
 * @method pageToCanvasX
 * @param {Number} x The x coordinate on the page to be converted
 * @return {Number} The x coordinate on the canvas area
 */
Graphics.pageToCanvasX = function (x) {
    if (Graphics._canvas) {
        const left = Graphics._canvas.offsetLeft;
        return Math.round((x - left) / Graphics._realScale);
    } else {
        return 0;
    }
};

/**
 * Converts a y coordinate on the page to the corresponding
 * y coordinate on the canvas area.
 *
 * @static
 * @method pageToCanvasY
 * @param {Number} y The y coordinate on the page to be converted
 * @return {Number} The y coordinate on the canvas area
 */
Graphics.pageToCanvasY = function (y) {
    if (Graphics._canvas) {
        const top = Graphics._canvas.offsetTop;
        return Math.round((y - top) / Graphics._realScale);
    } else {
        return 0;
    }
};

/**
 * Checks whether the specified point is inside the game canvas area.
 *
 * @static
 * @method isInsideCanvas
 * @param {Number} x The x coordinate on the canvas area
 * @param {Number} y The y coordinate on the canvas area
 * @return {Boolean} True if the specified point is inside the game canvas area
 */
Graphics.isInsideCanvas = function (x, y) {
    return (x >= 0 && x < Graphics.width && y >= 0 && y < Graphics.height);
};

/**
 * Calls pixi.js garbage collector
 */
Graphics.callGC = function () {
    if (Graphics.isWebGL()) {
        Graphics.renderer.textureGC.run();
    }
};

/**
 * @static
 * @method _createAllElements
 * @private
 */
Graphics._createAllElements = function () {
    Graphics._createErrorPrinter();
    Graphics._createCanvas();
    Graphics._createVideo();
    Graphics._createUpperCanvas();
    Graphics._createRenderer();
    Graphics._createFPSMeter();
    Graphics._createModeBox();
    Graphics._createGameFontLoader();
};

/**
 * @static
 * @method _updateAllElements
 * @private
 */
Graphics._updateAllElements = function () {
    Graphics._updateRealScale();
    Graphics._updateErrorPrinter();
    Graphics._updateCanvas();
    Graphics._updateVideo();
    Graphics._updateUpperCanvas();
    Graphics._updateRenderer();
    Graphics._paintUpperCanvas();
};

/**
 * @static
 * @method _updateRealScale
 * @private
 */
Graphics._updateRealScale = function () {
    if (Graphics._stretchEnabled) {
        let h = window.innerWidth / Graphics.width;
        let v = window.innerHeight / Graphics.height;
        if (h >= 1 && h - 0.01 <= 1) { h = 1; }
        if (v >= 1 && v - 0.01 <= 1) { v = 1; }
        Graphics._realScale = Math.min(h, v);
    } else {
        Graphics._realScale = Graphics._scale;
    }
};

/**
 * @static
 * @method _makeErrorHtml
 * @param {String} name
 * @param {String} message
 * @return {String}
 * @private
 */
Graphics._makeErrorHtml = function (name, message) {
    return ('<font color="yellow"><b>' + name + "</b></font><br>" +
            '<font color="white">' + message + "</font><br>");
};

/**
 * @static
 * @method _defaultStretchMode
 * @private
 */
Graphics._defaultStretchMode = function () {
    return Utils.isNwjs() || Utils.isMobileDevice();
};

/**
 * @static
 * @method _testCanvasBlendModes
 * @private
 */
Graphics._testCanvasBlendModes = function () {
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
};

/**
 * @static
 * @method _modifyExistingElements
 * @private
 */
Graphics._modifyExistingElements = function () {
    const elements = document.getElementsByTagName("*");
    for (const element of elements) {
        if (element instanceof HTMLElement && Number(element.style.zIndex) > 0) {
            element.style.zIndex = "0";
        }
    }
};

/**
 * @static
 * @method _createErrorPrinter
 * @private
 */
Graphics._createErrorPrinter = function () {
    Graphics._errorPrinter = document.createElement("p");
    Graphics._errorPrinter.id = "ErrorPrinter";
    Graphics._updateErrorPrinter();
    document.body.appendChild(Graphics._errorPrinter);
};

/**
 * @static
 * @method _updateErrorPrinter
 * @private
 */
Graphics._updateErrorPrinter = function () {
    Graphics._errorPrinter.width = Graphics.width * 0.9;
    Graphics._errorPrinter.height = 40;
    Graphics._errorPrinter.style.textAlign = "center";
    Graphics._errorPrinter.style.textShadow = "1px 1px 3px #000";
    Graphics._errorPrinter.style.fontSize = "20px";
    Graphics._errorPrinter.style.zIndex = 99;
    Graphics._centerElement(Graphics._errorPrinter);
};

/**
 * @static
 * @method _createCanvas
 * @private
 */
Graphics._createCanvas = function () {
    Graphics._canvas = document.createElement("canvas");
    Graphics._canvas.id = "GameCanvas";
    Graphics._updateCanvas();
    document.body.appendChild(Graphics._canvas);
};

/**
 * @static
 * @method _updateCanvas
 * @private
 */
Graphics._updateCanvas = function () {
    Graphics._canvas.width = Graphics.width;
    Graphics._canvas.height = Graphics.height;
    Graphics._canvas.style.zIndex = 1;
    Graphics._centerElement(Graphics._canvas);
};

/**
 * @static
 * @method _createVideo
 * @private
 */
Graphics._createVideo = function () {
    Graphics._video = document.createElement("video");
    Graphics._video.id = "GameVideo";
    Graphics._video.style.opacity = 0;
    Graphics._video.setAttribute("playsinline", "");
    Graphics._video.volume = Graphics._videoVolume;
    Graphics._updateVideo();
    enableInlineVideo(Graphics._video);
    document.body.appendChild(Graphics._video);
};

/**
 * @static
 * @method _updateVideo
 * @private
 */
Graphics._updateVideo = function () {
    Graphics._video.width = Graphics.width;
    Graphics._video.height = Graphics.height;
    Graphics._video.style.zIndex = 2;
    Graphics._centerElement(Graphics._video);
};

/**
 * @static
 * @method _createUpperCanvas
 * @private
 */
Graphics._createUpperCanvas = function () {
    Graphics._upperCanvas = document.createElement("canvas");
    Graphics._upperCanvas.id = "UpperCanvas";
    Graphics._updateUpperCanvas();
    document.body.appendChild(Graphics._upperCanvas);
};

/**
 * @static
 * @method _updateUpperCanvas
 * @private
 */
Graphics._updateUpperCanvas = function () {
    Graphics._upperCanvas.width = Graphics.width;
    Graphics._upperCanvas.height = Graphics.height;
    Graphics._upperCanvas.style.zIndex = 3;
    Graphics._centerElement(Graphics._upperCanvas);
};

/**
 * @static
 * @method _clearUpperCanvas
 * @private
 */
Graphics._clearUpperCanvas = function () {
    const context = Graphics._upperCanvas.getContext("2d");
    context.clearRect(0, 0, Graphics.width, Graphics.height);
};

/**
 * @static
 * @method _paintUpperCanvas
 * @private
 */
Graphics._paintUpperCanvas = function () {
    Graphics._clearUpperCanvas();
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
};

/**
 * @static
 * @method _createRenderer
 * @private
 */
Graphics._createRenderer = function () {
    const width = Graphics.width;
    const height = Graphics.height;
    const options = { "view": Graphics._canvas };
    try {
        Graphics.renderer = new PIXI.WebGLRenderer(width, height, options);
        if(Graphics.renderer && Graphics.renderer.textureGC) {
            Graphics.renderer.textureGC.maxIdle = 1;
        }

    } catch (e) {
        Graphics.renderer = null;
    }
};

/**
 * @static
 * @method _updateRenderer
 * @private
 */
Graphics._updateRenderer = function () {
    if (Graphics.renderer) {
        Graphics.renderer.resize(Graphics.width, Graphics.height);
    }
};

/**
 * @static
 * @method _createFPSMeter
 * @private
 */
Graphics._createFPSMeter = function () {
    const options = { "graph": 1, "decimals": 0, "theme": "transparent", "toggleOn": null };
};

/**
 * @static
 * @method _createModeBox
 * @private
 */
Graphics._createModeBox = function () {
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
};

/**
 * @static
 * @method _createGameFontLoader
 * @private
 */
Graphics._createGameFontLoader = function () {
    Graphics._createFontLoader("GameFont");
};

/**
 * @static
 * @method _createFontLoader
 * @param {String} name
 * @private
 */
Graphics._createFontLoader = function (name) {
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
};

/**
 * @static
 * @method _centerElement
 * @param {HTMLElement} element
 * @private
 */
Graphics._centerElement = function (element) {
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
};

/**
 * @static
 * @method _disableTextSelection
 * @private
 */
Graphics._disableTextSelection = function () {
    const body = document.body;
    body.style.userSelect = "none";
    body.style.webkitUserSelect = "none";
    body.style.msUserSelect = "none";
};

/**
 * @static
 * @method _disableContextMenu
 * @private
 */
Graphics._disableContextMenu = function () {
    const elements = document.body.getElementsByTagName("*");
    const oncontextmenu = function () { return false; };
    for (const element of elements) {
        //@ts-ignore
        element.oncontextmenu = oncontextmenu;
    }
};

/**
 * @static
 * @method _applyCanvasFilter
 * @private
 */
Graphics._applyCanvasFilter = function () {
    if (Graphics._canvas) {
        Graphics._canvas.style.opacity = 0.5;
        Graphics._canvas.style.filter = "blur(8px)";
        Graphics._canvas.style.webkitFilter = "blur(8px)";
    }
};

/**
 * @static
 * @method _onVideoLoad
 * @private
 */
Graphics._onVideoLoad = function () {
    Graphics._video.play();
    Graphics._updateVisibility(true);
    Graphics._videoLoading = false;
};

/**
 * @static
 * @method _onVideoError
 * @private
 */
Graphics._onVideoError = function () {
    Graphics._updateVisibility(false);
    Graphics._videoLoading = false;
};

/**
 * @static
 * @method _onVideoEnd
 * @private
 */
Graphics._onVideoEnd = function () {
    Graphics._updateVisibility(false);
};

/**
 * @static
 * @method _updateVisibility
 * @param {Boolean} videoVisible
 * @private
 */
Graphics._updateVisibility = function (videoVisible) {
    Graphics._video.style.opacity = videoVisible ? 1 : 0;
    Graphics._canvas.style.opacity = videoVisible ? 0 : 1;
};

/**
 * @static
 * @method _isVideoVisible
 * @return {Boolean}
 * @private
 */
Graphics._isVideoVisible = function () {
    return Graphics._video.style.opacity > 0;
};

/**
 * @static
 * @method _setupEventHandlers
 * @private
 */
Graphics._setupEventHandlers = function () {
    window.addEventListener("resize", Graphics._onWindowResize.bind(this));
    document.addEventListener("keydown", Graphics._onKeyDown.bind(this));
    document.addEventListener("keydown", Graphics._onTouchEnd.bind(this));
    document.addEventListener("mousedown", Graphics._onTouchEnd.bind(this));
    document.addEventListener("touchend", Graphics._onTouchEnd.bind(this));
};

/**
 * @static
 * @method _onWindowResize
 * @private
 */
Graphics._onWindowResize = function () {
    Graphics._updateAllElements();
};

/**
 * @static
 * @method _onKeyDown
 * @param {KeyboardEvent} event
 * @private
 */
Graphics._onKeyDown = function (event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
        case 113:   // F2
            event.preventDefault();
            Graphics._switchFPSMeter();
            break;
        case 114:   // F3
            event.preventDefault();
            Graphics._switchStretchMode();
            break;
        case 115:   // F4
            event.preventDefault();
            Graphics._switchFullScreen();
            break;
        }
    }
};

/**
 * @static
 * @method _onTouchEnd
 * @param {TouchEvent} event
 * @private
 */
Graphics._onTouchEnd = function (event) {
    if (!Graphics._videoUnlocked) {
        Graphics._video.play();
        Graphics._videoUnlocked = true;
    }
    if (Graphics._isVideoVisible() && Graphics._video.paused) {
        Graphics._video.play();
    }
};

/**
 * @static
 * @method _switchFPSMeter
 * @private
 */
Graphics._switchFPSMeter = function () {
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
};

/**
 * @static
 * @method _switchStretchMode
 * @return {Boolean}
 * @private
 */
Graphics._switchStretchMode = function () {
    Graphics._stretchEnabled = !Graphics._stretchEnabled;
    Graphics._updateAllElements();
};

/**
 * @static
 * @method _switchFullScreen
 * @private
 */
Graphics._switchFullScreen = function () {
    if (Graphics._isFullScreen()) {
        Graphics._requestFullScreen();
    } else {
        Graphics._cancelFullScreen();
    }
};

/**
 * @static
 * @method _isFullScreen
 * @return {Boolean}
 * @private
 */
Graphics._isFullScreen = function () {
    return document.fullscreenEnabled;
};

/**
 * @static
 * @method _requestFullScreen
 * @private
 */
Graphics._requestFullScreen = function () {
    document.body.requestFullscreen();
};

/**
 * @static
 * @method _cancelFullScreen
 * @private
 */
Graphics._cancelFullScreen = function () {
    document.exitFullscreen();
};
