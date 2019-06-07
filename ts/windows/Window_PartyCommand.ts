import Graphics from "../core/Graphics";
import BattleManager from "../managers/BattleManager";
import TextManager from "../managers/TextManager";
import Window_Command from "./Window_Command";

// -----------------------------------------------------------------------------
// Window_PartyCommand
//
// The window for selecting whether to fight or escape on the battle screen.

export default class Window_PartyCommand extends Window_Command {
    public openness: number;

    public constructor() {
        super(
            0,
            Graphics.boxHeight - Window_PartyCommand.prototype.windowHeight()
        );
        this.openness = 0;
        this.deactivate();
    }

    public windowWidth() {
        return 192;
    }

    public numVisibleRows() {
        return 4;
    }

    public makeCommandList() {
        this.addCommand(TextManager.fight, "fight");
        this.addCommand(
            TextManager.escape,
            "escape",
            BattleManager.canEscape()
        );
    }

    public setup() {
        this.clearCommandList();
        this.makeCommandList();
        this.refresh();
        this.select(0);
        this.activate();
        this.open();
    }
}
