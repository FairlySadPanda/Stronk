import Graphics from "../core/Graphics";
import SceneManager from "../managers/SceneManager";
import Window_Gold from "../windows/Window_Gold";
import Window_MenuCommand from "../windows/Window_MenuCommand";
import Window_MenuStatus from "../windows/Window_MenuStatus";
import Scene_Equip from "./Scene_Equip";
import Scene_GameEnd from "./Scene_GameEnd";
import Scene_Item from "./Scene_Item";
import Scene_MenuBase from "./Scene_MenuBase";
import Scene_Save from "./Scene_Save";
import Scene_Skill from "./Scene_Skill";
import Scene_Status from "./Scene_Status";
import Scene_MushOptions from "./Scene_MushOptions";
import ConfigManager from "../managers/ConfigManager";

export default class Scene_Menu extends Scene_MenuBase {
    private _statusWindow: any;
    private _commandWindow: Window_MenuCommand;
    private _goldWindow: Window_Gold;

    public create() {
        super.create();
        this.createCommandWindow();
        this.createGoldWindow();
        this.createStatusWindow();
    }

    public start() {
        super.start();
        this._statusWindow.refresh();
    }

    public createCommandWindow() {
        this._commandWindow = new Window_MenuCommand(0, 0);
        this._commandWindow.setHandler("item", this.commandItem.bind(this));
        this._commandWindow.setHandler(
            "skill",
            this.commandPersonal.bind(this)
        );
        this._commandWindow.setHandler(
            "equip",
            this.commandPersonal.bind(this)
        );
        this._commandWindow.setHandler(
            "status",
            this.commandPersonal.bind(this)
        );
        this._commandWindow.setHandler(
            "formation",
            this.commandFormation.bind(this)
        );
        this._commandWindow.setHandler(
            "options",
            this.commandOptions.bind(this)
        );
        this._commandWindow.setHandler("save", this.commandSave.bind(this));
        this._commandWindow.setHandler(
            "gameEnd",
            this.commandGameEnd.bind(this)
        );
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }

    public createGoldWindow() {
        this._goldWindow = new Window_Gold(0, 0);
        this._goldWindow.y = Graphics.boxHeight - this._goldWindow.height;
        this.addWindow(this._goldWindow);
    }

    public createStatusWindow() {
        this._statusWindow = new Window_MenuStatus(
            this._commandWindow.width,
            0
        );
        this._statusWindow.reserveFaceImages();
        this.addWindow(this._statusWindow);
    }

    public commandItem() {
        SceneManager.push(Scene_Item);
    }

    public commandPersonal() {
        this._statusWindow.setFormationMode(false);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler("ok", this.onPersonalOk.bind(this));
        this._statusWindow.setHandler(
            "cancel",
            this.onPersonalCancel.bind(this)
        );
    }

    public commandFormation() {
        this._statusWindow.setFormationMode(true);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
        this._statusWindow.setHandler(
            "cancel",
            this.onFormationCancel.bind(this)
        );
    }

    public commandOptions() {
        SceneManager.push(Scene_MushOptions);
    }

    public commandSave() {
        SceneManager.push(Scene_Save);
    }

    public commandGameEnd() {
        SceneManager.push(Scene_GameEnd);
    }

    public onPersonalOk() {
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
    }

    public onPersonalCancel() {
        this._statusWindow.deselect();
        this._commandWindow.activate();
    }

    public onFormationOk() {
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
    }

    public onFormationCancel() {
        if (this._statusWindow.pendingIndex() >= 0) {
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.activate();
        } else {
            this._statusWindow.deselect();
            this._commandWindow.activate();
        }
    }

    // public popScene() {
    //     super.popScene();
    //     if (ConfigManager.graphicsOptions.screenResolution.scale === false) {
    //         const diff_x = Math.abs($gameMap.displayX() - $gamePlayer.x);
    //         const diff_y = Math.abs($gameMap.displayY() - $gamePlayer.y);
    //         const screenMaxDistance_x = Math.floor(Graphics.boxWidth / 48);
    //         const screenMaxDistance_y = Math.floor(Graphics.boxHeight / 48);
    //         if (diff_x > screenMaxDistance_x || diff_y > screenMaxDistance_y) {
    //             const tileCenter_x = Math.floor(Graphics.boxWidth / 48 / 2);
    //             const tileCenter_y = Math.floor(Graphics.boxHeight / 48 / 2);
    //             // @ts-ignore
    //             $gameMap._displayX = $gamePlayer.x - tileCenter_x;
    //             // @ts-ignore
    //             $gameMap._displayY = $gamePlayer.y - tileCenter_y;
    //         }
    //     }
    // }
}
