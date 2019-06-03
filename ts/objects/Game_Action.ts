import Utils from "../core/Utils";
import Game_Item from "./Game_Item";

export default class Game_Action {
    public static EFFECT_RECOVER_HP: number;
    public static EFFECT_RECOVER_MP: number;
    public static EFFECT_GAIN_TP: number;
    public static EFFECT_ADD_STATE: number;
    public static EFFECT_REMOVE_STATE: number;
    public static EFFECT_ADD_BUFF: number;
    public static EFFECT_ADD_DEBUFF: number;
    public static EFFECT_REMOVE_BUFF: number;
    public static EFFECT_REMOVE_DEBUFF: number;
    public static EFFECT_SPECIAL: number;
    public static EFFECT_GROW: number;
    public static EFFECT_LEARN_SKILL: number;
    public static EFFECT_COMMON_EVENT: number;
    public static SPECIAL_EFFECT_ESCAPE: number;
    public static HITTYPE_CERTAIN: number;
    public static HITTYPE_PHYSICAL: number;
    public static HITTYPE_MAGICAL: number;
    public _subjectActorId: number;
    public _subjectEnemyIndex: number;
    public _forcing: any;
    public subject: () => any;
    public friendsUnit: () => any;
    public opponentsUnit: () => any;
    public setEnemyAction: (action: any) => void;
    public setAttack: () => void;
    public setGuard: () => void;
    public setSkill: (skillId: any) => void;
    public setItem: (itemId: any) => void;
    public setItemObject: (object: any) => void;
    public setTarget: (targetIndex: any) => void;
    public item: () => any;
    public isSkill: () => any;
    public isItem: () => any;
    public numRepeats: () => number;
    public checkItemScope: (list: any) => any;
    public isForOpponent: () => any;
    public isForFriend: () => any;
    public isForDeadFriend: () => any;
    public isForUser: () => any;
    public isForOne: () => any;
    public isForRandom: () => any;
    public isForAll: () => any;
    public needsSelection: () => any;
    public numTargets: () => number;
    public checkDamageType: (list: any) => any;
    public isHpEffect: () => any;
    public isMpEffect: () => any;
    public isDamage: () => any;
    public isRecover: () => any;
    public isDrain: () => any;
    public isHpRecover: () => any;
    public isMpRecover: () => any;
    public isCertainHit: () => boolean;
    public isPhysical: () => boolean;
    public isMagical: () => boolean;
    public isAttack: () => boolean;
    public isGuard: () => boolean;
    public isMagicSkill: () => any;
    public decideRandomTarget: () => void;
    public setConfusion: () => void;
    public prepare: () => void;
    public isValid: () => any;
    public speed: () => any;
    public makeTargets: () => any;
    public repeatTargets: (targets: any) => any[];
    public confusionTarget: () => any;
    public targetsForOpponents: () => any[];
    public targetsForFriends: () => any[];
    public evaluate: () => number;
    public itemTargetCandidates: () => any;
    public evaluateWithTarget: (target: any) => number;
    public testApply: (target: any) => any;
    public hasItemAnyValidEffects: (target: any) => any;
    public testItemEffect: (target: any, effect: any) => any;
    public itemCnt: (target: any) => any;
    public itemMrf: (target: any) => any;
    public itemHit: (target: any) => number;
    public itemEva: (target: any) => any;
    public itemCri: (target: any) => number;
    public apply: (target: any) => void;
    public makeDamageValue: (target: any, critical: any) => number;
    public evalDamageFormula: (target: any) => number;
    public calcElementRate: (target: any) => any;
    public elementsMaxRate: (target: any, elements: any) => any;
    public applyCritical: (damage: any) => number;
    public applyVariance: (damage: any, variance: any) => any;
    public applyGuard: (damage: any, target: any) => number;
    public executeDamage: (target: any, value: any) => void;
    public executeHpDamage: (target: any, value: any) => void;
    public executeMpDamage: (target: any, value: any) => void;
    public gainDrainedHp: (value: any) => void;
    public gainDrainedMp: (value: any) => void;
    public applyItemEffect: (target: any, effect: any) => void;
    public itemEffectRecoverHp: (target: any, effect: any) => void;
    public itemEffectRecoverMp: (target: any, effect: any) => void;
    public itemEffectGainTp: (target: any, effect: any) => void;
    public itemEffectAddState: (target: any, effect: any) => void;
    public itemEffectAddAttackState: (target: any, effect: any) => void;
    public itemEffectAddNormalState: (target: any, effect: any) => void;
    public itemEffectRemoveState: (target: any, effect: any) => void;
    public itemEffectAddBuff: (target: any, effect: any) => void;
    public itemEffectAddDebuff: (target: any, effect: any) => void;
    public itemEffectRemoveBuff: (target: any, effect: any) => void;
    public itemEffectRemoveDebuff: (target: any, effect: any) => void;
    public itemEffectSpecial: (target: any, effect: any) => void;
    public itemEffectGrow: (target: any, effect: any) => void;
    public itemEffectLearnSkill: (target: any, effect: any) => void;
    public itemEffectCommonEvent: (target: any, effect: any) => void;
    public makeSuccess: (target: any) => void;
    public applyItemUserEffect: (target: any) => void;
    public lukEffectRate: (target: any) => number;
    public applyGlobal: () => void;
    public constructor(subject?, forcing?) {
        this._subjectActorId = 0;
        this._subjectEnemyIndex = -1;
        this._forcing = forcing || false;
        this.setSubject(subject);
        this.clear();
    }
    public setSubject(subject: any): any {
        throw new Error("Method not implemented.");
    }
    public clear(): any {
        throw new Error("Method not implemented.");
    }
}

