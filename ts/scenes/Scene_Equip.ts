import Graphics from "../core/Graphics";
import SoundManager from "../managers/SoundManager";
import Window_EquipCommand from "../windows/Window_EquipCommand";
import Window_EquipItem from "../windows/Window_EquipItem";
import Window_EquipSlot from "../windows/Window_EquipSlot";
import Window_EquipStatus from "../windows/Window_EquipStatus";
import Scene_MenuBase from "./Scene_MenuBase";

export default class Scene_Equip extends Scene_MenuBase {
    public createStatusWindow: () => void;
    public createCommandWindow: () => void;
    public createSlotWindow: () => void;
    public createItemWindow: () => void;
    public refreshActor: () => void;
    public commandEquip: () => void;
    public commandOptimize: () => void;
    public commandClear: () => void;
    public onSlotOk: () => void;
    public onSlotCancel: () => void;
    public onItemOk: () => void;
    public onItemCancel: () => void;
    public constructor() {
        super();
    }
}

Scene_Equip.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createStatusWindow();
    this.createCommandWindow();
    this.createSlotWindow();
    this.createItemWindow();
    this.refreshActor();
};

Scene_Equip.prototype.createStatusWindow = function () {
    this._statusWindow = new Window_EquipStatus(0, this._helpWindow.height);
    this.addWindow(this._statusWindow);
};

Scene_Equip.prototype.createCommandWindow = function () {
    const wx = this._statusWindow.width;
    const wy = this._helpWindow.height;
    const ww = Graphics.boxWidth - this._statusWindow.width;
    this._commandWindow = new Window_EquipCommand(wx, wy, ww);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler("equip",    this.commandEquip.bind(this));
    this._commandWindow.setHandler("optimize", this.commandOptimize.bind(this));
    this._commandWindow.setHandler("clear",    this.commandClear.bind(this));
    this._commandWindow.setHandler("cancel",   this.popScene.bind(this));
    this._commandWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._commandWindow.setHandler("pageup",   this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Equip.prototype.createSlotWindow = function () {
    const wx = this._statusWindow.width;
    const wy = this._commandWindow.y + this._commandWindow.height;
    const ww = Graphics.boxWidth - this._statusWindow.width;
    const wh = this._statusWindow.height - this._commandWindow.height;
    this._slotWindow = new Window_EquipSlot(wx, wy, ww, wh);
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._slotWindow.setStatusWindow(this._statusWindow);
    this._slotWindow.setHandler("ok",       this.onSlotOk.bind(this));
    this._slotWindow.setHandler("cancel",   this.onSlotCancel.bind(this));
    this.addWindow(this._slotWindow);
};

Scene_Equip.prototype.createItemWindow = function () {
    const wx = 0;
    const wy = this._statusWindow.y + this._statusWindow.height;
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_EquipItem(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setStatusWindow(this._statusWindow);
    this._itemWindow.setHandler("ok",     this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

Scene_Equip.prototype.refreshActor = function () {
    const actor = this.actor();
    this._statusWindow.setActor(actor);
    this._slotWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

Scene_Equip.prototype.commandEquip = function () {
    this._slotWindow.activate();
    this._slotWindow.select(0);
};

Scene_Equip.prototype.commandOptimize = function () {
    SoundManager.playEquip();
    this.actor().optimizeEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

Scene_Equip.prototype.commandClear = function () {
    SoundManager.playEquip();
    this.actor().clearEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

Scene_Equip.prototype.onSlotOk = function () {
    this._itemWindow.activate();
    this._itemWindow.select(0);
};

Scene_Equip.prototype.onSlotCancel = function () {
    this._slotWindow.deselect();
    this._commandWindow.activate();
};

Scene_Equip.prototype.onItemOk = function () {
    SoundManager.playEquip();
    this.actor().changeEquip(this._slotWindow.index(), this._itemWindow.item());
    this._slotWindow.activate();
    this._slotWindow.refresh();
    this._itemWindow.deselect();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
};

Scene_Equip.prototype.onItemCancel = function () {
    this._slotWindow.activate();
    this._itemWindow.deselect();
};

Scene_Equip.prototype.onActorChange = function () {
    this.refreshActor();
    this._commandWindow.activate();
};
