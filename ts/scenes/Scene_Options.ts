import ConfigManager from "../managers/ConfigManager";
import Window_Options from "../windows/Window_Options";
import Scene_MenuBase from "./Scene_MenuBase";

export default class Scene_Options extends Scene_MenuBase {
    public createOptionsWindow: () => void;
}

Scene_Options.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
};

Scene_Options.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
};

Scene_Options.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_Options();
    this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
};
