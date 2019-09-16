import { Utils } from "../core/Utils";
import { DataManager } from "../managers/DataManager";

export interface Game_BattlerBase_OnLoad {
    _hp: any;
    _mp: any;
    _tp: any;
    _hidden: boolean;
    _paramPlus: number[];
    _states: number[];
    _stateTurns: number[];
    _buffs: number[];
    _buffTurns: number[];
}

export class Game_BattlerBase {
    public static TRAIT_ELEMENT_RATE = 11;
    public static TRAIT_DEBUFF_RATE = 12;
    public static TRAIT_STATE_RATE = 13;
    public static TRAIT_STATE_RESIST = 14;
    public static TRAIT_PARAM = 21;
    public static TRAIT_XPARAM = 22;
    public static TRAIT_SPARAM = 23;
    public static TRAIT_ATTACK_ELEMENT = 31;
    public static TRAIT_ATTACK_STATE = 32;
    public static TRAIT_ATTACK_SPEED = 33;
    public static TRAIT_ATTACK_TIMES = 34;
    public static TRAIT_STYPE_ADD = 41;
    public static TRAIT_STYPE_SEAL = 42;
    public static TRAIT_SKILL_ADD = 43;
    public static TRAIT_SKILL_SEAL = 44;
    public static TRAIT_EQUIP_WTYPE = 51;
    public static TRAIT_EQUIP_ATYPE = 52;
    public static TRAIT_EQUIP_LOCK = 53;
    public static TRAIT_EQUIP_SEAL = 54;
    public static TRAIT_SLOT_TYPE = 55;
    public static TRAIT_ACTION_PLUS = 61;
    public static TRAIT_SPECIAL_FLAG = 62;
    public static TRAIT_COLLAPSE_TYPE = 63;
    public static TRAIT_PARTY_ABILITY = 64;
    public static FLAG_ID_AUTO_BATTLE = 0;
    public static FLAG_ID_GUARD = 1;
    public static FLAG_ID_SUBSTITUTE = 2;
    public static FLAG_ID_PRESERVE_TP = 3;
    public static ICON_BUFF_START = 32;
    public static ICON_DEBUFF_START = 48;

    private _hp: any;
    private _mp: any;
    private _tp: any;
    private _hidden: boolean;
    private _paramPlus: number[];
    private _states: number[];
    private _stateTurns: number[];
    private _buffs: number[];
    private _buffTurns: number[];

    public constructor(gameLoadInput?: Game_BattlerBase_OnLoad) {
        this.initMembers();

        if (gameLoadInput) {
            this._hp = gameLoadInput._hp;
            this._mp = gameLoadInput._mp;
            this._tp = gameLoadInput._tp;
            this._hidden = gameLoadInput._hidden;
            this._paramPlus = gameLoadInput._paramPlus;
            this._states = gameLoadInput._states;
            this._stateTurns = gameLoadInput._stateTurns;
            this._buffs = gameLoadInput._buffs;
            this._buffTurns = gameLoadInput._buffTurns;
        }
    }

    public get hp() {
        return this._hp;
    }

    public get mp() {
        return this._mp;
    }

    public get tp() {
        return this._tp;
    }

    public get mhp() {
        return this.param(0);
    }

    public get mmp() {
        return this.param(1);
    }

    public get atk() {
        return this.param(2);
    }

    public get def() {
        return this.param(3);
    }

    public get mat() {
        return this.param(4);
    }

    public get mdf() {
        return this.param(5);
    }

    public get agi() {
        return this.param(6);
    }

    public get luk() {
        return this.param(7);
    }

    public get hit() {
        return this.xparam(0);
    }

    public get eva() {
        return this.xparam(1);
    }

    public get cri() {
        return this.xparam(2);
    }

    public get cev() {
        return this.xparam(3);
    }

    public get mev() {
        return this.xparam(4);
    }

    public get mrf() {
        return this.xparam(5);
    }

    public get cnt() {
        return this.xparam(6);
    }

    public get hrg() {
        return this.xparam(7);
    }

    public get mrg() {
        return this.xparam(8);
    }

    public get trg() {
        return this.xparam(9);
    }

    public get tgr() {
        return this.sparam(0);
    }

    public get grd() {
        return this.sparam(1);
    }

    public get rec() {
        return this.sparam(2);
    }

    public get pha() {
        return this.sparam(3);
    }

    public get mcr() {
        return this.sparam(4);
    }

    public get tcr() {
        return this.sparam(5);
    }

    public get pdr() {
        return this.sparam(6);
    }

    public get mdr() {
        return this.sparam(7);
    }

    public get fdr() {
        return this.sparam(8);
    }

    public get exr() {
        return this.sparam(9);
    }

