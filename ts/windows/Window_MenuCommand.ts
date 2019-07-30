import DataManager from "../managers/DataManager";
import TextManager from "../managers/TextManager";
import Window_Command from "./Window_Command";

// -----------------------------------------------------------------------------
// Window_MenuCommand
//
// The window for selecting a command on the menu screen.

export default class Window_MenuCommand extends Window_Command {
    private static _lastCommandSymbol = null;

    public static initCommandPosition() {
        this._lastCommandSymbol = null;
    }

    public constructor(x, y) {
        super(x, y);
        this.selectLast();
    }

    public windowWidth() {
        return 240;
    }

    public numVisibleRows() {
        return this.maxItems();
    }

    public makeCommandList() {
        this.addMainCommands();
        this.addFormationCommand();
        this.addOriginalCommands();
        this.addOptionsCommand();
        this.addSaveCommand();
        this.addGameEndCommand();
    }

    public addMainCommands() {
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
    }

    public addFormationCommand() {
        if (this.needsCommand("formation")) {
            const enabled = this.isFormationEnabled();
            this.addCommand(TextManager.formation, "formation", enabled);
        }
    }

    public addOriginalCommands() {}

    public addOptionsCommand() {
        if (this.needsCommand("options")) {
            const enabled = this.isOptionsEnabled();
            this.addCommand(TextManager.options, "options", enabled);
        }
    }

    public addSaveCommand() {
        if (this.needsCommand("save")) {
            const enabled = this.isSaveEnabled();
            this.addCommand(TextManager.save, "save", enabled);
        }
    }

    public addGameEndCommand() {
        const enabled = this.isGameEndEnabled();
        this.addCommand(TextManager.gameEnd, "gameEnd", enabled);
    }


    public needsCommand(name: string): boolean {
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
    }

    public areMainCommandsEnabled() {
        return $gameParty.exists();
    }

    public isFormationEnabled() {
        return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
    }

    public isOptionsEnabled() {
        return true;
    }

    public isSaveEnabled() {
        return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
    }

    public isGameEndEnabled() {
        return true;
    }

    public processOk() {
        Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }

    public selectLast() {
        this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
    }
}
