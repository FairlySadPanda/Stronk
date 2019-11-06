import { Window_Base } from "./Window_Base";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

// -----------------------------------------------------------------------------
// Window_SkillStatus
//
// The window for displaying the skill user's status on the skill screen.

export class Window_SkillStatus extends Window_Base {
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

    public async refresh() {
        this.contents.clear();
        if (this._actor) {
            const w = this.width - this.padding * 2;
            const h = this.height - this.padding * 2;
            let y = 0;
            if (!Yanfly.Param.MenuTpGauge) {
                y = h / 2 - this.lineHeight() * 1.5;
            } else {
                y = 0;
            }
            const xpad = Yanfly.Param.WindowPadding + Window_Base._faceWidth;
            const width = w - xpad - this.textPadding();
            await this.drawActorFace(
                this._actor,
                0,
                0,
                Window_Base._faceWidth,
                h
            );
            await this.drawActorSimpleStatus(this._actor, xpad, y, width);
        }
    }
}
