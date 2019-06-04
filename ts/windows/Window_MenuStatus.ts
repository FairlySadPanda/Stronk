import Graphics from "../core/Graphics";

import ImageManager from "../managers/ImageManager";
import Window_Base from "./Window_Base";
import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_MenuStatus
//
// The window for displaying party member status on the menu screen.

export default class Window_MenuStatus extends Window_Selectable {
    public _formationMode: boolean;
    public _pendingIndex: number;
    public numVisibleRows: () => number;
    public loadImages: () => void;
    public drawItemBackground: (index: any) => void;
    public drawItemImage: (index: any) => void;
    public drawItemStatus: (index: any) => void;
    public selectLast: () => void;
    public formationMode: () => any;
    public setFormationMode: (formationMode: any) => void;
    public pendingIndex: () => any;
    public setPendingIndex: (index: any) => void;
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
    public windowWidth(): any {
        throw new Error("Method not implemented.");
    }
    public windowHeight(): any {
        throw new Error("Method not implemented.");
    }
}

Window_MenuStatus.prototype.windowWidth = function() {
    return Graphics.boxWidth - 240;
};

Window_MenuStatus.prototype.windowHeight = function() {
    return Graphics.boxHeight;
};

Window_MenuStatus.prototype.maxItems = function() {
    return $gameParty.size();
};

Window_MenuStatus.prototype.itemHeight = function() {
    const clientHeight = this.height - this.padding * 2;
    return Math.floor(clientHeight / this.numVisibleRows());
};

Window_MenuStatus.prototype.numVisibleRows = function() {
    return 4;
};

Window_MenuStatus.prototype.loadImages = function() {
    $gameParty.members().forEach(function(actor) {
        ImageManager.reserveFace(actor.faceName());
    }, this);
};

Window_MenuStatus.prototype.drawItem = function(index) {
    this.drawItemBackground(index);
    this.drawItemImage(index);
    this.drawItemStatus(index);
};

Window_MenuStatus.prototype.drawItemBackground = function(index) {
    if (index === this._pendingIndex) {
        const rect = this.itemRect(index);
        const color = this.pendingColor();
        this.changePaintOpacity(false);
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.changePaintOpacity(true);
    }
};

Window_MenuStatus.prototype.drawItemImage = function(index) {
    const actor = $gameParty.members()[index];
    const rect = this.itemRect(index);
    this.changePaintOpacity(actor.isBattleMember());
    this.drawActorFace(
        actor,
        rect.x + 1,
        rect.y + 1,
        Window_Base._faceWidth,
        Window_Base._faceHeight
    );
    this.changePaintOpacity(true);
};

Window_MenuStatus.prototype.drawItemStatus = function(index) {
    const actor = $gameParty.members()[index];
    const rect = this.itemRect(index);
    const x = rect.x + 162;
    const y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
    const width = rect.width - x - this.textPadding();
    this.drawActorSimpleStatus(actor, x, y, width);
};

Window_MenuStatus.prototype.processOk = function() {
    Window_Selectable.prototype.processOk.call(this);
    $gameParty.setMenuActor($gameParty.members()[this.index()]);
};

Window_MenuStatus.prototype.isCurrentItemEnabled = function() {
    if (this._formationMode) {
        const actor = $gameParty.members()[this.index()];
        return actor && actor.isFormationChangeOk();
    } else {
        return true;
    }
};

Window_MenuStatus.prototype.selectLast = function() {
    this.select($gameParty.menuActor().index() || 0);
};

Window_MenuStatus.prototype.formationMode = function() {
    return this._formationMode;
};

Window_MenuStatus.prototype.setFormationMode = function(formationMode) {
    this._formationMode = formationMode;
};

Window_MenuStatus.prototype.pendingIndex = function() {
    return this._pendingIndex;
};

Window_MenuStatus.prototype.setPendingIndex = function(index) {
    const lastPendingIndex = this._pendingIndex;
    this._pendingIndex = index;
    this.redrawItem(this._pendingIndex);
    this.redrawItem(lastPendingIndex);
};
