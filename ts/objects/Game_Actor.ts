import Utils from "../core/Utils";
import BattleManager from "../managers/BattleManager";
import DataManager from "../managers/DataManager";
import SoundManager from "../managers/SoundManager";
import TextManager from "../managers/TextManager";
import Game_Action from "./Game_Action";
import Game_Battler, { Game_Battler_OnLoad } from "./Game_Battler";
import Game_Item, { Game_Item_OnLoad } from "./Game_Item";

export interface Game_Actor_OnLoad extends Game_Battler_OnLoad {
    _actorId: number;
    _name: string;
    _nickname: string;
    _classId: number;
    _level: number;
    _characterName: string;
    _characterIndex: number;
    _faceName: string;
    _faceIndex: number;
    _battlerName: string;
    _exp: {};
    _skills: number[];
    _equips: Game_Item_OnLoad[];
    _actionInputIndex: number;
    _lastMenuSkill: Game_Item_OnLoad;
    _lastBattleSkill: Game_Item_OnLoad;
    _lastCommandSymbol: string;
    _profile: any;
    _stateSteps: {};
}

export default class Game_Actor extends Game_Battler {
    private _actorId: number;
    private _name: string;
    private _nickname: string;
    private _classId: number;
    private _level: number;
    private _characterName: string;
    private _characterIndex: number;
    private _faceName: string;
    private _faceIndex: number;
    private _battlerName: string;
    private _exp: {};
    private _skills: number[];
    private _equips: Game_Item[];
    private _actionInputIndex: number;
    private _lastMenuSkill: Game_Item;
    private _lastBattleSkill: Game_Item;
    private _lastCommandSymbol: string;
    private _profile: any;
    private _stateSteps: {};

    public constructor(actorId: number, gameLoadInput?: Game_Actor_OnLoad) {
        super(gameLoadInput);
        if (gameLoadInput) {
            this._actorId = gameLoadInput._actorId;
            this._name = gameLoadInput._name;
            this._nickname = gameLoadInput._nickname;
            this._classId = gameLoadInput._classId;
            this._level = gameLoadInput._level;
            this._characterName = gameLoadInput._characterName;
            this._characterIndex = gameLoadInput._characterIndex;
            this._faceName = gameLoadInput._faceName;
            this._faceIndex = gameLoadInput._faceIndex;
            this._battlerName = gameLoadInput._battlerName;
            this._exp = gameLoadInput._exp;
            this._skills = gameLoadInput._skills;
            this._equips = [];
            for (const equip of gameLoadInput._equips) {
                this._equips.push(new Game_Item(undefined, equip));
            }
            this._actionInputIndex = gameLoadInput._actionInputIndex;
            this._lastMenuSkill = new Game_Item(
                undefined,
                gameLoadInput._lastMenuSkill
            );
            this._lastBattleSkill = new Game_Item(
                undefined,
                gameLoadInput._lastBattleSkill
            );
            this._lastCommandSymbol = gameLoadInput._lastCommandSymbol;
            this._profile = gameLoadInput._profile;
            this._stateSteps = gameLoadInput._stateSteps;
        } else {
            this.setup(actorId);
        }
    }

    public get level() {
        return this._level;
    }

    public initMembers() {
        super.initMembers();
        this._actorId = 0;
        this._name = "";
        this._nickname = "";
        this._classId = 0;
        this._level = 0;
        this._characterName = "";
        this._characterIndex = 0;
        this._faceName = "";
        this._faceIndex = 0;
        this._battlerName = "";
        this._exp = {};
        this._skills = [];
        this._equips = [];
        this._actionInputIndex = 0;
        this._lastMenuSkill = new Game_Item();
        this._lastBattleSkill = new Game_Item();
        this._lastCommandSymbol = "";
    }

