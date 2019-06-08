import DataManager from "../managers/DataManager";
import Game_Action from "../objects/Game_Action";
import Window_MenuStatus from "./Window_MenuStatus";

// -----------------------------------------------------------------------------
// Window_MenuActor
//
// The window for selecting a target actor on the item and skill screens.

export default class Window_MenuActor extends Window_MenuStatus {
    public constructor() {
        super(0, 0);
        this.hide();
    }

    public processOk() {
        if (!this.cursorAll()) {
            $gameParty.setTargetActor($gameParty.members()[this.index()]);
        }
        this.callOkHandler();
    }

    public selectLast() {
        this.select($gameParty.targetActor().index() || 0);
    }

    public selectForItem(item) {
        const actor = $gameParty.menuActor();
        const action = new Game_Action(actor);
        action.setItemObject(item);
        this.setCursorFixed(false);
        this.setCursorAll(false);
        if (action.isForUser()) {
            if (DataManager.isSkill(item)) {
                this.setCursorFixed(true);
                this.select(actor.index());
            } else {
                this.selectLast();
            }
        } else if (action.isForAll()) {
            this.setCursorAll(true);
            this.select(0);
        } else {
            this.selectLast();
        }
    }
}
