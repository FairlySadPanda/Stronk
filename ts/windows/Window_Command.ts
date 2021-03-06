import { Window_Message } from "./Window_Message";
import { Window_Selectable } from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_Command
//
// The superclass of windows for selecting a command.

export class Window_Command extends Window_Selectable {
    protected _messageWindow: Window_Message;
    public constructor(x: any, y: any, messageWindow?: Window_Message) {
        super(0, 0, 0, 0);
        this._messageWindow = messageWindow;
        this.clearCommandList();
        this.makeCommandList();
        const width = this.windowWidth();
        const height = this.windowHeight();
        this.move(x, y, width, height);
        this.refresh();
        this.select(0);
        this.activate();
    }

    public windowWidth() {
        return 240;
    }

    public windowHeight() {
        return this.fittingHeight(this.numVisibleRows());
    }

    public numVisibleRows() {
        return Math.ceil(this.maxItems() / this.maxCols());
    }

    public maxItems() {
        return this._list.length;
    }

    public clearCommandList() {
        this._list = [];
    }

    public makeCommandList() {}

    public addCommand(
        name: any,
        symbol: string,
        enabled?: boolean,
        ext?: null
    ) {
        if (enabled === undefined) {
            enabled = true;
        }
        if (ext === undefined) {
            ext = null;
        }
        this._list.push({
            name: name,
            symbol: symbol,
            enabled: enabled,
            ext: ext
        });
    }

    public commandName(index: string | number) {
        return this._list[index].name;
    }

    public commandSymbol(index: number) {
        return this._list[index].symbol;
    }

    public isCommandEnabled(index: string | number) {
        return this._list[index].enabled;
    }

    public currentData() {
        return this.index() >= 0 ? this._list[this.index()] : null;
    }

    public isCurrentItemEnabled() {
        return this.currentData() ? this.currentData().enabled : false;
    }

    public currentSymbol() {
        return this.currentData() ? this.currentData().symbol : null;
    }

    public currentExt() {
        return this.currentData() ? this.currentData().ext : null;
    }

    public findSymbol(symbol: any) {
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].symbol === symbol) {
                return i;
            }
        }
        return -1;
    }

    public selectSymbol(symbol: string) {
        const index = this.findSymbol(symbol);
        if (index >= 0) {
            this.select(index);
        } else {
            this.select(0);
        }
    }

    public findExt(ext: any) {
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].ext === ext) {
                return i;
            }
        }
        return -1;
    }

    public selectExt(ext: number) {
        const index = this.findExt(ext);
        if (index >= 0) {
            this.select(index);
        } else {
            this.select(0);
        }
    }

    public async drawItem(index: number) {
        const rect = this.itemRectForText(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        await this.drawText(
            this.commandName(index),
            rect.x,
            rect.y,
            rect.width,
            undefined,
            align
        );
    }

    public itemTextAlign(): CanvasTextAlign {
        return "left";
    }

    public isOkEnabled() {
        return true;
    }

    public callOkHandler() {
        const symbol = this.currentSymbol();
        if (this.isHandled(symbol)) {
            this.callHandler(symbol);
        } else if (this.isHandled("ok")) {
            super.callOkHandler();
        } else {
            this.activate();
        }
    }

    public async refresh() {
        this.clearCommandList();
        this.makeCommandList();
        this.createContents();
        await super.refresh();
    }
}