Game_Action.EFFECT_RECOVER_HP       = 11;
Game_Action.EFFECT_RECOVER_MP       = 12;
Game_Action.EFFECT_GAIN_TP          = 13;
Game_Action.EFFECT_ADD_STATE        = 21;
Game_Action.EFFECT_REMOVE_STATE     = 22;
Game_Action.EFFECT_ADD_BUFF         = 31;
Game_Action.EFFECT_ADD_DEBUFF       = 32;
Game_Action.EFFECT_REMOVE_BUFF      = 33;
Game_Action.EFFECT_REMOVE_DEBUFF    = 34;
Game_Action.EFFECT_SPECIAL          = 41;
Game_Action.EFFECT_GROW             = 42;
Game_Action.EFFECT_LEARN_SKILL      = 43;
Game_Action.EFFECT_COMMON_EVENT     = 44;
Game_Action.SPECIAL_EFFECT_ESCAPE   = 0;
Game_Action.HITTYPE_CERTAIN         = 0;
Game_Action.HITTYPE_PHYSICAL        = 1;
Game_Action.HITTYPE_MAGICAL         = 2;

Game_Action.prototype.clear = function () {
    this._item = new Game_Item();
    this._targetIndex = -1;
};

Game_Action.prototype.setSubject = function (subject) {
    if (subject.isActor()) {
        this._subjectActorId = subject.actorId();
        this._subjectEnemyIndex = -1;
    } else {
        this._subjectEnemyIndex = subject.index();
        this._subjectActorId = 0;
    }
};

Game_Action.prototype.subject = function () {
    if (this._subjectActorId > 0) {
        return $gameActors.actor(this._subjectActorId);
    } else {
        return $gameTroop.members()[this._subjectEnemyIndex];
    }
};

Game_Action.prototype.friendsUnit = function () {
    return this.subject().friendsUnit();
};

Game_Action.prototype.opponentsUnit = function () {
    return this.subject().opponentsUnit();
};

Game_Action.prototype.setEnemyAction = function (action) {
    if (action) {
        this.setSkill(action.skillId);
    } else {
        this.clear();
    }
};

Game_Action.prototype.setAttack = function () {
    this.setSkill(this.subject().attackSkillId());
};

Game_Action.prototype.setGuard = function () {
    this.setSkill(this.subject().guardSkillId());
};

Game_Action.prototype.setSkill = function (skillId) {
    this._item.setObject($dataSkills[skillId]);
};

Game_Action.prototype.setItem = function (itemId) {
    this._item.setObject($dataItems[itemId]);
};

Game_Action.prototype.setItemObject = function (object) {
    this._item.setObject(object);
};

Game_Action.prototype.setTarget = function (targetIndex) {
    this._targetIndex = targetIndex;
};

