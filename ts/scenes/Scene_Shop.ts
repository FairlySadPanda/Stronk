import { Graphics } from "../core/Graphics";
import { SoundManager } from "../managers/SoundManager";
import { Window_Base } from "../windows/Window_Base";
import { Window_Gold } from "../windows/Window_Gold";
import { Window_ItemCategory } from "../windows/Window_ItemCategory";
import { Window_ShopBuy } from "../windows/Window_ShopBuy";
import { Window_ShopCommand } from "../windows/Window_ShopCommand";
import { Window_ShopNumber } from "../windows/Window_ShopNumber";
import { Window_ShopSell } from "../windows/Window_ShopSell";
import { Window_ShopStatus } from "../windows/Window_ShopStatus";
import { Scene_MenuBase } from "./Scene_MenuBase";

export class Scene_Shop extends Scene_MenuBase {
    private _goods: any;
    private _purchaseOnly: any;
    private _item: any;
    private _goldWindow: Window_Gold;
    private _commandWindow: Window_ShopCommand;
    private _dummyWindow: Window_Base;
    private _numberWindow: Window_ShopNumber;
    private _statusWindow: Window_ShopStatus;
    private _buyWindow: Window_ShopBuy;
    private _categoryWindow: Window_ItemCategory;
    private _sellWindow: Window_ShopSell;

    public prepare(goods, purchaseOnly) {
        this._goods = goods;
        this._purchaseOnly = purchaseOnly;
        this._item = null;
    }

    public create() {
        super.create();
        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createDummyWindow();
        this.createNumberWindow();
        this.createStatusWindow();
        this.createBuyWindow();
        this.createCategoryWindow();
        this.createSellWindow();
    }

    public createGoldWindow() {
        this._goldWindow = new Window_Gold(0, this._helpWindow.height);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this.addWindow(this._goldWindow);
    }

    public createCommandWindow() {
        this._commandWindow = new Window_ShopCommand(
            this._goldWindow.x,
            this._purchaseOnly
        );
        this._commandWindow.y = this._helpWindow.height;
        this._commandWindow.setHandler("buy", this.commandBuy.bind(this));
        this._commandWindow.setHandler("sell", this.commandSell.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }

    public createDummyWindow() {
        const wy = this._commandWindow.y + this._commandWindow.height;
        const wh = Graphics.boxHeight - wy;
        this._dummyWindow = new Window_Base(0, wy, Graphics.boxWidth, wh);
        this.addWindow(this._dummyWindow);
    }

    public createNumberWindow() {
        const wy = this._dummyWindow.y;
        const wh = this._dummyWindow.height;
        this._numberWindow = new Window_ShopNumber(0, wy, wh);
        this._numberWindow.hide();
        this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
        this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    }

    public createStatusWindow() {
        const wx = this._numberWindow.width;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth - wx;
        const wh = this._dummyWindow.height;
        this._statusWindow = new Window_ShopStatus(wx, wy, ww, wh);
        this._statusWindow.hide();
        this.addWindow(this._statusWindow);
    }

    public createBuyWindow() {
        const wy = this._dummyWindow.y;
        const wh = this._dummyWindow.height;
        this._buyWindow = new Window_ShopBuy(0, wy, wh, this._goods);
        this._buyWindow.setHelpWindow(this._helpWindow);
        this._buyWindow.setStatusWindow(this._statusWindow);
        this._buyWindow.hide();
        this._buyWindow.setHandler("ok", this.onBuyOk.bind(this));
        this._buyWindow.setHandler("cancel", this.onBuyCancel.bind(this));
        this.addWindow(this._buyWindow);
    }

    public createCategoryWindow() {
        this._categoryWindow = new Window_ItemCategory();
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.y = this._dummyWindow.y;
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler(
            "cancel",
            this.onCategoryCancel.bind(this)
        );
        this.addWindow(this._categoryWindow);
    }

    public createSellWindow() {
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const wh = Graphics.boxHeight - wy;
        this._sellWindow = new Window_ShopSell(0, wy, Graphics.boxWidth, wh);
        this._sellWindow.setHelpWindow(this._helpWindow);
        this._sellWindow.hide();
        this._sellWindow.setHandler("ok", this.onSellOk.bind(this));
        this._sellWindow.setHandler("cancel", this.onSellCancel.bind(this));
        this._categoryWindow.setItemWindow(this._sellWindow);
        this.addWindow(this._sellWindow);
    }

    public activateBuyWindow() {
        this._buyWindow.setMoney(this.money());
        this._buyWindow.show();
        this._buyWindow.activate();
        this._statusWindow.show();
    }

    public activateSellWindow() {
        this._categoryWindow.show();
        this._sellWindow.refresh();
        this._sellWindow.show();
        this._sellWindow.activate();
        this._statusWindow.hide();
    }

    public commandBuy() {
        this._dummyWindow.hide();
        this.activateBuyWindow();
    }

    public commandSell() {
        this._dummyWindow.hide();
        this._categoryWindow.show();
        this._categoryWindow.activate();
        this._sellWindow.show();
        this._sellWindow.deselect();
        this._sellWindow.refresh();
    }

    public onBuyOk() {
        this._item = this._buyWindow.item();
        this._buyWindow.hide();
        this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
    }

    public onBuyCancel() {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._buyWindow.hide();
        this._statusWindow.hide();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
    }

    public onCategoryOk() {
        this.activateSellWindow();
        this._sellWindow.select(0);
    }

    public onCategoryCancel() {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._categoryWindow.hide();
        this._sellWindow.hide();
    }

    public onSellOk() {
        this._item = this._sellWindow.item();
        this._categoryWindow.hide();
        this._sellWindow.hide();
        this._numberWindow.setup(
            this._item,
            this.maxSell(),
            this.sellingPrice()
        );
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
        this._statusWindow.setItem(this._item);
        this._statusWindow.show();
    }

    public onSellCancel() {
        this._sellWindow.deselect();
        this._categoryWindow.activate();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
    }

    public onNumberOk() {
        SoundManager.playShop();
        switch (this._commandWindow.currentSymbol()) {
            case "buy":
                this.doBuy(this._numberWindow.number());
                break;
            case "sell":
                this.doSell(this._numberWindow.number());
                break;
        }
        this.endNumberInput();
        this._goldWindow.refresh();
        this._statusWindow.refresh();
    }

    public onNumberCancel() {
        SoundManager.playCancel();
        this.endNumberInput();
    }

    public doBuy(number) {
        $gameParty.loseGold(number * this.buyingPrice());
        $gameParty.gainItem(this._item, number);
    }

    public doSell(number) {
        $gameParty.gainGold(number * this.sellingPrice());
        $gameParty.loseItem(this._item, number);
    }

    public endNumberInput() {
        this._numberWindow.hide();
        switch (this._commandWindow.currentSymbol()) {
            case "buy":
                this.activateBuyWindow();
                break;
            case "sell":
                this.activateSellWindow();
                break;
        }
    }

    public maxBuy() {
        const max =
            $gameParty.maxItems(this._item) - $gameParty.numItems(this._item);
        const price = this.buyingPrice();
        if (price > 0) {
            return Math.min(max, Math.floor(this.money() / price));
        } else {
            return max;
        }
    }

    public maxSell() {
        return $gameParty.numItems(this._item);
    }

    public money() {
        return this._goldWindow.value();
    }

    public currencyUnit() {
        return this._goldWindow.currencyUnit();
    }

    public buyingPrice() {
        return this._buyWindow.price(this._item);
    }

    public sellingPrice() {
        return Math.floor(this._item.price / 2);
    }
}
