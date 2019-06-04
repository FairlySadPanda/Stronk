import Graphics from "../core/Graphics";
import TextManager from "../managers/TextManager";
import Window_Command from "./Window_Command";

// -----------------------------------------------------------------------------
// Window_GameEnd
//
// The window for selecting "Go to Title" on the game end screen.

export default class Window_GameEnd extends Window_Command {
    public openness: number;
    public constructor() {
        super(0, 0);
        this.updatePlacement();
        this.openness = 0;
        this.open();
    }
    public updatePlacement(): any {
        throw new Error("Method not implemented.");
    }
}

Window_GameEnd.prototype.windowWidth = function() {
    return 240;
};

Window_GameEnd.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};

Window_GameEnd.prototype.makeCommandList = function() {
    this.addCommand(TextManager.toTitle, "toTitle");
    this.addCommand(TextManager.cancel, "cancel");
};