Game_Action.prototype.item = function () {
    return this._item.object();
};

Game_Action.prototype.isSkill = function () {
    return this._item.isSkill();
};

Game_Action.prototype.isItem = function () {
    return this._item.isItem();
};

Game_Action.prototype.numRepeats = function () {
    let repeats = this.item().repeats;
    if (this.isAttack()) {
        repeats += this.subject().attackTimesAdd();
    }
    return Math.floor(repeats);
};

Game_Action.prototype.checkItemScope = function (list) {
    return list.indexOf(this.item().scope) > -1;
};

Game_Action.prototype.isForOpponent = function () {
    return this.checkItemScope([1, 2, 3, 4, 5, 6]);
};

Game_Action.prototype.isForFriend = function () {
    return this.checkItemScope([7, 8, 9, 10, 11]);
};

Game_Action.prototype.isForDeadFriend = function () {
    return this.checkItemScope([9, 10]);
};

Game_Action.prototype.isForUser = function () {
    return this.checkItemScope([11]);
};

Game_Action.prototype.isForOne = function () {
    return this.checkItemScope([1, 3, 7, 9, 11]);
};

Game_Action.prototype.isForRandom = function () {
    return this.checkItemScope([3, 4, 5, 6]);
};

Game_Action.prototype.isForAll = function () {
    return this.checkItemScope([2, 8, 10]);
};

Game_Action.prototype.needsSelection = function () {
    return this.checkItemScope([1, 7, 9]);
};

Game_Action.prototype.numTargets = function () {
    return this.isForRandom() ? this.item().scope - 2 : 0;
};

Game_Action.prototype.checkDamageType = function (list) {
    return list.indexOf(this.item().damage.type) > -1;
};

Game_Action.prototype.isHpEffect = function () {
    return this.checkDamageType([1, 3, 5]);
};

Game_Action.prototype.isMpEffect = function () {
    return this.checkDamageType([2, 4, 6]);
};

Game_Action.prototype.isDamage = function () {
    return this.checkDamageType([1, 2]);
};

Game_Action.prototype.isRecover = function () {
    return this.checkDamageType([3, 4]);
};

Game_Action.prototype.isDrain = function () {
    return this.checkDamageType([5, 6]);
};

Game_Action.prototype.isHpRecover = function () {
    return this.checkDamageType([3]);
};

Game_Action.prototype.isMpRecover = function () {
    return this.checkDamageType([4]);
};

Game_Action.prototype.isCertainHit = function () {
    return this.item().hitType === Game_Action.HITTYPE_CERTAIN;
};

Game_Action.prototype.isPhysical = function () {
    return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;
};

Game_Action.prototype.isMagical = function () {
    return this.item().hitType === Game_Action.HITTYPE_MAGICAL;
};

Game_Action.prototype.isAttack = function () {
    return this.item() === $dataSkills[this.subject().attackSkillId()];
};

Game_Action.prototype.isGuard = function () {
    return this.item() === $dataSkills[this.subject().guardSkillId()];
};

Game_Action.prototype.isMagicSkill = function () {
    if (this.isSkill()) {
        return $dataSystem.magicSkills.indexOf(this.item().stypeId) > -1;
    } else {
        return false;
    }
};

Game_Action.prototype.decideRandomTarget = function () {
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
};

Game_Action.prototype.setConfusion = function () {
    this.setAttack();
};

Game_Action.prototype.prepare = function () {
    if (this.subject().isConfused() && !this._forcing) {
        this.setConfusion();
    }
};

Game_Action.prototype.isValid = function () {
    return (this._forcing && this.item()) || this.subject().canUse(this.item());
};

Game_Action.prototype.speed = function () {
    const agi = this.subject().agi;
    let speed = agi + Utils.randomInt(Math.floor(5 + agi / 4));
    if (this.item()) {
        speed += this.item().speed;
    }
    if (this.isAttack()) {
        speed += this.subject().attackSpeed();
    }
    return speed;
};

Game_Action.prototype.makeTargets = function () {
    let targets = [];
    if (!this._forcing && this.subject().isConfused()) {
        targets = [this.confusionTarget()];
    } else if (this.isForOpponent()) {
        targets = this.targetsForOpponents();
    } else if (this.isForFriend()) {
        targets = this.targetsForFriends();
    }
    return this.repeatTargets(targets);
};

