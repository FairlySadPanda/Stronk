import Bitmap from "../core/Bitmap";
import Graphics from "../core/Graphics";
import Input from "../core/Input";
import TouchInput from "../core/TouchInput";
import Utils from "../core/Utils";
import WebAudio from "../core/WebAudio";
import AudioManager from "./AudioManager";
import ImageManager from "./ImageManager";
import PluginManager from "./PluginManager";
import Scene_Base from "../scenes/Scene_Base";

declare const nw: any;

export default abstract class SceneManager {
    private static _scene: Scene_Base = null;
    private static _nextScene: Scene_Base = null;
    private static _stack = [];
    private static _stopped = false;
    private static _sceneStarted = false;
    private static _exiting = false;
    private static _previousClass = null;
    private static _backgroundBitmap: Bitmap = null;
    private static _screenWidth = 816;
    private static _screenHeight = 624;
    private static _boxWidth = 816;
    private static _boxHeight = 624;
    private static _deltaTime = 1.0 / 60.0;
    private static _accumulator = 0.0;
    private static _currentTime = performance.now();

    /*
     * Gets the current time in ms without on iOS Safari.
     * @private
     */

    public static run = function(sceneClass: any) {
        try {
            SceneManager.initialize();
            SceneManager.goto(sceneClass);
            SceneManager.requestUpdate();
        } catch (e) {
            SceneManager.catchException(e);
        }
    };

    public static initialize = function() {
        SceneManager.initGraphics();
        SceneManager.checkFileAccess();
        SceneManager.initAudio();
        SceneManager.initInput();
        SceneManager.initNwjs();
        SceneManager.checkPluginErrors();
        SceneManager.setupErrorHandlers();
    };

    public static initGraphics = function() {
        const type = SceneManager.preferableRendererType();
        Graphics.initialize(
            SceneManager._screenWidth,
            SceneManager._screenHeight,
            type
        );
        Graphics.boxWidth = SceneManager._boxWidth;
        Graphics.boxHeight = SceneManager._boxHeight;
        Graphics.setLoadingImage("img/system/Loading.png");
        if (type === "webgl") {
            SceneManager.checkWebGL();
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
        window.addEventListener(
            "error",
            SceneManager.onError.bind(SceneManager)
        );
        document.addEventListener(
            "keydown",
            SceneManager.onKeyDown.bind(SceneManager)
        );
    };

    public static requestUpdate = function() {
        if (!SceneManager._stopped) {
            requestAnimationFrame(SceneManager.update.bind(SceneManager));
        }
    };

    public static update = function() {
        try {
            if (Utils.isMobileSafari()) {
                SceneManager.updateInputData();
            }
            SceneManager.updateManagers();
            SceneManager.updateMain();
        } catch (e) {
            SceneManager.catchException(e);
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
            SceneManager.stop();
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
        SceneManager.stop();
    };

    public static updateInputData = function() {
        Input.update();
        TouchInput.update();
    };

    public static updateMain = function() {
        if (Utils.isMobileSafari()) {
            SceneManager.changeScene();
            SceneManager.updateScene();
        } else {
            const newTime = performance.now();
            let fTime = (newTime - SceneManager._currentTime) / 1000;
            if (fTime > 0.25) {
                fTime = 0.25;
            }
            SceneManager._currentTime = newTime;
            SceneManager._accumulator += fTime;
            while (SceneManager._accumulator >= SceneManager._deltaTime) {
                SceneManager.updateInputData();
                SceneManager.changeScene();
                SceneManager.updateScene();
                SceneManager._accumulator -= SceneManager._deltaTime;
            }
        }
        SceneManager.renderScene();
        SceneManager.requestUpdate();
    };

    public static updateManagers = function() {
        ImageManager.update();
    };

    public static changeScene = function() {
        if (
            SceneManager.isSceneChanging() &&
            !SceneManager.isCurrentSceneBusy()
        ) {
            if (SceneManager._scene) {
                SceneManager._scene.terminate();
                SceneManager._scene.detachReservation();
                SceneManager._previousClass = SceneManager._scene.constructor;
            }
            SceneManager._scene = SceneManager._nextScene;
            if (SceneManager._scene) {
                SceneManager._scene.attachReservation();
                SceneManager._scene.create();
                SceneManager._nextScene = null;
                SceneManager._sceneStarted = false;
                SceneManager.onSceneCreate();
            }
            if (SceneManager._exiting) {
                SceneManager.terminate();
            }
        }
    };

    public static updateScene = function() {
        if (SceneManager._scene) {
            if (!SceneManager._sceneStarted && SceneManager._scene.isReady()) {
                SceneManager._scene.start();
                SceneManager._sceneStarted = true;
                SceneManager.onSceneStart();
            }
            if (SceneManager.isCurrentSceneStarted()) {
                SceneManager._scene.update();
            }
        }
    };

    public static renderScene = function() {
        if (SceneManager.isCurrentSceneStarted()) {
            Graphics.render(SceneManager._scene);
        } else if (SceneManager._scene) {
            SceneManager.onSceneLoading();
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
        return SceneManager._exiting || !!SceneManager._nextScene;
    };

    public static isCurrentSceneBusy = function() {
        return SceneManager._scene && SceneManager._scene.isBusy();
    };

    public static isCurrentSceneStarted = function() {
        return SceneManager._scene && SceneManager._sceneStarted;
    };

    public static isNextScene = function(sceneClass: any) {
        return (
            SceneManager._nextScene &&
            SceneManager._nextScene.constructor === sceneClass
        );
    };

    public static isPreviousScene = function(sceneClass: any) {
        return SceneManager._previousClass === sceneClass;
    };

    public static goto = function(SceneClass: new () => Scene_Base) {
        if (SceneClass) {
            SceneManager._nextScene = new SceneClass();
        }
        if (SceneManager._scene) {
            SceneManager._scene.stop();
        }
    };

    public static push = function(sceneClass: any) {
        SceneManager._stack.push(SceneManager._scene.constructor);
        SceneManager.goto(sceneClass);
    };

    public static pop = function() {
        if (SceneManager._stack.length > 0) {
            SceneManager.goto(SceneManager._stack.pop());
        } else {
            SceneManager.exit();
        }
    };

    public static exit = function() {
        SceneManager.goto(null);
        SceneManager._exiting = true;
    };

    public static clearStack = function() {
        SceneManager._stack = [];
    };

    public static stop = function() {
        SceneManager._stopped = true;
    };

    public static prepareNextScene = function(...args: any) {
        SceneManager._nextScene.prepare.apply(SceneManager._nextScene, args);
    };

    public static snap = function() {
        return Bitmap.snap(SceneManager._scene);
    };

    public static snapForBackground = function() {
        SceneManager._backgroundBitmap = SceneManager.snap();
        SceneManager._backgroundBitmap.blur();
    };

    public static backgroundBitmap = function(): Bitmap {
        return SceneManager._backgroundBitmap;
    };

    public static resume = function() {
        SceneManager._stopped = false;
        SceneManager.requestUpdate();
        if (!Utils.isMobileSafari()) {
            SceneManager._currentTime = performance.now();
            SceneManager._accumulator = 0;
        }
    };
}
