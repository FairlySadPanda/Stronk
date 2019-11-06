import { Graphics } from "../core/Graphics";
import { ImageManager } from "../managers/ImageManager";
import { Window_Base } from "./Window_Base";
import { Window_Selectable } from "./Window_Selectable";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

// -----------------------------------------------------------------------------
// Window_MenuStatus
//
// The window for displaying party member status on the menu screen.

export class Window_MenuStatus extends Window_Selectable {
    private _formationMode: boolean;
    private _pendingIndex: number;

    public constructor(x, y) {
        super(
            x,
            y,
            Window_MenuStatus.prototype.windowWidth(),
            Window_MenuStatus.prototype.windowHeight()
        );
        this._formationMode = false;
        this._pendingIndex = -1;
        this.refresh();
    }

    public windowWidth() {
        return Graphics.boxWidth - 240;
    }

    public windowHeight() {
        return Graphics.boxHeight;
    }

    public maxItems() {
        return $gameParty.size();
    }

    public itemHeight() {
        const clientHeight = this.height - this.padding * 2;
        return Math.floor(clientHeight / this.numVisibleRows());
    }

    public numVisibleRows() {
        return 4;
    }

    public loadImages() {
        $gameParty.members().forEach(function(actor) {
            ImageManager.reserveFace(actor.faceName());
        }, this);
    }

    public async drawItem(index) {
        await this.drawItemBackground(index);
        await this.drawItemImage(index);
        await this.drawItemStatus(index);
    }

    public async drawItemBackground(index) {
        if (index === this._pendingIndex) {
            const rect = this.itemRect(index);
            const color = this.pendingColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(
                rect.x,
                rect.y,
                rect.width,
                rect.height,
                color
            );
            this.changePaintOpacity(true);
        }
    }

    public async drawItemImage(index) {
        const actor = $gameParty.members()[index];
        const rect = this.itemRect(index);
        this.changePaintOpacity(actor.isBattleMember());
        const fw = Window_Base._faceWidth;
        await this.drawActorFace(
            actor,
            rect.x + 1,
            rect.y + 1,
            fw,
            rect.height - 2
        );
        this.changePaintOpacity(true);
    }

    public async drawItemStatus(index) {
        const actor = $gameParty.members()[index];
        const rect = this.itemRect(index);
        const xpad = Yanfly.Param.WindowPadding + Window_Base._faceWidth;
        const x = rect.x + xpad;
        let y = 0;
        if (!Yanfly.Param.MenuTpGauge) {
            y = Math.floor(rect.y + rect.height / 2 - this.lineHeight() * 1.5);
        } else {
            y = Math.floor(rect.y);
        }
        const width = rect.width - x - this.textPadding();
        await this.drawActorSimpleStatus(actor, x, y, width);
    }

    public processOk() {
        super.processOk();
        $gameParty.setMenuActor($gameParty.members()[this.index()]);
    }

    public isCurrentItemEnabled() {
        if (this._formationMode) {
            const actor = $gameParty.members()[this.index()];
            return actor && actor.isFormationChangeOk();
        } else {
            return true;
        }
    }

    public selectLast() {
        this.select($gameParty.menuActor().index() || 0);
    }

    public formationMode() {
        return this._formationMode;
    }

    public setFormationMode(formationMode) {
        this._formationMode = formationMode;
    }

    public pendingIndex() {
        return this._pendingIndex;
    }

    public setPendingIndex(index) {
        const lastPendingIndex = this._pendingIndex;
        this._pendingIndex = index;
        this.redrawItem(this._pendingIndex);
        this.redrawItem(lastPendingIndex);
    }
}