Game_Action.prototype.repeatTargets = function (targets) {
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
};

Game_Action.prototype.confusionTarget = function () {
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
};

Game_Action.prototype.targetsForOpponents = function () {
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
};

Game_Action.prototype.targetsForFriends = function () {
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
};

Game_Action.prototype.evaluate = function () {
    let value = 0;
    this.itemTargetCandidates().forEach(function (target) {
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
};

Game_Action.prototype.itemTargetCandidates = function () {
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
};

Game_Action.prototype.evaluateWithTarget = function (target) {
    if (this.isHpEffect()) {
        const value = this.makeDamageValue(target, false);
        if (this.isForOpponent()) {
            return value / Math.max(target.hp, 1);
        } else {
            const recovery = Math.min(-value, target.mhp - target.hp);
            return recovery / target.mhp;
        }
    }
};

Game_Action.prototype.testApply = function (target) {
    return (this.isForDeadFriend() === target.isDead() &&
            ($gameParty.inBattle() || this.isForOpponent() ||
            (this.isHpRecover() && target.hp < target.mhp) ||
            (this.isMpRecover() && target.mp < target.mmp) ||
            (this.hasItemAnyValidEffects(target))));
};

Game_Action.prototype.hasItemAnyValidEffects = function (target) {
    return this.item().effects.some(function (effect) {
        return this.testItemEffect(target, effect);
    }, this);
};

Game_Action.prototype.testItemEffect = function (target, effect) {
    switch (effect.code) {
    case Game_Action.EFFECT_RECOVER_HP:
        return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
    case Game_Action.EFFECT_RECOVER_MP:
        return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
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
        return target.isActor() && !target.isLearnedSkill(effect.dataId);
    default:
        return true;
    }
};

Game_Action.prototype.itemCnt = function (target) {
    if (this.isPhysical() && target.canMove()) {
        return target.cnt;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemMrf = function (target) {
    if (this.isMagical()) {
        return target.mrf;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemHit = function (target) {
    if (this.isPhysical()) {
        return this.item().successRate * 0.01 * this.subject().hit;
    } else {
        return this.item().successRate * 0.01;
    }
};

Game_Action.prototype.itemEva = function (target) {
    if (this.isPhysical()) {
        return target.eva;
    } else if (this.isMagical()) {
        return target.mev;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemCri = function (target) {
    return this.item().damage.critical ? this.subject().cri * (1 - target.cev) : 0;
};

Game_Action.prototype.apply = function (target) {
    const result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = (Math.random() < this.itemCri(target));
            const value = this.makeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
        this.item().effects.forEach(function (effect) {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyItemUserEffect(target);
    }
};

Game_Action.prototype.makeDamageValue = function (target, critical) {
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
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
    value = Math.round(value);
    return value;
};

Game_Action.prototype.evalDamageFormula = function (target) {
    try {
        const item = this.item();
        const a = this.subject();
        const b = target;
        const v = $gameVariables._data;
        const sign = ([3, 4].indexOf(item.damage.type) > -1 ? -1 : 1);
        let value = Math.max(eval(item.damage.formula), 0) * sign;
		if (isNaN(value)) { value = 0; }
		return value;
    } catch (e) {
        return 0;
    }
};

Game_Action.prototype.calcElementRate = function (target) {
    if (this.item().damage.elementId < 0) {
        return this.elementsMaxRate(target, this.subject().attackElements());
    } else {
        return target.elementRate(this.item().damage.elementId);
    }
};

Game_Action.prototype.elementsMaxRate = function (target, elements) {
    if (elements.length > 0) {
        return Math.max.apply(null, elements.map(function (elementId) {
            return target.elementRate(elementId);
        }, this));
    } else {
        return 1;
    }
};

Game_Action.prototype.applyCritical = function (damage) {
    return damage * 3;
};

Game_Action.prototype.applyVariance = function (damage, variance) {
    const amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
    const v = Utils.randomInt(amp + 1) + Utils.randomInt(amp + 1) - amp;
    return damage >= 0 ? damage + v : damage - v;
};

Game_Action.prototype.applyGuard = function (damage, target) {
    return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
};

Game_Action.prototype.executeDamage = function (target, value) {
    const result = target.result();
    if (value === 0) {
        result.critical = false;
    }
    if (this.isHpEffect()) {
        this.executeHpDamage(target, value);
    }
    if (this.isMpEffect()) {
        this.executeMpDamage(target, value);
    }
};

Game_Action.prototype.executeHpDamage = function (target, value) {
    if (this.isDrain()) {
        value = Math.min(target.hp, value);
    }
    this.makeSuccess(target);
    target.gainHp(-value);
    if (value > 0) {
        target.onDamage(value);
    }
    this.gainDrainedHp(value);
};

Game_Action.prototype.executeMpDamage = function (target, value) {
    if (!this.isMpRecover()) {
        value = Math.min(target.mp, value);
    }
    if (value !== 0) {
        this.makeSuccess(target);
    }
    target.gainMp(-value);
    this.gainDrainedMp(value);
};

Game_Action.prototype.gainDrainedHp = function (value) {
    if (this.isDrain()) {
       let gainTarget = this.subject();
       if (this._reflectionTarget !== undefined) {
            gainTarget = this._reflectionTarget;
        }
       gainTarget.gainHp(value);
    }
};

Game_Action.prototype.gainDrainedMp = function (value) {
    if (this.isDrain()) {
       let gainTarget = this.subject();
       if (this._reflectionTarget !== undefined) {
           gainTarget = this._reflectionTarget;
       }
       gainTarget.gainMp(value);
    }
};

Game_Action.prototype.applyItemEffect = function (target, effect) {
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
};

Game_Action.prototype.itemEffectRecoverHp = function (target, effect) {
    let value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainHp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRecoverMp = function (target, effect) {
    let value = (target.mmp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainMp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectGainTp = function (target, effect) {
    const value = Math.floor(effect.value1);
    if (value !== 0) {
        target.gainTp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectAddState = function (target, effect) {
    if (effect.dataId === 0) {
        this.itemEffectAddAttackState(target, effect);
    } else {
        this.itemEffectAddNormalState(target, effect);
    }
};

Game_Action.prototype.itemEffectAddAttackState = function (target, effect) {
    this.subject().attackStates().forEach(function (stateId) {
        let chance = effect.value1;
        chance *= target.stateRate(stateId);
        chance *= this.subject().attackStatesRate(stateId);
        chance *= this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addState(stateId);
            this.makeSuccess(target);
        }
    }.bind(this), target);
};

Game_Action.prototype.itemEffectAddNormalState = function (target, effect) {
    let chance = effect.value1;
    if (!this.isCertainHit()) {
        chance *= target.stateRate(effect.dataId);
        chance *= this.lukEffectRate(target);
    }
    if (Math.random() < chance) {
        target.addState(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRemoveState = function (target, effect) {
    const chance = effect.value1;
    if (Math.random() < chance) {
        target.removeState(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectAddBuff = function (target, effect) {
    target.addBuff(effect.dataId, effect.value1);
    this.makeSuccess(target);
};

Game_Action.prototype.itemEffectAddDebuff = function (target, effect) {
    const chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
    if (Math.random() < chance) {
        target.addDebuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRemoveBuff = function (target, effect) {
    if (target.isBuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRemoveDebuff = function (target, effect) {
    if (target.isDebuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectSpecial = function (target, effect) {
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
        target.escape();
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectGrow = function (target, effect) {
    target.addParam(effect.dataId, Math.floor(effect.value1));
    this.makeSuccess(target);
};

Game_Action.prototype.itemEffectLearnSkill = function (target, effect) {
    if (target.isActor()) {
        target.learnSkill(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectCommonEvent = function (target, effect) {
};

Game_Action.prototype.makeSuccess = function (target) {
    target.result().success = true;
};

Game_Action.prototype.applyItemUserEffect = function (target) {
    const value = Math.floor(this.item().tpGain * this.subject().tcr);
    this.subject().gainSilentTp(value);
};

Game_Action.prototype.lukEffectRate = function (target) {
    return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
};

Game_Action.prototype.applyGlobal = function () {
    this.item().effects.forEach(function (effect) {
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
    }, this);
};
