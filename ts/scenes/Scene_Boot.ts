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
    public static loadSystemImages() {
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
    }

    public _startDate: number;
    public constructor() {
        super();
        this._startDate = Date.now();
    }

    public create() {
        super.create();
        DataManager.loadDatabase();
        ConfigManager.load();
        this.loadSystemWindowImage();
    }

    public loadSystemWindowImage() {
        ImageManager.reserveSystem("Window");
    }

    public isReady() {
        if (super.isReady.call(this)) {
            return DataManager.isDatabaseLoaded() && this.isGameFontLoaded();
        } else {
            return false;
        }
    }

    public isGameFontLoaded() {
        if (Graphics.isFontLoaded("GameFont")) {
            return true;
        } else if (!Graphics.canUseCssFontLoading()) {
            const elapsed = Date.now() - this._startDate;
            if (elapsed >= 60000) {
                throw new Error("Failed to load GameFont");
            }
        }
    }

    public start() {
        super.start();
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
            SceneManager.goto(Scene_Title); // TODO: This should be Scene_Map when we're doing test stuff
            Window_TitleCommand.initCommandPosition();
        }
        this.updateDocumentTitle();
    }

    public updateDocumentTitle() {
        document.title = $dataSystem.gameTitle;
    }

    public checkPlayerLocation() {
        if ($dataSystem.startMapId === 0) {
            throw new Error("Player's starting position is not set");
        }
    }
}
