import { Window_Selectable } from "./Window_Selectable";
import { ConfigManager } from "../managers/ConfigManager";
import { Graphics } from "../core/Graphics";
import { SoundManager } from "../managers/SoundManager";
import { Utils } from "../core/Utils";

export class Window_MushOptionsMainCommand extends Window_Selectable {
    _section: any;
    _sectionMaxItems: number[];
    _backSpace: number;
    _cosmetics: { code: number }[];
    _graphics: { code: number }[];
    _audio: { code: number }[];
    _other: { code: number }[];

    public constructor(x, y, width, height) {
        Window_MushOptionsMainCommand.prototype.createSections();
        super(x, y, width, height);
        this.opacity = 0;
        this.refresh();
    }

    public maxItems() {
        return this._sectionMaxItems[this._section];
    }

    public maxCols() {
        return 1;
    }

    public getSection() {
        return this._section;
    }

    public changeSection(section) {
        if (this._section != section) {
            this._section = section;
            this.refresh();
            this.select(-1);
        }
    }

    public createSections() {
        this._section = 0;
        this._sectionMaxItems = [6, 4, 4, 2];
        this._backSpace = 8;
        this.refreshSectionsContents();
    }

    public refreshSectionsContents() {
        this._cosmetics = [
            { code: 1 },
            { code: 2 },
            { code: 3 },
            { code: 4 },
            { code: 5 },
            { code: 6 }
        ];
        this._graphics = [{ code: 7 }, { code: 8 }, { code: 15 }, { code: 16 }];
        this._audio = [{ code: 9 }, { code: 10 }, { code: 11 }, { code: 12 }];
        this._other = [{ code: 13 }, { code: 14 }];
    }

    public getConfig(symbol: string) {
        return ConfigManager[symbol];
    }

    public getBarHeight() {
        return 12;
    }

