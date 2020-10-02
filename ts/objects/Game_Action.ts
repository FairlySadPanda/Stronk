import { Utils } from "../core/Utils";
import { Game_Item } from "./Game_Item";
import { Skill } from "../interfaces/Skill";
import { Item } from "../interfaces/Item";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";
import { BattleManager } from "../managers/BattleManager";
import { Game_ActionResult } from "./Game_ActionResult";
import { Game_Battler } from "./Game_Battler";

export class Game_Action {
    public static EFFECT_RECOVER_HP = 11;
    public static EFFECT_RECOVER_MP = 12;
    public static EFFECT_GAIN_TP = 13;
    public static EFFECT_ADD_STATE = 21;
    public static EFFECT_REMOVE_STATE = 22;
    public static EFFECT_ADD_BUFF = 31;
    public static EFFECT_ADD_DEBUFF = 32;
    public static EFFECT_REMOVE_BUFF = 33;
    public static EFFECT_REMOVE_DEBUFF = 34;
    public static EFFECT_SPECIAL = 41;
    public static EFFECT_GROW = 42;
    public static EFFECT_LEARN_SKILL = 43;
    public static EFFECT_COMMON_EVENT = 44;
    public static SPECIAL_EFFECT_ESCAPE = 0;
    public static HITTYPE_CERTAIN = 0;
    public static HITTYPE_PHYSICAL = 1;
    public static HITTYPE_MAGICAL = 2;

    private _subjectActorId: number;
    private _subjectEnemyIndex: number;
    private _forcing: any;
    private _item: Game_Item;
    private _targetIndex: number;
    private _reflectionTarget: any;

    public constructor(subject?: Game_Battler, forcing?: boolean) {
        this._subjectActorId = 0;
        this._subjectEnemyIndex = -1;
        this._forcing = forcing || false;
        this.setSubject(subject);
        this.clear();
    }

    public clear() {
        this._item = new Game_Item();
        this._targetIndex = -1;
    }

    public setSubject(subject) {
        if (subject.isActor()) {
            this._subjectActorId = subject.actorId();
            this._subjectEnemyIndex = -1;
        } else {
            this._subjectEnemyIndex = subject.index();
            this._subjectActorId = 0;
        }
    }

    public subject() {
        if (this._subjectActorId > 0) {
            return $gameActors.actor(this._subjectActorId);
        } else {
            return $gameTroop.members()[this._subjectEnemyIndex];
        }
    }

    public friendsUnit() {
        return this.subject().friendsUnit();
    }

    public opponentsUnit() {
        return this.subject().opponentsUnit();
    }

    public setEnemyAction(action) {
        if (action) {
            this.setSkill(action.skillId);
        } else {
            this.clear();
        }
    }

    public setAttack() {
        this.setSkill(this.subject().attackSkillId());
    }

    public setGuard() {
        this.setSkill(this.subject().guardSkillId());
    }

    public setSkill(skillId) {
        this._item.setObject($dataSkills[skillId]);
    }

    public setItem(itemId) {
        this._item.setObject($dataItems[itemId]);
    }

    public setItemObject(object) {
        this._item.setObject(object);
    }

    public setTarget(targetIndex) {
        this._targetIndex = targetIndex;
    }

    public item() {
        return this._item.object();
    }

    public isSkill() {
        return this._item.isSkill();
    }

    public isItem() {
        return this._item.isItem();
    }

    public numRepeats() {
        let repeats = (this.item() as Skill | Item).repeats;
        if (this.isAttack()) {
            repeats += this.subject().attackTimesAdd();
        }
        return Math.floor(repeats);
    }

    public checkItemScope(list) {
        return list.indexOf((this.item() as Item).scope) > -1;
    }

    public isForOpponent() {
        return this.checkItemScope([1, 2, 3, 4, 5, 6]);
    }

    public isForFriend() {
        return this.checkItemScope([7, 8, 9, 10, 11]);
    }

    public isForDeadFriend() {
        return this.checkItemScope([9, 10]);
    }

    public isForUser() {
        return this.checkItemScope([11]);
    }

    public isForOne() {
        return this.checkItemScope([1, 3, 7, 9, 11]);
    }

