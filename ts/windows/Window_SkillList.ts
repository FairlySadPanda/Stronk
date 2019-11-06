import { Window_Selectable } from "./Window_Selectable";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

// -----------------------------------------------------------------------------
// Window_SkillList
//
// The window for selecting a skill on the skill screen.

export class Window_SkillList extends Window_Selectable {
    public _actor: any;
    public _stypeId: number;
    public _data: any[];

    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this._actor = null;
        this._stypeId = 0;
        this._data = [];
    }

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.resetScroll();
        }
    }

    public setStypeId(stypeId) {
        if (this._stypeId !== stypeId) {
            this._stypeId = stypeId;
            this.refresh();
            this.resetScroll();
        }
    }

    public maxCols() {
        return 2;
    }

    public spacing() {
        return 48;
    }

    public maxItems() {
        return this._data ? this._data.length : 1;
    }

    public item() {
        return this._data && this.index() >= 0
            ? this._data[this.index()]
            : null;
    }

    public isCurrentItemEnabled() {
        return this.isEnabled(this._data[this.index()]);
    }

    public includes(item) {
        return item && item.stypeId === this._stypeId;
    }

    public isEnabled(item) {
        return this._actor && this._actor.canUse(item);
    }

    public makeItemList() {
        if (this._actor) {
            this._data = this._actor.skills().filter(function(item) {
                return this.includes(item);
            }, this);
        } else {
            this._data = [];
        }
    }

    public selectLast() {
        let skill;
        if ($gameParty.inBattle()) {
            skill = this._actor.lastBattleSkill();
        } else {
            skill = this._actor.lastMenuSkill();
        }
        const index = this._data.indexOf(skill);
        this.select(index >= 0 ? index : 0);
    }

    public async drawItem(index) {
        const skill = this._data[index];
        if (skill) {
            const costWidth = this.costWidth();
            const rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(skill));
            this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
            this.drawSkillCost(skill, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    }

    public costWidth() {
        return this.textWidth("000");
    }

    public drawSkillCost(skill, x, y, width) {
        if (this._actor.skillTpCost(skill) > 0) {
            this.changeTextColor(this.tpCostColor());
            const skillcost = Yanfly.Util.toGroup(
                this._actor.skillTpCost(skill)
            );
            this.drawText(skillcost, x, y, width, undefined, "right");
        } else if (this._actor.skillMpCost(skill) > 0) {
            this.changeTextColor(this.mpCostColor());
            const skillcost = Yanfly.Util.toGroup(
                this._actor.skillMpCost(skill)
            );
            this.drawText(skillcost, x, y, width, undefined, "right");
        }
    }

    public updateHelp() {
        this.setHelpWindowItem(this.item());
    }

    public async refresh() {
        this.makeItemList();
        this.createContents();
        await this.drawAllItems();
    }
}
