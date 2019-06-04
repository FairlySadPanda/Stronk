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
    public _messageWindow: any;
    public _number: number;
    public _maxDigits: number;
    public openness: number;
    public start: () => void;
    public updatePlacement: () => void;
    public windowWidth: () => number;
    public windowHeight: () => any;
    public placeButtons: () => void;
    public updateButtonsVisiblity: () => void;
    public showButtons: () => void;
    public hideButtons: () => void;
    public buttonY: () => any;
    public processDigitChange: () => void;
    public changeDigit: (up: any) => void;
    public onButtonUp: () => void;
    public onButtonDown: () => void;
    public onButtonOk: () => void;
    public constructor(messageWindow) {
        super(0, 0, 0, 0);
        this._messageWindow = messageWindow;
        this._number = 0;
        this._maxDigits = 1;
        this.openness = 0;
        this.createButtons();
        this.deactivate();
    }
    public createButtons(): any {
        throw new Error("Method not implemented.");
    }
}

Window_NumberInput.prototype.start = function() {
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
};

Window_NumberInput.prototype.updatePlacement = function() {
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
};

Window_NumberInput.prototype.windowWidth = function() {
    return this.maxCols() * this.itemWidth() + this.padding * 2;
};

Window_NumberInput.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_NumberInput.prototype.maxCols = function() {
    return this._maxDigits;
};

Window_NumberInput.prototype.maxItems = function() {
    return this._maxDigits;
};

Window_NumberInput.prototype.spacing = function() {
    return 0;
};

Window_NumberInput.prototype.itemWidth = function() {
    return 32;
};

Window_NumberInput.prototype.createButtons = function() {
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
};

Window_NumberInput.prototype.placeButtons = function() {
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
};

Window_NumberInput.prototype.updateButtonsVisiblity = function() {
    if (TouchInput.date > Input.date) {
        this.showButtons();
    } else {
        this.hideButtons();
    }
};

Window_NumberInput.prototype.showButtons = function() {
    for (let i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = true;
    }
};

Window_NumberInput.prototype.hideButtons = function() {
    for (let i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = false;
    }
};

Window_NumberInput.prototype.buttonY = function() {
    const spacing = 8;
    if (this._messageWindow.y >= Graphics.boxHeight / 2) {
        return 0 - this._buttons[0].height - spacing;
    } else {
        return this.height + spacing;
    }
};

Window_NumberInput.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.processDigitChange();
};

Window_NumberInput.prototype.processDigitChange = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated("up")) {
            this.changeDigit(true);
        } else if (Input.isRepeated("down")) {
            this.changeDigit(false);
        }
    }
};

Window_NumberInput.prototype.changeDigit = function(up) {
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
};

Window_NumberInput.prototype.isTouchOkEnabled = function() {
    return false;
};

Window_NumberInput.prototype.isOkEnabled = function() {
    return true;
};

Window_NumberInput.prototype.isCancelEnabled = function() {
    return false;
};

Window_NumberInput.prototype.isOkTriggered = function() {
    return Input.isTriggered("ok");
};

Window_NumberInput.prototype.processOk = function() {
    SoundManager.playOk();
    $gameVariables.setValue($gameMessage.numInputVariableId(), this._number);
    this._messageWindow.terminateMessage();
    this.updateInputData();
    this.deactivate();
    this.close();
};

Window_NumberInput.prototype.drawItem = function(index) {
    const rect = this.itemRect(index);
    const align = "center";
    const s = Utils.padZero(this._number, this._maxDigits);
    const c = s.slice(index, index + 1);
    this.resetTextColor();
    this.drawText(c, rect.x, rect.y, rect.width, align);
};

Window_NumberInput.prototype.onButtonUp = function() {
    this.changeDigit(true);
};

Window_NumberInput.prototype.onButtonDown = function() {
    this.changeDigit(false);
};

Window_NumberInput.prototype.onButtonOk = function() {
    this.processOk();
    this.hideButtons();
};
