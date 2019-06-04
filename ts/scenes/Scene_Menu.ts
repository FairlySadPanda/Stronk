import Graphics from "../core/Graphics";

import SceneManager from "../managers/SceneManager";
import Window_Gold from "../windows/Window_Gold";
import Window_MenuCommand from "../windows/Window_MenuCommand";
import Window_MenuStatus from "../windows/Window_MenuStatus";
import Scene_Equip from "./Scene_Equip";
import Scene_GameEnd from "./Scene_GameEnd";
import Scene_Item from "./Scene_Item";
import Scene_MenuBase from "./Scene_MenuBase";
import Scene_Options from "./Scene_Options";
import Scene_Save from "./Scene_Save";
import Scene_Skill from "./Scene_Skill";
import Scene_Status from "./Scene_Status";

export default class Scene_Menu extends Scene_MenuBase {
    public createCommandWindow: () => void;
    public createGoldWindow: () => void;
    public createStatusWindow: () => void;
    public commandItem: () => void;
    public commandPersonal: () => void;
    public commandFormation: () => void;
    public commandOptions: () => void;
    public commandSave: () => void;
    public commandGameEnd: () => void;
    public onPersonalOk: () => void;
    public onPersonalCancel: () => void;
    public onFormationOk: () => void;
    public onFormationCancel: () => void;
}

Scene_Menu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createGoldWindow();
    this.createStatusWindow();
};

Scene_Menu.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._statusWindow.refresh();
};

Scene_Menu.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_MenuCommand(0, 0);
    this._commandWindow.setHandler("item", this.commandItem.bind(this));
    this._commandWindow.setHandler("skill", this.commandPersonal.bind(this));
    this._commandWindow.setHandler("equip", this.commandPersonal.bind(this));
    this._commandWindow.setHandler("status", this.commandPersonal.bind(this));
    this._commandWindow.setHandler(
        "formation",
        this.commandFormation.bind(this)
    );
    this._commandWindow.setHandler("options", this.commandOptions.bind(this));
    this._commandWindow.setHandler("save", this.commandSave.bind(this));
    this._commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Menu.prototype.createGoldWindow = function() {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.y = Graphics.boxHeight - this._goldWindow.height;
    this.addWindow(this._goldWindow);
};

Scene_Menu.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_MenuStatus(this._commandWindow.width, 0);
    this._statusWindow.reserveFaceImages();
    this.addWindow(this._statusWindow);
};

Scene_Menu.prototype.commandItem = function() {
    SceneManager.push(Scene_Item);
};

Scene_Menu.prototype.commandPersonal = function() {
    this._statusWindow.setFormationMode(false);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler("ok", this.onPersonalOk.bind(this));
    this._statusWindow.setHandler("cancel", this.onPersonalCancel.bind(this));
};

Scene_Menu.prototype.commandFormation = function() {
    this._statusWindow.setFormationMode(true);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
    this._statusWindow.setHandler("cancel", this.onFormationCancel.bind(this));
};

Scene_Menu.prototype.commandOptions = function() {
    SceneManager.push(Scene_Options);
};

Scene_Menu.prototype.commandSave = function() {
    SceneManager.push(Scene_Save);
};

Scene_Menu.prototype.commandGameEnd = function() {
    SceneManager.push(Scene_GameEnd);
};

Scene_Menu.prototype.onPersonalOk = function() {
    switch (this._commandWindow.currentSymbol()) {
        case "skill":
            SceneManager.push(Scene_Skill);
            break;
        case "equip":
            SceneManager.push(Scene_Equip);
            break;
        case "status":
            SceneManager.push(Scene_Status);
            break;
    }
};

Scene_Menu.prototype.onPersonalCancel = function() {
    this._statusWindow.deselect();
    this._commandWindow.activate();
};

Scene_Menu.prototype.onFormationOk = function() {
    const index = this._statusWindow.index();
    const actor = $gameParty.members()[index];
    const pendingIndex = this._statusWindow.pendingIndex();
    if (pendingIndex >= 0) {
        $gameParty.swapOrder(index, pendingIndex);
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.redrawItem(index);
    } else {
        this._statusWindow.setPendingIndex(index);
    }
    this._statusWindow.activate();
};

Scene_Menu.prototype.onFormationCancel = function() {
    if (this._statusWindow.pendingIndex() >= 0) {
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.activate();
    } else {
        this._statusWindow.deselect();
        this._commandWindow.activate();
    }
};
