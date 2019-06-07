import Window_Status from "../windows/Window_Status";
import Scene_MenuBase from "./Scene_MenuBase";

export default class Scene_Status extends Scene_MenuBase {
    private _statusWindow: Window_Status;

    public create() {
        super.create();
        this._statusWindow = new Window_Status();
        this._statusWindow.setHandler("cancel", this.popScene.bind(this));
        this._statusWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._statusWindow.setHandler("pageup", this.previousActor.bind(this));
        this._statusWindow.reserveFaceImages();
        this.addWindow(this._statusWindow);
    }

    public start() {
        super.start();
        this.refreshActor();
    }

    public refreshActor() {
        const actor = this.actor();
        this._statusWindow.setActor(actor);
    }

    public onActorChange() {
        this.refreshActor();
        this._statusWindow.activate();
    }
}
