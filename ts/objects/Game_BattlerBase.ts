import { Utils } from "../core/Utils";
import { DataManager } from "../managers/DataManager";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";
import { BattleManager } from "../managers/BattleManager";
import { Game_ActionResult } from "./Game_ActionResult";

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
    _result: Game_ActionResult;
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

    protected _hp: any;
    protected _mp: any;
    protected _tp: any;
    protected _hidden: boolean;
    protected _paramPlus: number[];
    protected _states: number[];
    protected _stateTurns: number[];

    protected _baseParamCache: any;
    protected _paramLimitMin: number[];
    protected _paramLimitMax: number[];
    protected _xparamPlus: number[];
    protected _xparam: any;
    protected _immortalState: any;
    protected _statusRefreshRequested: boolean;
    protected _freeStateTurn: any;

    protected _buffs: number[];
    protected _buffTurns: number[];
    protected _result: Game_ActionResult;

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
            this._result = gameLoadInput._result;
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
        this.clearCustomParamLimits();
        this.clearXParamPlus();
    }

    public clearCustomParamLimits() {
        this._paramLimitMin = [0, 0, 0, 0, 0, 0, 0, 0];
        this._paramLimitMax = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    public clearParamPlus() {
        this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    public clearXParamPlus() {
        this._xparamPlus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
        const customMin = this.customParamMin(paramId);
        const a = this;
        const user = this;
        const subject = this;
        const b = this;
        const target = this;
        const s = $gameSwitches._data;
        const v = $gameVariables._data;
        const code = Yanfly.Param.BPCMinimum[paramId];
        let value = 0;
        try {
            value = eval(code);
        } catch (e) {
            Yanfly.Util.displayError(e, code, "CUSTOM PARAM MIN FORMULA ERROR");
        }
        value = Math.ceil(value);
        return value;
    }

    public paramMax(paramId) {
        const customMax = this.customParamMax(paramId);
        const a = this;
        const user = this;
        const subject = this;
        const b = this;
        const target = this;
        const s = $gameSwitches._data;
        const v = $gameVariables._data;
        const code = Yanfly.Param.BPCMaximum[paramId];
        let value = 0;
        try {
            value = eval(code);
        } catch (e) {
            Yanfly.Util.displayError(e, code, "CUSTOM PARAM MAX FORMULA ERROR");
        }
        value = Math.ceil(value);
        return value;
    }

    public customParamMax(paramId: any) {
        if (!this._paramLimitMax) {
            this.clearCustomParamLimits();
        }
        const value = this._paramLimitMax[paramId];
        return value;
    }

    public paramRate(paramId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
    }

    public paramBuffRate(paramId) {
        return this._buffs[paramId] * 0.25 + 1.0;
    }

    public customParamMin(paramId) {
        if (!this._paramLimitMin) {
            this.clearCustomParamLimits();
        }
        const value = this._paramLimitMin[paramId];
        return value;
    }

    public param(paramId) {
        this._baseParamCache = this._baseParamCache || [];
        if (this._baseParamCache[paramId]) {
            return this._baseParamCache[paramId];
        }
        const base = this.paramBase(paramId);
        const plus = this.paramPlus(paramId);
        const paramRate = this.paramRate(paramId);
        const buffRate = this.paramBuffRate(paramId);
        const flat = this.paramFlat(paramId);
        const minValue = this.paramMin(paramId);
        const maxValue = Math.max(minValue, this.paramMax(paramId));
        const a = this;
        const user = this;
        const subject = this;
        const b = this;
        const target = this;
        const s = $gameSwitches._data;
        const v = $gameVariables._data;
        const code = Yanfly.Param.BPCFormula[paramId];
        let value = 0;
        try {
            value = eval(code);
        } catch (e) {
            Yanfly.Util.displayError(e, code, "CUSTOM PARAM FORMULA ERROR");
        }
        value = Math.round(Utils.clamp(value, minValue, maxValue));
        this._baseParamCache[paramId] = value;
        return this._baseParamCache[paramId];
    }

    public xparam(id) {
        if (this._xparam && this._xparam[id] !== undefined)
            return this._xparam[id];
        if (this._xparam === undefined) this._xparam = {};
        const base = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, id);
        const plus = this.xparamPlus(id);
        const rate = this.xparamRate(id);
        const flat = this.xparamFlat(id);
        const a = this;
        const user = this;
        const subject = this;
        const s = $gameSwitches._data;
        const v = $gameVariables._data;
        const code = Yanfly.Param.XParamFormula[id];
        try {
            this._xparam[id] = eval(code);
        } catch (e) {
            this._xparam[id] = 0;
            Yanfly.Util.displayError(e, code, "EXTRA PARAM FORMULA ERROR");
        }
        return this._xparam[id];
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
        if (stateId === this.deathStateId() && this.isImmortal()) return true;
        return this.stateResistSet().indexOf(stateId) > -1;
    }

    public isImmortal() {
        return this._immortalState;
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
        if (this._hp === hp) return;
        this._hp = hp;
        this.refresh();
    }

    public setMp(mp) {
        if (this._mp === mp) return;
        this._mp = mp;
        this.refresh();
    }

    public setTp(tp) {
        if (this._tp === tp) return;
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
        this._xparam = undefined;
    }

    public recoverAll() {
        this.clearStates();
        this._hp = this.mhp;
        this._mp = this.mmp;
        this.refresh();
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
        this.requestStatusRefresh();
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

    public mapRegenUpdateCheck(type) {
        if ($gameParty.inBattle()) return true;
        if (type === "hp") {
            return Yanfly.Param.RefreshUpdateHp;
        } else if (type === "mp") {
            return Yanfly.Param.RefreshUpdateMp;
        } else if (type === "tp") {
            return Yanfly.Param.RefreshUpdateTp;
        }
    }

    public setParam(id, value) {
        this._paramPlus[id] = 0;
        this._baseParamCache = [];
        this._paramPlus[id] = value - this.param(id);
        this.refresh();
    }

    public setMaxHp(value) {
        this.setParam(0, value);
    }

    public setMaxMp(value) {
        this.setParam(1, value);
    }

    public setAtk(value) {
        this.setParam(2, value);
    }

    public setDef(value) {
        this.setParam(3, value);
    }

    public setMat(value) {
        this.setParam(4, value);
    }

    public setMdf(value) {
        this.setParam(5, value);
    }

    public setAgi(value) {
        this.setParam(6, value);
    }

    public setLuk(value) {
        this.setParam(7, value);
    }

    public setParamPlus(id, value) {
        this._paramPlus[id] = value;
        this.refresh();
    }

    public setMaxHpPlus(value) {
        this.setParamPlus(0, value);
    }

    public setMaxMpPlus(value) {
        this.setParamPlus(1, value);
    }

    public setAtkPlus(value) {
        this.setParamPlus(2, value);
    }

    public setDefPlus(value) {
        this.setParamPlus(3, value);
    }

    public setMatPlus(value) {
        this.setParamPlus(4, value);
    }

    public setMdfPlus(value) {
        this.setParamPlus(5, value);
    }

    public setAgiPlus(value) {
        this.setParamPlus(6, value);
    }

    public setLukPlus(value) {
        this.setParamPlus(7, value);
    }

    public addMaxHp(value) {
        this.addParam(0, value);
    }

    public addMaxMp(value) {
        this.addParam(1, value);
    }

    public addAtk(value) {
        this.addParam(2, value);
    }

    public addDef(value) {
        this.addParam(3, value);
    }

    public addMat(value) {
        this.addParam(4, value);
    }

    public addMdf(value) {
        this.addParam(5, value);
    }

    public addAgi(value) {
        this.addParam(6, value);
    }

    public addLuk(value) {
        this.addParam(7, value);
    }

    public minusMaxHp(value) {
        this.addParam(0, -value);
    }

    public minusMaxMp(value) {
        this.addParam(1, -value);
    }

    public minusAtk(value) {
        this.addParam(2, -value);
    }

    public minusDef(value) {
        this.addParam(3, -value);
    }

    public minusMat(value) {
        this.addParam(4, -value);
    }

    public minusMdf(value) {
        this.addParam(5, -value);
    }

    public minusAgi(value) {
        this.addParam(6, -value);
    }

    public minusLuk(value) {
        this.addParam(7, -value);
    }

    public setCustomParamLimitMax(id, value) {
        if (!this._paramLimitMax) this.clearCustomParamLimits();
        this._paramLimitMax[id] = value;
        this.refresh();
    }

    public setCustomMaxHpMax(value) {
        this.setCustomParamLimitMax(0, value);
    }

    public setCustomMaxMpMax(value) {
        this.setCustomParamLimitMax(1, value);
    }

    public setCustomAtkMax(value) {
        this.setCustomParamLimitMax(2, value);
    }

    public setCustomDefMax(value) {
        this.setCustomParamLimitMax(3, value);
    }

    public setCustomMatMax(value) {
        this.setCustomParamLimitMax(4, value);
    }

    public setCustomMdfMax(value) {
        this.setCustomParamLimitMax(5, value);
    }

    public setCustomAgiMax(value) {
        this.setCustomParamLimitMax(6, value);
    }

    public setCustomLukMax(value) {
        this.setCustomParamLimitMax(7, value);
    }

    public setCustomParamLimitMin(id, value) {
        if (!this._paramLimitMin) this.clearCustomParamLimits();
        this._paramLimitMin[id] = value;
        this.refresh();
    }

    public setCustomMaxHpMin(value) {
        this.setCustomParamLimitMin(0, value);
    }

    public setCustomMaxMpMin(value) {
        this.setCustomParamLimitMin(1, value);
    }

    public setCustomAtkMin(value) {
        this.setCustomParamLimitMin(2, value);
    }

    public setCustomDefMin(value) {
        this.setCustomParamLimitMin(3, value);
    }

    public setCustomMatMin(value) {
        this.setCustomParamLimitMin(4, value);
    }

    public setCustomMdfMin(value) {
        this.setCustomParamLimitMin(5, value);
    }

    public setCustomAgiMin(value) {
        this.setCustomParamLimitMin(6, value);
    }

    public setCustomLukMin(value) {
        this.setCustomParamLimitMin(7, value);
    }

    public xparamPlus(id) {
        if (this._xparamPlus === undefined) this.clearXParamPlus();
        return this._xparamPlus[id];
    }

    public xparamRate(id) {
        return 1;
    }

    public xparamFlat(id) {
        return 0;
    }

    public setXParam(id, value) {
        if (this._xparamPlus === undefined) this.clearXParamPlus();
        this._xparam = {};
        this._xparamPlus[id] = 0;
        this._xparamPlus[id] = value - this.xparam(id);
        this.refresh();
    }

    public setHit(value) {
        this.setXParam(0, value);
    }

    public setEva(value) {
        this.setXParam(1, value);
    }

    public setCri(value) {
        this.setXParam(2, value);
    }

    public setCev(value) {
        this.setXParam(3, value);
    }

    public setMev(value) {
        this.setXParam(4, value);
    }

    public setMrf(value) {
        this.setXParam(5, value);
    }

    public setCnt(value) {
        this.setXParam(6, value);
    }

    public setHrg(value) {
        this.setXParam(7, value);
    }

    public setMrg(value) {
        this.setXParam(8, value);
    }

    public setTrg(value) {
        this.setXParam(9, value);
    }

    public setXParamPlus(id, value) {
        if (this._xparamPlus === undefined) this.clearXParamPlus();
        this._xparamPlus[id] = value;
        this.refresh();
    }

    public setHitPlus(value) {
        this.setXParamPlus(0, value);
    }

    public setEvaPlus(value) {
        this.setXParamPlus(1, value);
    }

    public setCriPlus(value) {
        this.setXParamPlus(2, value);
    }

    public setCevPlus(value) {
        this.setXParamPlus(3, value);
    }

    public setMevPlus(value) {
        this.setXParamPlus(4, value);
    }

    public setMrfPlus(value) {
        this.setXParamPlus(5, value);
    }

    public setCntPlus(value) {
        this.setXParamPlus(6, value);
    }

    public setHrgPlus(value) {
        this.setXParamPlus(7, value);
    }

    public setMrgPlus(value) {
        this.setXParamPlus(8, value);
    }

    public setTrgPlus(value) {
        this.setXParamPlus(9, value);
    }

    public addXParam(id, value) {
        if (this._xparamPlus === undefined) this.clearXParamPlus();
        this._xparamPlus[id] += value;
        this.refresh();
    }

    public addHit(value) {
        this.addXParam(0, value);
    }

    public addEva(value) {
        this.addXParam(1, value);
    }

    public addCri(value) {
        this.addXParam(2, value);
    }

    public addCev(value) {
        this.addXParam(3, value);
    }

    public addMev(value) {
        this.addXParam(4, value);
    }

    public addMrf(value) {
        this.addXParam(5, value);
    }

    public addCnt(value) {
        this.addXParam(6, value);
    }

    public addHrg(value) {
        this.addXParam(7, value);
    }

    public addMrg(value) {
        this.addXParam(8, value);
    }

    public addTrg(value) {
        this.addXParam(9, value);
    }

    public minusHit(value) {
        this.addXParam(0, -value);
    }

    public minusEva(value) {
        this.addXParam(1, -value);
    }

    public minusCri(value) {
        this.addXParam(2, -value);
    }

    public minusCev(value) {
        this.addXParam(3, -value);
    }

    public minusMev(value) {
        this.addXParam(4, -value);
    }

    public minusMrf(value) {
        this.addXParam(5, -value);
    }

    public minusCnt(value) {
        this.addXParam(6, -value);
    }

    public minusHrg(value) {
        this.addXParam(7, -value);
    }

    public minusMrg(value) {
        this.addXParam(8, -value);
    }

    public minusTrg(value) {
        this.addXParam(9, -value);
    }

    public requestStatusRefresh() {
        this._statusRefreshRequested = true;
    }

    public isStatusRefreshRequested() {
        return this._statusRefreshRequested;
    }

    public completetStatusRefreshRequest() {
        this._statusRefreshRequested = false;
    }

    public updateStateTicks() {
        let needRefresh = false;
        for (let i = 0; i < this._states.length; ++i) {
            let stateId = this._states[i];
            let state = $dataStates[stateId];
            if (!state) continue;
            if (state.autoRemovalTiming !== 2) continue;
            if (!this._stateTurns[stateId]) continue;
            let value = BattleManager.tickRate() / Yanfly.Param.BECTurnTime;
            let shown1 = Math.ceil(this._stateTurns[stateId]);
            this._stateTurns[stateId] -= value;
            let shown2 = Math.ceil(this._stateTurns[stateId]);
            if (shown1 !== shown2) needRefresh = true;
            if (this._stateTurns[stateId] <= 0) this.removeState(stateId);
        }
        if (needRefresh) this.refresh();
    }

    public isBypassUpdateTurns() {
        if ($gameTroop.isEventRunning()) return true;
        return false;
    }

    public updateStateTurns() {
        this.updateStateTurnEnd();
    }

    public updateStateTurnTiming(timing) {
        if (this.isBypassUpdateTurns()) return;
        let statesRemoved = [];
        this._freeStateTurn = this._freeStateTurn || [];
        for (let i = 0; i < this._states.length; ++i) {
            let stateId = this._states[i];
            let state = $dataStates[stateId];
            if (!state) continue;
            if (state.autoRemovalTiming !== timing) continue;
            if (!this._stateTurns[stateId]) continue;
            if (this._freeStateTurn.includes(stateId)) {
                let index = this._freeStateTurn.indexOf(stateId);
                this._freeStateTurn.splice(index, 1);
            } else {
                this._stateTurns[stateId] -= 1;
            }
            if (this._stateTurns[stateId] <= 0) statesRemoved.push(stateId);
        }
        for (let i = 0; i < statesRemoved.length; ++i) {
            let stateId = statesRemoved[i];
            this.removeState(stateId);
        }
    }

    public updateStateActionStart() {
        this.updateStateTurnTiming(3);
    }

    public updateStateActionEnd() {
        this.updateStateTurnTiming(1);
    }

    public updateStateTurnStart() {
        this.updateStateTurnTiming(4);
    }

    public updateStateTurnEnd() {
        this.updateStateTurnTiming(2);
    }

    public timedTick() {
        return 1 * BattleManager.tickRate();
    }

    public paramFlat(paramId: number) {
        let value = 0;
        const length = this.states().length;
        for (let i = 0; i < length; ++i) {
            const obj = this.states()[i];
            if (obj && obj.flatParams) {
                value += obj.flatParams[paramId];
            }
        }
        return value;
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
}
