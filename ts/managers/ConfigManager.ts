import Utils from "../core/Utils";
import AudioManager from "./AudioManager";
import StorageManager from "./StorageManager";

export default abstract class ConfigManager {
    public static alwaysDash: boolean;
    public static commandRemember: boolean;
    public static load: () => void;
    public static save: () => void;
    public static makeData: () => { "alwaysDash": any; "commandRemember": any; "bgmVolume": any; "bgsVolume": any; "meVolume": any; "seVolume": any; };
    public static applyData: (config: any) => void;
    public static readFlag: (config: any, name: any) => boolean;
    public static readVolume: (config: any, name: any) => number;
}

ConfigManager.alwaysDash        = false;
ConfigManager.commandRemember   = false;

Object.defineProperty(ConfigManager, "bgmVolume", {
    "get"() {
        return AudioManager._bgmVolume;
    },
    "set"(value) {
        AudioManager.bgmVolume = value;
    },
    "configurable": true
});

Object.defineProperty(ConfigManager, "bgsVolume", {
    "get"() {
        return AudioManager.bgsVolume;
    },
    "set"(value) {
        AudioManager.bgsVolume = value;
    },
    "configurable": true
});

Object.defineProperty(ConfigManager, "meVolume", {
    "get"() {
        return AudioManager.meVolume;
    },
    "set"(value) {
        AudioManager.meVolume = value;
    },
    "configurable": true
});

Object.defineProperty(ConfigManager, "seVolume", {
    "get"() {
        return AudioManager.seVolume;
    },
    "set"(value) {
        AudioManager.seVolume = value;
    },
    "configurable": true
});

ConfigManager.load = function () {
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
};

ConfigManager.save = function () {
    StorageManager.save(-1, JSON.stringify(this.makeData()));
};

ConfigManager.makeData = function () {
    return {
        "alwaysDash": this.alwaysDash,
        "commandRemember": this.commandRemember,
        "bgmVolume": this.bgmVolume,
        "bgsVolume": this.bgsVolume,
        "meVolume": this.meVolume,
        "seVolume": this.seVolume
    };
};

ConfigManager.applyData = function (config) {
    this.alwaysDash = this.readFlag(config, "alwaysDash");
    this.commandRemember = this.readFlag(config, "commandRemember");
    this.bgmVolume = this.readVolume(config, "bgmVolume");
    this.bgsVolume = this.readVolume(config, "bgsVolume");
    this.meVolume = this.readVolume(config, "meVolume");
    this.seVolume = this.readVolume(config, "seVolume");
};

ConfigManager.readFlag = function (config, name) {
    return !!config[name];
};

ConfigManager.readVolume = function (config, name) {
    const value = config[name];
    if (value !== undefined) {
        return Utils.clamp(Number(value), 0, 100);
    } else {
        return 100;
    }
};
