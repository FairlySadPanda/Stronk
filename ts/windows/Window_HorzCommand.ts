import Window_Command from "./Window_Command";

// -----------------------------------------------------------------------------
// Window_HorzCommand
//
// The command window for the horizontal selection format.

export default class Window_HorzCommand extends Window_Command {
    public numVisibleRows() {
        return 1;
    }

    public maxCols() {
        return 4;
    }

    public itemTextAlign(): CanvasTextAlign {
        return "center";
    }
}
