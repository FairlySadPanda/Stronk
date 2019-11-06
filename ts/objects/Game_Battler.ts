import { Utils } from "../core/Utils";
import { BattleManager } from "../managers/BattleManager";
import { DataManager } from "../managers/DataManager";
import { SoundManager } from "../managers/SoundManager";
import { Game_Action } from "./Game_Action";
import { Game_ActionResult } from "./Game_ActionResult";
import { Game_BattlerBase, Game_BattlerBase_OnLoad } from "./Game_BattlerBase";
import { JsonEx } from "../core/JsonEx";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

export interface Game_Battler_OnLoad extends Game_BattlerBase_OnLoad {
    _actions: any[];
    _speed: number;

    _actionState: string;
    _lastTargetIndex: number;
    _animations: any[];
    _damagePopup: any[];
    _effectType: any;
    _motionType: any;
    _weaponImageId: number;
    _motionRefresh: boolean;
    _selected: boolean;
}

export abstract class Game_Battler extends Game_BattlerBase {
    private _actions: any[];
    private _speed: number;
    private _actionState: string;
    private _lastTargetIndex: number;
    private _animations: any[];
    private _damagePopup: any[];
    private _effectType: any;
    private _motionType: any;
    private _weaponImageId: number;
    private _motionRefresh: boolean;
    private _selected: boolean;
    private _selfTurnCount: number;
    private _flinched: boolean;

