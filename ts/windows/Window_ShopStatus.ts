import Input from "../core/Input";
import TouchInput from "../core/TouchInput";
import DataManager from "../managers/DataManager";
import SoundManager from "../managers/SoundManager";
import TextManager from "../managers/TextManager";
import Window_Base from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_ShopStatus
//
// The window for displaying number of items in possession and the actor's
// equipment on the shop screen.

export default class Window_ShopStatus extends Window_Base {
    public _item: any;
    public _pageIndex: number;
    public setItem: (item: any) => void;
    public isEquipItem: () => any;
    public drawPossession: (x: any, y: any) => void;
    public drawEquipInfo: (x: any, y: any) => void;
    public statusMembers: () => any;
    public pageSize: () => number;
    public maxPages: () => number;
    public drawActorEquipInfo: (x: any, y: any, actor: any) => void;
    public drawActorParamChange: (
        x: any,
        y: any,
        actor: any,
        item1: any
    ) => void;
    public paramId: () => 2 | 3;
    public currentEquippedItem: (actor: any, etypeId: any) => any;
    public updatePage: () => void;
    public isPageChangeEnabled: () => boolean;
    public isPageChangeRequested: () => boolean;
    public isTouchedInsideFrame: () => boolean;
    public changePage: () => void;
    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this._item = null;
        this._pageIndex = 0;
        this.refresh();
    }
    public refresh(): any {
        throw new Error("Method not implemented.");
    }
}

Window_ShopStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._item) {
        const x = this.textPadding();
        this.drawPossession(x, 0);
        if (this.isEquipItem()) {
            this.drawEquipInfo(x, this.lineHeight() * 2);
        }
    }
};

Window_ShopStatus.prototype.setItem = function(item) {
    this._item = item;
    this.refresh();
};

Window_ShopStatus.prototype.isEquipItem = function() {
    return DataManager.isWeapon(this._item) || DataManager.isArmor(this._item);
};

Window_ShopStatus.prototype.drawPossession = function(x, y) {
    const width = this.contents.width - this.textPadding() - x;
    const possessionWidth = this.textWidth("0000");
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.possession, x, y, width - possessionWidth);
    this.resetTextColor();
    this.drawText($gameParty.numItems(this._item), x, y, width, "right");
};

Window_ShopStatus.prototype.drawEquipInfo = function(x, y) {
    const members = this.statusMembers();
    for (let i = 0; i < members.length; i++) {
        this.drawActorEquipInfo(
            x,
            y + this.lineHeight() * (i * 2.4),
            members[i]
        );
    }
};

Window_ShopStatus.prototype.statusMembers = function() {
    const start = this._pageIndex * this.pageSize();
    const end = start + this.pageSize();
    return $gameParty.members().slice(start, end);
};

Window_ShopStatus.prototype.pageSize = function() {
    return 4;
};

Window_ShopStatus.prototype.maxPages = function() {
    return Math.floor(
        ($gameParty.size() + this.pageSize() - 1) / this.pageSize()
    );
};

Window_ShopStatus.prototype.drawActorEquipInfo = function(x, y, actor) {
    const enabled = actor.canEquip(this._item);
    this.changePaintOpacity(enabled);
    this.resetTextColor();
    this.drawText(actor.name(), x, y, 168);
    const item1 = this.currentEquippedItem(actor, this._item.etypeId);
    if (enabled) {
        this.drawActorParamChange(x, y, actor, item1);
    }
    this.drawItemName(item1, x, y + this.lineHeight());
    this.changePaintOpacity(true);
};

Window_ShopStatus.prototype.drawActorParamChange = function(
    x,
    y,
    actor,
    item1
) {
    const width = this.contents.width - this.textPadding() - x;
    const paramId = this.paramId();
    const change =
        this._item.params[paramId] - (item1 ? item1.params[paramId] : 0);
    this.changeTextColor(this.paramchangeTextColor(change));
    this.drawText((change > 0 ? "+" : "") + change, x, y, width, "right");
};

Window_ShopStatus.prototype.paramId = function() {
    return DataManager.isWeapon(this._item) ? 2 : 3;
};

Window_ShopStatus.prototype.currentEquippedItem = function(actor, etypeId) {
    const list = [];
    const equips = actor.equips();
    const slots = actor.equipSlots();
    for (let i = 0; i < slots.length; i++) {
        if (slots[i] === etypeId) {
            list.push(equips[i]);
        }
    }
    const paramId = this.paramId();
    let worstParam = Number.MAX_VALUE;
    let worstItem = null;
    for (let j = 0; j < list.length; j++) {
        if (list[j] && list[j].params[paramId] < worstParam) {
            worstParam = list[j].params[paramId];
            worstItem = list[j];
        }
    }
    return worstItem;
};

Window_ShopStatus.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.updatePage();
};

Window_ShopStatus.prototype.updatePage = function() {
    if (this.isPageChangeEnabled() && this.isPageChangeRequested()) {
        this.changePage();
    }
};

Window_ShopStatus.prototype.isPageChangeEnabled = function() {
    return this.visible && this.maxPages() >= 2;
};

Window_ShopStatus.prototype.isPageChangeRequested = function() {
    if (Input.isTriggered("shift")) {
        return true;
    }
    if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
        return true;
    }
    return false;
};

Window_ShopStatus.prototype.isTouchedInsideFrame = function() {
    const x = this.canvasToLocalX(TouchInput.x);
    const y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

Window_ShopStatus.prototype.changePage = function() {
    this._pageIndex = (this._pageIndex + 1) % this.maxPages();
    this.refresh();
    SoundManager.playCursor();
};
