import { TextManager } from "../managers/TextManager";
import { Window_HorzCommand } from "./Window_HorzCommand";

// -----------------------------------------------------------------------------
// Window_ShopCommand
//
// The window for selecting buy/sell on the shop screen.

export class Window_ShopCommand extends Window_HorzCommand {
    private _windowWidth: number;
    private _purchaseOnly: boolean;

    public constructor(width: number, purchaseOnly: boolean) {
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
