import { Bitmap } from "../core/Bitmap";
import { Graphics } from "../core/Graphics";
import { Input } from "../core/Input";
import { TouchInput } from "../core/TouchInput";
import { Utils } from "../core/Utils";
import { WebAudio } from "../core/WebAudio";
import { AudioManager } from "./AudioManager";
import { ImageManager } from "./ImageManager";
import { PluginManager } from "./PluginManager";
import { Scene_Base } from "../scenes/Scene_Base";
import { ConfigManager } from "./ConfigManager";

declare const nw: any;

export abstract class SceneManager {
    private static _scene: Scene_Base = null;
    private static _nextScene: Scene_Base = null;
    private static _stack = [];

    private static _stopped = false;
    private static _sceneStarted = false;
    private static _exiting = false;
    private static _previousClass = null;
    private static _backgroundBitmap: Bitmap = null;
    private static _screenWidth =
        ConfigManager.graphicsOptions.screenResolution.list[0][0] + 0;
    private static _screenHeight =
        ConfigManager.graphicsOptions.screenResolution.list[0][1] + 0;
    private static _boxWidth =
        ConfigManager.graphicsOptions.screenResolution.list[0][0] + 0;
    private static _boxHeight =
        ConfigManager.graphicsOptions.screenResolution.list[0][1] + 0;
    private static _deltaTime = 1.0 / 60.0;
    private static _accumulator = 0.0;
    private static _currentTime = performance.now();

    public static get scene(): Scene_Base {
        return SceneManager._scene;
    }
    public static set scene(value: Scene_Base) {
        SceneManager._scene = value;
    }

    public static get stack() {
        return SceneManager._stack;
    }
    public static set stack(value) {
        SceneManager._stack = value;
    }

    public static run(sceneClass: any) {
        try {
            SceneManager.initialize();
            SceneManager.goto(sceneClass);
            SceneManager.requestUpdate();
        } catch (e) {
            SceneManager.catchException(e);
        }
        if (Utils.isNwjs()) {
            SceneManager.updateResolution();
        }
    }

    public static updateResolution() {
        const resizeWidth = this._screenWidth - window.innerWidth;
        const resizeHeight = this._screenHeight - window.innerHeight;
        window.resizeBy(resizeWidth, resizeHeight);
        window.moveBy((-1 * resizeWidth) / 2, (-1 * resizeHeight) / 2);
    }

    public static changeGraphicResolution(width: number, height: number) {
        SceneManager._screenWidth = width;
        SceneManager._screenHeight = height;
        SceneManager._boxWidth = width;
        SceneManager._boxHeight = height;
        if (ConfigManager.graphicsOptions.screenResolution.scale) {
            Graphics.width =
                ConfigManager.graphicsOptions.screenResolution.list[0][0] + 0;
            Graphics.height =
                ConfigManager.graphicsOptions.screenResolution.list[0][1] + 0;
            Graphics.boxWidth =
                ConfigManager.graphicsOptions.screenResolution.list[0][0] + 0;
            Graphics.boxHeight =
                ConfigManager.graphicsOptions.screenResolution.list[0][1] + 0;
        } else {
            Graphics.width = width;
            Graphics.height = height;
            Graphics.boxWidth = width;
            Graphics.boxHeight = height;
        }
        SceneManager.updateResolution();
    }

    public static initialize() {
        SceneManager.initGraphics();
        SceneManager.checkFileAccess();
        SceneManager.initAudio();
        SceneManager.initInput();
        SceneManager.initNwjs();
        SceneManager.checkPluginErrors();
        SceneManager.setupErrorHandlers();
    }

    public static initGraphics() {
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
        window.addEventListener(
            "error",
            SceneManager.onError.bind(SceneManager)
        );
        document.addEventListener(
            "keydown",
            SceneManager.onKeyDown.bind(SceneManager)
        );
    }

    public static requestUpdate() {
        if (!SceneManager._stopped) {
            requestAnimationFrame(SceneManager.update.bind(SceneManager));
        }
    }

