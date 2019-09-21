import { Utils } from "../core/Utils";
import { AudioManager } from "./AudioManager";
import { StorageManager } from "./StorageManager";
import { Graphics } from "../core/Graphics";

declare const nw: any;

interface WindowColor {
    name: string;
    defaultValue: number;
    description: string;
    barColor1: string;
    barColor2: string;
}

interface ToggleOption {
    name: string;
    onName: string;
    offName: string;
}

interface CosmeticsOptions {
    name: string;
    wRed: WindowColor;
    wGreen: WindowColor;
    wBlue: WindowColor;
    wOpacity: WindowColor;
    wSkin: {
        name: string;
        list: any[];
        defaultName: string;
        description: string;
    };
    menuBack: {
        name: string;
        list?: any[];
        defaultName: string;
        description: string;
        stretch: boolean;
    };
}

interface Resolution {
    widthPx: number;
    heightPx: number;
}

interface GraphicsOptions {
    name: string;
    screenResolution: {
        name: string;
        list: any[];
        scale: boolean;
        reposition: boolean;
        internalFieldResolution: Resolution;
    };
    vSync: {
        name: string;
        defaultValue: boolean;
        onName: string;
        offName: string;
    };
    fullScreen: ToggleOption;
    fpsMeter: ToggleOption;
}

interface AudioSoundOptions {
    name: string;
    barColor1: string;
    barColor2: string;
}

interface AudioOptions {
    name: string;
    bgm: AudioSoundOptions;
    bgs: AudioSoundOptions;
    me: AudioSoundOptions;
    se: AudioSoundOptions;
}

interface OtherOptions {
    name: string;
    alwaysDash: ToggleOption;
    commandRemember: ToggleOption;
}

export abstract class ConfigManager {
    public static alwaysDash = false;
    public static commandRemember = false;
    private static _isFullScreen = false;
    private static _windowRed = 0;
    private static _windowGreen = 0;
    private static _windowBlue = 0;
    private static _windowOpacity = 0;
    private static _windowSkin = 0;
    private static _menuBack = 0;
    private static _screenResolution = 0;
    private static _windowSkins: any[];
    private static _menuBacks: any[];

    public static mapWidth = 854;
    public static mapHeight = 480;
    public static vSync = true;

    public static cosmeticsOptions: CosmeticsOptions = {
        name: "Cosmetics Options",
        menuBack: {
            defaultName: "Menu Back 1",
            description: "Menu Back 1 desc",
            name: "Name",
            stretch: false
        },
        wBlue: {
            name: "Blue",
            description: "BLUE!",
            defaultValue: 0,
            barColor1: "blue",
            barColor2: "teal"
        },
        wGreen: {
            name: "Green",
            description: "GREEN!",
            defaultValue: 0,
            barColor1: "green",
            barColor2: "lime"
        },
        wRed: {
            name: "Red",
            description: "RED!",
            defaultValue: 0,
            barColor1: "red",
            barColor2: "maroon"
        },
        wOpacity: {
            name: "Alpha",
            description: "ALPHA!",
            defaultValue: 255,
            barColor1: "silver",
            barColor2: "gray"
        },
        wSkin: {
            name: "Skin",
            description: "Skin desc",
            list: [],
            defaultName: "Skin def"
        }
    };

    public static graphicsOptions: GraphicsOptions = {
        name: "Graphics Options",
        vSync: {
            name: "VSync",
            defaultValue: true,
            offName: "OFF",
            onName: "ON"
        },
        screenResolution: {
            name: "Resolution",
            reposition: true,
            scale: false,
            list: [
                [800, 600],
                [1024, 768],
                [1280, 720],
                [1280, 1024],
                [1400, 900],
                [1600, 1200],
                [1920, 1080]
            ],
            internalFieldResolution: {
                widthPx: 960,
                heightPx: 540
            }
        },
        fullScreen: {
            name: "Fullscreen",
            offName: "OFF",
            onName: "ON"
        },
        fpsMeter: {
            name: "FPS",
            offName: "OFF",
            onName: "ON"
        }
    };

    public static AudioSoundOptions: AudioOptions = {
        name: "Audio",
        bgm: {
            name: "Music",
            barColor1: "gray",
            barColor2: "silver"
        },
        bgs: {
            name: "BGS",
            barColor1: "gray",
            barColor2: "silver"
        },
        me: { name: "ME", barColor1: "gray", barColor2: "silver" },
        se: { name: "SE", barColor1: "gray", barColor2: "silver" }
    };

    public static OtherOptions: OtherOptions = {
        name: "Other",
        alwaysDash: {
            name: "Dash",
            offName: "OFF",
            onName: "ON"
        },
        commandRemember: {
            name: "Command Remember",
            offName: "OFF",
            onName: "ON"
        }
    };

    public static get currentResolution(): Resolution {
        return {
            widthPx:
                ConfigManager.graphicsOptions.screenResolution.list[
                    ConfigManager._screenResolution
                ][0],
            heightPx:
                ConfigManager.graphicsOptions.screenResolution.list[
                    ConfigManager._screenResolution
                ][1]
        };
    }

    public static get fieldResolution(): Resolution {
        return ConfigManager.graphicsOptions.screenResolution
            .internalFieldResolution;
    }

    public static get isFullScreen(): boolean {
        return ConfigManager._isFullScreen;
    }

    public static set isFullScreen(value: boolean) {
        value ? Graphics.requestFullScreen() : Graphics.cancelFullScreen();
        ConfigManager._isFullScreen = value;
    }