    public initMembers() {
        this._hp = 1;
        this._mp = 0;
        this._tp = 0;
        this._hidden = false;
        this.clearParamPlus();
        this.clearStates();
        this.clearBuffs();
    }

    public clearParamPlus() {
        this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    public clearStates() {
        this._states = [];
        this._stateTurns = [];
    }

    public eraseState(stateId) {
        const index = this._states.indexOf(stateId);
        if (index >= 0) {
            this._states.splice(index, 1);
        }
        delete this._stateTurns[stateId];
    }

    public isStateAffected(stateId) {
        return this._states.indexOf(stateId) > -1;
    }

    public isDeathStateAffected() {
        return this.isStateAffected(this.deathStateId());
    }

    public deathStateId() {
        return 1;
    }

    public resetStateCounts(stateId) {
        const state = $dataStates[stateId];
        const variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
        this._stateTurns[stateId] = state.minTurns + Utils.randomInt(variance);
    }

    public isStateExpired(stateId) {
        return this._stateTurns[stateId] === 0;
    }

    public updateStateTurns() {
        this._states.forEach(function(stateId) {
            if (this._stateTurns[stateId] > 0) {
                this._stateTurns[stateId]--;
            }
        }, this);
    }

    public clearBuffs() {
        this._buffs = [0, 0, 0, 0, 0, 0, 0, 0];
        this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    public eraseBuff(paramId) {
        this._buffs[paramId] = 0;
        this._buffTurns[paramId] = 0;
    }

    public buffLength() {
        return this._buffs.length;
    }

    public buff(paramId) {
        return this._buffs[paramId];
    }

    public isBuffAffected(paramId) {
        return this._buffs[paramId] > 0;
    }

    public isDebuffAffected(paramId) {
        return this._buffs[paramId] < 0;
    }

    public isBuffOrDebuffAffected(paramId) {
        return this._buffs[paramId] !== 0;
    }

    public isMaxBuffAffected(paramId) {
        return this._buffs[paramId] === 2;
    }

    public isMaxDebuffAffected(paramId) {
        return this._buffs[paramId] === -2;
    }

    public increaseBuff(paramId) {
        if (!this.isMaxBuffAffected(paramId)) {
            this._buffs[paramId]++;
        }
    }

    public decreaseBuff(paramId) {
        if (!this.isMaxDebuffAffected(paramId)) {
            this._buffs[paramId]--;
        }
    }

    public overwriteBuffTurns(paramId, turns) {
        if (this._buffTurns[paramId] < turns) {
            this._buffTurns[paramId] = turns;
        }
    }

    public isBuffExpired(paramId) {
        return this._buffTurns[paramId] === 0;
    }

    public updateBuffTurns() {
        for (let i = 0; i < this._buffTurns.length; i++) {
            if (this._buffTurns[i] > 0) {
                this._buffTurns[i]--;
            }
        }
    }

    public die() {
        this._hp = 0;
        this.clearStates();
        this.clearBuffs();
    }

    public revive() {
        if (this._hp === 0) {
            this._hp = 1;
        }
    }

    public states() {
        return this._states.map(function(id) {
            return $dataStates[id];
        });
    }

    public stateIcons() {
        return this.states()
            .map(function(state) {
                return state.iconIndex;
            })
            .filter(function(iconIndex) {
                return iconIndex > 0;
            });
    }

    public buffIcons() {
        const icons = [];
        for (let i = 0; i < this._buffs.length; i++) {
            if (this._buffs[i] !== 0) {
                icons.push(this.buffIconIndex(this._buffs[i], i));
            }
        }
        return icons;
    }

    public buffIconIndex(buffLevel, paramId) {
        if (buffLevel > 0) {
            return (
                Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId
            );
        } else if (buffLevel < 0) {
            return (
                Game_BattlerBase.ICON_DEBUFF_START +
                (-buffLevel - 1) * 8 +
                paramId
            );
        } else {
            return 0;
        }
    }

    public allIcons() {
        return this.stateIcons().concat(this.buffIcons());
    }

    public traitObjects() {
        // Returns an array of the all objects having traits. States only here.
        return this.states();
    }

    public allTraits() {
        return this.traitObjects().reduce(function(r, obj) {
            return r.concat(obj.traits);
        }, []);
    }

    public traits(code) {
        return this.allTraits().filter(function(trait) {
            return trait.code === code;
        });
    }

    public traitsWithId(code, id) {
        return this.allTraits().filter(function(trait) {
            return trait.code === code && trait.dataId === id;
        });
    }

    public traitsPi(code, id) {
        return this.traitsWithId(code, id).reduce(function(r, trait) {
            return r * trait.value;
        }, 1);
    }

    public traitsSum(code, id) {
        return this.traitsWithId(code, id).reduce(function(r, trait) {
            return r + trait.value;
        }, 0);
    }

    public traitsSumAll(code) {
        return this.traits(code).reduce(function(r, trait) {
            return r + trait.value;
        }, 0);
    }

    public traitsSet(code) {
        return this.traits(code).reduce(function(r, trait) {
            return r.concat(trait.dataId);
        }, []);
    }

    public paramBase(paramId) {
        return 0;
    }

    public paramPlus(paramId) {
        return this._paramPlus[paramId];
    }

    public paramMin(paramId) {
        if (paramId === 1) {
            return 0; // MMP
        } else {
            return 1;
        }
    }

    public paramMax(paramId) {
        if (paramId === 0) {
            return 999999; // MHP
        } else if (paramId === 1) {
            return 9999; // MMP
        } else {
            return 999;
        }
    }

    public paramRate(paramId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
    }

    public paramBuffRate(paramId) {
        return this._buffs[paramId] * 0.25 + 1.0;
    }

    public param(paramId) {
        let value = this.paramBase(paramId) + this.paramPlus(paramId);
        value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
        const maxValue = this.paramMax(paramId);
        const minValue = this.paramMin(paramId);
        return Math.round(Utils.clamp(value, minValue, maxValue));
    }

    public xparam(xparamId) {
        return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
    }

    public sparam(sparamId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
    }

    public elementRate(elementId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
    }

    public debuffRate(paramId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
    }

    public stateRate(stateId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
    }

    public stateResistSet() {
        return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
    }

    public isStateResist(stateId) {
        return this.stateResistSet().indexOf(stateId) > -1;
    }

    public attackElements() {
        return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
    }

    public attackStates() {
        return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
    }

    public attackStatesRate(stateId) {
        return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
    }

    public attackSpeed() {
        return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
    }

    public attackTimesAdd() {
        return Math.max(
            this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES),
            0
        );
    }

    public addedSkillTypes() {
        return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
    }

    public isSkillTypeSealed(stypeId) {
        return (
            this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).indexOf(stypeId) >
            -1
        );
    }

