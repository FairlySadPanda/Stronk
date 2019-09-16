import { Window_Command } from "./Window_Command";

// -----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.

export class Window_SkillType extends Window_Command {
    private _actor: any;
    private _skillWindow: any;

    public constructor(x, y) {
        super(x, y);
        this._actor = null;
    }

    public windowWidth() {
        return 240;
    }

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.selectLast();
        }
    }

    public numVisibleRows() {
        return 4;
    }

    public makeCommandList() {
        if (this._actor) {
            const skillTypes = this._actor.addedSkillTypes();
            skillTypes.sort(function(a, b) {
                return a - b;
            });
            skillTypes.forEach(function(stypeId) {
                const name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, "skill", true, stypeId);
            }, this);
        }
    }

    public update() {
        super.update();
        if (this._skillWindow) {
            this._skillWindow.setStypeId(this.currentExt());
        }
    }

    public setSkillWindow(skillWindow) {
        this._skillWindow = skillWindow;
    }

    public selectLast() {
        const skill = this._actor.lastMenuSkill();
        if (skill) {
            this.selectExt(skill.stypeId);
        } else {
            this.select(0);
        }
    }
}