    public isForRandom() {
        return this.checkItemScope([3, 4, 5, 6]);
    }

    public isForAll() {
        return this.checkItemScope([2, 8, 10]);
    }

    public needsSelection() {
        if ($gameParty.inBattle() && (this.item() as Item).scope === 0)
            return false;
        if ($gameParty.inBattle() && BattleManager.isForceSelection())
            return true;
        return this.checkItemScope([1, 7, 9]);
    }

    public numTargets() {
        return this.isForRandom() ? (this.item() as Item).scope - 2 : 0;
    }

    public checkDamageType(list) {
        return list.indexOf((this.item() as Item).damage.type) > -1;
    }

    public isHpEffect() {
        return this.checkDamageType([1, 3, 5]);
    }

    public isMpEffect() {
        return this.checkDamageType([2, 4, 6]);
    }

    public isDamage() {
        return this.checkDamageType([1, 2]);
    }

    public isRecover() {
        return this.checkDamageType([3, 4]);
    }

    public isDrain() {
        return this.checkDamageType([5, 6]);
    }

    public isHpRecover() {
        return this.checkDamageType([3]);
    }

    public isMpRecover() {
        return this.checkDamageType([4]);
    }

    public isCertainHit() {
        return (
            (this.item() as Skill | Item).hitType ===
            Game_Action.HITTYPE_CERTAIN
        );
    }

    public isPhysical() {
        return (
            (this.item() as Skill | Item).hitType ===
            Game_Action.HITTYPE_PHYSICAL
        );
    }

    public isMagical() {
        return (
            (this.item() as Skill | Item).hitType ===
            Game_Action.HITTYPE_MAGICAL
        );
    }

    public isAttack() {
        return this.item() === $dataSkills[this.subject().attackSkillId()];
    }

    public isGuard() {
        return this.item() === $dataSkills[this.subject().guardSkillId()];
    }

    public isMagicSkill() {
        if (this.isSkill()) {
            return (
                $dataSystem.magicSkills.indexOf(
                    (this.item() as Skill).stypeId
                ) > -1
            );
        } else {
            return false;
        }
    }

    public decideRandomTarget() {
        let target;
        if (this.isForDeadFriend()) {
            target = this.friendsUnit().randomDeadTarget();
        } else if (this.isForFriend()) {
            target = this.friendsUnit().randomTarget();
        } else {
            target = this.opponentsUnit().randomTarget();
        }
        if (target) {
            this._targetIndex = target.index();
        } else {
            this.clear();
        }
    }

    public setConfusion() {
        this.setAttack();
    }

    public prepare() {
        if (this.subject().isConfused() && !this._forcing) {
            this.setConfusion();
        }
    }

    public isValid() {
        return (
            (this._forcing && this.item()) || this.subject().canUse(this.item())
        );
    }

    public speed() {
        const user = this.subject();
        const a = user;
        const maxhp = user.mhp;
        const mhp = user.mhp;
        const hp = user.hp;
        const maxmp = user.mmp;
        const mmp = user.mmp;
        const mp = user.mp;
        const maxtp = user.maxTp();
        const mtp = user.maxTp();
        const tp = user.tp;
        const atk = user.atk;
        const def = user.def;
        const mat = user.mat;
        const int = user.mat;
        const mdf = user.mdf;
        //const res = user.res;
        const agi = user.agi;
        const luk = user.luk;
        const code = Yanfly.Param.BECActionSpeed;
        let speed = 0;
        try {
            speed = eval(code);
        } catch (e) {
            Yanfly.Util.displayError(e, code, "ACTION SPEED FORMULA ERROR");
        }
        if (this.item()) speed += (this.item() as Item).speed;
        if (this.isAttack()) speed += this.subject().attackSpeed();
        return speed;
    }

    public makeTargets() {
        let targets = [];
        if (!this._forcing && this.subject().isConfused()) {
            targets = [this.confusionTarget()];
        } else if (this.isForOpponent()) {
            targets = this.targetsForOpponents();
        } else if (this.isForFriend()) {
            targets = this.targetsForFriends();
        }
        return this.repeatTargets(targets);
    }

