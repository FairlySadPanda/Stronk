import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_ShopBuy
//
// The window for selecting an item to buy on the shop screen.

export default class Window_ShopBuy extends Window_Selectable {
    public _shopGoods: any;
    public _money: number;
    public item: () => any;
    public setMoney: (money: any) => void;
    public price: (item: any) => any;
    public isEnabled: (item: any) => boolean;
    public makeItemList: () => void;
    public setStatusWindow: (statusWindow: any) => void;
    public constructor(x, y, height, shopGoods) {
        super(x, y, Window_ShopBuy.prototype.windowWidth(), height);
        this._shopGoods = shopGoods;
        this._money = 0;
        this.refresh();
        this.select(0);
    }
    public windowWidth(): any {
        throw new Error("Method not implemented.");
    }
}

Window_ShopBuy.prototype.windowWidth = function() {
    return 456;
};

Window_ShopBuy.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_ShopBuy.prototype.item = function() {
    return this._data[this.index()];
};

Window_ShopBuy.prototype.setMoney = function(money) {
    this._money = money;
    this.refresh();
};

Window_ShopBuy.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._data[this.index()]);
};

Window_ShopBuy.prototype.price = function(item) {
    return this._price[this._data.indexOf(item)] || 0;
};

Window_ShopBuy.prototype.isEnabled = function(item) {
    return (
        item && this.price(item) <= this._money && !$gameParty.hasMaxItems(item)
    );
};

Window_ShopBuy.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};

Window_ShopBuy.prototype.makeItemList = function() {
    this._data = [];
    this._price = [];
    this._shopGoods.forEach(function(goods) {
        let item = null;
        switch (goods[0]) {
            case 0:
                item = $dataItems[goods[1]];
                break;
            case 1:
                item = $dataWeapons[goods[1]];
                break;
            case 2:
                item = $dataArmors[goods[1]];
                break;
        }
        if (item) {
            this._data.push(item);
            this._price.push(goods[2] === 0 ? item.price : goods[3]);
        }
    }, this);
};

Window_ShopBuy.prototype.drawItem = function(index) {
    const item = this._data[index];
    const rect = this.itemRect(index);
    const priceWidth = 96;
    rect.width -= this.textPadding();
    this.changePaintOpacity(this.isEnabled(item));
    this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
    this.drawText(
        this.price(item),
        rect.x + rect.width - priceWidth,
        rect.y,
        priceWidth,
        "right"
    );
    this.changePaintOpacity(true);
};

Window_ShopBuy.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_ShopBuy.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setItem(this.item());
    }
};
