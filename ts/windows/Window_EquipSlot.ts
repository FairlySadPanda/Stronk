import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_EquipSlot
//
// The window for selecting an equipment slot on the equipment screen.

export default class Window_EquipSlot extends Window_Selectable {
    public _actor: any;
    public setActor: (actor: any) => void;
    public item: () => any;
    public slotName: (index: any) => any;
    public isEnabled: (index: any) => any;
    public setStatusWindow: (statusWindow: any) => void;
    public setItemWindow: (itemWindow: any) => void;
    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this._actor = null;
        this.refresh();
    }
}

Window_EquipSlot.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_EquipSlot.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setSlotId(this.index());
    }
};

Window_EquipSlot.prototype.maxItems = function() {
    return this._actor ? this._actor.equipSlots().length : 0;
};

Window_EquipSlot.prototype.item = function() {
    return this._actor ? this._actor.equips()[this.index()] : null;
};

Window_EquipSlot.prototype.drawItem = function(index) {
    if (this._actor) {
        const rect = this.itemRectForText(index);
        this.changeTextColor(this.systemColor());
        this.changePaintOpacity(this.isEnabled(index));
        this.drawText(
            this.slotName(index),
            rect.x,
            rect.y,
            138,
            this.lineHeight()
        );
        this.drawItemName(this._actor.equips()[index], rect.x + 138, rect.y);
        this.changePaintOpacity(true);
    }
};

Window_EquipSlot.prototype.slotName = function(index) {
    const slots = this._actor.equipSlots();
    return this._actor ? $dataSystem.equipTypes[slots[index]] : "";
};

Window_EquipSlot.prototype.isEnabled = function(index) {
    return this._actor ? this._actor.isEquipChangeOk(index) : false;
};

Window_EquipSlot.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.index());
};

Window_EquipSlot.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_EquipSlot.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
};

Window_EquipSlot.prototype.updateHelp = function() {
    Window_Selectable.prototype.updateHelp.call(this);
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setTempActor(null);
    }
};