    public repeatTargets(targets) {
        const repeatedTargets = [];
        const repeats = this.numRepeats();
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            if (target) {
                for (let j = 0; j < repeats; j++) {
                    repeatedTargets.push(target);
                }
            }
        }
        return repeatedTargets;
    }

    public confusionTarget() {
        switch (this.subject().confusionLevel()) {
            case 1:
                return this.opponentsUnit().randomTarget();
            case 2:
                if (Utils.randomInt(2) === 0) {
                    return this.opponentsUnit().randomTarget();
                }
                return this.friendsUnit().randomTarget();
            default:
                return this.friendsUnit().randomTarget();
        }
    }

    public targetsForOpponents() {
        let targets = [];
        const unit = this.opponentsUnit();
        if (this.isForRandom()) {
            for (let i = 0; i < this.numTargets(); i++) {
                targets.push(unit.randomTarget());
            }
        } else if (this.isForOne()) {
            if (this._targetIndex < 0) {
                targets.push(unit.randomTarget());
            } else {
                targets.push(unit.smoothTarget(this._targetIndex));
            }
        } else {
            targets = unit.aliveMembers();
        }
        return targets;
    }

    public targetsForFriends() {
        let targets = [];
        const unit = this.friendsUnit();
        if (this.isForUser()) {
            return [this.subject()];
        } else if (this.isForDeadFriend()) {
            if (this.isForOne()) {
                targets.push(unit.smoothDeadTarget(this._targetIndex));
            } else {
                targets = unit.deadMembers();
            }
        } else if (this.isForOne()) {
            if (this._targetIndex < 0) {
                targets.push(unit.randomTarget());
            } else {
                targets.push(unit.smoothTarget(this._targetIndex));
            }
        } else {
            targets = unit.aliveMembers();
        }
        return targets;
    }

    public evaluate() {
        let value = 0;
        this.itemTargetCandidates().forEach(function(target) {
            const targetValue = this.evaluateWithTarget(target);
            if (this.isForAll()) {
                value += targetValue;
            } else if (targetValue > value) {
                value = targetValue;
                this._targetIndex = target.index();
            }
        }, this);
        value *= this.numRepeats();
        if (value > 0) {
            value += Math.random();
        }
        return value;
    }

    public itemTargetCandidates() {
        if (!this.isValid()) {
            return [];
        } else if (this.isForOpponent()) {
            return this.opponentsUnit().aliveMembers();
        } else if (this.isForUser()) {
            return [this.subject()];
        } else if (this.isForDeadFriend()) {
            return this.friendsUnit().deadMembers();
        } else {
            return this.friendsUnit().aliveMembers();
        }
    }

    public evaluateWithTarget(target: Game_Battler) {
        if (this.isHpEffect()) {
            const value = this.makeDamageValue(target, false);
            if (this.isForOpponent()) {
                return value / Math.max(target.hp, 1);
            } else {
                const recovery = Math.min(-value, target.mhp - target.hp);
                return recovery / target.mhp;
            }
        }
    }

    public testApply(target: Game_Battler) {
        return (
            this.isForDeadFriend() === target.isDead() &&
            ($gameParty.inBattle() ||
                this.isForOpponent() ||
                (this.isHpRecover() && target.hp < target.mhp) ||
                (this.isMpRecover() && target.mp < target.mmp) ||
                this.hasItemAnyValidEffects(target))
        );
    }

    public hasItemAnyValidEffects(target: Game_Battler) {
        return (this.item() as Skill | Item).effects.some(function(effect) {
            return this.testItemEffect(target, effect);
        }, this);
    }

    public testItemEffect(target, effect) {
        switch (effect.code) {
            case Game_Action.EFFECT_RECOVER_HP:
                return (
                    target.hp < target.mhp ||
                    effect.value1 < 0 ||
                    effect.value2 < 0
                );
            case Game_Action.EFFECT_RECOVER_MP:
                return (
                    target.mp < target.mmp ||
                    effect.value1 < 0 ||
                    effect.value2 < 0
                );
            case Game_Action.EFFECT_ADD_STATE:
                return !target.isStateAffected(effect.dataId);
            case Game_Action.EFFECT_REMOVE_STATE:
                return target.isStateAffected(effect.dataId);
            case Game_Action.EFFECT_ADD_BUFF:
                return !target.isMaxBuffAffected(effect.dataId);
            case Game_Action.EFFECT_ADD_DEBUFF:
                return !target.isMaxDebuffAffected(effect.dataId);
            case Game_Action.EFFECT_REMOVE_BUFF:
                return target.isBuffAffected(effect.dataId);
            case Game_Action.EFFECT_REMOVE_DEBUFF:
                return target.isDebuffAffected(effect.dataId);
            case Game_Action.EFFECT_LEARN_SKILL:
                return (
                    target.isActor() && !target._skills.includes(effect.dataId)
                );
            default:
                return true;
        }
    }

    public itemCnt(target: Game_Battler) {
        if (this.isPhysical() && target.canMove()) {
            return target.cnt;
        } else {
            return 0;
        }
    }

    public itemMrf(target: Game_Battler) {
        if (this.isMagical()) {
            return target.mrf;
        } else {
            return 0;
        }
    }

    public itemHit(target: Game_Battler) {
        if (this.isPhysical()) {
            return (
                (this.item() as Item).successRate * 0.01 * this.subject().hit
            );
        } else {
            return (this.item() as Item).successRate * 0.01;
        }
    }

    public itemEva(target: Game_Battler) {
        if (this.isPhysical()) {
            return target.eva;
        } else if (this.isMagical()) {
            return target.mev;
        } else {
            return 0;
        }
    }

    public itemCri(target: Game_Battler) {
        return (this.item() as Item).damage.critical
            ? this.subject().cri * (1 - target.cev)
            : 0;
    }

    public apply(target: Game_Battler) {
        target.result = null;
        target.result = new Game_ActionResult();
        this.subject().result = null;
        this.subject().result = new Game_ActionResult();
        const result = target.result;
        this.subject().clearResult;
        result.clear();
        result.used = this.testApply(target);
        result.missed = result.used && Math.random() >= this.itemHit(target);
        result.evaded = !result.missed && Math.random() < this.itemEva(target);
        result.physical = this.isPhysical();
        result.drain = this.isDrain();
        if (result.isHit()) {
            if ((this.item() as Skill | Item).damage.type > 0) {
                result.critical = Math.random() < this.itemCri(target);
                const value = this.makeDamageValue(target, result.critical);
                this.executeDamage(target, value);
            }
            (this.item() as Skill | Item).effects.forEach(function(effect) {
                this.applyItemEffect(target, effect);
            }, this);
            this.applyItemUserEffect(target);
        }
        if ($gameParty.inBattle()) {
            target.startDamagePopup();
            target.performResultEffects();
            if (target !== this.subject()) this.subject().startDamagePopup();
        }
    }

    public makeDamageValue(target, critical) {
        const item = this.item();
        const baseValue = this.evalDamageFormula(target);
        let value = baseValue * this.calcElementRate(target);
        if (this.isPhysical()) {
            value *= target.pdr;
        }
        if (this.isMagical()) {
            value *= target.mdr;
        }
        if (baseValue < 0) {
            value *= target.rec;
        }
        if (critical) {
            value = this.applyCritical(value);
        }
        value = this.applyVariance(
            value,
            (item as Skill | Item).damage.variance
        );
        value = this.applyGuard(value, target);
        value = Math.round(value);
        return value;
    }

    public evalDamageFormula(target: Game_Battler) {
        const item = this.item() as Skill | Item;
        const a = this.subject();
        const b = target;
        const v = $gameVariables._data;
        try {
            let value =
                Math.max(eval(item.damage.formula), 0) *
                ([3, 4].includes(item.damage.type) ? -1 : 1);
            if (isNaN(value)) {
                value = 0;
            }
            return value;
        } catch (e) {
            Yanfly.Util.displayError(
                e,
                item.damage.formula,
                "DAMAGE FORMULA ERROR"
            );
            return 0;
        }
    }

    public calcElementRate(target: Game_Battler) {
        if ((this.item() as Skill | Item).damage.elementId < 0) {
            return this.elementsMaxRate(
                target,
                this.subject().attackElements()
            );
        } else {
            return target.elementRate(
                (this.item() as Skill | Item).damage.elementId
            );
        }
    }

    public elementsMaxRate(target, elements) {
        if (elements.length > 0) {
            return Math.max.apply(
                null,
                elements.map(function(elementId) {
                    return target.elementRate(elementId);
                }, this)
            );
        } else {
            return 1;
        }
    }

    public applyCritical(damage) {
        return damage * 3;
    }

    public applyVariance(damage, variance) {
        const amp = Math.floor(
            Math.max((Math.abs(damage) * variance) / 100, 0)
        );
        const v = Utils.randomInt(amp + 1) + Utils.randomInt(amp + 1) - amp;
        return damage >= 0 ? damage + v : damage - v;
    }

    public applyGuard(damage, target) {
        return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
    }

    public executeDamage(target, value) {
        const result = target.result;
        if (value === 0) {
            result.critical = false;
        }
        if (this.isHpEffect()) {
            this.executeHpDamage(target, value);
        }
        if (this.isMpEffect()) {
            this.executeMpDamage(target, value);
        }
    }

    public executeHpDamage(target, value) {
        if (this.isDrain()) {
            value = Math.min(target.hp, value);
        }
        this.makeSuccess(target);
        target.gainHp(-value);
        if (value > 0) {
            target.onDamage(value);
        }
        this.gainDrainedHp(value);
    }

    public executeMpDamage(target, value) {
        if (!this.isMpRecover()) {
            value = Math.min(target.mp, value);
        }
        if (value !== 0) {
            this.makeSuccess(target);
        }
        target.gainMp(-value);
        this.gainDrainedMp(value);
    }

    public gainDrainedHp(value) {
        if (this.isDrain()) {
            let gainTarget = this.subject();
            if (this._reflectionTarget !== undefined) {
                gainTarget = this._reflectionTarget;
            }
            gainTarget.gainHp(value);
        }
    }

    public gainDrainedMp(value) {
        if (this.isDrain()) {
            let gainTarget = this.subject();
            if (this._reflectionTarget !== undefined) {
                gainTarget = this._reflectionTarget;
            }
            gainTarget.gainMp(value);
        }
    }

    public applyItemEffect(target, effect) {
        switch (effect.code) {
            case Game_Action.EFFECT_RECOVER_HP:
                this.itemEffectRecoverHp(target, effect);
                break;
            case Game_Action.EFFECT_RECOVER_MP:
                this.itemEffectRecoverMp(target, effect);
                break;
            case Game_Action.EFFECT_GAIN_TP:
                this.itemEffectGainTp(target, effect);
                break;
            case Game_Action.EFFECT_ADD_STATE:
                this.itemEffectAddState(target, effect);
                break;
            case Game_Action.EFFECT_REMOVE_STATE:
                this.itemEffectRemoveState(target, effect);
                break;
            case Game_Action.EFFECT_ADD_BUFF:
                this.itemEffectAddBuff(target, effect);
                break;
            case Game_Action.EFFECT_ADD_DEBUFF:
                this.itemEffectAddDebuff(target, effect);
                break;
            case Game_Action.EFFECT_REMOVE_BUFF:
                this.itemEffectRemoveBuff(target, effect);
                break;
            case Game_Action.EFFECT_REMOVE_DEBUFF:
                this.itemEffectRemoveDebuff(target, effect);
                break;
            case Game_Action.EFFECT_SPECIAL:
                this.itemEffectSpecial(target, effect);
                break;
            case Game_Action.EFFECT_GROW:
                this.itemEffectGrow(target, effect);
                break;
            case Game_Action.EFFECT_LEARN_SKILL:
                this.itemEffectLearnSkill(target, effect);
                break;
            case Game_Action.EFFECT_COMMON_EVENT:
                this.itemEffectCommonEvent(target, effect);
                break;
        }
    }

    public itemEffectRecoverHp(target, effect) {
        let value = (target.mhp * effect.value1 + effect.value2) * target.rec;
        if (this.isItem()) {
            value *= this.subject().pha;
        }
        value = Math.floor(value);
        if (value !== 0) {
            target.gainHp(value);
            this.makeSuccess(target);
        }
    }

    public itemEffectRecoverMp(target, effect) {
        let value = (target.mmp * effect.value1 + effect.value2) * target.rec;
        if (this.isItem()) {
            value *= this.subject().pha;
        }
        value = Math.floor(value);
        if (value !== 0) {
            target.gainMp(value);
            this.makeSuccess(target);
        }
    }

    public itemEffectGainTp(target, effect) {
        const value = Math.floor(effect.value1);
        if (value !== 0) {
            target.gainTp(value);
            this.makeSuccess(target);
        }
    }

    public itemEffectAddState(target, effect) {
        if (effect.dataId === 0) {
            this.itemEffectAddAttackState(target, effect);
        } else {
            this.itemEffectAddNormalState(target, effect);
        }
    }

    public itemEffectAddAttackState(target, effect) {
        this.subject()
            .attackStates()
            .forEach(
                function(stateId) {
                    let chance = effect.value1;
                    chance *= target.stateRate(stateId);
                    chance *= this.subject().attackStatesRate(stateId);
                    chance *= this.lukEffectRate(target);
                    if (Math.random() < chance) {
                        if (stateId === target.deathStateId()) {
                            if (target.isImmortal()) target.removeImmortal();
                        }
                        target.addState(stateId);
                        this.makeSuccess(target);
                    }
                }.bind(this),
                target
            );
    }

    public itemEffectAddNormalState(target, effect) {
        let stateId = effect.dataId;
        let chance = effect.value1;
        if (!this.isCertainHit()) {
            chance *= target.stateRate(stateId);
            chance *= this.lukEffectRate(target);
        }
        if (Math.random() < chance) {
            if (stateId === target.deathStateId()) {
                if (target.isImmortal()) target.removeImmortal();
            }
            target.addState(stateId);
            this.makeSuccess(target);
        }
    }

    public itemEffectRemoveState(target, effect) {
        const chance = effect.value1;
        if (Math.random() < chance) {
            target.removeState(effect.dataId);
            this.makeSuccess(target);
        }
    }

    public itemEffectAddBuff(target, effect) {
        target.addBuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    }

    public itemEffectAddDebuff(target, effect) {
        const chance =
            target.debuffRate(effect.dataId) * this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addDebuff(effect.dataId, effect.value1);
            this.makeSuccess(target);
        }
    }

    public itemEffectRemoveBuff(target, effect) {
        if (target.isBuffAffected(effect.dataId)) {
            target.removeBuff(effect.dataId);
            this.makeSuccess(target);
        }
    }

    public itemEffectRemoveDebuff(target, effect) {
        if (target.isDebuffAffected(effect.dataId)) {
            target.removeBuff(effect.dataId);
            this.makeSuccess(target);
        }
    }

    public itemEffectSpecial(target, effect) {
        if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
            target.escape();
            this.makeSuccess(target);
        }
    }

    public itemEffectGrow(target, effect) {
        target.addParam(effect.dataId, Math.floor(effect.value1));
        this.makeSuccess(target);
    }

    public itemEffectLearnSkill(target, effect) {
        if (target.isActor()) {
            target.learnSkill(effect.dataId);
            this.makeSuccess(target);
        }
    }

    public itemEffectCommonEvent(target, effect) {}

    public makeSuccess(target: Game_Battler) {
        target.result.success = true;
    }

    public applyItemUserEffect(target: Game_Battler) {
        const value = Math.floor(
            (this.item() as Skill | Item).tpGain * this.subject().tcr
        );
        this.subject().gainSilentTp(value);
    }

    public lukEffectRate(target) {
        const item = this.item();
        const skill = this.item();
        const a = this.subject();
        const user = this.subject();
        const subject = this.subject();
        const b = target;
        const s = $gameSwitches._data;
        const v = $gameVariables._data;
        return eval(Yanfly.Param.BPCLukEffectRate);
    }

    public applyGlobal() {
        if ($gameParty.inBattle()) return;
        (this.item() as Skill | Item).effects.forEach(function(effect) {
            if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
                $gameTemp.reserveCommonEvent(effect.dataId);
            }
        }, this);
    }
}
