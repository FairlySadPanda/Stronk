import { ConfigManager } from "../managers/ConfigManager";
import { Window_Options } from "../windows/Window_Options";
import { Scene_MenuBase } from "./Scene_MenuBase";

export class Scene_Options extends Scene_MenuBase {
    private _optionsWindow: Window_Options;

    public create() {
        super.create();
        this.createOptionsWindow();
    }

    public terminate() {
        super.terminate();
        ConfigManager.save();
    }

    public createOptionsWindow() {
        this._optionsWindow = new Window_Options();
        this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._optionsWindow);
    }
}
