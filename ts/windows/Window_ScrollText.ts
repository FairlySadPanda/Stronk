import { Graphics } from "../core/Graphics";
import { Input } from "../core/Input";
import { TouchInput } from "../core/TouchInput";
import { Window_Base } from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_ScrollText
//
// The window for displaying scrolling text. No frame is displayed, but it
// is handled as a window for convenience.

export class Window_ScrollText extends Window_Base {
    public opacity: number;
    private _text: string;
    private _allTextHeight: number;

    public constructor() {
        super(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.opacity = 0;
        this.hide();
        this._text = "";
        this._allTextHeight = 0;
    }

    public update() {
        super.update();
        if ($gameMessage.scrollMode()) {
            if (this._text) {
                this.updateMessage();
            }
            if (!this._text && $gameMessage.hasText()) {
                this.startMessage();
            }
        }
    }

    public startMessage() {
        this._text = $gameMessage.allText();
        this.refresh();
        this.show();
    }

    public refresh() {
        const textState = { index: 0, text: null };
        textState.text = this.convertEscapeCharacters(this._text);
        this.resetFontSettings();
        this._allTextHeight = this.calcTextHeight(textState, true);
        this.createContents();
        this.origin.y = -this.height;
        this.drawTextEx(this._text, this.textPadding(), 1);
    }

    public contentsHeight() {
        return Math.max(this._allTextHeight, 1);
    }

    public updateMessage() {
        this.origin.y += this.scrollSpeed();
        if (this.origin.y >= this.contents.height) {
            this.terminateMessage();
        }
    }

    public scrollSpeed() {
        let speed = $gameMessage.scrollSpeed() / 2;
        if (this.isFastForward()) {
            speed *= this.fastForwardRate();
        }
        return speed;
    }

    public isFastForward() {
        if ($gameMessage.scrollNoFast()) {
            return false;
        } else {
            return (
                Input.isPressed("ok") ||
                Input.isPressed("shift") ||
                TouchInput.isPressed()
            );
        }
    }

    public fastForwardRate() {
        return 3;
    }

    public terminateMessage() {
        this._text = null;
        $gameMessage.clear();
        this.hide();
    }
}
