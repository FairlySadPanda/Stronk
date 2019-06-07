import Window_SkillList from "./Window_SkillList";

// -----------------------------------------------------------------------------
// Window_BattleSkill
//
// The window for selecting a skill to use on the battle screen.

export default class Window_BattleSkill extends Window_SkillList {
    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this.hide();
    }

    public show() {
        this.selectLast();
        this.showHelpWindow();
        super.show();
    }

    public hide() {
        this.hideHelpWindow();
        super.hide();
    }
}
