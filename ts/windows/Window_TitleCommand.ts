import Graphics from "../core/Graphics";
import DataManager from "../managers/DataManager";
import TextManager from "../managers/TextManager";
import Window_Command from "./Window_Command";

// -----------------------------------------------------------------------------
// Window_TitleCommand
//
// The window for selecting New Game/Continue on the title screen.

export default class Window_TitleCommand extends Window_Command {
    public static initCommandPosition() {
        Window_TitleCommand._lastCommandSymbol = null;
    }

    private static _lastCommandSymbol = null;

    public openness: number;

    public constructor() {
        super(0, 0);
        this.updatePlacement();
        this.openness = 0;
        this.selectLast();
    }

    public windowWidth() {
        return 240;
    }

    public updatePlacement() {
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = Graphics.boxHeight - this.height - 96;
    }

    public makeCommandList() {
        this.addCommand(TextManager.newGame, "newGame");
        this.addCommand(
            TextManager.continue_,
            "continue",
            this.isContinueEnabled()
        );
        this.addCommand(TextManager.options, "options");
    }

    public isContinueEnabled() {
        return DataManager.isAnySavefileExists();
    }

    public processOk() {
        Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }

    public selectLast() {
        if (Window_TitleCommand._lastCommandSymbol) {
            this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
        } else if (this.isContinueEnabled()) {
            this.selectSymbol("continue");
        }
    }
}