    public static update() {
        try {
            if (Utils.isMobileSafari()) {
                SceneManager.updateInputData();
            }
            SceneManager.updateManagers();
            SceneManager.updateMain();
        } catch (e) {
            SceneManager.catchException(e);
        }
    }

    public static terminate() {
        window.close();
    }

    public static onError(e: { message: string; filename: any; lineno: any }) {
        console.error(e.message);
        console.error(e.filename, e.lineno);
        try {
            SceneManager.stop();
            Graphics.printError("Error", e.message);
            AudioManager.stopAll();
        } catch (e2) {}
    }

    public static onKeyDown(event: {
        ctrlKey: any;
        altKey: any;
        keyCode: any;
    }) {
        if (!event.ctrlKey && !event.altKey) {
            switch (event.keyCode) {
                case 116: // F5
                    if (Utils.isNwjs()) {
                        location.reload();
                        if (Utils.isOptionValid("test")) {
                            const win = nw.Window.get();
                            win.closeDevTools();
                        }
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

    public static catchException(e: Error) {
        if (e instanceof Error) {
            Graphics.printFullError(e.name, e.message, e.stack);
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
        AudioManager.clearUniqueCheckSe();
    }

    public static updateMain() {
        if (ConfigManager.vSync) {
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

            SceneManager.renderScene();
            SceneManager.requestUpdate();
        } else {
            this.updateInputData();
            this.changeScene();
            this.updateScene();
            this.renderScene();
            this.requestUpdate();
        }
    }

    public static updateManagers() {
        ImageManager.update();
    }

    public static changeScene() {
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
    }

    public static updateScene() {
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
    }

    public static renderScene() {
        if (SceneManager.isCurrentSceneStarted()) {
            Graphics.render(SceneManager._scene);
        } else if (SceneManager._scene) {
            SceneManager.onSceneLoading();
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
        return SceneManager._exiting || !!SceneManager._nextScene;
    }

    public static isCurrentSceneBusy() {
        return SceneManager._scene && SceneManager._scene.isBusy();
    }

    public static isCurrentSceneStarted() {
        return SceneManager._scene && SceneManager._sceneStarted;
    }

    public static isNextScene(sceneClass: any) {
        return (
            SceneManager._nextScene &&
            SceneManager._nextScene.constructor === sceneClass
        );
    }

    public static isPreviousScene(sceneClass: any) {
        return SceneManager._previousClass === sceneClass;
    }

    public static goto(SceneClass: new () => Scene_Base) {
        if (SceneClass) {
            SceneManager._nextScene = new SceneClass();
        }
        if (SceneManager._scene) {
            SceneManager._scene.stop();
        }
    }

    public static push(sceneClass: any) {
        SceneManager._stack.push(SceneManager._scene.constructor);
        SceneManager.goto(sceneClass);
    }

    public static pop() {
        if (SceneManager._stack.length > 0) {
            SceneManager.goto(SceneManager._stack.pop());
        } else {
            SceneManager.exit();
        }
    }

    public static exit() {
        SceneManager.goto(null);
        SceneManager._exiting = true;
    }

    public static clearStack() {
        SceneManager._stack = [];
    }

    public static stop() {
        SceneManager._stopped = true;
    }

    public static prepareNextScene(...args: any) {
        SceneManager._nextScene.prepare.apply(SceneManager._nextScene, args);
    }

    public static snap() {
        return Bitmap.snap(SceneManager._scene);
    }

    public static snapForBackground() {
        SceneManager._backgroundBitmap = SceneManager.snap();
        SceneManager._backgroundBitmap.blur();
    }

    public static backgroundBitmap(): Bitmap {
        return SceneManager._backgroundBitmap;
    }

    public static resume() {
        SceneManager._stopped = false;
        SceneManager.requestUpdate();
        if (!Utils.isMobileSafari()) {
            SceneManager._currentTime = performance.now();
            SceneManager._accumulator = 0;
        }
    }
}
