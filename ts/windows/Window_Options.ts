import Graphics from "../core/Graphics";
import Utils from "../core/Utils";
import ConfigManager from "../managers/ConfigManager";
import SoundManager from "../managers/SoundManager";
import TextManager from "../managers/TextManager";
import Window_Command from "./Window_Command";

// -----------------------------------------------------------------------------
// Window_Options
//
// The window for changing various settings on the options screen.

export default class Window_Options extends Window_Command {
    public addGeneralOptions: () => void;
    public addVolumeOptions: () => void;
    public statusWidth: () => number;
    public statusText: (index: any) => any;
    public isVolumeSymbol: (symbol: any) => any;
    public booleanStatusText: (value: any) => "ON" | "OFF";
    public volumeStatusText: (value: any) => string;
    public volumeOffset: () => number;
    public changeValue: (symbol: any, value: any) => void;
    public getConfigValue: (symbol: any) => any;
    public setConfigValue: (symbol: any, volume: any) => void;
    public constructor() {
        super(0, 0);
        this.updatePlacement();
    }
    public updatePlacement(): any {
        throw new Error("Method not implemented.");
    }
}

Window_Options.prototype.windowWidth = function() {
    return 400;
};

Window_Options.prototype.windowHeight = function() {
    return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
};

Window_Options.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};

Window_Options.prototype.makeCommandList = function() {
    this.addGeneralOptions();
    this.addVolumeOptions();
};

Window_Options.prototype.addGeneralOptions = function() {
    this.addCommand(TextManager.alwaysDash, "alwaysDash");
    this.addCommand(TextManager.commandRemember, "commandRemember");
};

Window_Options.prototype.addVolumeOptions = function() {
    this.addCommand(TextManager.bgmVolume, "bgmVolume");
    this.addCommand(TextManager.bgsVolume, "bgsVolume");
    this.addCommand(TextManager.meVolume, "meVolume");
    this.addCommand(TextManager.seVolume, "seVolume");
};

Window_Options.prototype.drawItem = function(index) {
    const rect = this.itemRectForText(index);
    const statusWidth = this.statusWidth();
    const titleWidth = rect.width - statusWidth;
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, "left");
    this.drawText(
        this.statusText(index),
        rect.x + titleWidth,
        rect.y,
        statusWidth,
        "right"
    );
};

Window_Options.prototype.statusWidth = function() {
    return 120;
};

Window_Options.prototype.statusText = function(index) {
    const symbol = this.commandSymbol(index);
    const value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        return this.volumeStatusText(value);
    } else {
        return this.booleanStatusText(value);
    }
};

Window_Options.prototype.isVolumeSymbol = function(symbol) {
    return symbol.indexOf("Volume") > -1;
};

Window_Options.prototype.booleanStatusText = function(value) {
    return value ? "ON" : "OFF";
};

Window_Options.prototype.volumeStatusText = function(value) {
    return value + "%";
};

Window_Options.prototype.processOk = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        value += this.volumeOffset();
        if (value > 100) {
            value = 0;
        }
        value = Utils.clamp(value, 0, 100);
        this.changeValue(symbol, value);
    } else {
        this.changeValue(symbol, !value);
    }
};

Window_Options.prototype.cursorRight = function(wrap) {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        value += this.volumeOffset();
        value = Utils.clamp(value, 0, 100);
        this.changeValue(symbol, value);
    } else {
        this.changeValue(symbol, true);
    }
};

Window_Options.prototype.cursorLeft = function(wrap) {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    let value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        value -= this.volumeOffset();
        value = Utils.clamp(value, 0, 100);
        this.changeValue(symbol, value);
    } else {
        this.changeValue(symbol, false);
    }
};

Window_Options.prototype.volumeOffset = function() {
    return 20;
};

Window_Options.prototype.changeValue = function(symbol, value) {
    const lastValue = this.getConfigValue(symbol);
    if (lastValue !== value) {
        this.setConfigValue(symbol, value);
        this.redrawItem(this.findSymbol(symbol));
        SoundManager.playCursor();
    }
};

Window_Options.prototype.getConfigValue = function(symbol) {
    return ConfigManager[symbol];
};

Window_Options.prototype.setConfigValue = function(symbol, volume) {
    ConfigManager[symbol] = volume;
};
