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
    public constructor() {
        super(0, 0);
        this.updatePlacement();
    }

    public windowWidth() {
        return 400;
    }

    public windowHeight() {
        return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
    }

    public updatePlacement() {
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = (Graphics.boxHeight - this.height) / 2;
    }

    public makeCommandList() {
        this.addGeneralOptions();
        this.addVolumeOptions();
    }

    public addGeneralOptions() {
        this.addCommand(TextManager.alwaysDash, "alwaysDash");
        this.addCommand(TextManager.commandRemember, "commandRemember");
    }

    public addVolumeOptions() {
        this.addCommand(TextManager.bgmVolume, "bgmVolume");
        this.addCommand(TextManager.bgsVolume, "bgsVolume");
        this.addCommand(TextManager.meVolume, "meVolume");
        this.addCommand(TextManager.seVolume, "seVolume");
    }

    public drawItem(index) {
        const rect = this.itemRectForText(index);
        const statusWidth = this.statusWidth();
        const titleWidth = rect.width - statusWidth;
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(
            this.commandName(index),
            rect.x,
            rect.y,
            titleWidth,
            undefined,
            "left"
        );
        this.drawText(
            this.statusText(index),
            rect.x + titleWidth,
            rect.y,
            statusWidth,
            undefined,
            "right"
        );
    }

    public statusWidth() {
        return 120;
    }

    public statusText(index) {
        const symbol = this.commandSymbol(index);
        const value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            return this.volumeStatusText(value);
        } else {
            return this.booleanStatusText(value);
        }
    }

    public isVolumeSymbol(symbol) {
        return symbol.indexOf("Volume") > -1;
    }

    public booleanStatusText(value) {
        return value ? "ON" : "OFF";
    }

    public volumeStatusText(value) {
        return value + "%";
    }

    public processOk() {
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
    }

    public cursorRight(wrap) {
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
    }

    public cursorLeft(wrap) {
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
    }

    public volumeOffset() {
        return 20;
    }

    public changeValue(symbol, value) {
        const lastValue = this.getConfigValue(symbol);
        if (lastValue !== value) {
            this.setConfigValue(symbol, value);
            this.redrawItem(this.findSymbol(symbol));
            SoundManager.playCursor();
        }
    }

    public getConfigValue(symbol) {
        return ConfigManager[symbol];
    }

    public setConfigValue(symbol, volume) {
        ConfigManager[symbol] = volume;
    }
}
