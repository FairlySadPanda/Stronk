import Graphics from "../core/Graphics";
import Input from "../core/Input";
import TouchInput from "../core/TouchInput";
import Utils from "../core/Utils";
import ImageManager from "../managers/ImageManager";
import SoundManager from "../managers/SoundManager";
import Sprite_Button from "../sprites/Sprite_Button";
import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_NumberInput
//
// The window used for the event command [Input Number].

export default class Window_NumberInput extends Window_Selectable {
    private _messageWindow: any;
    private _number: number;
    private _maxDigits: number;
    public openness: number;
    private _buttons: any[];

    public constructor(messageWindow) {
        super(0, 0, 0, 0);
        this._messageWindow = messageWindow;
        this._number = 0;
        this._maxDigits = 1;
        this.openness = 0;
        this.createButtons();
        this.deactivate();
    }

    public start() {
        this._maxDigits = $gameMessage.numInputMaxDigits();
        this._number = $gameVariables.value($gameMessage.numInputVariableId());
        this._number = Utils.clamp(
            this._number,
            0,
            Math.pow(10, this._maxDigits) - 1
        );
        this.updatePlacement();
        this.placeButtons();
        this.updateButtonsVisiblity();
        this.createContents();
        this.refresh();
        this.open();
        this.activate();
        this.select(0);
    }

    public updatePlacement() {
        const messageY = this._messageWindow.y;
        const spacing = 8;
        this.width = this.windowWidth();
        this.height = this.windowHeight();
        this.x = (Graphics.boxWidth - this.width) / 2;
        if (messageY >= Graphics.boxHeight / 2) {
            this.y = messageY - this.height - spacing;
        } else {
            this.y = messageY + this._messageWindow.height + spacing;
        }
    }

    public windowWidth() {
        return this.maxCols() * this.itemWidth() + this.padding * 2;
    }

    public windowHeight() {
        return this.fittingHeight(1);
    }

    public maxCols() {
        return this._maxDigits;
    }

    public maxItems() {
        return this._maxDigits;
    }

    public spacing() {
        return 0;
    }

    public itemWidth() {
        return 32;
    }

    public createButtons() {
        const bitmap = ImageManager.loadSystem("ButtonSet");
        const buttonWidth = 48;
        const buttonHeight = 48;
        this._buttons = [];
        for (let i = 0; i < 3; i++) {
            const button = new Sprite_Button();
            const x = buttonWidth * [1, 2, 4][i];
            const w = buttonWidth * (i === 2 ? 2 : 1);
            button.bitmap = bitmap;
            button.setColdFrame(x, 0, w, buttonHeight);
            button.setHotFrame(x, buttonHeight, w, buttonHeight);
            button.visible = false;
            this._buttons.push(button);
            this.addChild(button);
        }
        this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
        this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
        this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
    }

    public placeButtons() {
        const numButtons = this._buttons.length;
        const spacing = 16;
        let totalWidth = -spacing;
        for (let i = 0; i < numButtons; i++) {
            totalWidth += this._buttons[i].width + spacing;
        }
        let x = (this.width - totalWidth) / 2;
        for (let j = 0; j < numButtons; j++) {
            const button = this._buttons[j];
            button.x = x;
            button.y = this.buttonY();
            x += button.width + spacing;
        }
    }

    public updateButtonsVisiblity() {
        if (TouchInput.date > Input.date) {
            this.showButtons();
        } else {
            this.hideButtons();
        }
    }

    public showButtons() {
        for (let i = 0; i < this._buttons.length; i++) {
            this._buttons[i].visible = true;
        }
    }

    public hideButtons() {
        for (let i = 0; i < this._buttons.length; i++) {
            this._buttons[i].visible = false;
        }
    }

    public buttonY() {
        const spacing = 8;
        if (this._messageWindow.y >= Graphics.boxHeight / 2) {
            return 0 - this._buttons[0].height - spacing;
        } else {
            return this.height + spacing;
        }
    }

    public update() {
        super.update();
        this.processDigitChange();
    }

    public processDigitChange() {
        if (this.isOpenAndActive()) {
            if (Input.isRepeated("up")) {
                this.changeDigit(true);
            } else if (Input.isRepeated("down")) {
                this.changeDigit(false);
            }
        }
    }

    public changeDigit(up) {
        const index = this.index();
        const place = Math.pow(10, this._maxDigits - 1 - index);
        let n = Math.floor(this._number / place) % 10;
        this._number -= n * place;
        if (up) {
            n = (n + 1) % 10;
        } else {
            n = (n + 9) % 10;
        }
        this._number += n * place;
        this.refresh();
        SoundManager.playCursor();
    }

    public isTouchOkEnabled() {
        return false;
    }

    public isOkEnabled() {
        return true;
    }

    public isCancelEnabled() {
        return false;
    }

    public isOkTriggered() {
        return Input.isTriggered("ok");
    }

    public processOk() {
        SoundManager.playOk();
        $gameVariables.setValue(
            $gameMessage.numInputVariableId(),
            this._number
        );
        this._messageWindow.terminateMessage();
        this.updateInputData();
        this.deactivate();
        this.close();
    }

    public drawItem(index) {
        const rect = this.itemRect(index);
        const align = "center";
        const s = Utils.padZero(this._number, this._maxDigits);
        const c = s.slice(index, index + 1);
        this.resetTextColor();
        this.drawText(c, rect.x, rect.y, rect.width, undefined, align);
    }

    public onButtonUp() {
        this.changeDigit(true);
    }

    public onButtonDown() {
        this.changeDigit(false);
    }

    public onButtonOk() {
        this.processOk();
        this.hideButtons();
    }
}
