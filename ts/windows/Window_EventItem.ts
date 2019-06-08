import Graphics from "../core/Graphics";
import DataManager from "../managers/DataManager";
import Window_ItemList from "./Window_ItemList";

// -----------------------------------------------------------------------------
// Window_EventItem
//
// The window used for the event command [Select Item].

export default class Window_EventItem extends Window_ItemList {
    public _messageWindow: any;
    public openness: number;

    public constructor(messageWindow) {
        super(
            0,
            0,
            Graphics.boxWidth,
            Window_EventItem.prototype.windowHeight()
        );
        this._messageWindow = messageWindow;
        this.openness = 0;
        this.deactivate();
        this.setHandler("ok", this.onOk.bind(this));
        this.setHandler("cancel", this.onCancel.bind(this));
    }

    public windowHeight() {
        return this.fittingHeight(this.numVisibleRows());
    }

    public numVisibleRows() {
        return 4;
    }

    public start() {
        this.refresh();
        this.updatePlacement();
        this.select(0);
        this.open();
        this.activate();
    }

    public updatePlacement() {
        if (this._messageWindow.y >= Graphics.boxHeight / 2) {
            this.y = 0;
        } else {
            this.y = Graphics.boxHeight - this.height;
        }
    }

    public includes(item) {
        const itypeId = $gameMessage.itemChoiceItypeId();
        return DataManager.isItem(item) && item.itypeId === itypeId;
    }

    public isEnabled(item) {
        return true;
    }

    public onOk() {
        const item = this.item();
        const itemId = item ? item.id : 0;
        $gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);
        this._messageWindow.terminateMessage();
        this.close();
    }

    public onCancel() {
        $gameVariables.setValue($gameMessage.itemChoiceVariableId(), 0);
        this._messageWindow.terminateMessage();
        this.close();
    }
}
