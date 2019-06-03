import Window_Command from "./Window_Command";

//-----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.

export default class Window_SkillType extends Window_Command {
    public _actor: any;
    public setActor: (actor: any) => void;
    public setSkillWindow: (skillWindow: any) => void;
    public selectLast: () => void;
    public constructor(x, y) {
        super(x, y);
        this._actor = null;
    }
}

Window_SkillType.prototype.windowWidth = function () {
    return 240;
};

Window_SkillType.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.selectLast();
    }
};

Window_SkillType.prototype.numVisibleRows = function () {
    return 4;
};

Window_SkillType.prototype.makeCommandList = function () {
    if (this._actor) {
        const skillTypes = this._actor.addedSkillTypes();
        skillTypes.sort(function (a, b) {
            return a - b;
        });
        skillTypes.forEach(function (stypeId) {
            const name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, "skill", true, stypeId);
        }, this);
    }
};

Window_SkillType.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (this._skillWindow) {
        this._skillWindow.setStypeId(this.currentExt());
    }
};

Window_SkillType.prototype.setSkillWindow = function (skillWindow) {
    this._skillWindow = skillWindow;
};

Window_SkillType.prototype.selectLast = function () {
    const skill = this._actor.lastMenuSkill();
    if (skill) {
        this.selectExt(skill.stypeId);
    } else {
        this.select(0);
    }
};
