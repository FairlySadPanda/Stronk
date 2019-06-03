import Utils from "../core/Utils";
import SoundManager from "../managers/SoundManager";
import Game_Battler from "./Game_Battler";

export default class Game_Enemy extends Game_Battler {
    public friendsUnit: () => any;
    public opponentsUnit: () => any;
    public index: () => any;
    public isBattleMember: () => boolean;
    public enemyId: () => any;
    public enemy: () => any;
    public exp: () => any;
    public gold: () => any;
    public makeDropItems: () => any;
    public dropItemRate: () => 1 | 2;
    public itemObject: (kind: any, dataId: any) => any;
    public isSpriteVisible: () => boolean;
    public screenX: () => any;
    public screenY: () => any;
    public battlerName: () => any;
    public battlerHue: () => any;
    public originalName: () => any;
    public name: () => any;
    public isLetterEmpty: () => boolean;
    public setLetter: (letter: any) => void;
    public setPlural: (plural: any) => void;
    public transform: (enemyId: any) => void;
    public meetsCondition: (action: any) => any;
    public meetsTurnCondition: (param1: any, param2: any) => boolean;
    public meetsHpCondition: (param1: any, param2: any) => boolean;
    public meetsMpCondition: (param1: any, param2: any) => boolean;
    public meetsStateCondition: (param: any) => any;
    public meetsPartyLevelCondition: (param: any) => boolean;
    public meetsSwitchCondition: (param: any) => any;
    public isActionValid: (action: any) => any;
    public selectAction: (actionList: any, ratingZero: any) => any;
    public selectAllActions: (actionList: any) => void;
    public constructor(enemyId, x, y) {
        super();
        this.setup(enemyId, x, y);
    }
    public setup(enemyId: any, x: any, y: any): any {
        throw new Error("Method not implemented.");
    }
}

Game_Enemy.prototype.initMembers = function () {
    Game_Battler.prototype.initMembers.call(this);
    this._enemyId = 0;
    this._letter = "";
    this._plural = false;
    this._screenX = 0;
    this._screenY = 0;
};

Game_Enemy.prototype.setup = function (enemyId, x, y) {
    this._enemyId = enemyId;
    this._screenX = x;
    this._screenY = y;
    this.recoverAll();
};

Game_Enemy.prototype.isEnemy = function () {
    return true;
};

Game_Enemy.prototype.friendsUnit = function () {
    return $gameTroop;
};

Game_Enemy.prototype.opponentsUnit = function () {
    return $gameParty;
};

Game_Enemy.prototype.index = function () {
    return $gameTroop.members().indexOf(this);
};

Game_Enemy.prototype.isBattleMember = function () {
    return this.index() >= 0;
};

Game_Enemy.prototype.enemyId = function () {
    return this._enemyId;
};

Game_Enemy.prototype.enemy = function () {
    return $dataEnemies[this._enemyId];
};

Game_Enemy.prototype.traitObjects = function () {
    return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());
};

Game_Enemy.prototype.paramBase = function (paramId) {
    return this.enemy().params[paramId];
};

Game_Enemy.prototype.exp = function () {
    return this.enemy().exp;
};

Game_Enemy.prototype.gold = function () {
    return this.enemy().gold;
};

Game_Enemy.prototype.makeDropItems = function () {
    return this.enemy().dropItems.reduce(function (r, di) {
        if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) {
            return r.concat(this.itemObject(di.kind, di.dataId));
        } else {
            return r;
        }
    }.bind(this), []);
};

Game_Enemy.prototype.dropItemRate = function () {
    return $gameParty.hasDropItemDouble() ? 2 : 1;
};

Game_Enemy.prototype.itemObject = function (kind, dataId) {
    if (kind === 1) {
        return $dataItems[dataId];
    } else if (kind === 2) {
        return $dataWeapons[dataId];
    } else if (kind === 3) {
        return $dataArmors[dataId];
    } else {
        return null;
    }
};

Game_Enemy.prototype.isSpriteVisible = function () {
    return true;
};

Game_Enemy.prototype.screenX = function () {
    return this._screenX;
};

Game_Enemy.prototype.screenY = function () {
    return this._screenY;
};

Game_Enemy.prototype.battlerName = function () {
    return this.enemy().battlerName;
};

Game_Enemy.prototype.battlerHue = function () {
    return this.enemy().battlerHue;
};

Game_Enemy.prototype.originalName = function () {
    return this.enemy().name;
};

