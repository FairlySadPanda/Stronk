import Sprite from "../core/Sprite";

import SceneManager from "../managers/SceneManager";
import Window_Help from "../windows/Window_Help";
import Scene_Base from "./Scene_Base";

export default class Scene_MenuBase extends Scene_Base {
    protected _helpWindow: Window_Help;
    private _actor: any;
    private _backgroundSprite: Sprite;

    public constructor() {
        super();
    }

    public create() {
        Scene_Base.prototype.create.call(this);
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

    public onActorChange() {
    }

}
