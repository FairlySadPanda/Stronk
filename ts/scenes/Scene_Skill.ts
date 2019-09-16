import { Graphics } from "../core/Graphics";
import { SoundManager } from "../managers/SoundManager";
import { Window_SkillList } from "../windows/Window_SkillList";
import { Window_SkillStatus } from "../windows/Window_SkillStatus";
import { Window_SkillType } from "../windows/Window_SkillType";
import { Scene_ItemBase } from "./Scene_ItemBase";

export class Scene_Skill extends Scene_ItemBase {
    private _skillTypeWindow: Window_SkillType;
    private _statusWindow: Window_SkillStatus;
    protected _itemWindow: Window_SkillList;

    public create() {
        super.create.call(this);
        this.createHelpWindow();
        this.createSkillTypeWindow();
        this.createStatusWindow();
        this.createItemWindow();
        this.createActorWindow();
    }

    public start() {
        super.start.call(this);
        this.refreshActor();
    }

    public createSkillTypeWindow() {
        const wy = this._helpWindow.height;
        this._skillTypeWindow = new Window_SkillType(0, wy);
        this._skillTypeWindow.setHelpWindow(this._helpWindow);
        this._skillTypeWindow.setHandler("skill", this.commandSkill.bind(this));
        this._skillTypeWindow.setHandler("cancel", this.popScene.bind(this));
        this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._skillTypeWindow.setHandler(
            "pageup",
            this.previousActor.bind(this)
        );
        this.addWindow(this._skillTypeWindow);
    }

    public createStatusWindow() {
        const wx = this._skillTypeWindow.width;
        const wy = this._helpWindow.height;
        const ww = Graphics.boxWidth - wx;
        const wh = this._skillTypeWindow.height;
        this._statusWindow = new Window_SkillStatus(wx, wy, ww, wh);
        this._statusWindow.reserveFaceImages();
        this.addWindow(this._statusWindow);
    }

    public createItemWindow() {
        const wx = 0;
        const wy = this._statusWindow.y + this._statusWindow.height;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - wy;
        this._itemWindow = new Window_SkillList(wx, wy, ww, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this._skillTypeWindow.setSkillWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
    }

    public refreshActor() {
        const actor = this.actor();
        this._skillTypeWindow.setActor(actor);
        this._statusWindow.setActor(actor);
        this._itemWindow.setActor(actor);
    }

    public user() {
        return this.actor();
    }

    public commandSkill() {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    }

    public onItemOk() {
        this.actor().setLastMenuSkill(this.item());
        this.determineItem();
    }

    public onItemCancel() {
        this._itemWindow.deselect();
        this._skillTypeWindow.activate();
    }

    public playSeForItem() {
        SoundManager.playUseSkill();
    }

    public useItem() {
        super.useItem.call(this);
        this._statusWindow.refresh();
        this._itemWindow.refresh();
    }

    public onActorChange() {
        this.refreshActor();
        this._skillTypeWindow.activate();
    }
}
