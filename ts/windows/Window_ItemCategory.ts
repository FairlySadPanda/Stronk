import Graphics from "../core/Graphics";
import TextManager from "../managers/TextManager";
import Window_HorzCommand from "./Window_HorzCommand";

// -----------------------------------------------------------------------------
// Window_ItemCategory
//
// The window for selecting a category of items on the item and shop screens.

export default class Window_ItemCategory extends Window_HorzCommand {
    public setItemWindow: (itemWindow: any) => void;
    public constructor() {
        super(0, 0);
    }
}

Window_ItemCategory.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_ItemCategory.prototype.maxCols = function() {
    return 4;
};

Window_ItemCategory.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setCategory(this.currentSymbol());
    }
};

Window_ItemCategory.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item, "item");
    this.addCommand(TextManager.weapon, "weapon");
    this.addCommand(TextManager.armor, "armor");
    this.addCommand(TextManager.keyItem, "keyItem");
};

Window_ItemCategory.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
};
