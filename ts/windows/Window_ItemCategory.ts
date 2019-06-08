import Graphics from "../core/Graphics";
import TextManager from "../managers/TextManager";
import Window_HorzCommand from "./Window_HorzCommand";
import Window_ItemList from "./Window_ItemList";

// -----------------------------------------------------------------------------
// Window_ItemCategory
//
// The window for selecting a category of items on the item and shop screens.

export default class Window_ItemCategory extends Window_HorzCommand {
    private _itemWindow: Window_ItemList;

    public constructor() {
        super(0, 0);
    }

    public windowWidth() {
        return Graphics.boxWidth;
    }

    public maxCols() {
        return 4;
    }

    public update() {
        super.update();
        if (this._itemWindow) {
            this._itemWindow.setCategory(this.currentSymbol());
        }
    }

    public makeCommandList() {
        this.addCommand(TextManager.item, "item");
        this.addCommand(TextManager.weapon, "weapon");
        this.addCommand(TextManager.armor, "armor");
        this.addCommand(TextManager.keyItem, "keyItem");
    }

    public setItemWindow(itemWindow) {
        this._itemWindow = itemWindow;
    }
}
