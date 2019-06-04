import Window_Base from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_SkillStatus
//
// The window for displaying the skill user's status on the skill screen.

export default class Window_SkillStatus extends Window_Base {
    public _actor: any;
    public setActor: (actor: any) => void;
    public refresh: () => void;
    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this._actor = null;
    }
}

Window_SkillStatus.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_SkillStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        const w = this.width - this.padding * 2;
        const h = this.height - this.padding * 2;
        const y = h / 2 - this.lineHeight() * 1.5;
        const width = w - 162 - this.textPadding();
        this.drawActorFace(this._actor, 0, 0, 144, h);
        this.drawActorSimpleStatus(this._actor, 162, y, width);
    }
};
