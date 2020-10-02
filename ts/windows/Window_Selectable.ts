import { Input } from "../core/Input";
import { Rectangle } from "../core/Rectangle";
import { TouchInput } from "../core/TouchInput";
import { Utils } from "../core/Utils";
import { Item } from "../interfaces/Item";
import { SoundManager } from "../managers/SoundManager";
import { Window_Base } from "./Window_Base";
import { Window_Help } from "./Window_Help";

// -----------------------------------------------------------------------------
// Window_Selectable
//
// The window class with cursor movement and scroll export functions.

export class Window_Selectable extends Window_Base {
    protected _index: number;
    protected _cursorFixed: boolean;
    protected _cursorAll: boolean;
    protected _stayCount: number;
    protected _helpWindow: any;
    protected _handlers: {};
    protected _touching: boolean;
    protected _scrollX: number;
    protected _scrollY: number;
    protected _inputLock: any;

    public constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this._index = -1;
        this._cursorFixed = false;
        this._cursorAll = false;
        this._stayCount = 0;
        this._helpWindow = null;
        this._handlers = {};
        this._touching = false;
        this._scrollX = 0;
        this._scrollY = 0;
        this.deactivate();
    }

    public index() {
        return this._index;
    }

    public cursorFixed() {
        return this._cursorFixed;
    }

    public setCursorFixed(cursorFixed: boolean) {
        this._cursorFixed = cursorFixed;
    }

    public cursorAll() {
        return this._cursorAll;
    }

    public setCursorAll(cursorAll: boolean) {
        this._cursorAll = cursorAll;
    }

    public maxCols() {
        return 1;
    }

    public maxItems() {
        return 0;
    }

    public spacing() {
        return 12;
    }

    public itemWidth() {
        return Math.floor(
            (this.width - this.padding * 2 + this.spacing()) / this.maxCols() -
                this.spacing()
        );
    }

    public itemHeight() {
        return this.lineHeight();
    }

    public maxRows() {
        return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
    }

    public activate() {
        super.activate();
        this.reselect();
    }

    public deactivate() {
        super.deactivate();
        this.reselect();
    }

    public select(index: number) {
        this._index = index;
        this._stayCount = 0;
        this.ensureCursorVisible();
        this.updateCursor();
        this.callUpdateHelp();
    }

    public deselect() {
        this.select(-1);
    }

    public reselect() {
        this.select(this._index);
    }

    public row() {
        return Math.floor(this.index() / this.maxCols());
    }

    public topRow() {
        return Math.floor(this._scrollY / this.itemHeight());
    }

    public maxTopRow() {
        return Math.max(0, this.maxRows() - this.maxPageRows());
    }

    public setTopRow(row: number) {
        const scrollY =
            Utils.clamp(row, 0, this.maxTopRow()) * this.itemHeight();
        if (this._scrollY !== scrollY) {
            this._scrollY = scrollY;
            this.refresh();
            this.updateCursor();
        }
    }

    public resetScroll() {
        this.setTopRow(0);
    }

    public maxPageRows() {
        const pageHeight = this.height - this.padding * 2;
        return Math.floor(pageHeight / this.itemHeight());
    }

    public maxPageItems() {
        return this.maxPageRows() * this.maxCols();
    }

    public isHorizontal() {
        return this.maxPageRows() === 1;
    }

    public bottomRow() {
        return Math.max(0, this.topRow() + this.maxPageRows() - 1);
    }

    public setBottomRow(row: number) {
        this.setTopRow(row - (this.maxPageRows() - 1));
    }

    public topIndex() {
        return this.topRow() * this.maxCols();
    }

    public itemRect(index: number) {
        const rect = new Rectangle();
        const maxCols = this.maxCols();
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        rect.x =
            (index % maxCols) * (rect.width + this.spacing()) - this._scrollX;
        rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        return rect;
    }

    public itemRectForText(index: number) {
        const rect = this.itemRect(index);
        rect.x += this.textPadding();
        rect.width -= this.textPadding() * 2;
        return rect;
    }

    public setHelpWindow(helpWindow: Window_Help) {
        this._helpWindow = helpWindow;
        this.callUpdateHelp();
    }

    public showHelpWindow() {
        if (this._helpWindow) {
            this._helpWindow.show();
        }
    }

    public hideHelpWindow() {
        if (this._helpWindow) {
            this._helpWindow.hide();
        }
    }

    public setHandler(symbol: string, method: any) {
        this._handlers[symbol] = method;
    }

    public isHandled(symbol: string) {
        return !!this._handlers[symbol];
    }

    public callHandler(symbol: string) {
        if (this.isHandled(symbol)) {
            this._handlers[symbol]();
        }
    }

    public isOpenAndActive() {
        return this.isOpen() && this.active;
    }

    public isCursorMovable() {
        if (this._inputLock) return false;
        return (
            this.isOpenAndActive() &&
            !this._cursorFixed &&
            !this._cursorAll &&
            this.maxItems() > 0
        );
    }

    public cursorDown(wrap?: boolean) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
            this.select((index + maxCols) % maxItems);
        }
    }

    public cursorUp(wrap?: boolean) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index >= maxCols || (wrap && maxCols === 1)) {
            this.select((index - maxCols + maxItems) % maxItems);
        }
    }

    public cursorRight(wrap: boolean) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (
            maxCols >= 2 &&
            (index < maxItems - 1 || (wrap && this.isHorizontal()))
        ) {
            this.select((index + 1) % maxItems);
        }
    }

    public cursorLeft(wrap: boolean) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (maxCols >= 2 && (index > 0 || (wrap && this.isHorizontal()))) {
            this.select((index - 1 + maxItems) % maxItems);
        }
    }

    public cursorPagedown() {
        const index = this.index();
        const maxItems = this.maxItems();
        if (this.topRow() + this.maxPageRows() < this.maxRows()) {
            this.setTopRow(this.topRow() + this.maxPageRows());
            this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
        }
    }

    public cursorPageup() {
        const index = this.index();
        if (this.topRow() > 0) {
            this.setTopRow(this.topRow() - this.maxPageRows());
            this.select(Math.max(index - this.maxPageItems(), 0));
        }
    }

    public scrollDown() {
        if (this.topRow() + 1 < this.maxRows()) {
            this.setTopRow(this.topRow() + 1);
        }
    }

    public scrollUp() {
        if (this.topRow() > 0) {
            this.setTopRow(this.topRow() - 1);
        }
    }

    public update() {
        super.update();
        this.updateArrows();
        this.processCursorMove();
        this.processHandling();
        this.processWheel();
        this.processTouch();
        this._stayCount++;
    }

    public updateArrows() {
        const topRow = this.topRow();
        const maxTopRow = this.maxTopRow();
        this.downArrowVisible = maxTopRow > 0 && topRow < maxTopRow;
        this.upArrowVisible = topRow > 0;
    }

    public processCursorMove() {
        if (this.isCursorMovable()) {
            const lastIndex = this.index();
            if (Input.isRepeated("down")) {
                this.cursorDown(Input.isTriggered("down"));
            }
            if (Input.isRepeated("up")) {
                this.cursorUp(Input.isTriggered("up"));
            }
            if (Input.isRepeated("right")) {
                this.cursorRight(Input.isTriggered("right"));
            }
            if (Input.isRepeated("left")) {
                this.cursorLeft(Input.isTriggered("left"));
            }
            if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
                this.cursorPagedown();
            }
            if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
                this.cursorPageup();
            }
            if (this.index() !== lastIndex) {
                SoundManager.playCursor();
            }
        }
    }

    public processHandling() {
        if (this.isOpenAndActive()) {
            if (this.isOkEnabled() && this.isOkTriggered()) {
                this.processOk();
            } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
                this.processCancel();
            } else if (
                this.isHandled("pagedown") &&
                Input.isTriggered("pagedown")
            ) {
                this.processPagedown();
            } else if (
                this.isHandled("pageup") &&
                Input.isTriggered("pageup")
            ) {
                this.processPageup();
            }
        }
    }

    public processWheel() {
        if (this.isOpenAndActive()) {
            const threshold = 20;
            if (TouchInput.wheelY >= threshold) {
                this.scrollDown();
            }
            if (TouchInput.wheelY <= -threshold) {
                this.scrollUp();
            }
        }
    }

    public processTouch() {
        if (this.isOpenAndActive()) {
            if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
                this._touching = true;
                this.onTouch(true);
            } else if (TouchInput.isCancelled()) {
                if (this.isCancelEnabled()) {
                    this.processCancel();
                }
            }
            if (this._touching) {
                if (TouchInput.isPressed()) {
                    this.onTouch(false);
                } else {
                    this._touching = false;
                }
            }
        } else {
            this._touching = false;
        }
    }

    public isTouchedInsideFrame() {
        const x = this.canvasToLocalX(TouchInput.x);
        const y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    public onTouch(triggered: boolean) {
        const lastIndex = this.index();
        const x = this.canvasToLocalX(TouchInput.x);
        const y = this.canvasToLocalY(TouchInput.y);
        const hitIndex = this.hitTest(x, y);
        if (hitIndex >= 0) {
            if (hitIndex === this.index()) {
                if (triggered && this.isTouchOkEnabled()) {
                    this.processOk();
                }
            } else if (this.isCursorMovable()) {
                this.select(hitIndex);
            }
        } else if (this._stayCount >= 10) {
            if (y < this.padding) {
                this.cursorUp();
            } else if (y >= this.height - this.padding) {
                this.cursorDown();
            }
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }

    public hitTest(x: number, y: number) {
        if (this.isContentsArea(x, y)) {
            const cx = x - this.padding;
            const cy = y - this.padding;
            const topIndex = this.topIndex();
            for (let i = 0; i < this.maxPageItems(); i++) {
                const index = topIndex + i;
                if (index < this.maxItems()) {
                    const rect = this.itemRect(index);
                    const right = rect.x + rect.width;
                    const bottom = rect.y + rect.height;
                    if (
                        cx >= rect.x &&
                        cy >= rect.y &&
                        cx < right &&
                        cy < bottom
                    ) {
                        return index;
                    }
                }
            }
        }
        return -1;
    }

    public isContentsArea(x: number, y: number) {
        const left = this.padding;
        const top = this.padding;
        const right = this.width - this.padding;
        const bottom = this.height - this.padding;
        return x >= left && y >= top && x < right && y < bottom;
    }

    public isTouchOkEnabled() {
        return this.isOkEnabled();
    }

    public isOkEnabled() {
        return this.isHandled("ok");
    }

    public isCancelEnabled() {
        return this.isHandled("cancel");
    }

    public isOkTriggered() {
        return Input.isRepeated("ok");
    }

    public isCancelTriggered() {
        return Input.isRepeated("cancel");
    }

    public processOk() {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        } else {
            this.playBuzzerSound();
        }
    }

    public playOkSound() {
        SoundManager.playOk();
    }

    public playBuzzerSound() {
        SoundManager.playBuzzer();
    }

    public callOkHandler() {
        this.callHandler("ok");
    }

    public processCancel() {
        SoundManager.playCancel();
        this.updateInputData();
        this.deactivate();
        this.callCancelHandler();
    }

    public callCancelHandler() {
        this.callHandler("cancel");
    }

    public processPageup() {
        SoundManager.playCursor();
        this.updateInputData();
        this.deactivate();
        this.callHandler("pageup");
    }

    public processPagedown() {
        SoundManager.playCursor();
        this.updateInputData();
        this.deactivate();
        this.callHandler("pagedown");
    }

    public updateInputData() {
        Input.update();
        TouchInput.update();
    }

    public updateCursor() {
        if (this._cursorAll) {
            const allRowsHeight = this.maxRows() * this.itemHeight();
            this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
            this.setTopRow(0);
        } else if (this.isCursorVisible()) {
            const rect = this.itemRect(this.index());
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    }

    public isCursorVisible() {
        const row = this.row();
        return row >= this.topRow() && row <= this.bottomRow();
    }

    public ensureCursorVisible() {
        const row = this.row();
        if (row < this.topRow()) {
            this.setTopRow(row);
        } else if (row > this.bottomRow()) {
            this.setBottomRow(row);
        }
    }

    public callUpdateHelp() {
        if (this.active && this._helpWindow) {
            this.updateHelp();
        }
    }

    public updateHelp() {
        this._helpWindow.clear();
    }

    public setHelpWindowItem(item: Item) {
        if (this._helpWindow) {
            this._helpWindow.setItem(item);
        }
    }

    public isCurrentItemEnabled() {
        return true;
    }

    public async drawAllItems() {
        const topIndex = this.topIndex();
        const promises = [];
        for (let i = 0; i < this.maxPageItems(); i++) {
            const index = topIndex + i;
            if (index < this.maxItems()) {
                promises.push(this.drawItem(index));
            }
        }
        await Promise.all(promises);
    }

    public async drawItem(index: number) {}

    public clearItem(index: any) {
        const rect = this.itemRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    }

    public redrawItem(index: number) {
        if (index >= 0) {
            this.clearItem(index);
            this.drawItem(index);
        }
    }

    public redrawCurrentItem() {
        this.redrawItem(this.index());
    }

    public async refresh() {
        if (this.contents) {
            this.contents.clear();
            await this.drawAllItems();
        }
    }
}
