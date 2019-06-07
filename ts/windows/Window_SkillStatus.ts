import Window_Base from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_SkillStatus
//
// The window for displaying the skill user's status on the skill screen.

export default class Window_SkillStatus extends Window_Base {
    private _actor: any;

    public constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this._actor = null;
    }

    public setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    public refresh() {
        this.contents.clear();
        if (this._actor) {
            const w = this.width - this.padding * 2;
            const h = this.height - this.padding * 2;
            const y = h / 2 - this.lineHeight() * 1.5;
            const width = w - 162 - this.textPadding();
            this.drawActorFace(this._actor, 0, 0, 144, h);
            this.drawActorSimpleStatus(this._actor, 162, y, width);
        }
    }
}
