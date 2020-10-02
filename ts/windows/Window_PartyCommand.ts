import { Graphics } from "../core/Graphics";
import { BattleManager } from "../managers/BattleManager";
import { TextManager } from "../managers/TextManager";
import { Window_Command } from "./Window_Command";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

// -----------------------------------------------------------------------------
// Window_PartyCommand
//
// The window for selecting whether to fight or escape on the battle screen.

export class Window_PartyCommand extends Window_Command {
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
        return Yanfly.Param.BECCommandRows;
    }

    public itemTextAlign() {
        return Yanfly.Param.BECCommandAlign;
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
