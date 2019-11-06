import { Utils } from "../core/Utils";
import { DataManager } from "../managers/DataManager";
import { TextManager } from "../managers/TextManager";
import { Game_Item, Game_Item_OnLoad } from "./Game_Item";
import { Game_Unit, Game_Unit_OnLoad } from "./Game_Unit";
import { Item } from "../interfaces/Item";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

export interface Game_Party_Onload extends Game_Unit_OnLoad {
    _gold: number;
    _steps: number;
    _lastItem: Game_Item_OnLoad;
    _menuActorId: number;
    _targetActorId: number;
    _actors: number[];
    _items: number[];
    _weapons: number[];
    _armors: number[];
}

export class Game_Party extends Game_Unit {
    public static ABILITY_ENCOUNTER_HALF = 0;
    public static ABILITY_ENCOUNTER_NONE = 1;
    public static ABILITY_CANCEL_SURPRISE = 2;
    public static ABILITY_RAISE_PREEMPTIVE = 3;
    public static ABILITY_GOLD_DOUBLE = 4;
    public static ABILITY_DROP_ITEM_DOUBLE = 5;

    private _gold: number;
    private _steps: number;
    private _lastItem: Game_Item;
    private _menuActorId: number;
    private _targetActorId: number;
    private _actors: number[];
    private _items: number[];
    private _weapons: number[];
    private _armors: number[];

    public constructor(gameLoadInput?: Game_Party_Onload) {
        super(gameLoadInput);
        if (gameLoadInput) {
            this._gold = gameLoadInput._gold;
            this._steps = gameLoadInput._steps;
            this._lastItem = new Game_Item(undefined, gameLoadInput._lastItem);
            this._menuActorId = gameLoadInput._menuActorId;
            this._targetActorId = gameLoadInput._targetActorId;
            this._actors = gameLoadInput._actors;
            this._items = gameLoadInput._items;
            this._weapons = gameLoadInput._weapons;
            this._armors = gameLoadInput._armors;
        } else {
            this._gold = 0;
            this._steps = 0;
            this._lastItem = new Game_Item();
            this._menuActorId = 0;
            this._targetActorId = 0;
            this._actors = [];
            this.initAllItems();
        }
    }

    public initAllItems() {
        this._items = [];
        this._weapons = [];
        this._armors = [];
    }

    public exists() {
        return this._actors.length > 0;
    }

    public size() {
        return this.members().length;
    }

    public isEmpty() {
        return this.size() === 0;
    }

    public members() {
        return this.inBattle() ? this.battleMembers() : this.allMembers();
    }

    public allMembers() {
        return this._actors.map(function(id) {
            return $gameActors.actor(id);
        });
    }

    public battleMembers() {
        return this.allMembers()
            .slice(0, this.maxBattleMembers())
            .filter(function(actor) {
                return actor.isAppeared();
            });
    }

    public maxBattleMembers() {
        return 4;
    }

    public leader() {
        return this.battleMembers()[0];
    }

    public reviveBattleMembers() {
        this.battleMembers().forEach(function(actor) {
            if (actor.isDead()) {
                actor.setHp(1);
            }
        });
    }

    public items() {
        const list = [];
        for (const id in this._items) {
            list.push($dataItems[id]);
        }
        return list;
    }

    public weapons() {
        const list = [];
        for (const id in this._weapons) {
            list.push($dataWeapons[id]);
        }
        return list;
    }

    public armors() {
        const list = [];
        for (const id in this._armors) {
            list.push($dataArmors[id]);
        }
        return list;
    }

    public equipItems() {
        return this.weapons().concat(this.armors());
    }

    public allItems() {
        return this.items().concat(this.equipItems());
    }

    public itemContainer(item) {
        if (!item) {
            return null;
        } else if (DataManager.isItem(item)) {
            return this._items;
        } else if (DataManager.isWeapon(item)) {
            return this._weapons;
        } else if (DataManager.isArmor(item)) {
            return this._armors;
        } else {
            return null;
        }
    }

    public setupStartingMembers() {
        this._actors = [];
        $dataSystem.partyMembers.forEach(function(actorId) {
            if ($gameActors.actor(actorId)) {
                this._actors.push(actorId);
            }
        }, this);
    }

    public name() {
        const numBattleMembers = this.battleMembers().length;
        if (numBattleMembers === 0) {
            return "";
        } else if (numBattleMembers === 1) {
            return this.leader().name();
        } else {
            return Utils.format(TextManager.partyName, this.leader().name());
        }
    }

    public setupBattleTest() {
        this.setupBattleTestMembers();
        this.setupBattleTestItems();
    }

    public setupBattleTestMembers() {
        $dataSystem.testBattlers.forEach(function(battler) {
            const actor = $gameActors.actor(battler.actorId);
            if (actor) {
                actor.changeLevel(battler.level, false);
                actor.initEquips(battler.equips);
                actor.recoverAll();
                this.addActor(battler.actorId);
            }
        }, this);
    }

    public setupBattleTestItems() {
        $dataItems.forEach(function(item) {
            if (item && item.name.length > 0) {
                this.gainItem(item, this.maxItems(item));
            }
        }, this);
    }

    public highestLevel() {
        return Math.max.apply(
            null,
            this.members().map(function(actor) {
                return actor.level;
            })
        );
    }

    public addActor(actorId) {
        if (!(this._actors.indexOf(actorId) > -1)) {
            this._actors.push(actorId);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        }
    }

    public removeActor(actorId) {
        if (this._actors.indexOf(actorId) > -1) {
            this._actors.splice(this._actors.indexOf(actorId), 1);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        }
    }

