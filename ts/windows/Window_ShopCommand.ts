import TextManager from "../managers/TextManager";
import Window_HorzCommand from "./Window_HorzCommand";

// -----------------------------------------------------------------------------
// Window_ShopCommand
//
// The window for selecting buy/sell on the shop screen.

export default class Window_ShopCommand extends Window_HorzCommand {
    public _windowWidth: any;
    public _purchaseOnly: any;
    public constructor(width, purchaseOnly) {
        super(0, 0);
        this._windowWidth = width;
        this._purchaseOnly = purchaseOnly;
    }

    public windowWidth() {
        return this._windowWidth;
    }

    public maxCols() {
        return 3;
    }

    public makeCommandList() {
        this.addCommand(TextManager.buy, "buy");
        this.addCommand(TextManager.sell, "sell", !this._purchaseOnly);
        this.addCommand(TextManager.cancel, "cancel");
    }
}
