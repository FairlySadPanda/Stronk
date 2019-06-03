import Graphics from "../core/Graphics";
import ConfigManager from "../managers/ConfigManager";

import DataManager from "../managers/DataManager";
import ImageManager from "../managers/ImageManager";
import SceneManager from "../managers/SceneManager";
import SoundManager from "../managers/SoundManager";
import Window_TitleCommand from "../windows/Window_TitleCommand";
import Scene_Base from "./Scene_Base";
import Scene_Battle from "./Scene_Battle";
import Scene_Map from "./Scene_Map";
import Scene_Title from "./Scene_Title";

export default class Scene_Boot extends Scene_Base {
    public static loadSystemImages: () => void;
    public _startDate: number;
    public loadSystemWindowImage: () => void;
    public isGameFontLoaded: () => boolean;
    public updateDocumentTitle: () => void;
    public checkPlayerLocation: () => void;
    public constructor() {
        super();
        this._startDate = Date.now();
    }
}

Scene_Boot.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    DataManager.loadDatabase();
    ConfigManager.load();
    this.loadSystemWindowImage();
};

Scene_Boot.prototype.loadSystemWindowImage = function () {
    ImageManager.reserveSystem("Window");
};

Scene_Boot.loadSystemImages = function () {
    ImageManager.reserveSystem("IconSet");
    ImageManager.reserveSystem("Balloon");
    ImageManager.reserveSystem("Shadow1");
    ImageManager.reserveSystem("Shadow2");
    ImageManager.reserveSystem("Damage");
    ImageManager.reserveSystem("States");
    ImageManager.reserveSystem("Weapons1");
    ImageManager.reserveSystem("Weapons2");
    ImageManager.reserveSystem("Weapons3");
    ImageManager.reserveSystem("ButtonSet");
};

Scene_Boot.prototype.isReady = function () {
    if (Scene_Base.prototype.isReady.call(this)) {
        return DataManager.isDatabaseLoaded() && this.isGameFontLoaded();
    } else {
        return false;
    }
};

Scene_Boot.prototype.isGameFontLoaded = function () {
    if (Graphics.isFontLoaded("GameFont")) {
        return true;
    } else if (!Graphics.canUseCssFontLoading()){
        const elapsed = Date.now() - this._startDate;
        if (elapsed >= 60000) {
            throw new Error("Failed to load GameFont");
        }
    }
};

Scene_Boot.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Scene_Map);
    } else {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Title); //TODO: This should be Scene_Map when we're doing test stuff
        Window_TitleCommand.initCommandPosition();
    }
    this.updateDocumentTitle();
};

Scene_Boot.prototype.updateDocumentTitle = function () {
    document.title = $dataSystem.gameTitle;
};

Scene_Boot.prototype.checkPlayerLocation = function () {
    if ($dataSystem.startMapId === 0) {
        throw new Error("Player's starting position is not set");
    }
};
