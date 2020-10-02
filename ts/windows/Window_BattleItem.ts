import { Window_ItemList } from "./Window_ItemList";
import { Game_Actor } from "../objects/Game_Actor";
import { Item } from "../interfaces/Item";

// -----------------------------------------------------------------------------
// Window_BattleItem
//
// The window for selecting an item to use on the battle screen.

export class Window_BattleItem extends Window_ItemList {
    private _actor: Game_Actor;

    public constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.hide();
    }

    public includes(item: Item) {
        return $gameParty.canUse(item);
    }

    public maxCols() {
        return 1;
    }

    public show() {
        const width = 300;
        const height = 300;
        const sprite = $gameActors.actor(this._actor.actorId()).battler();
        const scale = $gameScreen.zoomScale();
        this.move(sprite.x * scale - width, sprite.y * scale, width, height);
        this.selectLast();
        this.showHelpWindow();
        super.show();
    }

    public hide() {
        this.hideHelpWindow();
        super.hide();
    }

    public set actor(actor: Game_Actor) {
        this._actor = actor;
    }
}
