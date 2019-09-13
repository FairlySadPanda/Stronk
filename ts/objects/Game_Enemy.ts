import Utils from "../core/Utils";
import SoundManager from "../managers/SoundManager";
import Game_Battler from "./Game_Battler";

export default class Game_Enemy extends Game_Battler {
    private _enemyId: number;
    private _letter: string;
    private _plural: boolean;
    private _screenX: number;
    private _screenY: number;

    public constructor(enemyId, x, y) {
        super();
        this.setup(enemyId, x, y);
    }

    public initMembers() {
        super.initMembers();
        this._enemyId = 0;
        this._letter = "";
        this._plural = false;
        this._screenX = 0;
        this._screenY = 0;
    }

    public setup(enemyId, x, y) {
        this._enemyId = enemyId;
        this._screenX = x;
        this._screenY = y;
        this.recoverAll();
    }

    public isEnemy() {
        return true;
    }

    public friendsUnit() {
        return $gameTroop;
    }

    public opponentsUnit() {
        return $gameParty;
    }

    public index() {
        return $gameTroop.members().indexOf(this);
    }

    public isBattleMember() {
        return this.index() >= 0;
    }

    public enemyId() {
        return this._enemyId;
    }

    public enemy() {
        return $dataEnemies[this._enemyId];
    }

    public traitObjects() {
        return super.traitObjects().concat(this.enemy());
    }

    public paramBase(paramId) {
        return this.enemy().params[paramId];
    }

    public exp() {
        return this.enemy().exp;
    }

    public gold() {
        return this.enemy().gold;
    }

    public makeDropItems() {
        return this.enemy().dropItems.reduce(
            function(r, di) {
                if (
                    di.kind > 0 &&
                    Math.random() * di.denominator < this.dropItemRate()
                ) {
                    return r.concat(this.itemObject(di.kind, di.dataId));
                } else {
                    return r;
                }
            }.bind(this),
            []
        );
    }

    public dropItemRate() {
        return $gameParty.hasDropItemDouble() ? 2 : 1;
    }

    public itemObject(kind, dataId) {
        if (kind === 1) {
            return $dataItems[dataId];
        } else if (kind === 2) {
            return $dataWeapons[dataId];
        } else if (kind === 3) {
            return $dataArmors[dataId];
        } else {
            return null;
        }
    }

    public isSpriteVisible() {
        return true;
    }

    public screenX() {
        return this._screenX;
    }

    public setScreenX(value: number) {
        this._screenX = value;
    }

    public screenY() {
        return this._screenY;
    }

    public setScreenY(value: number) {
        this._screenY = value;
    }

    public battlerName() {
        return this.enemy().battlerName;
    }

    public battlerHue() {
        return this.enemy().battlerHue;
    }

    public originalName() {
        return this.enemy().name;
    }

    public name() {
        return this.originalName() + (this._plural ? this._letter : "");
    }

    public isLetterEmpty() {
        return this._letter === "";
    }

    public setLetter(letter) {
        this._letter = letter;
    }

    public setPlural(plural) {
        this._plural = plural;
    }

    public performActionStart(action) {
        super.performActionStart(action);
        this.requestEffect("whiten");
    }

    public performAction(action) {
        super.performAction(action);
    }

    public performActionEnd() {
        super.performActionEnd();
    }

    public performDamage() {
        super.performDamage();
        SoundManager.playEnemyDamage();
        this.requestEffect("blink");
    }

    public performCollapse() {
        super.performCollapse();
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
    }

    public transform(enemyId) {
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
    }

    public meetsCondition(action) {
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
    }

    public meetsTurnCondition(param1, param2) {
        const n = $gameTroop.turnCount();
        if (param2 === 0) {
            return n === param1;
        } else {
            return n > 0 && n >= param1 && n % param2 === param1 % param2;
        }
    }

    public meetsHpCondition(param1, param2) {
        return this.hpRate() >= param1 && this.hpRate() <= param2;
    }

    public meetsMpCondition(param1, param2) {
        return this.mpRate() >= param1 && this.mpRate() <= param2;
    }

    public meetsStateCondition(param) {
        return this.isStateAffected(param);
    }

    public meetsPartyLevelCondition(param) {
        return $gameParty.highestLevel() >= param;
    }

    public meetsSwitchCondition(param) {
        return $gameSwitches.value(param);
    }

    public isActionValid(action) {
        return (
            this.meetsCondition(action) &&
            this.canUse($dataSkills[action.skillId])
        );
    }

    public selectAction(actionList, ratingZero) {
        const sum = actionList.reduce(function(r, a) {
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
    }

    public selectAllActions(actionList) {
        const ratingMax = Math.max.apply(
            null,
            actionList.map(function(a) {
                return a.rating;
            })
        );
        const ratingZero = ratingMax - 3;
        actionList = actionList.filter(function(a) {
            return a.rating > ratingZero;
        });
        for (let i = 0; i < this.numActions(); i++) {
            this.action(i).setEnemyAction(
                this.selectAction(actionList, ratingZero)
            );
        }
    }

    public makeActions() {
        super.makeActions();
        if (this.numActions() > 0) {
            const actionList = this.enemy().actions.filter(function(a) {
                return this.isActionValid(a);
            }, this);
            if (actionList.length > 0) {
                this.selectAllActions(actionList);
            }
        }
        this.setActionState("waiting");
    }
}
