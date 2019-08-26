import Utils from "../core/Utils";
import AudioManager from "./AudioManager";
import StorageManager from "./StorageManager";

declare const nw: any;

export default abstract class ConfigManager {
    public static alwaysDash = false;
    public static commandRemember = false;
    private static _isFullScreen = false;

    public static get isFullScreen(): boolean {
        return this._isFullScreen;
    }

    public static set isFullScreen(value: boolean) {
        value
            ? nw.Window.get().enterKioskMode()
            : nw.Window.get().leaveKioskMode();
        this._isFullScreen = value;
    }

    public static load() {
        let json;
        let config = {};
        try {
            json = StorageManager.load(-1);
        } catch (e) {
            console.error(e);
        }
        if (json) {
            config = JSON.parse(json);
        }
        this.applyData(config);
    }

    public static save() {
        StorageManager.save(-1, JSON.stringify(this.makeData()));
    }

    public static makeData() {
        return {
            alwaysDash: this.alwaysDash,
            commandRemember: this.commandRemember,
            isFullScreen: this.isFullScreen,
            bgmVolume: this.bgmVolume,
            bgsVolume: this.bgsVolume,
            meVolume: this.meVolume,
            seVolume: this.seVolume
        };
    }

    public static applyData(config) {
        this.alwaysDash = this.readFlag(config, "alwaysDash");
        this.commandRemember = this.readFlag(config, "commandRemember");
        this.isFullScreen = this.readFlag(config, "isFullScreen");
        this.bgmVolume = this.readVolume(config, "bgmVolume");
        this.bgsVolume = this.readVolume(config, "bgsVolume");
        this.meVolume = this.readVolume(config, "meVolume");
        this.seVolume = this.readVolume(config, "seVolume");
    }

    public static readFlag(config, name) {
        return !!config[name];
    }

    public static readVolume(config, name) {
        const value = config[name];
        if (value !== undefined) {
            return Utils.clamp(Number(value), 0, 100);
        } else {
            return 100;
        }
    }

    public static get bgmVolume() {
        return AudioManager.bgmVolume;
    }

    public static set bgmVolume(value) {
        AudioManager.bgmVolume = value;
    }

    public static get bgsVolume() {
        return AudioManager.bgsVolume;
    }

    public static set bgsVolume(value) {
        AudioManager.bgsVolume = value;
    }

    public static get meVolume() {
        return AudioManager.meVolume;
    }

    public static set meVolume(value) {
        AudioManager.meVolume = value;
    }

    public static get seVolume() {
        return AudioManager.seVolume;
    }

    public static set seVolume(value) {
        AudioManager.seVolume = value;
    }
}
