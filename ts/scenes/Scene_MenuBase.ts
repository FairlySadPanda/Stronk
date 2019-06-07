import Sprite from "../core/Sprite";
import SceneManager from "../managers/SceneManager";
import Game_Actor from "../objects/Game_Actor";
import Window_Help from "../windows/Window_Help";
import Scene_Base from "./Scene_Base";

export default abstract class Scene_MenuBase extends Scene_Base {
    protected _helpWindow: Window_Help;
    protected _actor: Game_Actor;
    protected _backgroundSprite: Sprite;

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
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this.addChild(this._backgroundSprite);
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
}
