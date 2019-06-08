import TextManager from "../managers/TextManager";
import Window_Base from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_Gold
//
// The window for displaying the party's gold.

export default class Window_Gold extends Window_Base {
    public constructor(x, y) {
        const width = Window_Gold.prototype.windowWidth();
        const height = Window_Gold.prototype.windowHeight();
        super(x, y, width, height);
        this.refresh();
    }

    public windowWidth() {
        return 240;
    }

    public windowHeight() {
        return this.fittingHeight(1);
    }

    public refresh() {
        const x = this.textPadding();
        const width = this.contents.width - this.textPadding() * 2;
        this.contents.clear();
        this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
    }

    public value() {
        return $gameParty.gold();
    }

    public currencyUnit() {
        return TextManager.currencyUnit;
    }

    public open() {
        this.refresh();
        super.open();
    }
}
