import Sprite from "../core/Sprite";
import SceneManager from "../managers/SceneManager";
import Game_Actor from "../objects/Game_Actor";
import Window_Help from "../windows/Window_Help";
import Scene_Base from "./Scene_Base";
import ConfigManager from "../managers/ConfigManager";
import ImageManager from "../managers/ImageManager";
import Graphics from "../core/Graphics";

export default abstract class Scene_MenuBase extends Scene_Base {
    protected _helpWindow: Window_Help;
    protected _actor: Game_Actor;
    protected _backgroundSprite: Sprite;
    public refreshStretch: boolean;

    public create() {
        super.create();
        this.createBackground();
        this.updateActor();
        this.createWindowLayer();
    }

    public actor() {
        return this._actor;
    }

    public updateActor() {
        this._actor = $gameParty.menuActor();
    }

    public createBackground() {
        const list = ConfigManager.cosmeticsOptions.menuBack.list;
        if (list !== undefined) {
            const value = ConfigManager["_menuBack"];
            const file = list[value];
            if (file === "default" || file === "Default") {
                this._backgroundSprite = new Sprite();
                this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
                this.addChild(this._backgroundSprite);
                this.refreshStretch = true;
            } else {
                this._backgroundSprite = new Sprite();
                this._backgroundSprite.bitmap = ImageManager.loadTitle1(
                    file,
                    0
                );
                this.addChild(this._backgroundSprite);
                this.refreshStretch = true;
            }
        } else {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this.addChild(this._backgroundSprite);
            this.refreshStretch = true;
        }
    }

    public setBackgroundOpacity(opacity) {
        this._backgroundSprite.opacity = opacity;
    }

    public createHelpWindow() {
        this._helpWindow = new Window_Help();
        this.addWindow(this._helpWindow);
    }

    public nextActor() {
        $gameParty.makeMenuActorNext();
        this.updateActor();
        this.onActorChange();
    }

    public previousActor() {
        $gameParty.makeMenuActorPrevious();
        this.updateActor();
        this.onActorChange();
    }

    public onActorChange() {}

    public refreshMenuBackground() {
        const value = ConfigManager["_menuBack"];
        const list = ConfigManager.cosmeticsOptions.menuBack.list;

        if (Array.isArray(list) && list[value].toLowerCase() !== "default") {
            const filename = list[value];
            this._backgroundSprite.bitmap = ImageManager.loadTitle1(
                filename,
                0
            );
            this.refreshStretch = true;
        } else {
            const scale =
                ConfigManager.currentResolution.heightPx /
                this._backgroundSprite.height;

            const moveByX =
                (ConfigManager.currentResolution.widthPx -
                    scale * this._backgroundSprite.width) /
                2;

            this._backgroundSprite.move(moveByX, 0);

            this._backgroundSprite.scale.x = scale;
            this._backgroundSprite.scale.y = scale;

            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this.refreshStretch = true;
        }
    }

    public stretchMenuBackground() {
        if (ConfigManager.cosmeticsOptions.menuBack.stretch === true) {
            const backWidth = this._backgroundSprite.width;
            const backHeight = this._backgroundSprite.height;
            const scaleX = Graphics.boxWidth / backWidth;
            const scaleY = Graphics.boxHeight / backHeight;
            if (backWidth && backHeight) {
                this._backgroundSprite.scale.x = scaleX;
                this._backgroundSprite.scale.y = scaleY;
                this.refreshStretch = false;
            }
        } else {
            this.refreshStretch = false;
        }
    }

    public update() {
        super.update();
        if (this.refreshStretch) {
            this.stretchMenuBackground();
        }
    }
}