    public static load() {
        try {
            const config = StorageManager.load(-1);
            if (config) {
                ConfigManager.applyData(JSON.parse(config));
            }
        } catch (e) {
            console.error(e);
        }
    }

    public static save() {
        StorageManager.save(-1, JSON.stringify(ConfigManager.makeData()));
    }

    public static makeData() {
        return {
            alwaysDash: ConfigManager.alwaysDash,
            commandRemember: ConfigManager.commandRemember,
            isFullScreen: ConfigManager.isFullScreen,
            bgmVolume: ConfigManager.bgmVolume,
            bgsVolume: ConfigManager.bgsVolume,
            meVolume: ConfigManager.meVolume,
            seVolume: ConfigManager.seVolume,
            _windowRed: ConfigManager._windowRed,
            _windowGreen: ConfigManager._windowGreen,
            _windowBlue: ConfigManager._windowBlue,
            _windowOpacity: ConfigManager._windowOpacity,
            _menuBack: ConfigManager._menuBack,
            _screenResolution: ConfigManager._screenResolution,
            _vSync: ConfigManager.vSync,
            graphicsOptions: ConfigManager.graphicsOptions,
            audioOptions: ConfigManager.AudioSoundOptions,
            otherOptions: ConfigManager.OtherOptions,
            cosmeticOptions: ConfigManager.cosmeticsOptions
        };
    }

    public static applyData(config: {}) {
        ConfigManager.alwaysDash = ConfigManager.readFlag(config, "alwaysDash");
        ConfigManager.commandRemember = ConfigManager.readFlag(
            config,
            "commandRemember"
        );
        ConfigManager.isFullScreen = ConfigManager.readFlag(
            config,
            "isFullScreen"
        );
        ConfigManager.bgmVolume = ConfigManager.readVolume(config, "bgmVolume");
        ConfigManager.bgsVolume = ConfigManager.readVolume(config, "bgsVolume");
        ConfigManager.meVolume = ConfigManager.readVolume(config, "meVolume");
        ConfigManager.seVolume = ConfigManager.readVolume(config, "seVolume");
        ConfigManager._windowRed = ConfigManager.readFlagWindow(
            config,
            "_windowRed"
        );
        ConfigManager._windowGreen = ConfigManager.readFlagWindow(
            config,
            "_windowGreen"
        );
        ConfigManager._windowBlue = ConfigManager.readFlagWindow(
            config,
            "_windowBlue"
        );
        ConfigManager._windowOpacity = ConfigManager.readFlagWindow(
            config,
            "_windowOpacity"
        );
        ConfigManager._windowSkin = ConfigManager.readFlagWindowSkin(config);
        ConfigManager._menuBack = ConfigManager.readFlagMenuBackground(config);
        ConfigManager._screenResolution = ConfigManager.readFlagScreenResolution(
            config
        );
        ConfigManager.vSync = ConfigManager.readFlagVSync(config);
        ConfigManager.cosmeticsOptions = ConfigManager.readObject(
            config,
            "cosmeticOptions"
        );
        ConfigManager.AudioSoundOptions = ConfigManager.readObject(
            config,
            "audioOptions"
        );
        ConfigManager.OtherOptions = ConfigManager.readObject(
            config,
            "otherOptions"
        );
        ConfigManager.graphicsOptions = ConfigManager.readObject(
            config,
            "graphicsOptions"
        );
    }

    public static readFlag(config: {}, name: string) {
        return !!config[name];
    }

    public static readObject(config: {}, name: string): any {
        return config[name];
    }

    public static readFlagWindow(config: {}, name: string) {
        const value = config[name];
        if (value !== undefined) {
            return Utils.clamp(value, 0, 255);
        } else {
            switch (name) {
                case "_windowRed":
                    return 0;
                case "_windowGreen":
                    return 0;
                case "_windowBlue":
                    return 0;
                case "_windowOpacity":
                    return 0;
            }
        }
    }

    public static readFlagWindowSkin(config: {}) {
        const value = config["_windowSkin"];
        let length = 0;
        if (ConfigManager._windowSkins !== undefined) {
            length = ConfigManager._windowSkins.length;
        }
        if (value !== undefined) {
            return Utils.clamp(value, 0, length);
        }
    }

    public static readFlagMenuBackground(config: {}) {
        const value = config["_menuBack"];
        let length = 0;
        if (ConfigManager._menuBacks !== undefined) {
            length = ConfigManager._menuBacks.length;
        }
        if (value !== undefined) {
            return Utils.clamp(value, 0, length);
        } else {
            return 0;
        }
    }

    public static readFlagScreenResolution(config: {}) {
        const value = config["_screenResolution"];
        let length = 0;
        if (ConfigManager.graphicsOptions.screenResolution.list !== undefined) {
            length = ConfigManager.graphicsOptions.screenResolution.list.length;
        }
        if (value !== undefined) {
            return Utils.clamp(value, 0, length);
        } else {
            return 0;
        }
    }

    public static readFlagVSync(config: {}) {
        const value = config["_vSync"];
        if (value) {
            return value;
        } else {
            return true;
        }
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

    public static get xOffset(): number {
        const screenRatio =
            ConfigManager.currentResolution.widthPx /
            ConfigManager.currentResolution.heightPx;
        const mapRatio =
            ConfigManager.fieldResolution.widthPx /
            ConfigManager.fieldResolution.heightPx;
        const ratioToMoveBy = (mapRatio - screenRatio) / 4;
        return ratioToMoveBy * ConfigManager.fieldResolution.widthPx;
    }
}
