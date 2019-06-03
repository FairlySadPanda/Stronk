import Graphics from "../core/Graphics";
import Input from "../core/Input";

import Window_Command from "./Window_Command";

//-----------------------------------------------------------------------------
// Window_ChoiceList
//
// The window used for the event command [Show Choices].

export default class Window_ChoiceList extends Window_Command {
    public openness: number;
    private _background: number;
    public constructor(messageWindow) {
        super(0, 0, messageWindow);
        this.openness = 0;
        this.deactivate();
        this._background = 0;
    }

    public start() {
        this.updatePlacement();
        this.updateBackground();
        this.refresh();
        this.selectDefault();
        this.open();
        this.activate();
    }

    public selectDefault() {
        this.select($gameMessage.choiceDefaultType());
    }

    public updatePlacement() {
        const positionType = $gameMessage.choicePositionType();
        const messageY = this._messageWindow.y;
        this.width = this.windowWidth();
        this.height = this.windowHeight();
        switch (positionType) {
        case 0:
            this.x = 0;
            break;
        case 1:
            this.x = (Graphics.boxWidth - this.width) / 2;
            break;
        case 2:
            this.x = Graphics.boxWidth - this.width;
            break;
        }
        if (messageY >= Graphics.boxHeight / 2) {
            this.y = messageY - this.height;
        } else {
            this.y = messageY + this._messageWindow.height;
        }
    }

    public updateBackground() {
        this._background = $gameMessage.choiceBackground();
        this.setBackgroundType(this._background);
    }

    public windowWidth() {
        const width = this.maxChoiceWidth() + this.padding * 2;
        return Math.min(width, Graphics.boxWidth);
    }

    public numVisibleRows() {
        const messageY = this._messageWindow.y;
        const messageHeight = this._messageWindow.height;
        const centerY = Graphics.boxHeight / 2;
        const choices = $gameMessage.choices();
        let numLines = choices.length;
        let maxLines = 8;
        if (messageY < centerY && messageY + messageHeight > centerY) {
            maxLines = 4;
        }
        if (numLines > maxLines) {
            numLines = maxLines;
        }
        return numLines;
    }

    public maxChoiceWidth() {
        let maxWidth = 96;
        const choices = $gameMessage.choices();
        for (let i = 0; i < choices.length; i++) {
            const choiceWidth = this.textWidthEx(choices[i]) + this.textPadding() * 2;
            if (maxWidth < choiceWidth) {
                maxWidth = choiceWidth;
            }
        }
        return maxWidth;
    }

    public textWidthEx(text) {
        return this.drawTextEx(text, 0, this.contents.height);
    }

    public contentsHeight() {
        return this.maxItems() * this.itemHeight();
    }

    public makeCommandList() {
        const choices = $gameMessage.choices();
        for (let i = 0; i < choices.length; i++) {
            this.addCommand(choices[i], "choice");
        }
    }

    public drawItem(index) {
        const rect = this.itemRectForText(index);
        this.drawTextEx(this.commandName(index), rect.x, rect.y);
    }

    public isCancelEnabled() {
        return $gameMessage.choiceCancelType() !== -1;
    }

    public isOkTriggered() {
        return Input.isTriggered("ok");
    }

    public callOkHandler() {
        $gameMessage.onChoice(this.index());
        this._messageWindow.terminateMessage();
        this.close();
    }

    public callCancelHandler() {
        $gameMessage.onChoice($gameMessage.choiceCancelType());
        this._messageWindow.terminateMessage();
        this.close();
    }

}
