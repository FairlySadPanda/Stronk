import { JsonEx } from "../core/JsonEx";
import { Game_Actor, Game_Actor_OnLoad } from "../objects/Game_Actor";
import { Window_EquipStatus } from "./Window_EquipStatus";
import { Window_ItemList } from "./Window_ItemList";

// -----------------------------------------------------------------------------
// Window_EquipItem
//
// The window for selecting an equipment item on the equipment screen.

export class Window_EquipItem extends Window_ItemList {
    private _actor: Game_Actor;
    private _slotId: number;
    private _statusWindow: Window_EquipStatus;

    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this._actor = null;
        this._slotId = 0;
    }

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.resetScroll();
        }
    }

    public setSlotId(slotId) {
        if (this._slotId !== slotId) {
            this._slotId = slotId;
            this.refresh();
            this.resetScroll();
        }
    }

    public includes(item) {
        if (item === null) {
            return true;
        }
        if (
            this._slotId < 0 ||
            item.etypeId !== this._actor.equipSlots()[this._slotId]
        ) {
            return false;
        }
        return this._actor.canEquip(item);
    }

    public isEnabled(item) {
        return true;
    }

    public selectLast() {}

    public setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    public updateHelp() {
        super.updateHelp();
        if (this._actor && this._statusWindow) {
            const actor = JsonEx.makeDeepCopy(this._actor);
            actor.forceChangeEquip(this._slotId, this.item());
            this._statusWindow.setTempActor(actor);
        }
    }

    public playOkSound() {}
}
