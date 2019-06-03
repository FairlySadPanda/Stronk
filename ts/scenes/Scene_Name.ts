import Window_NameEdit from "../windows/Window_NameEdit";
import Window_NameInput from "../windows/Window_NameInput";
import Scene_MenuBase from "./Scene_MenuBase";

export default class Scene_Name extends Scene_MenuBase {
    public prepare: (actorId: any, maxLength: any) => void;
    public createEditWindow: () => void;
    public createInputWindow: () => void;
    public onInputOk: () => void;
    public constructor() {
        super();
    }
}

Scene_Name.prototype.prepare = function (actorId, maxLength) {
    this._actorId = actorId;
    this._maxLength = maxLength;
};

Scene_Name.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameActors.actor(this._actorId);
    this.createEditWindow();
    this.createInputWindow();
};

Scene_Name.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    this._editWindow.refresh();
};

Scene_Name.prototype.createEditWindow = function () {
    this._editWindow = new Window_NameEdit(this._actor, this._maxLength);
    this.addWindow(this._editWindow);
};

Scene_Name.prototype.createInputWindow = function () {
    this._inputWindow = new Window_NameInput(this._editWindow);
    this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
    this.addWindow(this._inputWindow);
};

Scene_Name.prototype.onInputOk = function () {
    this._actor.setName(this._editWindow.name());
    this.popScene();
};
