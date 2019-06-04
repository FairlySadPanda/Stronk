import Utils from "../core/Utils";
import BattleManager from "../managers/BattleManager";
import DataManager from "../managers/DataManager";
import SoundManager from "../managers/SoundManager";
import Game_Action from "./Game_Action";
import Game_ActionResult from "./Game_ActionResult";
import Game_BattlerBase, { Game_BattlerBase_OnLoad } from "./Game_BattlerBase";

export interface Game_Battler_OnLoad extends Game_BattlerBase_OnLoad {
    _actions: any[];
    _speed: number;
    _result: Game_ActionResult;
    _actionState: string;
    _lastTargetIndex: number;
    _animations: any[];
    _damagePopup: boolean;
    _effectType: any;
    _motionType: any;
    _weaponImageId: number;
    _motionRefresh: boolean;
    _selected: boolean;
}

export default class Game_Battler extends Game_BattlerBase {
    private _actions: any[];
    private _speed: number;
    private _result: Game_ActionResult;
    private _actionState: string;
    private _lastTargetIndex: number;
    private _animations: any[];
    private _damagePopup: boolean;
    private _effectType: any;
    private _motionType: any;
    private _weaponImageId: number;
    private _motionRefresh: boolean;
    private _selected: boolean;

    public constructor(gameLoadInput?: Game_Battler_OnLoad) {
        super(gameLoadInput);

        if (gameLoadInput) {
            this._actions = gameLoadInput._actions;
            this._speed = gameLoadInput._speed;
            this._result = new Game_ActionResult(gameLoadInput._result);
            this._actionState = gameLoadInput._actionState;
            this._lastTargetIndex = gameLoadInput._lastTargetIndex;
            this._animations = gameLoadInput._animations;
            this._damagePopup = gameLoadInput._damagePopup;
            this._effectType = gameLoadInput._effectType;
            this._motionType = gameLoadInput._motionType;
            this._weaponImageId = gameLoadInput._weaponImageId;
            this._motionRefresh = gameLoadInput._motionRefresh;
            this._selected = gameLoadInput._selected;
        }
    }

    public initMembers() {
        super.initMembers();
        this._actions = [];
        this._speed = 0;
        this._result = new Game_ActionResult();
        this._actionState = "";
        this._lastTargetIndex = 0;
        this._animations = [];
        this._damagePopup = false;
        this._effectType = null;
        this._motionType = null;
        this._weaponImageId = 0;
        this._motionRefresh = false;
        this._selected = false;
    }

    public clearAnimations() {
        this._animations = [];
    }

    public clearDamagePopup() {
        this._damagePopup = false;
    }

    public clearWeaponAnimation() {
        this._weaponImageId = 0;
    }

    public clearEffect() {
        this._effectType = null;
    }

    public clearMotion() {
        this._motionType = null;
        this._motionRefresh = false;
    }

    public requestEffect(effectType) {
        this._effectType = effectType;
    }

    public requestMotion(motionType) {
        this._motionType = motionType;
    }

    public requestMotionRefresh() {
        this._motionRefresh = true;
    }

    public select() {
        this._selected = true;
    }

    public deselect() {
        this._selected = false;
    }

    public isAnimationRequested() {
        return this._animations.length > 0;
    }

    public isDamagePopupRequested() {
        return this._damagePopup;
    }

    public isEffectRequested() {
        return !!this._effectType;
    }

    public isMotionRequested() {
        return !!this._motionType;
    }

    public isWeaponAnimationRequested() {
        return this._weaponImageId > 0;
    }

    public isMotionRefreshRequested() {
        return this._motionRefresh;
    }

    public isSelected() {
        return this._selected;
    }

    public effectType() {
        return this._effectType;
    }

    public motionType() {
        return this._motionType;
    }

    public weaponImageId() {
        return this._weaponImageId;
    }

    public shiftAnimation() {
        return this._animations.shift();
    }

    public startAnimation(animationId, mirror, delay) {
        const data = { animationId: animationId, mirror: mirror, delay: delay };
        this._animations.push(data);
    }

    public startDamagePopup() {
        this._damagePopup = true;
    }

    public startWeaponAnimation(weaponImageId) {
        this._weaponImageId = weaponImageId;
    }

    public action(index) {
        return this._actions[index];
    }

    public setAction(index, action) {
        this._actions[index] = action;
    }

