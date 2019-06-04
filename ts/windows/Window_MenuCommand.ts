import DataManager from "../managers/DataManager";
import TextManager from "../managers/TextManager";
import Window_Command from "./Window_Command";

// -----------------------------------------------------------------------------
// Window_MenuCommand
//
// The window for selecting a command on the menu screen.

export default class Window_MenuCommand extends Window_Command {
    public static _lastCommandSymbol: any;
    public static initCommandPosition: () => void;
    public addMainCommands: () => void;
    public addFormationCommand: () => void;
    public addOriginalCommands: () => void;
    public addOptionsCommand: () => void;
    public addSaveCommand: () => void;
    public addGameEndCommand: () => void;
    public needsCommand: (name: any) => any;
    public areMainCommandsEnabled: () => any;
    public isFormationEnabled: () => any;
    public isOptionsEnabled: () => boolean;
    public isSaveEnabled: () => any;
    public isGameEndEnabled: () => boolean;
    public constructor(x, y) {
        super(x, y);
        this.selectLast();
    }
    public selectLast(): any {
        throw new Error("Method not implemented.");
    }
}

Window_MenuCommand._lastCommandSymbol = null;

Window_MenuCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_MenuCommand.prototype.windowWidth = function() {
    return 240;
};

Window_MenuCommand.prototype.numVisibleRows = function() {
    return this.maxItems();
};

Window_MenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addFormationCommand();
    this.addOriginalCommands();
    this.addOptionsCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
};

Window_MenuCommand.prototype.addMainCommands = function() {
    const enabled = this.areMainCommandsEnabled();
    if (this.needsCommand("item")) {
        this.addCommand(TextManager.item, "item", enabled);
    }
    if (this.needsCommand("skill")) {
        this.addCommand(TextManager.skill, "skill", enabled);
    }
    if (this.needsCommand("equip")) {
        this.addCommand(TextManager.equip, "equip", enabled);
    }
    if (this.needsCommand("status")) {
        this.addCommand(TextManager.status, "status", enabled);
    }
};

Window_MenuCommand.prototype.addFormationCommand = function() {
    if (this.needsCommand("formation")) {
        const enabled = this.isFormationEnabled();
        this.addCommand(TextManager.formation, "formation", enabled);
    }
};

Window_MenuCommand.prototype.addOriginalCommands = function() {};

Window_MenuCommand.prototype.addOptionsCommand = function() {
    if (this.needsCommand("options")) {
        const enabled = this.isOptionsEnabled();
        this.addCommand(TextManager.options, "options", enabled);
    }
};

Window_MenuCommand.prototype.addSaveCommand = function() {
    if (this.needsCommand("save")) {
        const enabled = this.isSaveEnabled();
        this.addCommand(TextManager.save, "save", enabled);
    }
};

Window_MenuCommand.prototype.addGameEndCommand = function() {
    const enabled = this.isGameEndEnabled();
    this.addCommand(TextManager.gameEnd, "gameEnd", enabled);
};

Window_MenuCommand.prototype.needsCommand = function(name) {
    const flags = $dataSystem.menuCommands;
    if (flags) {
        switch (name) {
            case "item":
                return flags[0];
            case "skill":
                return flags[1];
            case "equip":
                return flags[2];
            case "status":
                return flags[3];
            case "formation":
                return flags[4];
            case "save":
                return flags[5];
        }
    }
    return true;
};

Window_MenuCommand.prototype.areMainCommandsEnabled = function() {
    return $gameParty.exists();
};

Window_MenuCommand.prototype.isFormationEnabled = function() {
    return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
};

Window_MenuCommand.prototype.isOptionsEnabled = function() {
    return true;
};

Window_MenuCommand.prototype.isSaveEnabled = function() {
    return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
};

Window_MenuCommand.prototype.isGameEndEnabled = function() {
    return true;
};

Window_MenuCommand.prototype.processOk = function() {
    Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_MenuCommand.prototype.selectLast = function() {
    this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
};
