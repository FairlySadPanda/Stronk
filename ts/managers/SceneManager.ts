import Bitmap from "../core/Bitmap";
import Graphics from "../core/Graphics";
import Input from "../core/Input";
import TouchInput from "../core/TouchInput";
import Utils from "../core/Utils";
import WebAudio from "../core/WebAudio";
import AudioManager from "./AudioManager";
import ImageManager from "./ImageManager";
import PluginManager from "./PluginManager";

// NW is a global, you don't import it like an NPM module
declare const nw: any;

export default abstract class SceneManager {
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
    private static _currentTime: number;

    /*
     * Gets the current time in ms without on iOS Safari.
     * @private
     */
    private static _getTimeInMsWithoutMobileSafari() {
        return performance.now();
    }

    public static run(sceneClass) {
        try {
            this.initialize();
            this.goto(sceneClass);
            this.requestUpdate();
        } catch (e) {
            this.catchException(e);
        }
    }

    public static initialize() {
        this.initGraphics();
        this.checkFileAccess();
        this.initAudio();
        this.initInput();
        this.initNwjs();
        this.checkPluginErrors();
        this.setupErrorHandlers();
    }

    public static initGraphics() {
        const type = this.preferableRendererType();
        Graphics.initialize(this._screenWidth, this._screenHeight, type);
        Graphics.boxWidth = this._boxWidth;
        Graphics.boxHeight = this._boxHeight;
        Graphics.setLoadingImage("img/system/Loading.png");
        if (type === "webgl") {
            this.checkWebGL();
        }
    }

    public static preferableRendererType() {
        if (Utils.isOptionValid("canvas")) {
            return "canvas";
        } else if (Utils.isOptionValid("webgl")) {
            return "webgl";
        } else {
            return "auto";
        }
    }

    public static shouldUseCanvasRenderer() {
        return Utils.isMobileDevice();
    }

    public static checkWebGL() {
        if (!Graphics.hasWebGL()) {
            throw new Error("Your browser does not support WebGL.");
        }
    }

    public static checkFileAccess() {
        if (!Utils.canReadGameFiles()) {
            throw new Error("Your browser does not allow to read local files.");
        }
    }

    public static initAudio() {
        const noAudio = Utils.isOptionValid("noaudio");
        if (!WebAudio.initialize(noAudio) && !noAudio) {
            throw new Error("Your browser does not support Web Audio API.");
        }
    }

    public static initInput() {
        Input.initialize();
        TouchInput.initialize();
    }

    public static initNwjs() {
        if (Utils.isNwjs()) {
            const win = nw.Window.get();
            if (process.platform === "darwin" && !win.menu) {
                const menubar = new nw.Menu({ type: "menubar" });
                const option = { hideEdit: true, hideWindow: true };
                menubar.createMacBuiltin("Game", option);
                win.menu = menubar;
            }
        }
    }

    public static checkPluginErrors() {
        PluginManager.checkErrors();
    }

    public static setupErrorHandlers() {
        window.addEventListener("error", this.onError.bind(this));
        document.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    public static requestUpdate() {
        if (!this._stopped) {
            requestAnimationFrame(this.update.bind(this));
        }
    }

    public static update() {
        try {
            if (Utils.isMobileSafari()) {
                this.updateInputData();
            }
            this.updateManagers();
            this.updateMain();
        } catch (e) {
            this.catchException(e);
        }
    }

    public static terminate() {
        window.close();
    }

    public static onError(e) {
        console.error(e.message);
        console.error(e.filename, e.lineno);
        try {
            this.stop();
            Graphics.printError("Error", e.message);
            AudioManager.stopAll();
        } catch (e2) {}
    }

    public static onKeyDown(event) {
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
    }

    public static catchException(e) {
        if (e instanceof Error) {
            Graphics.printError(e.name, e.message);
            console.error(e.stack);
        } else {
            Graphics.printError("UnknownError", e);
        }
        AudioManager.stopAll();
        this.stop();
    }

    public static updateInputData() {
        Input.update();
        TouchInput.update();
    }

    public static updateMain() {
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
    }

    public static updateManagers() {
        ImageManager.update();
    }

    public static changeScene() {
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
    }

    public static updateScene() {
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
    }

    public static renderScene() {
        if (this.isCurrentSceneStarted()) {
            Graphics.render(this._scene);
        } else if (this._scene) {
            this.onSceneLoading();
        }
    }

    public static onSceneCreate() {
        Graphics.startLoading();
    }

    public static onSceneStart() {
        Graphics.endLoading();
    }

    public static onSceneLoading() {
        Graphics.updateLoading();
    }

    public static isSceneChanging() {
        return this._exiting || !!this._nextScene;
    }

    public static isCurrentSceneBusy() {
        return this._scene && this._scene.isBusy();
    }

    public static isCurrentSceneStarted() {
        return this._scene && this._sceneStarted;
    }

    public static isNextScene(sceneClass) {
        return this._nextScene && this._nextScene.constructor === sceneClass;
    }

    public static isPreviousScene(sceneClass) {
        return this._previousClass === sceneClass;
    }

    public static goto(SceneClass) {
        if (SceneClass) {
            this._nextScene = new SceneClass();
        }
        if (this._scene) {
            this._scene.stop();
        }
    }

    public static push(sceneClass) {
        this._stack.push(this._scene.constructor);
        this.goto(sceneClass);
    }

    public static pop() {
        if (this._stack.length > 0) {
            this.goto(this._stack.pop());
        } else {
            this.exit();
        }
    }

    public static exit() {
        this.goto(null);
        this._exiting = true;
    }

    public static clearStack() {
        this._stack = [];
    }

    public static stop() {
        this._stopped = true;
    }

    public static prepareNextScene(...args) {
        this._nextScene.prepare.apply(this._nextScene, args);
    }

    public static snap() {
        return Bitmap.snap(this._scene);
    }

    public static snapForBackground() {
        this._backgroundBitmap = this.snap();
        this._backgroundBitmap.blur();
    }

    public static backgroundBitmap() {
        return this._backgroundBitmap;
    }

    public static resume() {
        this._stopped = false;
        this.requestUpdate();
        if (!Utils.isMobileSafari()) {
            this._currentTime = this._getTimeInMsWithoutMobileSafari();
            this._accumulator = 0;
        }
    }
}
