import Bitmap from "../core/Bitmap";
import Graphics from "../core/Graphics";
import Input from "../core/Input";
import TouchInput from "../core/TouchInput";
import Utils from "../core/Utils";
import WebAudio from "../core/WebAudio";
import AudioManager from "./AudioManager";
import ImageManager from "./ImageManager";
import PluginManager from "./PluginManager";

declare const nw: any;

export default abstract class SceneManager {
    private static _getTimeInMsWithoutMobileSafari = function() {
        return performance.now();
    };
    private static _scene = null;
    private static _nextScene = null;
    private static _stack = [];
    private static _stopped = false;
    private static _sceneStarted = false;
    private static _exiting = false;
    private static _previousClass = null;
    private static _backgroundBitmap = null;
    private static _screenWidth = 816;
    private static _screenHeight = 624;
    private static _boxWidth = 816;
    private static _boxHeight = 624;
    private static _deltaTime = 1.0 / 60.0;
    private static _accumulator = 0.0;
    private static _currentTime = SceneManager._getTimeInMsWithoutMobileSafari();
    public static run: (sceneClass: any) => void;
    public static initialize: () => void;
    public static initGraphics: () => void;
    public static preferableRendererType: () => "canvas" | "webgl" | "auto";
    public static shouldUseCanvasRenderer: () => boolean;
    public static checkWebGL: () => void;
    public static checkFileAccess: () => void;
    public static initAudio: () => void;
    public static initInput: () => void;
    public static initNwjs: () => void;
    public static checkPluginErrors: () => void;
    public static setupErrorHandlers: () => void;
    public static requestUpdate: () => void;
    public static update: () => void;
    public static terminate: () => void;
    public static onError: (e: any) => void;
    public static onKeyDown: (event: any) => void;
    public static catchException: (e: any) => void;
    public static updateInputData: () => void;
    public static updateMain: () => void;
    public static updateManagers: () => void;
    public static changeScene: () => void;
    public static updateScene: () => void;
    public static renderScene: () => void;
    public static onSceneCreate: () => void;
    public static onSceneStart: () => void;
    public static onSceneLoading: () => void;
    public static isSceneChanging: () => any;
    public static isCurrentSceneBusy: () => any;
    public static isCurrentSceneStarted: () => any;
    public static isNextScene: (sceneClass: any) => boolean;
    public static isPreviousScene: (sceneClass: any) => boolean;
    public static goto: (sceneClass: any) => void;
    public static push: (sceneClass: any) => void;
    public static pop: () => void;
    public static exit: () => void;
    public static clearStack: () => void;
    public static stop: () => void;
    public static prepareNextScene: (...args) => void;
    public static snap: () => void;
    public static snapForBackground: () => void;
    public static backgroundBitmap: () => any;
    public static resume: () => void;
}
/*
 * Gets the current time in ms without on iOS Safari.
 * @private
 */

SceneManager.run = function(sceneClass) {
    try {
        this.initialize();
        this.goto(sceneClass);
        this.requestUpdate();
    } catch (e) {
        this.catchException(e);
    }
};

SceneManager.initialize = function() {
    this.initGraphics();
    this.checkFileAccess();
    this.initAudio();
    this.initInput();
    this.initNwjs();
    this.checkPluginErrors();
    this.setupErrorHandlers();
};

SceneManager.initGraphics = function() {
    const type = this.preferableRendererType();
    Graphics.initialize(this._screenWidth, this._screenHeight, type);
    Graphics.boxWidth = this._boxWidth;
    Graphics.boxHeight = this._boxHeight;
    Graphics.setLoadingImage("img/system/Loading.png");
    if (type === "webgl") {
        this.checkWebGL();
    }
};

SceneManager.preferableRendererType = function() {
    if (Utils.isOptionValid("canvas")) {
        return "canvas";
    } else if (Utils.isOptionValid("webgl")) {
        return "webgl";
    } else {
        return "auto";
    }
};

SceneManager.shouldUseCanvasRenderer = function() {
    return Utils.isMobileDevice();
};

SceneManager.checkWebGL = function() {
    if (!Graphics.hasWebGL()) {
        throw new Error("Your browser does not support WebGL.");
    }
};

SceneManager.checkFileAccess = function() {
    if (!Utils.canReadGameFiles()) {
        throw new Error("Your browser does not allow to read local files.");
    }
};

SceneManager.initAudio = function() {
    const noAudio = Utils.isOptionValid("noaudio");
    if (!WebAudio.initialize(noAudio) && !noAudio) {
        throw new Error("Your browser does not support Web Audio API.");
    }
};

SceneManager.initInput = function() {
    Input.initialize();
    TouchInput.initialize();
};

SceneManager.initNwjs = function() {
    if (Utils.isNwjs()) {
        const win = nw.Window.get();
        if (process.platform === "darwin" && !win.menu) {
            const menubar = new nw.Menu({ type: "menubar" });
            const option = { hideEdit: true, hideWindow: true };
            menubar.createMacBuiltin("Game", option);
            win.menu = menubar;
        }
    }
};

SceneManager.checkPluginErrors = function() {
    PluginManager.checkErrors();
};

