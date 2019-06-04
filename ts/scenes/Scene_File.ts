import Graphics from "../core/Graphics";
import DataManager from "../managers/DataManager";
import Window_Help from "../windows/Window_Help";
import Window_SavefileList from "../windows/Window_SavefileList";
import Scene_MenuBase from "./Scene_MenuBase";

export default class Scene_File extends Scene_MenuBase {
    private _listWindow: any;

    public create() {
        super.create();
        DataManager.loadAllSavefileImages();
        this.createHelpWindow();
        this.createListWindow();
    }

    public start() {
        super.start();
        this._listWindow.refresh();
    }

    public savefileId() {
        return this._listWindow.index() + 1;
    }

    public createHelpWindow() {
        this._helpWindow = new Window_Help(1);
        this._helpWindow.setText(this.helpWindowText());
        this.addWindow(this._helpWindow);
    }

    public createListWindow() {
        const x = 0;
        const y = this._helpWindow.height;
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight - y;
        this._listWindow = new Window_SavefileList(x, y, width, height);
        this._listWindow.setHandler("ok", this.onSavefileOk.bind(this));
        this._listWindow.setHandler("cancel", this.popScene.bind(this));
        this._listWindow.select(this.firstSavefileIndex());
        this._listWindow.setTopRow(this.firstSavefileIndex() - 2);
        this._listWindow.setMode(this.mode());
        this._listWindow.refresh();
        this.addWindow(this._listWindow);
    }

    public mode() {
        return null;
    }

    public activateListWindow() {
        this._listWindow.activate();
    }

    public helpWindowText() {
        return "";
    }

    public firstSavefileIndex() {
        return 0;
    }

    public onSavefileOk() {}
}
