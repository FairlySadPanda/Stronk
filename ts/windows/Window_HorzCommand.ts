import Window_Command from "./Window_Command";

// -----------------------------------------------------------------------------
// Window_HorzCommand
//
// The command window for the horizontal selection format.

export default class Window_HorzCommand extends Window_Command {}

Window_HorzCommand.prototype.numVisibleRows = function() {
    return 1;
};

Window_HorzCommand.prototype.maxCols = function() {
    return 4;
};

Window_HorzCommand.prototype.itemTextAlign = function() {
    return "center";
};
