import Graphics from "../core/Graphics";
import DataManager from "../managers/DataManager";
import Window_ItemList from "./Window_ItemList";

//-----------------------------------------------------------------------------
// Window_EventItem
//
// The window used for the event command [Select Item].

export default class Window_EventItem extends Window_ItemList {
    public _messageWindow: any;
    public openness: number;
    public onOk: any;
    public onCancel: any;
    public numVisibleRows: () => number;
    public start: () => void;
    public updatePlacement: () => void;
    public constructor(messageWindow) {
        super(0, 0, Graphics.boxWidth, Window_EventItem.prototype.windowHeight());
        this._messageWindow = messageWindow;
        this.openness = 0;
        this.deactivate();
        this.setHandler("ok",     this.onOk.bind(this));
        this.setHandler("cancel", this.onCancel.bind(this));
    }
    public windowHeight(): any {
        throw new Error("Method not implemented.");
    }
}

Window_EventItem.prototype.windowHeight = function () {
    return this.fittingHeight(this.numVisibleRows());
};

Window_EventItem.prototype.numVisibleRows = function () {
    return 4;
};

Window_EventItem.prototype.start = function () {
    this.refresh();
    this.updatePlacement();
    this.select(0);
    this.open();
    this.activate();
};

Window_EventItem.prototype.updatePlacement = function () {
    if (this._messageWindow.y >= Graphics.boxHeight / 2) {
        this.y = 0;
    } else {
        this.y = Graphics.boxHeight - this.height;
    }
};

Window_EventItem.prototype.includes = function (item) {
    const itypeId = $gameMessage.itemChoiceItypeId();
    return DataManager.isItem(item) && item.itypeId === itypeId;
};

Window_EventItem.prototype.isEnabled = function (item) {
    return true;
};

Window_EventItem.prototype.onOk = function () {
    const item = this.item();
    const itemId = item ? item.id : 0;
    $gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);
    this._messageWindow.terminateMessage();
    this.close();
};

Window_EventItem.prototype.onCancel = function () {
    $gameVariables.setValue($gameMessage.itemChoiceVariableId(), 0);
    this._messageWindow.terminateMessage();
    this.close();
};
