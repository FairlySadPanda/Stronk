import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_EquipSlot
//
// The window for selecting an equipment slot on the equipment screen.

export default class Window_EquipSlot extends Window_Selectable {
    public _actor: any;
    private _itemWindow: any;
    private _statusWindow: any;

    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this._actor = null;
        this.refresh();
    }

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    public update() {
        super.update.call(this);
        if (this._itemWindow) {
            this._itemWindow.setSlotId(this.index());
        }
    }

    public maxItems() {
        return this._actor ? this._actor.equipSlots().length : 0;
    }

    public item() {
        return this._actor ? this._actor.equips()[this.index()] : null;
    }

    public drawItem(index) {
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
            this.drawItemName(
                this._actor.equips()[index],
                rect.x + 138,
                rect.y
            );
            this.changePaintOpacity(true);
        }
    }

    public slotName(index) {
        const slots = this._actor.equipSlots();
        return this._actor ? $dataSystem.equipTypes[slots[index]] : "";
    }

    public isEnabled(index) {
        return this._actor ? this._actor.isEquipChangeOk(index) : false;
    }

    public isCurrentItemEnabled() {
        return this.isEnabled(this.index());
    }

    public setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    public setItemWindow(itemWindow) {
        this._itemWindow = itemWindow;
    }

    public updateHelp() {
        super.updateHelp.call(this);
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setTempActor(null);
        }
    }
}