    public setup(actorId) {
        const actor = $dataActors[actorId];
        this._actorId = actorId;
        this._name = actor.name;
        this._nickname = actor.nickname;
        this._profile = actor.profile;
        this._classId = actor.classId;
        this._level = actor.initialLevel;
        this.initImages();
        this.initExp();
        this.initSkills();
        this.initEquips(actor.equips);
        this.clearParamPlus();
        this.recoverAll();
    }

    public actorId() {
        return this._actorId;
    }

    public actor() {
        return $dataActors[this._actorId];
    }

    public name() {
        return this._name;
    }

    public setName(name) {
        this._name = name;
    }

    public nickname() {
        return this._nickname;
    }

    public setNickname(nickname) {
        this._nickname = nickname;
    }

    public profile() {
        return this._profile;
    }

    public setProfile(profile) {
        this._profile = profile;
    }

    public characterName() {
        return this._characterName;
    }

    public characterIndex() {
        return this._characterIndex;
    }

    public faceName() {
        return this._faceName;
    }

    public faceIndex() {
        return this._faceIndex;
    }

    public battlerName() {
        return this._battlerName;
    }

    public clearStates() {
        super.clearStates();
        this._stateSteps = {};
    }

    public eraseState(stateId) {
        super.eraseState(stateId);
        delete this._stateSteps[stateId];
    }

    public resetStateCounts(stateId) {
        super.resetStateCounts(stateId);
        this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
    }

    public initImages() {
        const actor = this.actor();
        this._characterName = actor.characterName;
        this._characterIndex = actor.characterIndex;
        this._faceName = actor.faceName;
        this._faceIndex = actor.faceIndex;
        this._battlerName = actor.battlerName;
    }

    public expForLevel(level) {
        const c = this.currentClass();
        const basis = c.expParams[0];
        const extra = c.expParams[1];
        const acc_a = c.expParams[2];
        const acc_b = c.expParams[3];
        return Math.round(
            (basis *
                Math.pow(level - 1, 0.9 + acc_a / 250) *
                level *
                (level + 1)) /
                (6 + Math.pow(level, 2) / 50 / acc_b) +
                (level - 1) * extra
        );
    }

    public initExp() {
        this._exp[this._classId] = this.currentLevelExp();
    }

    public currentExp(): number {
        return this._exp[this._classId];
    }

    public currentLevelExp() {
        return this.expForLevel(this._level);
    }

    public nextLevelExp() {
        return this.expForLevel(this._level + 1);
    }

    public nextRequiredExp() {
        return this.nextLevelExp() - this.currentExp();
    }

    public maxLevel() {
        return this.actor().maxLevel;
    }

    public isMaxLevel() {
        return this._level >= this.maxLevel();
    }

    public initSkills() {
        this._skills = [];
        this.currentClass().learnings.forEach(function(learning) {
            if (learning.level <= this._level) {
                this.learnSkill(learning.skillId);
            }
        }, this);
    }

    public initEquips(equips) {
        const slots = this.equipSlots();
        const maxSlots = slots.length;
        this._equips = [];
        for (let i = 0; i < maxSlots; i++) {
            this._equips[i] = new Game_Item();
        }
        for (let j = 0; j < equips.length; j++) {
            if (j < maxSlots) {
                this._equips[j].setEquip(slots[j] === 1, equips[j]);
            }
        }
        this.releaseUnequippableItems(true);
        this.refresh();
    }

    public equipSlots() {
        const slots = [];
        for (let i = 1; i < $dataSystem.equipTypes.length; i++) {
            slots.push(i);
        }
        if (slots.length >= 2 && this.isDualWield()) {
            slots[1] = 1;
        }
        return slots;
    }

    public equips() {
        return this._equips.map(function(item) {
            return item.object();
        });
    }

    public weapons() {
        return this.equips().filter(function(item) {
            return item && DataManager.isWeapon(item);
        });
    }

    public armors() {
        return this.equips().filter(function(item) {
            return item && DataManager.isArmor(item);
        });
    }

    public hasWeapon(weapon) {
        return this.weapons().indexOf(weapon) > -1;
    }

