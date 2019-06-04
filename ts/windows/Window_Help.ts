import Graphics from "../core/Graphics";
import Window_Base from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.

export default class Window_Help extends Window_Base {
    public _text: string;
    public setText: (text: any) => void;
    public clear: () => void;
    public setItem: (item: any) => void;
    public refresh: () => void;
    public constructor(numLines?: number) {
        const width = Graphics.boxWidth;
        const height = Window_Help.prototype.fittingHeight(numLines || 2);
        super(0, 0, width, height);
        this._text = "";
    }
}

Window_Help.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};

Window_Help.prototype.clear = function() {
    this.setText("");
};

Window_Help.prototype.setItem = function(item) {
    this.setText(item ? item.description : "");
};

Window_Help.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this._text, this.textPadding(), 0);
};