    public async drawItem(index) {
        const rect = this.itemRectForText(index);
        let s;
        switch (this._section) {
            case 0:
                s = this._cosmetics;
                break;
            case 1:
                s = this._graphics;
                break;
            case 2:
                s = this._audio;
                break;
            case 3:
                s = this._other;
                break;
            default:
                s = this._other;
                break;
        }

        let color1;
        let color2;
        let nb;
        let arr;
        let name;
        let curFull;
        let curMeter;
        let x;
        let y;
        let text;
        let bool;

        switch (s[index].code) {
            case 1: // window red
                color1 = ConfigManager.cosmeticsOptions.wRed.barColor1;
                color2 = ConfigManager.cosmeticsOptions.wRed.barColor2;
                this.drawWindowOptions(
                    this.getConfig("_windowRed"),
                    rect,
                    color1,
                    color2
                );
                break;
            case 2: // window green
                color1 = ConfigManager.cosmeticsOptions.wGreen.barColor1;
                color2 = ConfigManager.cosmeticsOptions.wGreen.barColor2;
                this.drawWindowOptions(
                    this.getConfig("_windowGreen"),
                    rect,
                    color1,
                    color2
                );
                break;
            case 3: // window blue
                color1 = ConfigManager.cosmeticsOptions.wBlue.barColor1;
                color2 = ConfigManager.cosmeticsOptions.wBlue.barColor2;
                this.drawWindowOptions(
                    this.getConfig("_windowBlue"),
                    rect,
                    color1,
                    color2
                );
                break;
            case 4: // window opacity
                color1 = ConfigManager.cosmeticsOptions.wOpacity.barColor1;
                color2 = ConfigManager.cosmeticsOptions.wOpacity.barColor2;
                this.drawWindowOptions(
                    this.getConfig("_windowOpacity"),
                    rect,
                    color1,
                    color2
                );
                break;
            case 5: // windowskin
                nb = this.getConfig("_windowskin");
                arr = ConfigManager.cosmeticsOptions.wSkin.list;
                if (arr != undefined) {
                    name = arr[nb];
                } else {
                    name = ConfigManager.cosmeticsOptions.wSkin.defaultName;
                }
                this.drawText(
                    name,
                    rect.x,
                    rect.y,
                    rect.width - this._backSpace,
                    undefined,
                    "right"
                );
                break;
            case 6: // menu background
                nb = this.getConfig("_menuBack");
                arr = ConfigManager.cosmeticsOptions.menuBack.list;
                if (arr !== undefined) {
                    name = arr[nb];
                } else {
                    name = ConfigManager.cosmeticsOptions.menuBack.defaultName;
                }
                this.drawText(
                    name,
                    rect.x,
                    rect.y,
                    rect.width - this._backSpace,
                    undefined,
                    "right"
                );
                break;
            case 7: // Screen Resolution
                nb = this.getConfig("_screenResolution");
                arr = ConfigManager.graphicsOptions.screenResolution.list;
                x = arr[nb][0];
                y = arr[nb][1];
                text = "" + x + "x" + y;
                this.drawText(
                    text,
                    rect.x,
                    rect.y,
                    rect.width - this._backSpace,
                    undefined,
                    "right"
                );
                break;
            case 8: // VSync
                bool = this.getConfig("_vSync");
                if (bool === true)
                    text = ConfigManager.graphicsOptions.vSync.onName;
                else {
                    text = ConfigManager.graphicsOptions.vSync.offName;
                }
                this.drawText(
                    text,
                    rect.x,
                    rect.y,
                    rect.width - this._backSpace,
                    undefined,
                    "right"
                );
                break;
            case 9: // BGM Volume
                color1 = ConfigManager.AudioSoundOptions.bgm.barColor1;
                color2 = ConfigManager.AudioSoundOptions.bgm.barColor2;
                this.drawAudioOptions(
                    this.getConfig("bgmVolume"),
                    rect,
                    color1,
                    color2
                );
                break;
            case 10: // BGS Volume
                color1 = ConfigManager.AudioSoundOptions.bgs.barColor1;
                color2 = ConfigManager.AudioSoundOptions.bgs.barColor2;
                this.drawAudioOptions(
                    this.getConfig("bgsVolume"),
                    rect,
                    color1,
                    color2
                );
                break;
            case 11: // ME Volume
                color1 = ConfigManager.AudioSoundOptions.me.barColor1;
                color2 = ConfigManager.AudioSoundOptions.me.barColor2;
                this.drawAudioOptions(
                    this.getConfig("meVolume"),
                    rect,
                    color1,
                    color2
                );
                break;
            case 12: // SE Volume
                color1 = ConfigManager.AudioSoundOptions.se.barColor1;
                color2 = ConfigManager.AudioSoundOptions.se.barColor2;
                this.drawAudioOptions(
                    this.getConfig("seVolume"),
                    rect,
                    color1,
                    color2
                );
                break;
            case 13: // Always Dash
                bool = this.getConfig("alwaysDash");
                if (bool === true)
                    text = ConfigManager.OtherOptions.alwaysDash.onName;
                if (bool == false)
                    text = ConfigManager.OtherOptions.alwaysDash.offName;
                this.drawText(
                    text,
                    rect.x,
                    rect.y,
                    rect.width - this._backSpace,
                    undefined,
                    "right"
                );
                break;
            case 14: // Command Remember
                bool = this.getConfig("commandRemember");
                if (bool == true)
                    text = ConfigManager.OtherOptions.commandRemember.onName;
                if (bool == false)
                    text = ConfigManager.OtherOptions.commandRemember.offName;
                this.drawText(
                    text,
                    rect.x,
                    rect.y,
                    rect.width - this._backSpace,
                    undefined,
                    "right"
                );
                break;
            case 15: // Fullscreen
                curFull = Graphics.isFullScreen();
                if (curFull === true) {
                    text = ConfigManager.graphicsOptions.fullScreen.onName;
                } else {
                    text = ConfigManager.graphicsOptions.fullScreen.offName;
                }
                this.drawText(
                    text,
                    rect.x,
                    rect.y,
                    rect.width - this._backSpace,
                    undefined,
                    "right"
                );
                break;
            case 16: // Fps Meter
                // curMeter = Graphics.fpsMeter.isPaused;
                // if (curMeter === false) {
                //     text = ConfigManager.graphicsOptions.fpsMeter.onName;
                // } else {
                //     text = ConfigManager.graphicsOptions.fpsMeter.offName;
                // }
                // this.drawText(
                //     text,
                //     rect.x,
                //     rect.y,
                //     rect.width - this._backSpace,
                //     undefined,
                //     "right"
                // );
                break;
        }
    }