    public get result(): Game_ActionResult {
        return this._result;
    }
    public set result(value: Game_ActionResult) {
        this._result = value;
    }

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
        this._damagePopup = [];
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
        this._damagePopup = [];
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
        if (this.battler()) {
            this.battler().startMotion(motionType);
        }
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
        if (!this._damagePopup) this.clearDamagePopup();
        return this._damagePopup.length > 0;
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
        if ($gameParty.inBattle() && BattleManager.isAllSelection()) {
            if (!this.isAppeared()) return false;
            let action = BattleManager.inputtingAction();
            if (action && action.item()) {
                if (this.isDead() && this.isEnemy()) return false;
                if (this.isDead() && this.isActor())
                    return action.isForDeadFriend();
                if (action.isForFriend() && this.isActor()) return true;
                if (action.isForOpponent() && this.isEnemy()) return true;
            }
        }
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
        if (!$dataAnimations[animationId]) return;
        const data = { animationId: animationId, mirror: mirror, delay: delay };
        this._animations.push(data);
    }

    public startDamagePopup() {
        let result = this.result;
        if (result.missed || result.evaded) {
            let copyResult = JsonEx.makeDeepCopy(result);
            copyResult.hpAffected = false;
            copyResult.mpDamage = 0;
            this._damagePopup.push(copyResult);
        }
        if (result.hpAffected) {
            let copyResult = JsonEx.makeDeepCopy(result);
            copyResult.mpDamage = 0;
            this._damagePopup.push(copyResult);
        }
        if (result.mpDamage !== 0) {
            let copyResult = JsonEx.makeDeepCopy(result);
            copyResult.hpAffected = false;
            this._damagePopup.push(copyResult);
        }
    }

    public startWeaponAnimation(weaponImageId) {
        this._weaponImageId = weaponImageId;
        if (this.battler()) {
            this.battler().setupWeaponAnimation();
        }
    }

    public shiftDamagePopup() {
        if (!this._damagePopup) this.clearDamagePopup();
        return this._damagePopup.shift();
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

    public clearResult() {
        this._result.clear();
    }

    public refresh() {
        this._baseParamCache = undefined;
        super.refresh();
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
        if (this.canAddStateFreeTurn(stateId)) this.setStateFreeTurn(stateId);
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
        super.onRestrict();
        this.clearActions();
        this.states().forEach(function(state) {
            if (state.removeByRestriction) {
                this.removeState(state.id);
            }
        }, this);
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
        this.refresh();
        if (!$gameParty.inBattle()) return;
        this.increaseSelfTurnCount();
        this.updateStateActionStart();
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
        this.clearResult();
        const lifeState = this.isAlive();
        if (this.isAlive()) {
            this.regenerateHp();
            this.regenerateMp();
            this.regenerateTp();
        }
        if ($gameParty.inBattle()) {
            if (!BattleManager.timeBasedStates()) this.updateStateTurns();
            if (!BattleManager.timeBasedBuffs()) {
                this.updateBuffTurns();
                this.removeBuffsAuto();
            }
            if (this.isDead() && lifeState === true) {
                this.performCollapse();
            }
            this.startDamagePopup();
        }
    }

    public addImmortal() {
        this._immortalState = true;
    }

    public removeImmortal() {
        const alreadyDead = this.isDead();
        this._immortalState = false;
        this.refresh();
        if (this.isDead() && !alreadyDead) this.performCollapse();
    }

    public onBattleStart() {
        this.setActionState("undecided");
        this.clearMotion();
        if (!this.isPreserveTp()) {
            this.initTp();
        }
        this._freeStateTurn = [];
        this._immortalState = false;
        this._selfTurnCount = 0;
    }

    public onAllActionsEnd() {
        this.clearResult();
        this.removeStatesAuto(1);
        this.removeBuffsAuto();
        if (!BattleManager._processTurn) this.updateStateActionEnd();
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
        this._freeStateTurn = [];
        this._immortalState = false;
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
            this.spriteStepForward();
        }
    }

    public performAction(action) {}

    public performActionEnd() {
        this.setActionState("done");
        this.spriteReturnHome();
    }

    public performDamage() {
        this.performFlinch();
    }

    public performMiss() {
        SoundManager.playMiss();
        this.performFlinch();
    }

    public performRecovery() {
        SoundManager.playRecovery();
    }

    public performEvasion() {
        SoundManager.playEvasion();
        this.performFlinch();
    }

    public performFlinch() {
        if (this._flinched || !$gameSystem.isSideView()) return;
        this._flinched = true;
        this.spriteStepFlinch();
    }

    public performMagicEvasion() {
        SoundManager.playMagicEvasion();
        this.performFlinch();
    }

    public performCounter() {
        SoundManager.playEvasion();
    }

    public performReflection() {
        SoundManager.playReflection();
        if (!$gameSystem.isSideView() && this.isActor()) return;
        let animationId = this.reflectAnimationId();
        let mirror = this.isActor();
        this.startAnimation(animationId, mirror, 0);
    }

    public performSubstitute(target) {
        if (!$gameSystem.isSideView()) return;
        this._flinched = true;
        if (BattleManager._action.isForAll()) {
            this.spriteStepForward();
            target.spriteStepSubBack();
        } else {
            this.spriteStepToSubstitute(target);
            target.spriteStepSubBack();
        }
    }

    public setBattler(sprite) {
        BattleManager.registerSprite(this, sprite);
    }

    public battler() {
        return BattleManager.getSprite(this);
    }

    public performCollapse() {
        if ($gameParty.inBattle()) this.forceMotion(this.deadMotion());
    }

    public forceMotion(motionType) {
        this._motionType = motionType;
        if (this.battler()) {
            this.battler().forceMotion(motionType);
        }
    }

    public performResultEffects() {
        let result = this.result;
        if (result.missed && result.physical) this.performMiss();
        if (result.evaded) {
            if (result.physical) {
                this.performEvasion();
            } else {
                this.performMagicEvasion();
            }
        }
        if (result.hpAffected) {
            if (result.hpDamage > 0 && !result.drain) {
                this.performDamage();
            }
            if (result.hpDamage < 0) {
                this.performRecovery();
            }
        }
        if (this.isAlive() && result.mpDamage !== 0 && result.mpDamage < 0) {
            this.performRecovery();
        }
        if (this.isAlive() && result.tpDamage !== 0 && result.tpDamage < 0) {
            this.performRecovery();
        }
    }

    public abstract isSpriteVisible(): boolean;

    public paramPlus(paramId: number) {
        let value = super.paramPlus(paramId);
        const length = this.states().length;
        for (let i = 0; i < length; ++i) {
            const obj = this.states()[i];
            if (obj && obj.plusParams) {
                value += obj.plusParams[paramId];
            }
        }
        return value;
    }

    public paramRate(paramId: number) {
        let rate = super.paramRate(paramId);
        const length = this.states().length;
        for (let i = 0; i < length; ++i) {
            const obj = this.states()[i];
            if (obj && obj.rateParams) {
                rate *= obj.rateParams[paramId];
            }
        }
        return rate;
    }

    public customParamMax(paramId: number) {
        let value = super.customParamMax(paramId);
        const length = this.states().length;
        for (let i = 0; i < length; ++i) {
            const obj = this.states()[i];
            if (obj && obj.maxParams && obj.maxParams[paramId]) {
                value = Math.max(value, obj.maxParams[paramId]);
            }
        }
        return value;
    }

    public customParamMin(paramId) {
        let value = super.customParamMin(paramId);
        const length = this.states().length;
        for (let i = 0; i < length; ++i) {
            const obj = this.states()[i];
            if (obj && obj.minParams && obj.minParams[paramId]) {
                value = Math.max(value, obj.minParams[paramId]);
            }
        }
        return value;
    }

    public xparamPlus(id) {
        let value = super.xparamPlus(id);
        let length = this.states().length;
        for (let i = 0; i < length; ++i) {
            let obj = this.states()[i];
            if (obj && obj.plusXParams) value += obj.plusXParams[id];
        }
        return value;
    }

    public xparamRate(id) {
        let value = super.xparamRate(id);
        let length = this.states().length;
        for (let i = 0; i < length; ++i) {
            let obj = this.states()[i];
            if (obj && obj.rateXParams) value *= obj.rateXParams[id];
        }
        return value;
    }

    public xparamFlat(id) {
        let value = super.xparamFlat(id);
        let length = this.states().length;
        for (let i = 0; i < length; ++i) {
            let obj = this.states()[i];
            if (obj && obj.flatXParams) value += obj.flatXParams[id];
        }
        return value;
    }

    public spriteStepForward() {
        if ($gameSystem.isSideView() && this.battler()) {
            this.battler().stepForward();
        }
    }

    public spriteStepBack() {
        if ($gameSystem.isSideView() && this.battler()) {
            this.battler().stepBack();
        }
    }

    public spriteStepSubBack() {
        if ($gameSystem.isSideView() && this.battler()) {
            this.battler().stepSubBack();
        }
    }

    public spriteStepToSubstitute(target) {
        if ($gameSystem.isSideView() && this.battler()) {
            this.battler().stepToSubstitute(target);
        }
    }

    public spriteStepFlinch() {
        if ($gameSystem.isSideView() && this.battler()) {
            this.battler().stepFlinch();
        }
    }

    public spriteReturnHome() {
        if ($gameSystem.isSideView() && this.battler()) {
            this._flinched = false;
            this.spriteFaceForward();
            this.battler().stepBack();
            if (this.numActions() <= 0) {
                this.setActionState("undecided");
            }
            this.battler().refreshMotion();
        }
    }

    public reflectAnimationId() {
        for (let i = 0; i < this.states().length; ++i) {
            let state = this.states()[i];
            if (state.reflectAnimationId > 0) return state.reflectAnimationId;
        }
        return Yanfly.Param.BECReflectAni;
    }

    public spriteCanMove() {
        if (!$gameSystem.isSideView()) return false;
        for (let i = 0; i < this.states().length; ++i) {
            let state = this.states()[i];
            if (state.spriteCannotMove) return false;
        }
        return this.canMove();
    }

    public spritePosX() {
        if ($gameSystem.isSideView() && this.battler()) {
            return this.battler().x;
        } else if (this.battler()) {
            return this.battler().x;
        } else {
            return 0;
        }
    }

    public spritePosY() {
        if ($gameSystem.isSideView() && this.battler()) {
            return this.battler().y;
        } else if (this.battler()) {
            return this.battler().y;
        } else {
            return 0;
        }
    }

    public spriteWidth() {
        if (
            $gameSystem.isSideView() &&
            this.battler() &&
            this.battler().bitmap
        ) {
            return this.battler().bitmap.width;
        } else if (this.battler() && this.battler().bitmap) {
            return this.battler().bitmap.width;
        } else {
            return 1;
        }
    }

    public spriteHeight() {
        if (
            $gameSystem.isSideView() &&
            this.battler() &&
            this.battler().bitmap
        ) {
            return this.battler().bitmap.height;
        } else if (this.battler() && this.battler().bitmap) {
            return this.battler().bitmap.height;
        } else {
            return 1;
        }
    }

    public anchorX() {
        return Yanfly.Param.BECAnchorX;
    }

    public anchorY() {
        return Yanfly.Param.BECAnchorY;
    }

    public spriteHomeX() {
        if ($gameSystem.isSideView() && this.battler()) {
            return this.battler()._homeX;
        } else {
            return 0;
        }
    }

    public spriteHomeY() {
        if ($gameSystem.isSideView() && this.battler()) {
            return this.battler()._homeY;
        } else {
            return 0;
        }
    }

    public setMirror(value) {
        if (
            $gameSystem.isSideView() &&
            this.battler() &&
            this.spriteCanMove()
        ) {
            this.battler().setMirror(value);
        }
    }

    public spriteFaceForward() {
        this.setMirror(false);
    }

    public spriteFaceBackward() {
        this.setMirror(true);
    }

    public spriteFacePoint(pointX, pointY) {
        if (this.spritePosX() > pointX) {
            this.spriteFaceBackward();
        } else {
            this.spriteFaceForward();
        }
    }

    public spriteFaceAwayPoint(pointX, pointY) {
        if (this.spritePosX() > pointX) {
            this.spriteFaceForward();
        } else {
            this.spriteFaceBackward();
        }
    }

    public spriteFaceTarget(target) {
        if (!target) return;
        let pointX = target.spritePosX();
        let pointY = target.spritePosY();
        this.spriteFacePoint(pointX, pointY);
    }

    public spriteFaceAwayTarget(target) {
        if (!target) return;
        let pointX = target.spritePosX();
        let pointY = target.spritePosY();
        this.spriteFaceAwayPoint(pointX, pointY);
    }

    public spriteFaceHome() {
        let pointX = this.spriteHomeX();
        let pointY = this.spriteHomeY();
        this.spriteFacePoint(pointX, pointY);
    }

    public spriteFaceAwayHome() {
        let pointX = this.spriteHomeX();
        let pointY = this.spriteHomeY();
        this.spriteFaceAwayPoint(pointX, pointY);
    }

    public attackMotion() {
        return "thrust";
    }

    public performAttack() {}

    public forceMotionRefresh() {
        if (!$gameParty.inBattle()) return;
        if (this.battler()) this.battler().refreshMotion();
    }

    public requestMotionRefresh() {
        let deadMotion = this.deadMotion();
        if (this.isDead() && this._motionType !== deadMotion) {
            this.requestMotion(deadMotion);
        }
        if (this.isDead() && this._motionType === deadMotion) return;
        if (this._motionType === "victory") return;
        if (this._motionType === "escape" && !BattleManager.isInputting())
            return;
        if (this._motionType === "guard" && !BattleManager.isInputting())
            return;
        this.clearMotion();
        if (this.battler() && BattleManager.isInputting()) {
            this.battler().refreshMotion();
        }
    }

    public onTurnStart() {
        this.updateStateTurnStart();
    }

    public onTurnEnd() {
        this.clearResult();
        if (BattleManager.isTurnBased()) {
            this.regenerateAll();
        } else if (BattleManager.isTickBased() && !BattleManager.isTurnEnd()) {
            this.regenerateAll();
        }
        this.removeStatesAuto(2);
    }

    public updateTick() {
        if (BattleManager.timeBasedStates()) this.updateStateTicks();
        if (BattleManager.timeBasedBuffs()) this.updateBuffTicks();
    }

    public increaseSelfTurnCount() {
        if (this._selfTurnCount === undefined) this._selfTurnCount = 0;
        this._selfTurnCount += 1;
    }

    public turnCount() {
        if (BattleManager.isTurnBased()) return $gameTroop.turnCount();
        if (BattleManager.isTickBased() && Yanfly.Param.BECAISelfTurn) {
            return this._selfTurnCount;
        }
        return $gameTroop.turnCount();
    }

    public createActions() {
        if (this.currentAction()) return;
        this.makeActions();
    }

    public canAddStateFreeTurn(stateId) {
        if (!$gameParty.inBattle()) return false;
        if (BattleManager._subject !== this) return false;
        if ($dataStates[stateId].autoRemovalTiming !== 1) return false;
        // if (Imported.YEP_BuffsStatesCore) {
        //     if ($dataStates[stateId].reapplyRules === 0) return false;
        // }
        return true;
    }

    public setStateFreeTurn(stateId) {
        this._freeStateTurn = this._freeStateTurn || [];
        this._freeStateTurn.push(stateId);
    }

    public idleMotion() {
        return "walk";
    }

    public deadMotion() {
        return "dead";
    }

    public sleepMotion() {
        return "sleep";
    }

    public chantMotion() {
        return "chant";
    }

    public guardMotion() {
        return "guard";
    }

    public abnormalMotion() {
        return "abnormal";
    }

    public dyingMotion() {
        return "dying";
    }

    public waitMotion() {
        return "wait";
    }

    public recoverAll() {
        super.recoverAll();
        if ($gameParty.inBattle()) this.forceMotionRefresh();
    }

    public updateBuffTicks() {
        let needRefresh = false;
        for (let i = 0; i < this._buffTurns.length; i++) {
            if (this._buffTurns[i] <= 0) continue;
            let value = BattleManager.tickRate() / Yanfly.Param.BECTurnTime;
            let shown1 = Math.ceil(this._buffTurns[i]);
            this._buffTurns[i] -= value;
            let shown2 = Math.ceil(this._buffTurns[i]);
            if (shown1 !== shown2) needRefresh = true;
            if (this._buffTurns[i] <= 0) this.removeBuff(i);
        }
        if (needRefresh) this.refresh();
    }
}
