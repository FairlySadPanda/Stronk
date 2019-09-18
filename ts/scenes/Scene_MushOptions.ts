import { Scene_MenuBase } from "./Scene_MenuBase";
import { ConfigManager } from "../managers/ConfigManager";
import { Graphics } from "../core/Graphics";
import { Input } from "../core/Input";
import { SoundManager } from "../managers/SoundManager";
import { SceneManager } from "../managers/SceneManager";
import { Window_MushOptionsSections } from "../windows/Windows_MushOptionsSections";
import { Window_MushOptionsMainCommand } from "../windows/Window_MushOptionsMainCommand";
import { Window_MushOptionsMainBack } from "../windows/Window_MushOptionsMainBack";

export class Scene_MushOptions extends Scene_MenuBase {
    private timer: number;
    private windowSections: Window_MushOptionsSections;
    private windowMainBack: Window_MushOptionsMainBack;
    private windowMainCommand: Window_MushOptionsMainCommand;

    public constructor() {
        super();
        this.timer = 0;
    }

    public create() {
        super.create();
        this.createOptionsWindow();
    }

    public update() {
        super.update();
        this.updateSection();
        this.updateInputs();
        if (this.windowMainCommand.getSection() == 1) {
            if (this.timer < 15) {
                this.timer += 1;
            } else {
                this.timer = 0;
                this.windowMainCommand.refresh();
            }
        }
    }

    public terminate() {
        this._bypassFirstClear = true;
        super.terminate();
        ConfigManager.save();
        this.clearChildren();
    }

    public createOptionsWindow() {
        const wsp_width = Math.floor(Graphics.width - Graphics.width * 0.1);
        const wsp_x = Math.floor((Graphics.width - wsp_width) / 2);
        const wsp_y = Math.floor((Graphics.height - 328) / 2);
        this.windowSections = new Window_MushOptionsSections(
            wsp_x,
            wsp_y,
            wsp_width,
            72
        );
        this.addChild(this.windowSections);
        // -----------------------
        const wmb_x = wsp_x;
        const wmb_y = wsp_y + this.windowSections.height;
        const wmb_width = wsp_width;
        this.windowMainBack = new Window_MushOptionsMainBack(
            wmb_x,
            wmb_y,
            wmb_width,
            256
        );
        this.addChild(this.windowMainBack);
        // -----------------------
        const wmc_x = wmb_x + wmb_width / 2;
        const wmc_y = wmb_y;
        const wmc_width = wmb_width / 2;
        this.windowMainCommand = new Window_MushOptionsMainCommand(
            wmc_x,
            wmc_y,
            wmc_width,
            256
        );
        this.addChild(this.windowMainCommand);
    }

    public repositionWindows() {
        const wsp_width = Math.floor(Graphics.width - Graphics.width * 0.1);
        const wsp_x = Math.floor((Graphics.width - wsp_width) / 2);
        const wsp_y = Math.floor((Graphics.height - 328) / 2);
        this.windowSections.x = wsp_x;
        this.windowSections.y = wsp_y;
        this.windowSections.width = wsp_width;
        this.windowSections.createContents();
        this.windowSections.refresh();
        this.windowSections.select(this.windowSections.index());
        // -----------------------
        const wmb_x = wsp_x;
        const wmb_y = wsp_y + this.windowSections.height;
        const wmb_width = wsp_width;
        this.windowMainBack.x = wmb_x;
        this.windowMainBack.y = wmb_y;
        this.windowMainBack.width = wmb_width;
        this.windowMainBack.createContents();
        this.windowMainBack.refresh();
        // -----------------------
        const wmc_x = wmb_x + wmb_width / 2;
        const wmc_y = wmb_y;
        const wmc_width = wmb_width / 2;
        this.windowMainCommand.x = wmc_x;
        this.windowMainCommand.y = wmc_y;
        this.windowMainCommand.width = wmc_width;
        this.windowMainCommand.createContents();
        this.windowMainCommand.refresh();
        this.windowMainCommand.select(this.windowMainCommand.index());
    }

    public updateSection() {
        this.windowMainCommand.changeSection(this.windowSections.index());
        this.windowMainBack.changeSection(this.windowSections.index());
    }

    public updateInputs() {
        if (Input.isTriggered("ok")) {
            SoundManager.playOk();
            if (this.windowSections.active == true) {
                this.windowSections.deactivate();
                this.windowMainCommand.activate();
                this.windowMainCommand.select(0);
            } else if (this.windowMainCommand.active == true) {
                this.updateInputOkMain();
            }
        } else if (Input.isTriggered("escape")) {
            SoundManager.playCancel();
            if (this.windowSections.active == true) {
                this.popScene();
            } else if (this.windowMainCommand.active == true) {
                this.windowSections.activate();
                this.windowMainCommand.deactivate();
                this.windowMainCommand.select(-1);
            }
        } else if (Input.isRepeated("left")) {
            if (this.windowMainCommand.active == true) {
                this.updateInputLeftRight("left");
            }
        } else if (Input.isRepeated("right")) {
            if (this.windowMainCommand.active == true) {
                this.updateInputLeftRight("right");
            }
        }
    }

