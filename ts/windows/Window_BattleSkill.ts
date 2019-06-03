import Window_SkillList from "./Window_SkillList";

//-----------------------------------------------------------------------------
// Window_BattleSkill
//
// The window for selecting a skill to use on the battle screen.

export default class Window_BattleSkill extends Window_SkillList {
    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this.hide();
    }
}

Window_BattleSkill.prototype.show = function () {
    this.selectLast();
    this.showHelpWindow();
    Window_SkillList.prototype.show.call(this);
};

Window_BattleSkill.prototype.hide = function () {
    this.hideHelpWindow();
    Window_SkillList.prototype.hide.call(this);
};