SceneManager.setupErrorHandlers = function() {
    window.addEventListener("error", this.onError.bind(this));
    document.addEventListener("keydown", this.onKeyDown.bind(this));
};

SceneManager.requestUpdate = function() {
    if (!this._stopped) {
        requestAnimationFrame(this.update.bind(this));
    }
};

SceneManager.update = function() {
    try {
        if (Utils.isMobileSafari()) {
            this.updateInputData();
        }
        this.updateManagers();
        this.updateMain();
    } catch (e) {
        this.catchException(e);
    }
};

SceneManager.terminate = function() {
    window.close();
};

SceneManager.onError = function(e) {
    console.error(e.message);
    console.error(e.filename, e.lineno);
    try {
        this.stop();
        Graphics.printError("Error", e.message);
        AudioManager.stopAll();
    } catch (e2) {}
};

SceneManager.onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
            case 116: // F5
                if (Utils.isNwjs()) {
                    location.reload();
                }
                break;
            case 119: // F8
                if (Utils.isNwjs() && Utils.isOptionValid("test")) {
                    nw.Window.get().showDevTools();
                }
                break;
        }
    }
};

SceneManager.catchException = function(e) {
    if (e instanceof Error) {
        Graphics.printError(e.name, e.message);
        console.error(e.stack);
    } else {
        Graphics.printError("UnknownError", e);
    }
    AudioManager.stopAll();
    this.stop();
};

SceneManager.updateInputData = function() {
    Input.update();
    TouchInput.update();
};

SceneManager.updateMain = function() {
    if (Utils.isMobileSafari()) {
        this.changeScene();
        this.updateScene();
    } else {
        const newTime = this._getTimeInMsWithoutMobileSafari();
        let fTime = (newTime - this._currentTime) / 1000;
        if (fTime > 0.25) {
            fTime = 0.25;
        }
        this._currentTime = newTime;
        this._accumulator += fTime;
        while (this._accumulator >= this._deltaTime) {
            this.updateInputData();
            this.changeScene();
            this.updateScene();
            this._accumulator -= this._deltaTime;
        }
    }
    this.renderScene();
    this.requestUpdate();
};

SceneManager.updateManagers = function() {
    ImageManager.update();
};

SceneManager.changeScene = function() {
    if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
        if (this._scene) {
            this._scene.terminate();
            this._scene.detachReservation();
            this._previousClass = this._scene.constructor;
        }
        this._scene = this._nextScene;
        if (this._scene) {
            this._scene.attachReservation();
            this._scene.create();
            this._nextScene = null;
            this._sceneStarted = false;
            this.onSceneCreate();
        }
        if (this._exiting) {
            this.terminate();
        }
    }
};

SceneManager.updateScene = function() {
    if (this._scene) {
        if (!this._sceneStarted && this._scene.isReady()) {
            this._scene.start();
            this._sceneStarted = true;
            this.onSceneStart();
        }
        if (this.isCurrentSceneStarted()) {
            this._scene.update();
        }
    }
};

SceneManager.renderScene = function() {
    if (this.isCurrentSceneStarted()) {
        Graphics.render(this._scene);
    } else if (this._scene) {
        this.onSceneLoading();
    }
};

SceneManager.onSceneCreate = function() {
    Graphics.startLoading();
};

SceneManager.onSceneStart = function() {
    Graphics.endLoading();
};

SceneManager.onSceneLoading = function() {
    Graphics.updateLoading();
};

SceneManager.isSceneChanging = function() {
    return this._exiting || !!this._nextScene;
};

SceneManager.isCurrentSceneBusy = function() {
    return this._scene && this._scene.isBusy();
};

SceneManager.isCurrentSceneStarted = function() {
    return this._scene && this._sceneStarted;
};

SceneManager.isNextScene = function(sceneClass) {
    return this._nextScene && this._nextScene.constructor === sceneClass;
};

SceneManager.isPreviousScene = function(sceneClass) {
    return this._previousClass === sceneClass;
};

SceneManager.goto = function(SceneClass) {
    if (SceneClass) {
        this._nextScene = new SceneClass();
    }
    if (this._scene) {
        this._scene.stop();
    }
};

SceneManager.push = function(sceneClass) {
    this._stack.push(this._scene.constructor);
    this.goto(sceneClass);
};

SceneManager.pop = function() {
    if (this._stack.length > 0) {
        this.goto(this._stack.pop());
    } else {
        this.exit();
    }
};

SceneManager.exit = function() {
    this.goto(null);
    this._exiting = true;
};

SceneManager.clearStack = function() {
    this._stack = [];
};

SceneManager.stop = function() {
    this._stopped = true;
};

SceneManager.prepareNextScene = function(...args) {
    this._nextScene.prepare.apply(this._nextScene, args);
};

SceneManager.snap = function() {
    return Bitmap.snap(this._scene);
};

SceneManager.snapForBackground = function() {
    this._backgroundBitmap = this.snap();
    this._backgroundBitmap.blur();
};

SceneManager.backgroundBitmap = function() {
    return this._backgroundBitmap;
};

SceneManager.resume = function() {
    this._stopped = false;
    this.requestUpdate();
    if (!Utils.isMobileSafari()) {
        this._currentTime = this._getTimeInMsWithoutMobileSafari();
        this._accumulator = 0;
    }
};
