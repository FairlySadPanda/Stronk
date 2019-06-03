import Graphics from "../core/Graphics";
import SoundManager from "../managers/SoundManager";
import Window_SkillList from "../windows/Window_SkillList";
import Window_SkillStatus from "../windows/Window_SkillStatus";
import Window_SkillType from "../windows/Window_SkillType";
import Scene_ItemBase from "./Scene_ItemBase";

export default class Scene_Skill extends Scene_ItemBase {
    public createSkillTypeWindow: () => void;
    public createStatusWindow: () => void;
    public createItemWindow: () => void;
    public refreshActor: () => void;
    public commandSkill: () => void;
    public onItemOk: () => void;
    public onItemCancel: () => void;
    public playSeForItem: () => void;
    public constructor() {
        super();
    }
}

Scene_Skill.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createSkillTypeWindow();
    this.createStatusWindow();
    this.createItemWindow();
    this.createActorWindow();
};

Scene_Skill.prototype.start = function () {
    Scene_ItemBase.prototype.start.call(this);
    this.refreshActor();
};

Scene_Skill.prototype.createSkillTypeWindow = function () {
    const wy = this._helpWindow.height;
    this._skillTypeWindow = new Window_SkillType(0, wy);
    this._skillTypeWindow.setHelpWindow(this._helpWindow);
    this._skillTypeWindow.setHandler("skill",    this.commandSkill.bind(this));
    this._skillTypeWindow.setHandler("cancel",   this.popScene.bind(this));
    this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._skillTypeWindow.setHandler("pageup",   this.previousActor.bind(this));
    this.addWindow(this._skillTypeWindow);
};

Scene_Skill.prototype.createStatusWindow = function () {
    const wx = this._skillTypeWindow.width;
    const wy = this._helpWindow.height;
    const ww = Graphics.boxWidth - wx;
    const wh = this._skillTypeWindow.height;
    this._statusWindow = new Window_SkillStatus(wx, wy, ww, wh);
    this._statusWindow.reserveFaceImages();
    this.addWindow(this._statusWindow);
};

Scene_Skill.prototype.createItemWindow = function () {
    const wx = 0;
    const wy = this._statusWindow.y + this._statusWindow.height;
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_SkillList(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok",     this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._skillTypeWindow.setSkillWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

Scene_Skill.prototype.refreshActor = function () {
    const actor = this.actor();
    this._skillTypeWindow.setActor(actor);
    this._statusWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

Scene_Skill.prototype.user = function () {
    return this.actor();
};

Scene_Skill.prototype.commandSkill = function () {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

Scene_Skill.prototype.onItemOk = function () {
    this.actor().setLastMenuSkill(this.item());
    this.determineItem();
};

Scene_Skill.prototype.onItemCancel = function () {
    this._itemWindow.deselect();
    this._skillTypeWindow.activate();
};

Scene_Skill.prototype.playSeForItem = function () {
    SoundManager.playUseSkill();
};

Scene_Skill.prototype.useItem = function () {
    Scene_ItemBase.prototype.useItem.call(this);
    this._statusWindow.refresh();
    this._itemWindow.refresh();
};

Scene_Skill.prototype.onActorChange = function () {
    this.refreshActor();
    this._skillTypeWindow.activate();
};