    public updateInputLeftRight(arrow: "left" | "right") {
        const amount = arrow === "left" ? -1 : 1;

        if (this.windowMainCommand.getSection() == 0) {
            if (
                this.windowMainCommand.index() >= 0 &&
                this.windowMainCommand.index() <= 2
            ) {
                const symbol = ["_windowRed", "_windowGreen", "_windowBlue"];
                this.windowMainCommand.changeValueWindowColor(
                    symbol[this.windowMainCommand.index()],
                    amount * -5
                );
                this.windowMainCommand.refresh();
            } else if (this.windowMainCommand.index() == 3) {
                this.windowMainCommand.changeValueWindowOpacity(amount * -5);
                this.windowMainCommand.refresh();
                this.windowSections.opacity = this.windowMainCommand.getConfig(
                    "_windowOpacity"
                );
                this.windowMainBack.opacity = this.windowMainCommand.getConfig(
                    "_windowOpacity"
                );
            } else if (this.windowMainCommand.index() == 4) {
                this.windowMainCommand.changeListOption(
                    amount,
                    "_Cosmetics",
                    "_windowskin",
                    "wSkin"
                );
                this.windowMainCommand.refresh();
                this.windowSections.loadWindowskin();
                this.windowMainBack.loadWindowskin();
            } else if (this.windowMainCommand.index() == 5) {
                this.windowMainCommand.changeListOption(
                    amount,
                    "_Cosmetics",
                    "_menuBack",
                    "menuBack"
                );
                this.windowMainCommand.refresh();
                this.refreshMenuBackground();
            }
        } else if (this.windowMainCommand.getSection() == 1) {
            if (this.windowMainCommand.index() == 0) {
                this.windowMainCommand.changeListOption(
                    amount,
                    "_Graphics",
                    "_screenResolution",
                    "screenResolution"
                );
                const list =
                    ConfigManager.graphicsOptions.screenResolution.list;
                if (list) {
                    const value = ConfigManager["_screenResolution"];
                    SceneManager.changeGraphicResolution(
                        list[value][0],
                        list[value][1]
                    );
                }
                this.repositionWindows();
                this.refreshMenuBackground();
            } else if (this.windowMainCommand.index() == 1) {
                this.windowMainCommand.changeBoolOption("_vSync");
                this.windowMainCommand.refresh();
            }
        } else if (this.windowMainCommand.getSection() == 2) {
            if (
                this.windowMainCommand.index() >= 0 &&
                this.windowMainCommand.index() <= 3
            ) {
                const symbols = [
                    "bgmVolume",
                    "bgsVolume",
                    "meVolume",
                    "seVolume"
                ];
                this.windowMainCommand.changeVolumeOption(
                    amount * -5,
                    symbols[this.windowMainCommand.index()]
                );
                this.windowMainCommand.refresh();
            }
        } else if (this.windowMainCommand.getSection() == 3) {
            if (
                this.windowMainCommand.index() >= 0 &&
                this.windowMainCommand.index() <= 1
            ) {
                const symbols = ["alwaysDash", "commandRemember"];
                this.windowMainCommand.changeBoolOption(
                    symbols[this.windowMainCommand.index()]
                );
                this.windowMainCommand.refresh();
            }
        }
    }

    public updateInputOkMain() {
        if (this.windowMainCommand.getSection() == 0) {
            if (
                this.windowMainCommand.index() >= 0 &&
                this.windowMainCommand.index() <= 2
            ) {
                this.windowMainCommand.refresh();
            } else if (this.windowMainCommand.index() == 3) {
                this.windowMainCommand.refresh();
                this.windowSections.opacity = this.windowMainCommand.getConfig(
                    "_windowOpacity"
                );
                this.windowMainBack.opacity = this.windowMainCommand.getConfig(
                    "_windowOpacity"
                );
            } else if (this.windowMainCommand.index() == 4) {
                this.windowMainCommand.changeListOption(
                    1,
                    "_Cosmetics",
                    "_windowskin",
                    "wSkin"
                );
                this.windowMainCommand.refresh();
                this.windowSections.loadWindowskin();
                this.windowMainBack.loadWindowskin();
            } else if (this.windowMainCommand.index() == 5) {
                this.windowMainCommand.changeListOption(
                    1,
                    "_Cosmetics",
                    "_menuBack",
                    "menuBack"
                );
                this.windowMainCommand.refresh();
                this.refreshMenuBackground();
            }
        } else if (this.windowMainCommand.getSection() == 1) {
            if (this.windowMainCommand.index() == 0) {
                this.windowMainCommand.changeListOption(
                    1,
                    "_Graphics",
                    "_screenResolution",
                    "screenResolution"
                );
                const list =
                    ConfigManager.graphicsOptions.screenResolution.list;
                if (list) {
                    const value = ConfigManager["_screenResolution"];
                    SceneManager.changeGraphicResolution(
                        list[value][0],
                        list[value][1]
                    );
                }
                this.repositionWindows();
            } else if (this.windowMainCommand.index() == 1) {
                this.windowMainCommand.changeBoolOption("_vSync");
                this.windowMainCommand.refresh();
            } else if (this.windowMainCommand.index() == 2) {
                Graphics._switchFullScreen();
                this.windowMainCommand.refresh();
            } else if (this.windowMainCommand.index() == 3) {
                // if (!Graphics.fpsMeter.isPaused) {
                //     Graphics._switchFPSMeter();
                // }
                // Graphics._switchFPSMeter();
                this.windowMainCommand.refresh();
            }
        } else if (this.windowMainCommand.getSection() == 2) {
            if (
                this.windowMainCommand.index() >= 0 &&
                this.windowMainCommand.index() <= 3
            ) {
                this.windowMainCommand.refresh();
            }
        } else if (this.windowMainCommand.getSection() == 3) {
            if (
                this.windowMainCommand.index() >= 0 &&
                this.windowMainCommand.index() <= 1
            ) {
                const symbols = ["alwaysDash", "commandRemember"];
                this.windowMainCommand.changeBoolOption(
                    symbols[this.windowMainCommand.index()]
                );
                this.windowMainCommand.refresh();
            }
        }
    }
}
