import { Graphics } from "../core/Graphics";
import { Window_Selectable } from "./Window_Selectable";
import { ConfigManager } from "../managers/ConfigManager";
import { Window_Base } from "./Window_Base";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";
import { BattleManager } from "../managers/BattleManager";

// -----------------------------------------------------------------------------
// Window_BattleStatus
//
// The window for displaying the status of party members on the battle screen.

export class Window_BattleStatus extends Window_Selectable {
    public openness: number;

    public constructor() {
        super(
            ConfigManager.currentResolution.widthPx -
                Window_BattleStatus.prototype.windowWidth(),
            ConfigManager.currentResolution.heightPx -
                Window_BattleStatus.prototype.windowHeight(),
            Window_BattleStatus.prototype.windowWidth(),
            Window_BattleStatus.prototype.windowHeight()
        );
        this.refresh();
        this.openness = 0;
    }

    public windowWidth() {
        return ConfigManager.currentResolution.widthPx - 192;
    }

    public windowHeight() {
        return this.fittingHeight(this.numVisibleRows());
    }

    public numVisibleRows() {
        return Yanfly.Param.BECCommandRows;
    }

    public maxItems() {
        return $gameParty.battleMembers().length;
    }

    public async refresh() {
        this.contents.clear();
        await this.drawAllItems();
    }

    public async drawItem(index) {
        const actor = $gameParty.battleMembers()[index];
        await this.drawBasicArea(this.basicAreaRect(index), actor);
        await this.drawGaugeArea(this.gaugeAreaRect(index), actor);
    }

    public basicAreaRect(index) {
        const rect = this.itemRectForText(index);
        rect.width -= this.gaugeAreaWidth() + 15;
        return rect;
    }

    public gaugeAreaRect(index) {
        const rect = this.itemRectForText(index);
        rect.x += rect.width - this.gaugeAreaWidth();
        rect.width = this.gaugeAreaWidth();
        return rect;
    }

    public gaugeAreaWidth() {
        return this.width / 2 + this.standardPadding();
    }

    public drawBasicArea(rect, actor) {
        const minIconArea = Window_Base._iconWidth * 2;
        const nameLength = this.textWidth("0") * 16 + 6;
        const iconWidth = Math.max(rect.width - nameLength, minIconArea);
        const nameWidth = rect.width - iconWidth;
        this.drawActorName(actor, rect.x + 0, rect.y, nameWidth);
        this.drawActorIcons(actor, rect.x + nameWidth, rect.y, iconWidth);
    }

    public drawGaugeArea(rect, actor) {
        if ($dataSystem.optDisplayTp) {
            this.drawGaugeAreaWithTp(rect, actor);
        } else {
            this.drawGaugeAreaWithoutTp(rect, actor);
        }
    }

    public drawGaugeAreaWithTp(rect, actor) {
        const totalArea = this.gaugeAreaWidth() - 30;
        const hpW = Math.floor((totalArea * 108) / 300);
        const otW = Math.floor((totalArea * 96) / 300);
        this.drawActorHp(actor, rect.x + 0, rect.y, hpW);
        this.drawActorMp(actor, rect.x + hpW + 15, rect.y, otW);
        this.drawActorTp(actor, rect.x + hpW + otW + 30, rect.y, otW);
    }

    public drawGaugeAreaWithoutTp(rect, actor) {
        let totalArea = this.gaugeAreaWidth() - 15;
        let hpW = Math.floor((totalArea * 201) / 315);
        let otW = Math.floor((totalArea * 114) / 315);
        this.drawActorHp(actor, rect.x + 0, rect.y, hpW);
        this.drawActorMp(actor, rect.x + hpW + 15, rect.y, otW);
    }

    public updateStatusRequests() {
        if (BattleManager._victoryPhase) return;
        for (let i = 0; i < $gameParty.battleMembers().length; ++i) {
            let actor = $gameParty.battleMembers()[i];
            if (!actor) continue;
            if (actor.isStatusRefreshRequested()) this.processStatusRefresh(i);
        }
    }

    public processStatusRefresh(index) {
        let actor = $gameParty.battleMembers()[index];
        if (!actor) return;
        let rect = this.itemRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.drawItem(index);
        actor.completetStatusRefreshRequest();
    }

    public drawCurrentAndMax(current, max, x, y, width, color1, color2) {
        if (!Yanfly.Param.BECCurMax) {
            const labelWidth = this.textWidth("HP");
            const valueWidth = this.textWidth(Yanfly.Util.toGroup(max));
            const slashWidth = this.textWidth("/");
            const x1 = x + width - valueWidth;
            this.changeTextColor(color1);
            this.drawText(
                Yanfly.Util.toGroup(current),
                x1,
                y,
                valueWidth,
                undefined,
                "right"
            );
        } else {
            super.drawCurrentAndMax(current, max, x, y, width, color1, color2);
        }
    }
}
