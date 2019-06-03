import TextManager from "../managers/TextManager";
import Window_HorzCommand from "./Window_HorzCommand";

//-----------------------------------------------------------------------------
// Window_EquipCommand
//
// The window for selecting a command on the equipment screen.

export default class Window_EquipCommand extends Window_HorzCommand {
    public _windowWidth: any;
    public constructor(x, y, width) {
        super(x, y);
        this._windowWidth = width;
    }
}

Window_EquipCommand.prototype.windowWidth = function () {
    return this._windowWidth;
};

Window_EquipCommand.prototype.maxCols = function () {
    return 3;
};

Window_EquipCommand.prototype.makeCommandList = function () {
    this.addCommand(TextManager.equip2,   "equip");
    this.addCommand(TextManager.optimize, "optimize");
    this.addCommand(TextManager.clear,    "clear");
};