    public gold() {
        return this._gold;
    }

    public gainGold(amount) {
        this._gold = Utils.clamp(this._gold + amount, 0, this.maxGold());
    }

    public loseGold(amount) {
        this.gainGold(-amount);
    }

    public maxGold() {
        return eval(Yanfly.Param.MaxGold);
    }

    public steps() {
        return this._steps;
    }

    public increaseSteps() {
        this._steps++;
    }

    public numItems(item) {
        const container = this.itemContainer(item);
        return container ? container[item.id] || 0 : 0;
    }

    public maxItems(item) {
        if (!item) return 1;
        return item.maxItem;
    }

    public hasMaxItems(item) {
        return this.numItems(item) >= this.maxItems(item);
    }

    public hasItem(item, includeEquip?) {
        if (includeEquip === undefined) {
            includeEquip = false;
        }
        if (this.numItems(item) > 0) {
            return true;
        } else if (includeEquip && this.isAnyMemberEquipped(item)) {
            return true;
        } else {
            return false;
        }
    }

    public isAnyMemberEquipped(item) {
        return this.members().some(function(actor) {
            return actor.equips().indexOf(item) > -1;
        });
    }

    public gainItem(item, amount, includeEquip?) {
        const container = this.itemContainer(item);
        if (container) {
            const lastNumber = this.numItems(item);
            const newNumber = lastNumber + amount;
            container[item.id] = Utils.clamp(newNumber, 0, this.maxItems(item));
            if (container[item.id] === 0) {
                delete container[item.id];
            }
            if (includeEquip && newNumber < 0) {
                this.discardMembersEquip(item, -newNumber);
            }
            $gameMap.requestRefresh();
        }
    }

    public discardMembersEquip(item, amount) {
        let n = amount;
        this.members().forEach(function(actor) {
            while (n > 0 && actor.isEquipped(item)) {
                actor.discardEquip(item);
                n--;
            }
        });
    }

    public loseItem(item, amount, includeEquip?) {
        this.gainItem(item, -amount, includeEquip);
    }

    public consumeItem(item) {
        if (DataManager.isItem(item) && item.consumable) {
            this.loseItem(item, 1);
        }
    }

    public canUse(item) {
        return this.members().some(function(actor) {
            return actor.canUse(item);
        });
    }

    public canInput() {
        return this.members().some(function(actor) {
            return actor.canInput();
        });
    }

    public isAllDead() {
        if (super.isAllDead()) {
            return this.inBattle() || !this.isEmpty();
        } else {
            return false;
        }
    }

    public onPlayerWalk() {
        const group = this.members();
        const length = group.length;
        for (let i = 0; i < length; ++i) {
            const actor = group[i];
            if (actor) actor.onPlayerWalk();
        }
    }

    public menuActor() {
        let actor = $gameActors.actor(this._menuActorId);
        if (!(this.members().indexOf(actor) > -1)) {
            actor = this.members()[0];
        }
        return actor;
    }

    public setMenuActor(actor) {
        this._menuActorId = actor.actorId();
    }

    public makeMenuActorNext() {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    }

    public makeMenuActorPrevious() {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + this.members().length - 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    }

    public targetActor() {
        let actor = $gameActors.actor(this._targetActorId);
        if (!(this.members().indexOf(actor) > -1)) {
            actor = this.members()[0];
        }
        return actor;
    }

    public setTargetActor(actor) {
        this._targetActorId = actor.actorId();
    }

    public lastItem(): Item | null {
        return this._lastItem ? (this._lastItem.object() as Item) : null;
    }

    public setLastItem(item) {
        this._lastItem.setObject(item);
    }

    public swapOrder(index1, index2) {
        const temp = this._actors[index1];
        this._actors[index1] = this._actors[index2];
        this._actors[index2] = temp;
        $gamePlayer.refresh();
    }

    public charactersForSavefile() {
        return this.battleMembers().map(function(actor) {
            return [actor.characterName(), actor.characterIndex()];
        });
    }

    public facesForSavefile() {
        return this.battleMembers().map(function(actor) {
            return [actor.faceName(), actor.faceIndex()];
        });
    }

    public partyAbility(abilityId) {
        return this.battleMembers().some(function(actor) {
            return actor.partyAbility(abilityId);
        });
    }

    public hasEncounterHalf() {
        return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
    }

    public hasEncounterNone() {
        return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
    }

    public hasCancelSurprise() {
        return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
    }

    public hasRaisePreemptive() {
        return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
    }

    public hasGoldDouble() {
        return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
    }

    public hasDropItemDouble() {
        return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
    }

    public ratePreemptive(troopAgi) {
        let rate = this.agility() >= troopAgi ? 0.05 : 0.03;
        if (this.hasRaisePreemptive()) {
            rate *= 4;
        }
        return rate;
    }

    public rateSurprise(troopAgi) {
        let rate = this.agility() >= troopAgi ? 0.03 : 0.05;
        if (this.hasCancelSurprise()) {
            rate = 0;
        }
        return rate;
    }

    public performVictory() {
        this.members().forEach(function(actor) {
            actor.performVictory();
        });
    }

    public performEscape() {
        this.members().forEach(function(actor) {
            actor.performEscape();
        });
    }

    public removeBattleStates() {
        this.members().forEach(function(actor) {
            actor.removeBattleStates();
        });
    }

    public requestMotionRefresh() {
        this.members().forEach(function(actor) {
            actor.requestMotionRefresh();
        });
    }

    public performEscapeSuccess() {
        for (let i = 0; i < this.members().length; ++i) {
            let member = this.members()[i];
            if (member) member.performEscapeSuccess();
        }
    }
}