    public numActions() {
        return this._actions.length;
    }

    public clearActions() {
        this._actions = [];
    }

    public result() {
        return this._result;
    }

    public clearResult() {
        this._result.clear();
    }

    public refresh() {
        Game_BattlerBase.prototype.refresh.call(this);
        if (this.hp === 0) {
            this.addState(this.deathStateId());
        } else {
            this.removeState(this.deathStateId());
        }
    }

    public addState(stateId) {
        if (this.isStateAddable(stateId)) {
            if (!this.isStateAffected(stateId)) {
                this.addNewState(stateId);
                this.refresh();
            }
            this.resetStateCounts(stateId);
            this._result.pushAddedState(stateId);
        }
    }

    public isStateAddable(stateId) {
        return (
            this.isAlive() &&
            $dataStates[stateId] &&
            !this.isStateResist(stateId) &&
            !this._result.isStateRemoved(stateId) &&
            !this.isStateRestrict(stateId)
        );
    }

    public isStateRestrict(stateId) {
        return $dataStates[stateId].removeByRestriction && this.isRestricted();
    }

    public onRestrict() {
        Game_BattlerBase.prototype.onRestrict.call(this);
        this.clearActions();
        this.states().forEach(function(state) {
            if (state.removeByRestriction) {
                this.removeState(state.id);
            }
        }, this);
    }

    public removeState(stateId) {
        if (this.isStateAffected(stateId)) {
            if (stateId === this.deathStateId()) {
                this.revive();
            }
            this.eraseState(stateId);
            this.refresh();
            this._result.pushRemovedState(stateId);
        }
    }

    public escape() {
        if ($gameParty.inBattle()) {
            this.hide();
        }
        this.clearActions();
        this.clearStates();
        SoundManager.playEscape();
    }

