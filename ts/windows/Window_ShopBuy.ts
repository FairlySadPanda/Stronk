import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_ShopBuy
//
// The window for selecting an item to buy on the shop screen.

export default class Window_ShopBuy extends Window_Selectable {
    private _shopGoods: any;
    private _money: number;
    private _data: any;
    private _price: any;
    private _statusWindow: any;

    public constructor(x, y, height, shopGoods) {
        super(x, y, Window_ShopBuy.prototype.windowWidth(), height);
        this._shopGoods = shopGoods;
        this._money = 0;
        this.refresh();
        this.select(0);
    }

    public windowWidth() {
        return 456;
    }

    public maxItems() {
        return this._data ? this._data.length : 1;
    }

    public item() {
        return this._data[this.index()];
    }

    public setMoney(money) {
        this._money = money;
        this.refresh();
    }

    public isCurrentItemEnabled() {
        return this.isEnabled(this._data[this.index()]);
    }

    public price(item) {
        return this._price[this._data.indexOf(item)] || 0;
    }

    public isEnabled(item) {
        return (
            item &&
            this.price(item) <= this._money &&
            !$gameParty.hasMaxItems(item)
        );
    }

    public async refresh() {
        this.makeItemList();
        this.createContents();
        await this.drawAllItems();
    }

    public makeItemList() {
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
    }

    public async drawItem(index) {
        const item = this._data[index];
        const rect = this.itemRect(index);
        const priceWidth = 96;
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        await this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
        await this.drawText(
            this.price(item),
            rect.x + rect.width - priceWidth,
            rect.y,
            priceWidth,
            undefined,
            "right"
        );
        this.changePaintOpacity(true);
    }

    public setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    public updateHelp() {
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setItem(this.item());
        }
    }
}
