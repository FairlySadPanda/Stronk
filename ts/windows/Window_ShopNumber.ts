import { Input } from "../core/Input";
import { TouchInput } from "../core/TouchInput";
import { Utils } from "../core/Utils";
import { ImageManager } from "../managers/ImageManager";
import { SoundManager } from "../managers/SoundManager";
import { TextManager } from "../managers/TextManager";
import { Sprite_Button } from "../sprites/Sprite_Button";
import { Window_Selectable } from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_ShopNumber
//
// The window for inputting quantity of items to buy or sell on the shop
// screen.

export class Window_ShopNumber extends Window_Selectable {
    private _item: any;
    private _max: number;
    private _price: number;
    private _number: number;
    private _currencyUnit: any;
    private _buttons: any[];

    public constructor(x, y, height) {
        super(x, y, Window_ShopNumber.prototype.windowWidth(), height);
        this._item = null;
        this._max = 1;
        this._price = 0;
        this._number = 1;
        this._currencyUnit = TextManager.currencyUnit;
        this.createButtons();
    }

    public windowWidth() {
        return 456;
    }

    public number() {
        return this._number;
    }

    public setup(item, max, price) {
        this._item = item;
        this._max = Math.floor(max);
        this._price = price;
        this._number = 1;
        this.placeButtons();
        this.updateButtonsVisiblity();
        this.refresh();
    }

    public setCurrencyUnit(currencyUnit) {
        this._currencyUnit = currencyUnit;
        this.refresh();
    }

    public createButtons() {
        const bitmap = ImageManager.loadSystem("ButtonSet");
        const buttonWidth = 48;
        const buttonHeight = 48;
        this._buttons = [];
        for (let i = 0; i < 5; i++) {
            const button = new Sprite_Button();
            const x = buttonWidth * i;
            const w = buttonWidth * (i === 4 ? 2 : 1);
            button.bitmap = bitmap;
            button.setColdFrame(x, 0, w, buttonHeight);
            button.setHotFrame(x, buttonHeight, w, buttonHeight);
            button.visible = false;
            this._buttons.push(button);
            this.addChild(button);
        }
        this._buttons[0].setClickHandler(this.onButtonDown2.bind(this));
        this._buttons[1].setClickHandler(this.onButtonDown.bind(this));
        this._buttons[2].setClickHandler(this.onButtonUp.bind(this));
        this._buttons[3].setClickHandler(this.onButtonUp2.bind(this));
        this._buttons[4].setClickHandler(this.onButtonOk.bind(this));
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

    public async refresh() {
        this.contents.clear();
        await this.drawItemName(this._item, 0, this.itemY());
        await this.drawMultiplicationSign();
        await this.drawNumber();
        await this.drawTotalPrice();
    }

    public async drawMultiplicationSign() {
        const sign = "\u00d7";
        const width = this.textWidth(sign);
        const x = this.cursorX() - width * 2;
        const y = this.itemY();
        this.resetTextColor();
        await this.drawText(sign, x, y, width);
    }

    public async drawNumber() {
        const x = this.cursorX();
        const y = this.itemY();
        const width = this.cursorWidth() - this.textPadding();
        this.resetTextColor();
        await this.drawText(
            this._number.toString(),
            x,
            y,
            width,
            undefined,
            "right"
        );
    }

    public async drawTotalPrice() {
        const total = this._price * this._number;
        const width = this.contentsWidth() - this.textPadding();
        await this.drawCurrencyValue(
            total,
            this._currencyUnit,
            0,
            this.priceY(),
            width
        );
    }

    public itemY() {
        return Math.round(this.contentsHeight() / 2 - this.lineHeight() * 1.5);
    }

    public priceY() {
        return Math.round(this.contentsHeight() / 2 + this.lineHeight() / 2);
    }

    public buttonY() {
        return Math.round(this.priceY() + this.lineHeight() * 2.5);
    }

    public cursorWidth() {
        const digitWidth = this.textWidth("0");
        return this.maxDigits() * digitWidth + this.textPadding() * 2;
    }

    public cursorX() {
        return this.contentsWidth() - this.cursorWidth() - this.textPadding();
    }

    public maxDigits() {
        return 2;
    }

    public update() {
        super.update();
        this.processNumberChange();
    }

    public isOkTriggered() {
        return Input.isTriggered("ok");
    }

    public playOkSound() {}

    public processNumberChange() {
        if (this.isOpenAndActive()) {
            if (Input.isRepeated("right")) {
                this.changeNumber(1);
            }
            if (Input.isRepeated("left")) {
                this.changeNumber(-1);
            }
            if (Input.isRepeated("up")) {
                this.changeNumber(10);
            }
            if (Input.isRepeated("down")) {
                this.changeNumber(-10);
            }
        }
    }

    public changeNumber(amount) {
        const lastNumber = this._number;
        this._number = Utils.clamp(this._number + amount, 1, this._max);
        if (this._number !== lastNumber) {
            SoundManager.playCursor();
            this.refresh();
        }
    }

    public updateCursor() {
        this.setCursorRect(
            this.cursorX(),
            this.itemY(),
            this.cursorWidth(),
            this.lineHeight()
        );
    }

    public onButtonUp() {
        this.changeNumber(1);
    }

    public onButtonUp2() {
        this.changeNumber(10);
    }

    public onButtonDown() {
        this.changeNumber(-1);
    }

    public onButtonDown2() {
        this.changeNumber(-10);
    }

    public onButtonOk() {
        this.processOk();
    }
}
