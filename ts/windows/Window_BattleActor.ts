import { Window_BattleStatus } from "./Window_BattleStatus";
import { BattleManager } from "../managers/BattleManager";
import { Window_Selectable } from "./Window_Selectable";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";
import { TouchInput } from "../core/TouchInput";
import { SoundManager } from "../managers/SoundManager";
import { Rectangle } from "../core/Rectangle";

// -----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.

export class Window_BattleActor extends Window_BattleStatus {
    public x: any;
    public y: any;
    public openness: number;
    private _selectDead: boolean;

    public constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.openness = 255;
        this.hide();
    }

    public show() {
        this.select(0);
        super.show();
    }

    public hide() {
        super.hide();
        $gameParty.select(null);
    }

    public select(index) {
        super.select(index);
        $gameParty.select(this.actor());
    }

    public actor() {
        return $gameParty.members()[this.index()];
    }

    public autoSelect() {
        let action = BattleManager.inputtingAction();
        if (!action) return;
        this._inputLock = false;
        this._selectDead = false;
        this.setCursorAll(false);
        if (action.isForUser()) {
            this.select(BattleManager.actor().index());
            this._inputLock = true;
        } else if (action.isForAll()) {
            this._inputLock = true;
            this.setCursorAll(true);
        } else if (action.isForDeadFriend()) {
            this._selectDead = true;
            this.autoSelectFirstDeadActor();
        }
        this.updateCursor();
    }

    public updateCursor() {
        if (this._cursorAll) {
            let allRowsHeight = this.maxRows() * this.itemHeight();
            this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
            this.setTopRow(0);
        } else if (this.isCursorVisible()) {
            let rect = this.itemRect(this.index());
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    }

    public autoSelectFirstDeadActor() {
        let length = $gameParty.members().length;
        for (let i = 0; i < length; ++i) {
            let member = $gameParty.members()[i];
            if (member && member.isDead()) return this.select(i);
        }
    }

    public isOkEnabled() {
        if (this._selectDead) return this.actor().isDead();
        return super.isOkEnabled();
    }

    public updateHelp() {
        if (!this._helpWindow) return;
        this._helpWindow.setBattler(this.actor());
    }

    public processTouch() {
        if (Yanfly.Param.BECActorSelect && this.isOpenAndActive()) {
            if (TouchInput.isTriggered() && !this.isTouchedInsideFrame()) {
                if (this.getClickedActor() >= 0) {
                    var index = this.getClickedActor();
                    if (this.index() === index) {
                        return this.processOk();
                    } else {
                        SoundManager.playCursor();
                        return this.select(index);
                    }
                }
            }
            if (TouchInput.isPressed() && !this.isTouchedInsideFrame()) {
                if (this.getClickedActor() >= 0) {
                    var index = this.getClickedActor();
                    if (this.index() !== index) {
                        SoundManager.playCursor();
                        return this.select(index);
                    }
                }
            }
            if (Yanfly.Param.BECSelectMouseOver) {
                var index = this.getMouseOverActor();
                if (index >= 0 && this.index() !== index) {
                    SoundManager.playCursor();
                    return this.select(index);
                }
            }
        }
        super.processTouch();
    }

    public getClickedActor() {
        for (let i = 0; i < $gameParty.battleMembers().length; ++i) {
            let actor = $gameParty.battleMembers().reverse()[i];
            if (!actor) continue;
            if (this.isClickedActor(actor)) {
                if (this._selectDead && !actor.isDead()) continue;
                if (this._inputLock && actor.index() !== this.index()) continue;
                return actor.index();
            }
        }
        return -1;
    }

    public isClickedActor(actor) {
        if (!actor) return false;
        if (!actor.isSpriteVisible()) return false;
        if (!actor.isAppeared()) return false;
        if ($gameTemp._disableMouseOverSelect) return false;
        let x = TouchInput.x;
        let y = TouchInput.y;
        let rect = new Rectangle();
        rect.width = actor.spriteWidth();
        rect.height = actor.spriteHeight();
        rect.x = actor.spritePosX() - rect.width / 2;
        rect.y = actor.spritePosY() - rect.height;
        return (
            x >= rect.x &&
            y >= rect.y &&
            x < rect.x + rect.width &&
            y < rect.y + rect.height
        );
    }

    public getMouseOverActor() {
        for (let i = 0; i < $gameParty.battleMembers().length; ++i) {
            let actor = $gameParty.battleMembers().reverse()[i];
            if (!actor) continue;
            if (this.isMouseOverActor(actor)) {
                if (this._selectDead && !actor.isDead()) continue;
                if (this._inputLock && actor.index() !== this.index()) continue;
                return actor.index();
            }
        }
        return -1;
    }

    public isMouseOverActor(actor) {
        if (!actor) return false;
        if (!actor.isSpriteVisible()) return false;
        if (!actor.isAppeared()) return false;
        if ($gameTemp._disableMouseOverSelect) return false;
        let x = TouchInput._mouseOverX;
        let y = TouchInput._mouseOverY;
        let rect = new Rectangle();
        rect.width = actor.spriteWidth();
        rect.height = actor.spriteHeight();
        rect.x = actor.spritePosX() - rect.width / 2;
        rect.y = actor.spritePosY() - rect.height;
        return (
            x >= rect.x &&
            y >= rect.y &&
            x < rect.x + rect.width &&
            y < rect.y + rect.height
        );
    }
}