Game_Enemy.prototype.name = function () {
    return this.originalName() + (this._plural ? this._letter : "");
};

Game_Enemy.prototype.isLetterEmpty = function () {
    return this._letter === "";
};

Game_Enemy.prototype.setLetter = function (letter) {
    this._letter = letter;
};

Game_Enemy.prototype.setPlural = function (plural) {
    this._plural = plural;
};

Game_Enemy.prototype.performActionStart = function (action) {
    Game_Battler.prototype.performActionStart.call(this, action);
    this.requestEffect("whiten");
};

Game_Enemy.prototype.performAction = function (action) {
    Game_Battler.prototype.performAction.call(this, action);
};

Game_Enemy.prototype.performActionEnd = function () {
    Game_Battler.prototype.performActionEnd.call(this);
};

Game_Enemy.prototype.performDamage = function () {
    Game_Battler.prototype.performDamage.call(this);
    SoundManager.playEnemyDamage();
    this.requestEffect("blink");
};

Game_Enemy.prototype.performCollapse = function () {
    Game_Battler.prototype.performCollapse.call(this);
    switch (this.collapseType()) {
    case 0:
        this.requestEffect("collapse");
        SoundManager.playEnemyCollapse();
        break;
    case 1:
        this.requestEffect("bossCollapse");
        SoundManager.playBossCollapse1();
        break;
    case 2:
        this.requestEffect("instantCollapse");
        break;
    }
};

Game_Enemy.prototype.transform = function (enemyId) {
    const name = this.originalName();
    this._enemyId = enemyId;
    if (this.originalName() !== name) {
        this._letter = "";
        this._plural = false;
    }
    this.refresh();
    if (this.numActions() > 0) {
        this.makeActions();
    }
};

Game_Enemy.prototype.meetsCondition = function (action) {
    const param1 = action.conditionParam1;
    const param2 = action.conditionParam2;
    switch (action.conditionType) {
    case 1:
        return this.meetsTurnCondition(param1, param2);
    case 2:
        return this.meetsHpCondition(param1, param2);
    case 3:
        return this.meetsMpCondition(param1, param2);
    case 4:
        return this.meetsStateCondition(param1);
    case 5:
        return this.meetsPartyLevelCondition(param1);
    case 6:
        return this.meetsSwitchCondition(param1);
    default:
        return true;
    }
};

Game_Enemy.prototype.meetsTurnCondition = function (param1, param2) {
    const n = $gameTroop.turnCount();
    if (param2 === 0) {
        return n === param1;
    } else {
        return n > 0 && n >= param1 && n % param2 === param1 % param2;
    }
};

Game_Enemy.prototype.meetsHpCondition = function (param1, param2) {
    return this.hpRate() >= param1 && this.hpRate() <= param2;
};

Game_Enemy.prototype.meetsMpCondition = function (param1, param2) {
    return this.mpRate() >= param1 && this.mpRate() <= param2;
};

Game_Enemy.prototype.meetsStateCondition = function (param) {
    return this.isStateAffected(param);
};

Game_Enemy.prototype.meetsPartyLevelCondition = function (param) {
    return $gameParty.highestLevel() >= param;
};

Game_Enemy.prototype.meetsSwitchCondition = function (param) {
    return $gameSwitches.value(param);
};

Game_Enemy.prototype.isActionValid = function (action) {
    return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
};

Game_Enemy.prototype.selectAction = function (actionList, ratingZero) {
    const sum = actionList.reduce(function (r, a) {
        return r + a.rating - ratingZero;
    }, 0);
    if (sum > 0) {
        let value = Utils.randomInt(sum);
        for (let i = 0; i < actionList.length; i++) {
            const action = actionList[i];
            value -= action.rating - ratingZero;
            if (value < 0) {
                return action;
            }
        }
    } else {
        return null;
    }
};

Game_Enemy.prototype.selectAllActions = function (actionList) {
    const ratingMax = Math.max.apply(null, actionList.map(function (a) {
        return a.rating;
    }));
    const ratingZero = ratingMax - 3;
    actionList = actionList.filter(function (a) {
        return a.rating > ratingZero;
    });
    for (let i = 0; i < this.numActions(); i++) {
        this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
    }
};

Game_Enemy.prototype.makeActions = function () {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        const actionList = this.enemy().actions.filter(function (a) {
            return this.isActionValid(a);
        }, this);
        if (actionList.length > 0) {
            this.selectAllActions(actionList);
        }
    }
    this.setActionState("waiting");
};
