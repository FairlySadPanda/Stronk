import { Graphics } from "../core/Graphics";
import { Window_Base } from "./Window_Base";
import { BattleManager } from "../managers/BattleManager";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";
import { Utils } from "../core/Utils";

// -----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.

export class Window_Help extends Window_Base {
    private _text: string;

    public constructor(numLines?: number) {
        const width = Graphics.boxWidth;
        const height = Window_Help.prototype.fittingHeight(numLines || 2);
        super(0, 0, width, height);
        this._text = "";
    }

    public setText(text) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    }

    public clear() {
        this.setText("");
        this.contents.clear();
    }

    public setItem(item) {
        this.setText(item ? item.description : "");
    }

    public refresh() {
        this.contents.clear();
        this.drawTextEx(this._text, this.textPadding(), 0);
    }

    public setBattler(battler) {
        this.contents.clear();
        this.clear();
        this.resetFontSettings();
        if (!$gameParty.inBattle()) return;
        if (!battler) return;
        let action = BattleManager.inputtingAction();
        if (this.specialSelectionText(action)) {
            this.drawSpecialSelectionText(action);
        } else {
            this.drawBattler(battler);
        }
    }

    public specialSelectionText(action) {
        BattleManager.resetSelection();
        if (!action) return false;
        return !action.needsSelection();
    }

    public drawBattler(battler) {
        let text = battler.name();
        let wx = 0;
        let wy = (this.contents.height - this.lineHeight()) / 2;
        this.drawText(text, wx, wy, this.contents.width, undefined, "center");
    }

    public drawSpecialSelectionText(action) {
        let wx = 0;
        let wy = (this.contents.height - this.lineHeight()) / 2;
        let text = "";
        if (action.isForUser()) {
            text = Yanfly.Param.BECHelpUserTx;
        } else if (action.isForRandom()) {
            BattleManager.startAllSelection();
            let fmt = Yanfly.Param.BECHelpRandTx;
            let target = Yanfly.Param.BECHelpAllyTx;
            if (action.isForOpponent() && action.numTargets() !== 1) {
                target = Yanfly.Param.BECHelpEnemiesTx;
            } else if (action.isForOpponent() && action.numTargets() === 1) {
                target = Yanfly.Param.BECHelpEnemyTx;
            } else if (action.isForFriend() && action.numTargets() !== 1) {
                target = Yanfly.Param.BECHelpAlliesTx;
            }

            text = Utils.format(
                fmt,
                target,
                Yanfly.Util.toGroup(action.numTargets())
            );
        } else if (action.isForAll()) {
            BattleManager.startAllSelection();
            let fmt = Yanfly.Param.BECHelpAllTx;
            let target = Yanfly.Param.BECHelpAlliesTx;
            if (action.isForOpponent()) {
                target = Yanfly.Param.BECHelpEnemiesTx;
            }
            text = Utils.format(fmt, target);
        }
        this.drawText(text, wx, wy, this.contents.width, undefined, "center");
    }
}
