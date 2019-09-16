import { SceneManager } from "../managers/SceneManager";
import { Window_GameEnd } from "../windows/Window_GameEnd";
import { Scene_MenuBase } from "./Scene_MenuBase";
import { Scene_Title } from "./Scene_Title";

export class Scene_GameEnd extends Scene_MenuBase {
    private _commandWindow: Window_GameEnd;

    public create() {
        super.create();
        this.createCommandWindow();
    }

    public stop() {
        super.stop();
        this._commandWindow.close();
    }

    public createBackground() {
        super.createBackground.call(this);
        this.setBackgroundOpacity(128);
    }

    public createCommandWindow() {
        this._commandWindow = new Window_GameEnd();
        this._commandWindow.setHandler(
            "toTitle",
            this.commandToTitle.bind(this)
        );
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }

    public commandToTitle() {
        this.fadeOutAll();
        SceneManager.goto(Scene_Title);
    }
}
