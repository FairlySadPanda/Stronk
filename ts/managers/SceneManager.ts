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

    /*
     * Gets the current time in ms without on iOS Safari.
     * @private
     */

    public static run = function(sceneClass: any) {
        try {
            this.initialize();
            this.goto(sceneClass);
            this.requestUpdate();
        } catch (e) {
            this.catchException(e);
        }
    };

    public static initialize = function() {
        this.initGraphics();
        this.checkFileAccess();
        this.initAudio();
        this.initInput();
        this.initNwjs();
        this.checkPluginErrors();
        this.setupErrorHandlers();
    };

    public static initGraphics = function() {
        const type = this.preferableRendererType();
        Graphics.initialize(this._screenWidth, this._screenHeight, type);
        Graphics.boxWidth = this._boxWidth;
        Graphics.boxHeight = this._boxHeight;
        Graphics.setLoadingImage("img/system/Loading.png");
        if (type === "webgl") {
            this.checkWebGL();
        }
    };

    public static preferableRendererType = function() {
        if (Utils.isOptionValid("canvas")) {
            return "canvas";
        } else if (Utils.isOptionValid("webgl")) {
            return "webgl";
        } else {
            return "auto";
        }
    };

    public static shouldUseCanvasRenderer = function() {
        return Utils.isMobileDevice();
    };

    public static checkWebGL = function() {
        if (!Graphics.hasWebGL()) {
            throw new Error("Your browser does not support WebGL.");
        }
    };

    public static checkFileAccess = function() {
        if (!Utils.canReadGameFiles()) {
            throw new Error("Your browser does not allow to read local files.");
        }
    };

    public static initAudio = function() {
        const noAudio = Utils.isOptionValid("noaudio");
        if (!WebAudio.initialize(noAudio) && !noAudio) {
            throw new Error("Your browser does not support Web Audio API.");
        }
    };

    public static initInput = function() {
        Input.initialize();
        TouchInput.initialize();
    };

    public static initNwjs = function() {
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

    public static checkPluginErrors = function() {
        PluginManager.checkErrors();
    };

    public static setupErrorHandlers = function() {
        window.addEventListener("error", this.onError.bind(this));
        document.addEventListener("keydown", this.onKeyDown.bind(this));
    };

    public static requestUpdate = function() {
        if (!this._stopped) {
            requestAnimationFrame(this.update.bind(this));
        }
    };

    public static update = function() {
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

    public static terminate = function() {
        window.close();
    };

    public static onError = function(e: {
        message: string;
        filename: any;
        lineno: any;
    }) {
        console.error(e.message);
        console.error(e.filename, e.lineno);
        try {
            this.stop();
            Graphics.printError("Error", e.message);
            AudioManager.stopAll();
        } catch (e2) {}
    };

    public static onKeyDown = function(event: {
        ctrlKey: any;
        altKey: any;
        keyCode: any;
    }) {
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

    public static catchException = function(e: Error) {
        if (e instanceof Error) {
            Graphics.printError(e.name, e.message);
            console.error(e.stack);
        } else {
            Graphics.printError("UnknownError", e);
        }
        AudioManager.stopAll();
        this.stop();
    };

    public static updateInputData = function() {
        Input.update();
        TouchInput.update();
    };

    public static updateMain = function() {
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

    public static updateManagers = function() {
        ImageManager.update();
    };

    public static changeScene = function() {
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

    public static updateScene = function() {
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

    public static renderScene = function() {
        if (this.isCurrentSceneStarted()) {
            Graphics.render(this._scene);
        } else if (this._scene) {
            this.onSceneLoading();
        }
    };

    public static onSceneCreate = function() {
        Graphics.startLoading();
    };

    public static onSceneStart = function() {
        Graphics.endLoading();
    };

    public static onSceneLoading = function() {
        Graphics.updateLoading();
    };

    public static isSceneChanging = function() {
        return this._exiting || !!this._nextScene;
    };

    public static isCurrentSceneBusy = function() {
        return this._scene && this._scene.isBusy();
    };

    public static isCurrentSceneStarted = function() {
        return this._scene && this._sceneStarted;
    };

    public static isNextScene = function(sceneClass: any) {
        return this._nextScene && this._nextScene.constructor === sceneClass;
    };

    public static isPreviousScene = function(sceneClass: any) {
        return this._previousClass === sceneClass;
    };

    public static goto = function(SceneClass: new () => void) {
        if (SceneClass) {
            this._nextScene = new SceneClass();
        }
        if (this._scene) {
            this._scene.stop();
        }
    };

    public static push = function(sceneClass: any) {
        this._stack.push(this._scene.constructor);
        this.goto(sceneClass);
    };

    public static pop = function() {
        if (this._stack.length > 0) {
            this.goto(this._stack.pop());
        } else {
            this.exit();
        }
    };

    public static exit = function() {
        this.goto(null);
        this._exiting = true;
    };

    public static clearStack = function() {
        this._stack = [];
    };

    public static stop = function() {
        this._stopped = true;
    };

    public static prepareNextScene = function(...args: any) {
        this._nextScene.prepare.apply(this._nextScene, args);
    };

    public static snap = function() {
        return Bitmap.snap(this._scene);
    };

    public static snapForBackground = function() {
        this._backgroundBitmap = this.snap();
        this._backgroundBitmap.blur();
    };

    public static backgroundBitmap = function() {
        return this._backgroundBitmap;
    };

    public static resume = function() {
        this._stopped = false;
        this.requestUpdate();
        if (!Utils.isMobileSafari()) {
            this._currentTime = this._getTimeInMsWithoutMobileSafari();
            this._accumulator = 0;
        }
    };
}
