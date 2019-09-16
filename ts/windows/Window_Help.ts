import { Graphics } from "../core/Graphics";
import { Window_Base } from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.

export class Window_Help extends Window_Base {
    private _text: string;

    public constructor(numLines?: number) {
        const width = Graphics.boxWidth;
        const height = Window_Help.prototype.fittingHeight(numLines || 2);
        super(0, 0, width, height);
        this._text = "";
    }

    public setText(text) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    }

    public clear() {
        this.setText("");
    }

    public setItem(item) {
        this.setText(item ? item.description : "");
    }

    public refresh() {
        this.contents.clear();
        this.drawTextEx(this._text, this.textPadding(), 0);
    }
}
