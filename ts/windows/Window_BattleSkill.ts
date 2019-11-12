import { Window_SkillList } from "./Window_SkillList";
import { Config } from "../Config";
import { ConfigManager } from "../managers/ConfigManager";

// -----------------------------------------------------------------------------
// Window_BattleSkill
//
// The window for selecting a skill to use on the battle screen.

export class Window_BattleSkill extends Window_SkillList {
    public constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.hide();
    }

    public maxCols() {
        return 1;
    }

    public show() {
        const sprite = $gameActors.actor(this._actor.actorId()).battler();
        const scale = $gameScreen.zoomScale();
        this.move(sprite.x * scale - this.width, sprite.y * scale, 300, 300);
        this.selectLast();
        this.showHelpWindow();
        super.show();
    }

    public hide() {
        this.hideHelpWindow();
        super.hide();
    }
}
