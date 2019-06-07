import Graphics from "../core/Graphics";
import SceneManager from "../managers/SceneManager";
import SoundManager from "../managers/SoundManager";
import Game_Action from "../objects/Game_Action";
import Window_ItemList from "../windows/Window_ItemList";
import Window_MenuActor from "../windows/Window_MenuActor";
import Window_SkillList from "../windows/Window_SkillList";
import Scene_Map from "./Scene_Map";
import Scene_MenuBase from "./Scene_MenuBase";

export default abstract class Scene_ItemBase extends Scene_MenuBase {
    protected _actorWindow: Window_MenuActor;
    protected _itemWindow: Window_ItemList | Window_SkillList;

    public create() {
        super.create();
    }

    public createActorWindow() {
        this._actorWindow = new Window_MenuActor();
        this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    }

    public item() {
        return this._itemWindow.item();
    }

    public user() {
        return null;
    }

    public isCursorLeft() {
        return this._itemWindow.index() % 2 === 0;
    }

    public showSubWindow(window) {
        window.x = this.isCursorLeft() ? Graphics.boxWidth - window.width : 0;
        window.show();
        window.activate();
    }

    public hideSubWindow(window) {
        window.hide();
        window.deactivate();
        this.activateItemWindow();
    }

    public onActorOk() {
        if (this.canUse()) {
            this.useItem();
        } else {
            SoundManager.playBuzzer();
        }
    }

    public onActorCancel() {
        this.hideSubWindow(this._actorWindow);
    }

    public determineItem() {
        const action = new Game_Action(this.user());
        const item = this.item();
        action.setItemObject(item);
        if (action.isForFriend()) {
            this.showSubWindow(this._actorWindow);
            this._actorWindow.selectForItem(this.item());
        } else {
            this.useItem();
            this.activateItemWindow();
        }
    }

    public useItem() {
        this.playSeForItem();
        this.user().useItem(this.item());
        this.applyItem();
        this.checkCommonEvent();
        this.checkGameover();
        this._actorWindow.refresh();
    }

    public playSeForItem() {
        SoundManager.playUseItem();
    }

    public activateItemWindow() {
        this._itemWindow.refresh();
        this._itemWindow.activate();
    }

    public itemTargetActors() {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        if (!action.isForFriend()) {
            return [];
        } else if (action.isForAll()) {
            return $gameParty.members();
        } else {
            return [$gameParty.members()[this._actorWindow.index()]];
        }
    }

    public canUse() {
        return this.user().canUse(this.item()) && this.isItemEffectsValid();
    }

    public isItemEffectsValid() {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        return this.itemTargetActors().some(function(target) {
            return action.testApply(target);
        }, this);
    }

    public applyItem() {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        this.itemTargetActors().forEach(function(target) {
            for (let i = 0; i < action.numRepeats(); i++) {
                action.apply(target);
            }
        }, this);
        action.applyGlobal();
    }

    public checkCommonEvent() {
        if ($gameTemp.isCommonEventReserved()) {
            SceneManager.goto(Scene_Map);
        }
    }
}
