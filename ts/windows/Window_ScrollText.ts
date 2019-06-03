import Graphics from "../core/Graphics";
import Input from "../core/Input";
import TouchInput from "../core/TouchInput";
import Window_Base from "./Window_Base";

//-----------------------------------------------------------------------------
// Window_ScrollText
//
// The window for displaying scrolling text. No frame is displayed, but it
// is handled as a window for convenience.

export default class Window_ScrollText extends Window_Base {
    public opacity: number;
    public _text: string;
    public _allTextHeight: number;
    public startMessage: () => void;
    public refresh: () => void;
    public updateMessage: () => void;
    public scrollSpeed: () => number;
    public isFastForward: () => boolean;
    public fastForwardRate: () => number;
    public terminateMessage: () => void;
    public constructor() {
      super(0, 0, Graphics.boxWidth, Graphics.boxHeight);
      this.opacity = 0;
      this.hide();
      this._text = "";
      this._allTextHeight = 0;
    }
}

Window_ScrollText.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if ($gameMessage.scrollMode()) {
        if (this._text) {
            this.updateMessage();
        }
        if (!this._text && $gameMessage.hasText()) {
            this.startMessage();
        }
    }
};

Window_ScrollText.prototype.startMessage = function () {
    this._text = $gameMessage.allText();
    this.refresh();
    this.show();
};

Window_ScrollText.prototype.refresh = function () {
    const textState = { "index": 0, "text": null };
    textState.text = this.convertEscapeCharacters(this._text);
    this.resetFontSettings();
    this._allTextHeight = this.calcTextHeight(textState, true);
    this.createContents();
    this.origin.y = -this.height;
    this.drawTextEx(this._text, this.textPadding(), 1);
};

Window_ScrollText.prototype.contentsHeight = function () {
    return Math.max(this._allTextHeight, 1);
};

Window_ScrollText.prototype.updateMessage = function () {
    this.origin.y += this.scrollSpeed();
    if (this.origin.y >= this.contents.height) {
        this.terminateMessage();
    }
};

Window_ScrollText.prototype.scrollSpeed = function () {
    let speed = $gameMessage.scrollSpeed() / 2;
    if (this.isFastForward()) {
        speed *= this.fastForwardRate();
    }
    return speed;
};

Window_ScrollText.prototype.isFastForward = function () {
    if ($gameMessage.scrollNoFast()) {
        return false;
    } else {
        return (Input.isPressed("ok") || Input.isPressed("shift") ||
                TouchInput.isPressed());
    }
};

Window_ScrollText.prototype.fastForwardRate = function () {
    return 3;
};

Window_ScrollText.prototype.terminateMessage = function () {
    this._text = null;
    $gameMessage.clear();
    this.hide();
};
