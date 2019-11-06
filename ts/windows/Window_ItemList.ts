import { Item } from "../interfaces/Item";
import { DataManager } from "../managers/DataManager";
import { Window_Selectable } from "./Window_Selectable";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

// -----------------------------------------------------------------------------
// Window_ItemList
//
// The window for selecting an item on the item screen.

export class Window_ItemList extends Window_Selectable {
    public _category: string;
    public _data: Item[];

    public constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this._category = "none";
        this._data = [];
    }

    public setCategory(category) {
        if (this._category !== category) {
            this._category = category;
            this.refresh();
            this.resetScroll();
        }
    }

    public maxCols() {
        return 2;
    }

    public spacing() {
        return 48;
    }

    public maxItems() {
        return this._data ? this._data.length : 1;
    }

    public item() {
        const index = this.index();
        return this._data && index >= 0 ? this._data[index] : null;
    }

    public isCurrentItemEnabled() {
        return this.isEnabled(this.item());
    }

    public includes(item) {
        switch (this._category) {
            case "item":
                return DataManager.isItem(item) && item.itypeId === 1;
            case "weapon":
                return DataManager.isWeapon(item);
            case "armor":
                return DataManager.isArmor(item);
            case "keyItem":
                return DataManager.isItem(item) && item.itypeId === 2;
            default:
                return false;
        }
    }

    public needsNumber() {
        return true;
    }

    public isEnabled(item) {
        return $gameParty.canUse(item);
    }

    public makeItemList() {
        this._data = $gameParty.allItems().filter(function(item) {
            return this.includes(item);
        }, this);
        if (this.includes(null)) {
            this._data.push(null);
        }
    }

    public selectLast() {
        const index = this._data.indexOf($gameParty.lastItem());
        this.select(index >= 0 ? index : 0);
    }

    public async drawItem(index) {
        const item = this._data[index];
        if (item) {
            const numberWidth = this.numberWidth();
            const rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    }

    public numberWidth() {
        return this.textWidth("\u00d70,000");
    }

    public drawItemNumber(item, x, y, width) {
        if (!this.needsNumber()) return;
        let numItems = Yanfly.Util.toGroup($gameParty.numItems(item));
        this.contents.fontSize = Yanfly.Param.ItemQuantitySize;
        this.drawText("\u00d7" + numItems, x, y, width, undefined, "right");
        this.resetFontSettings();
    }

    public updateHelp() {
        this.setHelpWindowItem(this.item());
    }

    public async refresh() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    }
}