    public hasArmor(armor) {
        return this.armors().indexOf(armor) > -1;
    }

    public isEquipChangeOk(slotId) {
        return (
            !this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
            !this.isEquipTypeSealed(this.equipSlots()[slotId])
        );
    }

    public changeEquip(slotId, item) {
        if (
            this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)
        ) {
            this._equips[slotId].setObject(item);
            this.refresh();
        }
    }

    public forceChangeEquip(slotId, item) {
        this._equips[slotId].setObject(item);
        this.releaseUnequippableItems(true);
        this.refresh();
    }

    public tradeItemWithParty(newItem, oldItem) {
        if (newItem && !$gameParty.hasItem(newItem)) {
            return false;
        } else {
            $gameParty.gainItem(oldItem, 1);
            $gameParty.loseItem(newItem, 1);
            return true;
        }
    }

    public changeEquipById(etypeId, itemId) {
        const slotId = etypeId - 1;
        if (this.equipSlots()[slotId] === 1) {
            this.changeEquip(slotId, $dataWeapons[itemId]);
        } else {
            this.changeEquip(slotId, $dataArmors[itemId]);
        }
    }

    public isEquipped(item) {
        return this.equips().indexOf(item) > -1;
    }

    public discardEquip(item) {
        const slotId = this.equips().indexOf(item);
        if (slotId >= 0) {
            this._equips[slotId].setObject(null);
        }
    }

    public releaseUnequippableItems(forcing) {
        while (true) {
            const slots = this.equipSlots();
            const equips = this.equips();
            let changed = false;
            for (let i = 0; i < equips.length; i++) {
                const item = equips[i];
                if (
                    item &&
                    (!this.canEquip(item) || item.etypeId !== slots[i])
                ) {
                    if (!forcing) {
                        this.tradeItemWithParty(null, item);
                    }
                    this._equips[i].setObject(null);
                    changed = true;
                }
            }
            if (!changed) {
                break;
            }
        }
    }

    public clearEquipments() {
        const maxSlots = this.equipSlots().length;
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, null);
            }
        }
    }

    public optimizeEquipments() {
        const maxSlots = this.equipSlots().length;
        this.clearEquipments();
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, this.bestEquipItem(i));
            }
        }
    }

    public bestEquipItem(slotId) {
        const etypeId = this.equipSlots()[slotId];
        const items = $gameParty.equipItems().filter(function(item) {
            return item.etypeId === etypeId && this.canEquip(item);
        }, this);
        let bestItem = null;
        let bestPerformance = -1000;
        for (let i = 0; i < items.length; i++) {
            const performance = this.calcEquipItemPerformance(items[i]);
            if (performance > bestPerformance) {
                bestPerformance = performance;
                bestItem = items[i];
            }
        }
        return bestItem;
    }

    public calcEquipItemPerformance(item) {
        return item.params.reduce(function(a, b) {
            return a + b;
        });
    }

    public isSkillWtypeOk(skill) {
        const wtypeId1 = skill.requiredWtypeId1;
        const wtypeId2 = skill.requiredWtypeId2;
        if (
            (wtypeId1 === 0 && wtypeId2 === 0) ||
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))
        ) {
            return true;
        } else {
            return false;
        }
    }

    public isWtypeEquipped(wtypeId) {
        return this.weapons().some(function(weapon) {
            return weapon.wtypeId === wtypeId;
        });
    }

    public refresh() {
        this.releaseUnequippableItems(false);
        super.refresh();
    }

    public isActor() {
        return true;
    }

    public friendsUnit() {
        return $gameParty;
    }

    public opponentsUnit() {
        return $gameTroop;
    }

    public index() {
        return $gameParty.members().indexOf(this);
    }

    public isBattleMember() {
        return $gameParty.battleMembers().indexOf(this) > -1;
    }

    public isFormationChangeOk() {
        return true;
    }

    public currentClass() {
        return $dataClasses[this._classId];
    }

    public isClass(gameClass) {
        return gameClass && this._classId === gameClass.id;
    }

    public skills() {
        const list = [];
        this._skills.concat(this.addedSkills()).forEach(function(id) {
            if (list.indexOf($dataSkills[id]) === -1) {
                list.push($dataSkills[id]);
            }
        });
        return list;
    }

    public usableSkills() {
        return this.skills().filter(function(skill) {
            return this.canUse(skill);
        }, this);
    }

    public traitObjects() {
        let objects = super.traitObjects();
        objects = objects.concat([this.actor(), this.currentClass()]);
        const equips = this.equips();
        for (let i = 0; i < equips.length; i++) {
            const item = equips[i];
            if (item) {
                objects.push(item);
            }
        }
        return objects;
    }

    public attackElements() {
        const set = super.attackElements();
        if (
            this.hasNoWeapons() &&
            !(set.indexOf(this.bareHandsElementId()) > -1)
        ) {
            set.push(this.bareHandsElementId());
        }
        return set;
    }

    public hasNoWeapons() {
        return this.weapons().length === 0;
    }

    public bareHandsElementId() {
        return 1;
    }

    public paramMax(paramId) {
        if (paramId === 0) {
            return 9999; // MHP
        }
        return super.paramMax(paramId);
    }

    public paramBase(paramId) {
        return this.currentClass().params[paramId][this._level];
    }

    public paramPlus(paramId) {
        let value = super.paramPlus(paramId);
        const equips = this.equips();
        for (let i = 0; i < equips.length; i++) {
            const item = equips[i];
            if (item) {
                value += item.params[paramId];
            }
        }
        return value;
    }

    public attackAnimationId1() {
        if (this.hasNoWeapons()) {
            return this.bareHandsAnimationId();
        } else {
            const weapons = this.weapons();
            return weapons[0] ? weapons[0].animationId : 0;
        }
    }

    public attackAnimationId2() {
        const weapons = this.weapons();
        return weapons[1] ? weapons[1].animationId : 0;
    }

    public bareHandsAnimationId() {
        return 1;
    }

    public changeExp(exp, show) {
        this._exp[this._classId] = Math.max(exp, 0);
        const lastLevel = this._level;
        const lastSkills = this.skills();
        while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
            this.levelUp();
        }
        while (this.currentExp() < this.currentLevelExp()) {
            this.levelDown();
        }
        if (show && this._level > lastLevel) {
            this.displayLevelUp(this.findNewSkills(lastSkills));
        }
        this.refresh();
    }

    public levelUp() {
        this._level++;
        this.currentClass().learnings.forEach(function(learning) {
            if (learning.level === this._level) {
                this.learnSkill(learning.skillId);
            }
        }, this);
    }

    public levelDown() {
        this._level--;
    }

    public findNewSkills(lastSkills) {
        const newSkills = this.skills();
        for (let i = 0; i < lastSkills.length; i++) {
            const index = newSkills.indexOf(lastSkills[i]);
            if (index >= 0) {
                newSkills.splice(index, 1);
            }
        }
        return newSkills;
    }

    public displayLevelUp(newSkills) {
        const text = Utils.format(
            TextManager.levelUp,
            this._name,
            TextManager.level,
            this._level
        );
        $gameMessage.newPage();
        $gameMessage.add(text);
        newSkills.forEach(function(skill) {
            $gameMessage.add(Utils.format(TextManager.obtainSkill, skill.name));
        });
    }

    public gainExp(exp) {
        const newExp =
            this.currentExp() + Math.round(exp * this.finalExpRate());
        this.changeExp(newExp, this.shouldDisplayLevelUp());
    }

    public finalExpRate() {
        return (
            this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate())
        );
    }

    public benchMembersExpRate() {
        return $dataSystem.optExtraExp ? 1 : 0;
    }

    public shouldDisplayLevelUp() {
        return true;
    }

    public changeLevel(level, show) {
        level = Utils.clamp(level, 1, this.maxLevel());
        this.changeExp(this.expForLevel(level), show);
    }

    public learnSkill(skillId) {
        if (!this.isLearnedSkill(skillId)) {
            this._skills.push(skillId);
            this._skills.sort(function(a, b) {
                return a - b;
            });
        }
    }

    public forgetSkill(skillId) {
        const index = this._skills.indexOf(skillId);
        if (index >= 0) {
            this._skills.splice(index, 1);
        }
    }

    public isLearnedSkill(skillId) {
        return this._skills.indexOf(skillId) > -1;
    }

    public hasSkill(skillId) {
        return this.skills().indexOf($dataSkills[skillId]) > -1;
    }

    public changeClass(classId, keepExp) {
        if (keepExp) {
            this._exp[classId] = this.currentExp();
        }
        this._classId = classId;
        this.changeExp(this._exp[this._classId] || 0, false);
        this.refresh();
    }

    public setCharacterImage(characterName, characterIndex) {
        this._characterName = characterName;
        this._characterIndex = characterIndex;
    }

    public setFaceImage(faceName, faceIndex) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    }

    public setBattlerImage(battlerName) {
        this._battlerName = battlerName;
    }

    public isSpriteVisible() {
        return $gameSystem.isSideView();
    }

    public startAnimation(animationId, mirror, delay) {
        mirror = !mirror;
        super.startAnimation(animationId, mirror, delay);
    }

    public performActionStart(action) {
        super.performActionStart(action);
    }

    public performAction(action) {
        super.performAction(action);
        if (action.isAttack()) {
            this.performAttack();
        } else if (action.isGuard()) {
            this.requestMotion("guard");
        } else if (action.isMagicSkill()) {
            this.requestMotion("spell");
        } else if (action.isSkill()) {
            this.requestMotion("skill");
        } else if (action.isItem()) {
            this.requestMotion("item");
        }
    }

    public performActionEnd() {
        super.performActionEnd();
    }

    public performAttack() {
        const weapons = this.weapons();
        const wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
        const attackMotion = $dataSystem.attackMotions[wtypeId];
        if (attackMotion) {
            if (attackMotion.type === 0) {
                this.requestMotion("thrust");
            } else if (attackMotion.type === 1) {
                this.requestMotion("swing");
            } else if (attackMotion.type === 2) {
                this.requestMotion("missile");
            }
            this.startWeaponAnimation(attackMotion.weaponImageId);
        }
    }

    public performDamage() {
        super.performDamage();
        if (this.isSpriteVisible()) {
            this.requestMotion("damage");
        } else {
            $gameScreen.startShake(5, 5, 10);
        }
        SoundManager.playActorDamage();
    }

    public performEvasion() {
        super.performEvasion();
        this.requestMotion("evade");
    }

    public performMagicEvasion() {
        super.performMagicEvasion();
        this.requestMotion("evade");
    }

    public performCounter() {
        super.performCounter();
        this.performAttack();
    }

    public performCollapse() {
        super.performCollapse();
        if ($gameParty.inBattle()) {
            SoundManager.playActorCollapse();
        }
    }

    public performVictory() {
        if (this.canMove()) {
            this.requestMotion("victory");
        }
    }

    public performEscape() {
        if (this.canMove()) {
            this.requestMotion("escape");
        }
    }

    public makeActionList() {
        const list = [];
        let action = new Game_Action(this);
        action.setAttack();
        list.push(action);
        this.usableSkills().forEach(function(skill) {
            action = new Game_Action(this);
            action.setSkill(skill.id);
            list.push(action);
        }, this);
        return list;
    }

    public makeAutoBattleActions() {
        for (let i = 0; i < this.numActions(); i++) {
            const list = this.makeActionList();
            let maxValue = Number.MIN_VALUE;
            for (let j = 0; j < list.length; j++) {
                const value = list[j].evaluate();
                if (value > maxValue) {
                    maxValue = value;
                    this.setAction(i, list[j]);
                }
            }
        }
        this.setActionState("waiting");
    }

    public makeConfusionActions() {
        for (let i = 0; i < this.numActions(); i++) {
            this.action(i).setConfusion();
        }
        this.setActionState("waiting");
    }

    public makeActions() {
        super.makeActions();
        if (this.numActions() > 0) {
            this.setActionState("undecided");
        } else {
            this.setActionState("waiting");
        }
        if (this.isAutoBattle()) {
            this.makeAutoBattleActions();
        } else if (this.isConfused()) {
            this.makeConfusionActions();
        }
    }

    public onPlayerWalk() {
        this.clearResult();
        this.checkFloorEffect();
        if ($gamePlayer.isNormal()) {
            this.turnEndOnMap();
            this.states().forEach(function(state) {
                this.updateStateSteps(state);
            }, this);
            this.showAddedStates();
            this.showRemovedStates();
        }
    }

    public updateStateSteps(state) {
        if (state.removeByWalking) {
            if (this._stateSteps[state.id] > 0) {
                if (--this._stateSteps[state.id] === 0) {
                    this.removeState(state.id);
                }
            }
        }
    }

    public showAddedStates() {
        this.result()
            .addedStateObjects()
            .forEach(function(state) {
                if (state.message1) {
                    $gameMessage.add(this._name + state.message1);
                }
            }, this);
    }

    public showRemovedStates() {
        this.result()
            .removedStateObjects()
            .forEach(function(state) {
                if (state.message4) {
                    $gameMessage.add(this._name + state.message4);
                }
            }, this);
    }

    public stepsForTurn() {
        return 20;
    }

    public turnEndOnMap() {
        if ($gameParty.steps() % this.stepsForTurn() === 0) {
            this.onTurnEnd();
            if (this.result().hpDamage > 0) {
                this.performMapDamage();
            }
        }
    }

    public checkFloorEffect() {
        if ($gamePlayer.isOnDamageFloor()) {
            this.executeFloorDamage();
        }
    }

    public executeFloorDamage() {
        let damage = Math.floor(this.basicFloorDamage() * this.fdr);
        damage = Math.min(damage, this.maxFloorDamage());
        this.gainHp(-damage);
        if (damage > 0) {
            this.performMapDamage();
        }
    }

    public basicFloorDamage() {
        return 10;
    }

    public maxFloorDamage() {
        return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
    }

    public performMapDamage() {
        if (!$gameParty.inBattle()) {
            $gameScreen.startFlashForDamage();
        }
    }

    public clearActions() {
        super.clearActions();
        this._actionInputIndex = 0;
    }

    public inputtingAction() {
        return this.action(this._actionInputIndex);
    }

    public selectNextCommand() {
        if (this._actionInputIndex < this.numActions() - 1) {
            this._actionInputIndex++;
            return true;
        } else {
            return false;
        }
    }

    public selectPreviousCommand() {
        if (this._actionInputIndex > 0) {
            this._actionInputIndex--;
            return true;
        } else {
            return false;
        }
    }

    public lastMenuSkill() {
        return this._lastMenuSkill.object();
    }

    public setLastMenuSkill(skill) {
        this._lastMenuSkill.setObject(skill);
    }

    public lastBattleSkill() {
        return this._lastBattleSkill.object();
    }

    public setLastBattleSkill(skill) {
        this._lastBattleSkill.setObject(skill);
    }

    public lastCommandSymbol() {
        return this._lastCommandSymbol;
    }

    public setLastCommandSymbol(symbol) {
        this._lastCommandSymbol = symbol;
    }

    public testEscape(item) {
        return item.effects.some(function(effect, index, ar) {
            return effect && effect.code === Game_Action.EFFECT_SPECIAL;
        });
    }

    public meetsUsableItemConditions(item) {
        if (
            $gameParty.inBattle() &&
            !BattleManager.canEscape() &&
            this.testEscape(item)
        ) {
            return false;
        }
        return super.meetsUsableItemConditions(item);
    }
}
