import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_SkillList
//
// The window for selecting a skill on the skill screen.

export default class Window_SkillList extends Window_Selectable {
    public _actor: any;
    public _stypeId: number;
    public _data: any[];
    public setActor: (actor: any) => void;
    public setStypeId: (stypeId: any) => void;
    public item: () => any;
    public includes: (item: any) => boolean;
    public isEnabled: (item: any) => any;
    public makeItemList: () => void;
    public selectLast: () => void;
    public costWidth: () => any;
    public drawSkillCost: (skill: any, x: any, y: any, width: any) => void;
    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this._actor = null;
        this._stypeId = 0;
        this._data = [];
    }
}

Window_SkillList.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.resetScroll();
    }
};

Window_SkillList.prototype.setStypeId = function(stypeId) {
    if (this._stypeId !== stypeId) {
        this._stypeId = stypeId;
        this.refresh();
        this.resetScroll();
    }
};

Window_SkillList.prototype.maxCols = function() {
    return 2;
};

Window_SkillList.prototype.spacing = function() {
    return 48;
};

Window_SkillList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_SkillList.prototype.item = function() {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
};

Window_SkillList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._data[this.index()]);
};

Window_SkillList.prototype.includes = function(item) {
    return item && item.stypeId === this._stypeId;
};

Window_SkillList.prototype.isEnabled = function(item) {
    return this._actor && this._actor.canUse(item);
};

Window_SkillList.prototype.makeItemList = function() {
    if (this._actor) {
        this._data = this._actor.skills().filter(function(item) {
            return this.includes(item);
        }, this);
    } else {
        this._data = [];
    }
};

Window_SkillList.prototype.selectLast = function() {
    let skill;
    if ($gameParty.inBattle()) {
        skill = this._actor.lastBattleSkill();
    } else {
        skill = this._actor.lastMenuSkill();
    }
    const index = this._data.indexOf(skill);
    this.select(index >= 0 ? index : 0);
};

Window_SkillList.prototype.drawItem = function(index) {
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
};

Window_SkillList.prototype.costWidth = function() {
    return this.textWidth("000");
};

Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
    if (this._actor.skillTpCost(skill) > 0) {
        this.changeTextColor(this.tpCostColor());
        this.drawText(this._actor.skillTpCost(skill), x, y, width, "right");
    } else if (this._actor.skillMpCost(skill) > 0) {
        this.changeTextColor(this.mpCostColor());
        this.drawText(this._actor.skillMpCost(skill), x, y, width, "right");
    }
};

Window_SkillList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

Window_SkillList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};