    public addBuff(paramId, turns) {
        if (this.isAlive()) {
            this.increaseBuff(paramId);
            if (this.isBuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedBuff(paramId);
            this.refresh();
        }
    }

    public addDebuff(paramId, turns) {
        if (this.isAlive()) {
            this.decreaseBuff(paramId);
            if (this.isDebuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedDebuff(paramId);
            this.refresh();
        }
    }

    public removeBuff(paramId) {
        if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
            this.eraseBuff(paramId);
            this._result.pushRemovedBuff(paramId);
            this.refresh();
        }
    }

    public removeBattleStates() {
        this.states().forEach(function(state) {
            if (state.removeAtBattleEnd) {
                this.removeState(state.id);
            }
        }, this);
    }

    public removeAllBuffs() {
        for (let i = 0; i < this.buffLength(); i++) {
            this.removeBuff(i);
        }
    }

    public removeStatesAuto(timing) {
        this.states().forEach(function(state) {
            if (
                this.isStateExpired(state.id) &&
                state.autoRemovalTiming === timing
            ) {
                this.removeState(state.id);
            }
        }, this);
    }

    public removeBuffsAuto() {
        for (let i = 0; i < this.buffLength(); i++) {
            if (this.isBuffExpired(i)) {
                this.removeBuff(i);
            }
        }
    }

    public removeStatesByDamage() {
        this.states().forEach(function(state) {
            if (
                state.removeByDamage &&
                Utils.randomInt(100) < state.chanceByDamage
            ) {
                this.removeState(state.id);
            }
        }, this);
    }

    public makeActionTimes() {
        return this.actionPlusSet().reduce(function(r, p) {
            return Math.random() < p ? r + 1 : r;
        }, 1);
    }

    public makeActions() {
        this.clearActions();
        if (this.canMove()) {
            const actionTimes = this.makeActionTimes();
            this._actions = [];
            for (let i = 0; i < actionTimes; i++) {
                this._actions.push(new Game_Action(this));
            }
        }
    }

    public speed() {
        return this._speed;
    }

    public makeSpeed() {
        this._speed =
            Math.min.apply(
                null,
                this._actions.map(function(action) {
                    return action.speed();
                })
            ) || 0;
    }

    public currentAction() {
        return this._actions[0];
    }

    public removeCurrentAction() {
        this._actions.shift();
    }

    public setLastTarget(target) {
        if (target) {
            this._lastTargetIndex = target.index();
        } else {
            this._lastTargetIndex = 0;
        }
    }

    public forceAction(skillId, targetIndex) {
        this.clearActions();
        const action = new Game_Action(this, true);
        action.setSkill(skillId);
        if (targetIndex === -2) {
            action.setTarget(this._lastTargetIndex);
        } else if (targetIndex === -1) {
            action.decideRandomTarget();
        } else {
            action.setTarget(targetIndex);
        }
        this._actions.push(action);
    }

    public useItem(item) {
        if (DataManager.isSkill(item)) {
            this.paySkillCost(item);
        } else if (DataManager.isItem(item)) {
            this.consumeItem(item);
        }
    }

    public consumeItem(item) {
        $gameParty.consumeItem(item);
    }

    public gainHp(value) {
        this._result.hpDamage = -value;
        this._result.hpAffected = true;
        this.setHp(this.hp + value);
    }

    public gainMp(value) {
        this._result.mpDamage = -value;
        this.setMp(this.mp + value);
    }

    public gainTp(value) {
        this._result.tpDamage = -value;
        this.setTp(this.tp + value);
    }

    public gainSilentTp(value) {
        this.setTp(this.tp + value);
    }

    public initTp() {
        this.setTp(Utils.randomInt(25));
    }

    public clearTp() {
        this.setTp(0);
    }

    public chargeTpByDamage(damageRate) {
        const value = Math.floor(50 * damageRate * this.tcr);
        this.gainSilentTp(value);
    }

    public regenerateHp() {
        let value = Math.floor(this.mhp * this.hrg);
        value = Math.max(value, -this.maxSlipDamage());
        if (value !== 0) {
            this.gainHp(value);
        }
    }

    public maxSlipDamage() {
        return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
    }

    public regenerateMp() {
        const value = Math.floor(this.mmp * this.mrg);
        if (value !== 0) {
            this.gainMp(value);
        }
    }

    public regenerateTp() {
        const value = Math.floor(100 * this.trg);
        this.gainSilentTp(value);
    }

    public regenerateAll() {
        if (this.isAlive()) {
            this.regenerateHp();
            this.regenerateMp();
            this.regenerateTp();
        }
    }

    public onBattleStart() {
        this.setActionState("undecided");
        this.clearMotion();
        if (!this.isPreserveTp()) {
            this.initTp();
        }
    }

    public onAllActionsEnd() {
        this.clearResult();
        this.removeStatesAuto(1);
        this.removeBuffsAuto();
    }

    public onTurnEnd() {
        this.clearResult();
        this.regenerateAll();
        if (!BattleManager.isForcedTurn()) {
            this.updateStateTurns();
            this.updateBuffTurns();
        }
        this.removeStatesAuto(2);
    }

    public onBattleEnd() {
        this.clearResult();
        this.removeBattleStates();
        this.removeAllBuffs();
        this.clearActions();
        if (!this.isPreserveTp()) {
            this.clearTp();
        }
        this.appear();
    }

    public onDamage(value) {
        this.removeStatesByDamage();
        this.chargeTpByDamage(value / this.mhp);
    }

    public setActionState(actionState) {
        this._actionState = actionState;
        this.requestMotionRefresh();
    }

    public isUndecided() {
        return this._actionState === "undecided";
    }

    public isInputting() {
        return this._actionState === "inputting";
    }

    public isWaiting() {
        return this._actionState === "waiting";
    }

    public isActing() {
        return this._actionState === "acting";
    }

    public isChanting() {
        if (this.isWaiting()) {
            return this._actions.some(function(action) {
                return action.isMagicSkill();
            });
        }
        return false;
    }

    public isGuardWaiting() {
        if (this.isWaiting()) {
            return this._actions.some(function(action) {
                return action.isGuard();
            });
        }
        return false;
    }

    public performActionStart(action) {
        if (!action.isGuard()) {
            this.setActionState("acting");
        }
    }

    public performAction(action) {}

    public performActionEnd() {
        this.setActionState("done");
    }

    public performDamage() {}

    public performMiss() {
        SoundManager.playMiss();
    }

    public performRecovery() {
        SoundManager.playRecovery();
    }

    public performEvasion() {
        SoundManager.playEvasion();
    }

    public performMagicEvasion() {
        SoundManager.playMagicEvasion();
    }

    public performCounter() {
        SoundManager.playEvasion();
    }

    public performReflection() {
        SoundManager.playReflection();
    }

    public performSubstitute(target) {}

    public performCollapse() {}
}
