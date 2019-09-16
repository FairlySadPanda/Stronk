import { Window_NameEdit } from "../windows/Window_NameEdit";
import { Window_NameInput } from "../windows/Window_NameInput";
import { Scene_MenuBase } from "./Scene_MenuBase";

export class Scene_Name extends Scene_MenuBase {
    private _actorId: number;
    private _maxLength: number;
    private _editWindow: Window_NameEdit;
    private _inputWindow: Window_NameInput;

    public prepare(actorId: number, maxLength: number) {
        this._actorId = actorId;
        this._maxLength = maxLength;
    }

    public create() {
        super.create();
        this._actor = $gameActors.actor(this._actorId);
        this.createEditWindow();
        this.createInputWindow();
    }

    public start() {
        super.start();
        this._editWindow.refresh();
    }

    public createEditWindow() {
        this._editWindow = new Window_NameEdit(this._actor, this._maxLength);
        this.addWindow(this._editWindow);
    }

    public createInputWindow() {
        this._inputWindow = new Window_NameInput(this._editWindow);
        this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
        this.addWindow(this._inputWindow);
    }

    public onInputOk() {
        this._actor.setName(this._editWindow.name);
        this.popScene();
    }
}
