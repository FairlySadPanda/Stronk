import Window_ItemList from "./Window_ItemList";

// -----------------------------------------------------------------------------
// Window_BattleItem
//
// The window for selecting an item to use on the battle screen.

export default class Window_BattleItem extends Window_ItemList {
    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this.hide();
    }

    public includes(item) {
        return $gameParty.canUse(item);
    }

    public show() {
        this.selectLast();
        this.showHelpWindow();
        super.show();
    }

    public hide() {
        this.hideHelpWindow();
        super.hide();
    }
}
