import { DataManager } from "../managers/DataManager";
import { SceneManager } from "../managers/SceneManager";
import { SoundManager } from "../managers/SoundManager";
import { TextManager } from "../managers/TextManager";
import { Scene_File } from "./Scene_File";
import { Scene_Map } from "./Scene_Map";

export class Scene_Load extends Scene_File {
    private _loadSuccess: boolean;

    public constructor() {
        super();
        this._loadSuccess = false;
    }

    public terminate() {
        this._bypassFirstClear = true;
        super.terminate();
        if (this._loadSuccess) {
            $gameSystem.onAfterLoad();
        }
        this.clearChildren();
    }

    public mode() {
        return "load";
    }

    public helpWindowText() {
        return TextManager.loadMessage;
    }

    public firstSavefileIndex() {
        return DataManager.latestSavefileId() - 1;
    }

    public onSavefileOk() {
        super.onSavefileOk();
        if (DataManager.loadGame(this.savefileId())) {
            this.onLoadSuccess();
        } else {
            this.onLoadFailure();
        }
    }

    public onLoadSuccess() {
        SoundManager.playLoad();
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    }

    public onLoadFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }

    public reloadMapIfUpdated() {
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            $gamePlayer.reserveTransfer(
                $gameMap.mapId(),
                $gamePlayer.x,
                $gamePlayer.y
            );
            $gamePlayer.requestMapReload();
        }
    }
}