    public addedSkills() {
        return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
    }

    public isSkillSealed(skillId) {
        return (
            this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).indexOf(skillId) >
            -1
        );
    }

    public isEquipWtypeOk(wtypeId) {
        return (
            this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).indexOf(
                wtypeId
            ) > -1
        );
    }

    public isEquipAtypeOk(atypeId) {
        return (
            this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).indexOf(
                atypeId
            ) > -1
        );
    }

    public isEquipTypeLocked(etypeId) {
        return (
            this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).indexOf(etypeId) >
            -1
        );
    }

    public isEquipTypeSealed(etypeId) {
        return (
            this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).indexOf(etypeId) >
            -1
        );
    }

    public slotType() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
        return set.length > 0 ? Math.max.apply(null, set) : 0;
    }

    public isDualWield() {
        return this.slotType() === 1;
    }

    public actionPlusSet() {
        return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(function(
            trait
        ) {
            return trait.value;
        });
    }

    public specialFlag(flagId) {
        return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(function(
            trait
        ) {
            return trait.dataId === flagId;
        });
    }

    public collapseType() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
        return set.length > 0 ? Math.max.apply(null, set) : 0;
    }

    public partyAbility(abilityId) {
        return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(function(
            trait
        ) {
            return trait.dataId === abilityId;
        });
    }

    public isAutoBattle() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
    }

    public isGuard() {
        return (
            this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove()
        );
    }

    public isSubstitute() {
        return (
            this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) &&
            this.canMove()
        );
    }

    public isPreserveTp() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
    }

    public addParam(paramId, value) {
        this._paramPlus[paramId] += value;
        this.refresh();
    }

    public setHp(hp) {
        this._hp = hp;
        this.refresh();
    }

    public setMp(mp) {
        this._mp = mp;
        this.refresh();
    }

    public setTp(tp) {
        this._tp = tp;
        this.refresh();
    }

    public maxTp() {
        return 100;
    }

    public refresh() {
        this.stateResistSet().forEach(function(stateId) {
            this.eraseState(stateId);
        }, this);
        this._hp = Utils.clamp(this._hp, 0, this.mhp);
        this._mp = Utils.clamp(this._mp, 0, this.mmp);
        this._tp = Utils.clamp(this._tp, 0, this.maxTp());
    }

    public recoverAll() {
        this.clearStates();
        this._hp = this.mhp;
        this._mp = this.mmp;
    }

    public hpRate() {
        return this.hp / this.mhp;
    }

    public mpRate() {
        return this.mmp > 0 ? this.mp / this.mmp : 0;
    }

    public tpRate() {
        return this.tp / this.maxTp();
    }

    public hide() {
        this._hidden = true;
    }

    public appear() {
        this._hidden = false;
    }

    public isHidden() {
        return this._hidden;
    }

    public isAppeared() {
        return !this.isHidden();
    }

    public isDead() {
        return this.isAppeared() && this.isDeathStateAffected();
    }

    public isAlive() {
        return this.isAppeared() && !this.isDeathStateAffected();
    }

    public isDying() {
        return this.isAlive() && this._hp < this.mhp / 4;
    }

    public isRestricted() {
        return this.isAppeared() && this.restriction() > 0;
    }

    public canInput() {
        return (
            this.isAppeared() && !this.isRestricted() && !this.isAutoBattle()
        );
    }

    public canMove() {
        return this.isAppeared() && this.restriction() < 4;
    }

    public isConfused() {
        return (
            this.isAppeared() &&
            this.restriction() >= 1 &&
            this.restriction() <= 3
        );
    }

    public confusionLevel() {
        return this.isConfused() ? this.restriction() : 0;
    }

    public isActor() {
        return false;
    }

    public isEnemy() {
        return false;
    }

    public sortStates() {
        this._states.sort(function(a, b) {
            const p1 = $dataStates[a].priority;
            const p2 = $dataStates[b].priority;
            if (p1 !== p2) {
                return p2 - p1;
            }
            return a - b;
        });
    }

    public restriction() {
        return Math.max.apply(
            null,
            this.states()
                .map(function(state) {
                    return state.restriction;
                })
                .concat(0)
        );
    }

    public addNewState(stateId) {
        if (stateId === this.deathStateId()) {
            this.die();
        }
        const restricted = this.isRestricted();
        this._states.push(stateId);
        this.sortStates();
        if (!restricted && this.isRestricted()) {
            this.onRestrict();
        }
    }

    public onRestrict() {}

    public mostImportantStateText() {
        const states = this.states();
        for (let i = 0; i < states.length; i++) {
            if (states[i].message3) {
                return states[i].message3;
            }
        }
        return "";
    }

    public stateMotionIndex() {
        const states = this.states();
        if (states.length > 0) {
            return states[0].motion;
        } else {
            return 0;
        }
    }

    public stateOverlayIndex() {
        const states = this.states();
        if (states.length > 0) {
            return states[0].overlay;
        } else {
            return 0;
        }
    }

    public isSkillWtypeOk(skill) {
        return true;
    }

    public skillMpCost(skill) {
        return Math.floor(skill.mpCost * this.mcr);
    }

    public skillTpCost(skill) {
        return skill.tpCost;
    }

    public canPaySkillCost(skill) {
        return (
            this._tp >= this.skillTpCost(skill) &&
            this._mp >= this.skillMpCost(skill)
        );
    }

    public paySkillCost(skill) {
        this._mp -= this.skillMpCost(skill);
        this._tp -= this.skillTpCost(skill);
    }

    public isOccasionOk(item) {
        if ($gameParty.inBattle()) {
            return item.occasion === 0 || item.occasion === 1;
        } else {
            return item.occasion === 0 || item.occasion === 2;
        }
    }

    public meetsUsableItemConditions(item) {
        return this.canMove() && this.isOccasionOk(item);
    }

    public meetsSkillConditions(skill) {
        return (
            this.meetsUsableItemConditions(skill) &&
            this.isSkillWtypeOk(skill) &&
            this.canPaySkillCost(skill) &&
            !this.isSkillSealed(skill.id) &&
            !this.isSkillTypeSealed(skill.stypeId)
        );
    }

    public meetsItemConditions(item) {
        return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
    }

    public canUse(item) {
        if (!item) {
            return false;
        } else if (DataManager.isSkill(item)) {
            return this.meetsSkillConditions(item);
        } else if (DataManager.isItem(item)) {
            return this.meetsItemConditions(item);
        } else {
            return false;
        }
    }

    public canEquip(item) {
        if (!item) {
            return false;
        } else if (DataManager.isWeapon(item)) {
            return this.canEquipWeapon(item);
        } else if (DataManager.isArmor(item)) {
            return this.canEquipArmor(item);
        } else {
            return false;
        }
    }

    public canEquipWeapon(item) {
        return (
            this.isEquipWtypeOk(item.wtypeId) &&
            !this.isEquipTypeSealed(item.etypeId)
        );
    }

    public canEquipArmor(item) {
        return (
            this.isEquipAtypeOk(item.atypeId) &&
            !this.isEquipTypeSealed(item.etypeId)
        );
    }

    public attackSkillId() {
        return 1;
    }

    public guardSkillId() {
        return 2;
    }

    public canAttack() {
        return this.canUse($dataSkills[this.attackSkillId()]);
    }

    public canGuard() {
        return this.canUse($dataSkills[this.guardSkillId()]);
    }
}
