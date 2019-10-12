import { Graphics } from "../core/Graphics";
import { Window_Selectable } from "./Window_Selectable";
import { ConfigManager } from "../managers/ConfigManager";

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
        return 4;
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
        return 330;
    }

    public drawBasicArea(rect, actor) {
        this.drawActorName(actor, rect.x + 0, rect.y, 150);
        this.drawActorIcons(actor, rect.x + 156, rect.y, rect.width - 156);
    }

    public drawGaugeArea(rect, actor) {
        if ($dataSystem.optDisplayTp) {
            this.drawGaugeAreaWithTp(rect, actor);
        } else {
            this.drawGaugeAreaWithoutTp(rect, actor);
        }
    }

    public drawGaugeAreaWithTp(rect, actor) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 108);
        this.drawActorMp(actor, rect.x + 123, rect.y, 96);
        this.drawActorTp(actor, rect.x + 234, rect.y, 96);
    }

    public drawGaugeAreaWithoutTp(rect, actor) {
        this.drawActorHp(actor, rect.x + 0, rect.y, 201);
        this.drawActorMp(actor, rect.x + 216, rect.y, 114);
    }
}
