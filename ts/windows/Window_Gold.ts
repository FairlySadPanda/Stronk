
import TextManager from "../managers/TextManager";
import Window_Base from "./Window_Base";

//-----------------------------------------------------------------------------
// Window_Gold
//
// The window for displaying the party's gold.

export default class Window_Gold extends Window_Base {
    public value: () => any;
    public currencyUnit: () => any;
    public constructor(x, y) {
        const width = Window_Gold.prototype.windowWidth();
        const height = Window_Gold.prototype.windowHeight();
        super(x, y, width, height);
        this.refresh();
    }
    public windowWidth(): any {
        throw new Error("Method not implemented.");
    }
    public windowHeight(): any {
        throw new Error("Method not implemented.");
    }
    public refresh(): any {
        throw new Error("Method not implemented.");
    }
}

Window_Gold.prototype.windowWidth = function () {
    return 240;
};

Window_Gold.prototype.windowHeight = function () {
    return this.fittingHeight(1);
};

Window_Gold.prototype.refresh = function () {
    const x = this.textPadding();
    const width = this.contents.width - this.textPadding() * 2;
    this.contents.clear();
    this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
};

Window_Gold.prototype.value = function () {
    return $gameParty.gold();
};

Window_Gold.prototype.currencyUnit = function () {
    return TextManager.currencyUnit;
};

Window_Gold.prototype.open = function () {
    this.refresh();
    Window_Base.prototype.open.call(this);
};
