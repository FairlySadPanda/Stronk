import Window_Status from "../windows/Window_Status";
import Scene_MenuBase from "./Scene_MenuBase";

export default class Scene_Status extends Scene_MenuBase {
    public refreshActor: () => void;
    public constructor() {
        super();
    }
}

Scene_Status.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this._statusWindow = new Window_Status();
    this._statusWindow.setHandler("cancel",   this.popScene.bind(this));
    this._statusWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._statusWindow.setHandler("pageup",   this.previousActor.bind(this));
    this._statusWindow.reserveFaceImages();
    this.addWindow(this._statusWindow);
};

Scene_Status.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    this.refreshActor();
};

Scene_Status.prototype.refreshActor = function () {
    const actor = this.actor();
    this._statusWindow.setActor(actor);
};

Scene_Status.prototype.onActorChange = function () {
    this.refreshActor();
    this._statusWindow.activate();
};