    public drawWindowOptions(value, rect, color1, color2) {
        const wd = Math.floor((value / 255) * rect.width);
        this.contents.fillRect(
            rect.x,
            rect.y + this.lineHeight() - this.getBarHeight() - 4,
            rect.width,
            this.getBarHeight(),
            this.gaugeBackColor()
        );
        this.contents.gradientFillRect(
            rect.x + (rect.width - wd),
            rect.y + this.lineHeight() - this.getBarHeight() - 4,
            wd,
            this.getBarHeight(),
            color1,
            color2,
            false
        );
        this.drawText(
            value,
            rect.x,
            rect.y,
            rect.width - this._backSpace,
            undefined,
            "right"
        );
    }

    public drawAudioOptions(value, rect, color1, color2) {
        const wd = Math.floor((value / 100) * rect.width);
        this.contents.fillRect(
            rect.x,
            rect.y + this.lineHeight() - this.getBarHeight() - 4,
            rect.width,
            this.getBarHeight(),
            this.gaugeBackColor()
        );
        this.contents.gradientFillRect(
            rect.x + (rect.width - wd),
            rect.y + this.lineHeight() - this.getBarHeight() - 4,
            wd,
            this.getBarHeight(),
            color1,
            color2,
            false
        );
        this.drawText(
            value + "%",
            rect.x,
            rect.y,
            rect.width - this._backSpace,
            undefined,
            "right"
        );
    }

    public changeValue(symbol, value) {
        const lastValue = this.getGameSettingsMoe(symbol);
        if (lastValue !== value) {
            this.setConfigValue(symbol, value);
            SoundManager.playCursor();
        }
    }

    public setConfigValue(symbol, volume) {
        ConfigManager[symbol] = volume;
    }

    public changeValueWindowColor(symbol, numValue) {
        let value = this.getGameSettingsMoe(symbol);
        if (value === 255 && numValue > 0) {
            value = 0;
        } else if (value === 0 && numValue < 0) {
            value = 255;
        } else {
            value += numValue;
        }
        const newValue = Utils.clamp(value, 0, 255);
        this.changeValue(symbol, newValue);
        const t_red = this.getGameSettingsMoe("_windowRed");
        const t_green = this.getGameSettingsMoe("_windowGreen");
        const t_blue = this.getGameSettingsMoe("_windowBlue");
        const tone = [t_red, t_green, t_blue];
        $gameSystem.setWindowTone(tone);
    }

    public changeValueWindowOpacity(amount) {
        let value = this.getConfig("_windowOpacity");
        if (value == 255 && amount > 0) {
            value = 0;
        } else if (value == 0 && amount < 0) {
            value = 255;
        } else {
            value += amount;
        }
        const newValue = Utils.clamp(value, 0, 255);
        this.changeValue("_windowOpacity", newValue);
    }

    public changeListOption(
        amount: number,
        section: string,
        symbol: string,
        symbolParam: string
    ) {
        let value = this.getConfig(symbol);

        switch (section) {
            case "_Cosmetics":
                section = "cosmeticsOptions";
                break;
            case "_Graphics":
                section = "graphicsOptions";
                break;
            case "_Audio":
                section = "AudioSoundOptions";
                break;
            case "_Other":
                section = "OtherOptions";
                break;
        }

        const list = ConfigManager[section][symbolParam].list;

        if (list) {
            if (list.length > 1) {
                if (value == list.length - 1 && amount > 0) {
                    value = 0;
                } else if (value == 0 && amount < 0) {
                    value = list.length - 1;
                } else {
                    value += amount;
                }
                const newValue = Utils.clamp(value, 0, list.length - 1);
                this.changeValue(symbol, newValue);
            } else {
                SoundManager.playBuzzer();
            }
        } else {
            SoundManager.playBuzzer();
        }
    }

    public changeBoolOption(symbol: string) {
        const value = this.getConfig(symbol);
        if (value) {
            this.changeValue(symbol, false);
        } else {
            this.changeValue(symbol, true);
        }
    }

    public changeVolumeOption(amount: number, symbol: string) {
        let value = this.getConfig(symbol);
        if (value == 100 && amount > 0) {
            value = 0;
        } else if (value == 0 && amount < 0) {
            value = 100;
        } else {
            value += amount;
        }
        const newValue = Utils.clamp(value, 0, 100);
        this.changeValue(symbol, newValue);
    }
}
