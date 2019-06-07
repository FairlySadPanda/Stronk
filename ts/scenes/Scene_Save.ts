import DataManager from "../managers/DataManager";
import SoundManager from "../managers/SoundManager";
import StorageManager from "../managers/StorageManager";
import TextManager from "../managers/TextManager";
import Scene_File from "./Scene_File";

export default class Scene_Save extends Scene_File {
    public mode() {
        return "save";
    }

    public helpWindowText() {
        return TextManager.saveMessage;
    }

    public firstSavefileIndex() {
        return DataManager.lastAccessedSavefileId() - 1;
    }

    public onSavefileOk() {
        super.onSavefileOk();
        $gameSystem.onBeforeSave();
        if (DataManager.saveGame(this.savefileId())) {
            this.onSaveSuccess();
        } else {
            this.onSaveFailure();
        }
    }

    public onSaveSuccess() {
        SoundManager.playSave();
        StorageManager.cleanBackup(this.savefileId());
        this.popScene();
    }

    public onSaveFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }
}
