import { Bitmap } from "../core/Bitmap";
import { Graphics } from "../core/Graphics";
import { Sprite } from "../core/Sprite";
import { AudioManager } from "../managers/AudioManager";
import { DataManager } from "../managers/DataManager";
import { ImageManager } from "../managers/ImageManager";
import { SceneManager } from "../managers/SceneManager";
import { Window_TitleCommand } from "../windows/Window_TitleCommand";
import { Scene_Base } from "./Scene_Base";
import { Scene_Load } from "./Scene_Load";
import { Scene_Map } from "./Scene_Map";
import { Scene_MushOptions } from "./Scene_MushOptions";
import { ConfigManager } from "../managers/ConfigManager";

export class Scene_Title extends Scene_Base {
    private _commandWindow: any;
    private _gameTitleSprite: Sprite;
    private _backSprite1: Sprite;
    private _backSprite2: Sprite;

    public create() {
        super.create();
        this.createBackground();
        this.createForeground();
        this.createWindowLayer();
        this.createCommandWindow();
    }

    public start() {
        super.start();
        SceneManager.clearStack();
        this.centerSprite(this._backSprite1);
        this.centerSprite(this._backSprite2);
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
    }

    public update() {
        if (!this.isBusy()) {
            this._commandWindow.open();
        }
        super.update();
    }

    public isBusy() {
        return this._commandWindow.isClosing() || super.isBusy();
    }

    public terminate() {
        super.terminate();
        SceneManager.snapForBackground();
    }

    public createBackground() {
        this._backSprite1 = new Sprite(
            ImageManager.loadTitle1($dataSystem.title1Name)
        );
        this._backSprite2 = new Sprite(
            ImageManager.loadTitle2($dataSystem.title2Name)
        );
        this.addChild(this._backSprite1);
        this.addChild(this._backSprite2);
    }

    public createForeground() {
        this._gameTitleSprite = new Sprite(
            new Bitmap(Graphics.width, Graphics.height)
        );
        this.addChild(this._gameTitleSprite);
        if ($dataSystem.optDrawTitle) {
            this.drawGameTitle();
        }
    }

    public drawGameTitle() {
        const x = 20;
        const y = Graphics.height / 4;
        const maxWidth = Graphics.width - x * 2;
        const text = $dataSystem.gameTitle;
        this._gameTitleSprite.bitmap.outlineColor = "black";
        this._gameTitleSprite.bitmap.outlineWidth = 8;
        this._gameTitleSprite.bitmap.fontSize = 72;
        this._gameTitleSprite.bitmap.drawText(
            text,
            x,
            y,
            maxWidth,
            48,
            "center"
        );
    }

    public centerSprite(sprite) {
        if (
            ConfigManager.graphicsOptions.screenResolution.list[0] !==
                [816, 624] &&
            ConfigManager.graphicsOptions.screenResolution.reposition === true
        ) {
            const xCorrection = Graphics.boxWidth / sprite.width;
            const yCorrection = Graphics.boxHeight / sprite.height;
            sprite.scale.x = xCorrection;
            sprite.scale.y = yCorrection;
        } else {
            sprite.x = Graphics.width / 2;
            sprite.y = Graphics.height / 2;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
        }
    }

    public createCommandWindow() {
        this._commandWindow = new Window_TitleCommand();
        this._commandWindow.setHandler(
            "newGame",
            this.commandNewGame.bind(this)
        );
        this._commandWindow.setHandler(
            "continue",
            this.commandContinue.bind(this)
        );
        this._commandWindow.setHandler(
            "options",
            this.commandOptions.bind(this)
        );
        this.addWindow(this._commandWindow);
    }

    public commandNewGame() {
        DataManager.setupNewGame();
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    }

    public commandContinue() {
        this._commandWindow.close();
        SceneManager.push(Scene_Load);
    }

    public commandOptions() {
        this._commandWindow.close();
        SceneManager.push(Scene_MushOptions);
    }

    public playTitleMusic() {
        AudioManager.playBgm($dataSystem.titleBgm);
        AudioManager.stopBgs();
        AudioManager.stopMe();
    }
}
