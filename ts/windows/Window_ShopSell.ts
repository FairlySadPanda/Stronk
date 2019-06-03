import Window_ItemList from "./Window_ItemList";

//-----------------------------------------------------------------------------
// Window_ShopSell
//
// The window for selecting an item to sell on the shop screen.

export default class Window_ShopSell extends Window_ItemList {
    public constructor(x, y, width, height) {
        super(x, y, width, height);
    }
}

Window_ShopSell.prototype.isEnabled = function (item) {
    return item && item.price > 0;
};
