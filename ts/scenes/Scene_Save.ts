import DataManager from "../managers/DataManager";
import SoundManager from "../managers/SoundManager";
import StorageManager from "../managers/StorageManager";
import TextManager from "../managers/TextManager";
import Scene_File from "./Scene_File";

export default class Scene_Save extends Scene_File {
    public mode: () => string;
    public helpWindowText: () => any;
    public firstSavefileIndex: () => number;
    public onSaveSuccess: () => void;
    public onSaveFailure: () => void;
    public constructor() {
        super();
    }
}

Scene_Save.prototype.mode = function () {
    return "save";
};

Scene_Save.prototype.helpWindowText = function () {
    return TextManager.saveMessage;
};

Scene_Save.prototype.firstSavefileIndex = function () {
    return DataManager.lastAccessedSavefileId() - 1;
};

Scene_Save.prototype.onSavefileOk = function () {
    Scene_File.prototype.onSavefileOk.call(this);
    $gameSystem.onBeforeSave();
    if (DataManager.saveGame(this.savefileId())) {
        this.onSaveSuccess();
    } else {
        this.onSaveFailure();
    }
};

Scene_Save.prototype.onSaveSuccess = function () {
    SoundManager.playSave();
	StorageManager.cleanBackup(this.savefileId());
    this.popScene();
};

Scene_Save.prototype.onSaveFailure = function () {
    SoundManager.playBuzzer();
    this.activateListWindow();
};
