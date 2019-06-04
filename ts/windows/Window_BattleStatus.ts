import Graphics from "../core/Graphics";
import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_BattleStatus
//
// The window for displaying the status of party members on the battle screen.

export default class Window_BattleStatus extends Window_Selectable {
    public openness: number;
    public numVisibleRows: () => number;
    public basicAreaRect: (index: any) => any;
    public gaugeAreaRect: (index: any) => any;
    public gaugeAreaWidth: () => number;
    public drawBasicArea: (rect: any, actor: any) => void;
    public drawGaugeArea: (rect: any, actor: any) => void;
    public drawGaugeAreaWithTp: (rect: any, actor: any) => void;
    public drawGaugeAreaWithoutTp: (rect: any, actor: any) => void;
    public constructor() {
        super(
            Graphics.boxWidth - Window_BattleStatus.prototype.windowWidth(),
            Graphics.boxHeight - Window_BattleStatus.prototype.windowHeight(),
            Window_BattleStatus.prototype.windowWidth(),
            Window_BattleStatus.prototype.windowHeight()
        );
        this.refresh();
        this.openness = 0;
    }
    public windowWidth(): any {
        throw new Error("Method not implemented.");
    }
    public windowHeight(): any {
        throw new Error("Method not implemented.");
    }
}

Window_BattleStatus.prototype.windowWidth = function() {
    return Graphics.boxWidth - 192;
};

Window_BattleStatus.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};

Window_BattleStatus.prototype.numVisibleRows = function() {
    return 4;
};

Window_BattleStatus.prototype.maxItems = function() {
    return $gameParty.battleMembers().length;
};

Window_BattleStatus.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};

Window_BattleStatus.prototype.drawItem = function(index) {
    const actor = $gameParty.battleMembers()[index];
    this.drawBasicArea(this.basicAreaRect(index), actor);
    this.drawGaugeArea(this.gaugeAreaRect(index), actor);
};

Window_BattleStatus.prototype.basicAreaRect = function(index) {
    const rect = this.itemRectForText(index);
    rect.width -= this.gaugeAreaWidth() + 15;
    return rect;
};

Window_BattleStatus.prototype.gaugeAreaRect = function(index) {
    const rect = this.itemRectForText(index);
    rect.x += rect.width - this.gaugeAreaWidth();
    rect.width = this.gaugeAreaWidth();
    return rect;
};

Window_BattleStatus.prototype.gaugeAreaWidth = function() {
    return 330;
};

Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
    this.drawActorName(actor, rect.x + 0, rect.y, 150);
    this.drawActorIcons(actor, rect.x + 156, rect.y, rect.width - 156);
};

Window_BattleStatus.prototype.drawGaugeArea = function(rect, actor) {
    if ($dataSystem.optDisplayTp) {
        this.drawGaugeAreaWithTp(rect, actor);
    } else {
        this.drawGaugeAreaWithoutTp(rect, actor);
    }
};

Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
    this.drawActorHp(actor, rect.x + 0, rect.y, 108);
    this.drawActorMp(actor, rect.x + 123, rect.y, 96);
    this.drawActorTp(actor, rect.x + 234, rect.y, 96);
};

Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
    this.drawActorHp(actor, rect.x + 0, rect.y, 201);
    this.drawActorMp(actor, rect.x + 216, rect.y, 114);
};
