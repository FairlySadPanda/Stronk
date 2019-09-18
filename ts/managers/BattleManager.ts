import { Utils } from "../core/Utils";
import { Game_Action } from "../objects/Game_Action";
import { Game_Battler } from "../objects/Game_Battler";
import { Scene_Gameover } from "../scenes/Scene_Gameover";
import { AudioManager } from "./AudioManager";
import { SceneManager } from "./SceneManager";
import { SoundManager } from "./SoundManager";
import { TextManager } from "./TextManager";

interface Rewards {
    gold: number;
    exp: number;
    items: any;
}

export abstract class BattleManager {
    public static _canEscape: any;
    public static _canLose: any;
    public static _phase: string;
    public static _battleTest: boolean;
    public static _eventCallback: any;
    public static _preemptive: boolean;
    public static _surprise: boolean;
    public static _actorIndex: number;
    public static _actionForcedBattler: any;
    public static _mapBgm: any;
    public static _mapBgs: any;
    public static _actionBattlers: any[];
    public static _subject: any;
    public static _action: any;
    public static _targets: any[];
    public static _logWindow: any;
    public static _statusWindow: any;
    public static _spriteset: any;
    public static _escapeRatio: number;
    public static _escaped: boolean;
    public static _rewards: Rewards;
    public static _turnForced: boolean;

    public static setup(troopId, canEscape, canLose) {
        this.initMembers();
        this._canEscape = canEscape;
        this._canLose = canLose;
        $gameTroop.setup(troopId);
        $gameScreen.onBattleStart();
        this.makeEscapeRatio();
    }

    public static initMembers() {
        this._phase = "init";
        this._canEscape = false;
        this._canLose = false;
        this._battleTest = false;
        this._eventCallback = null;
        this._preemptive = false;
        this._surprise = false;
        this._actorIndex = -1;
        this._actionForcedBattler = null;
        this._mapBgm = null;
        this._mapBgs = null;
        this._actionBattlers = [];
        this._subject = null;
        this._action = null;
        this._targets = [];
        this._logWindow = null;
        this._statusWindow = null;
        this._spriteset = null;
        this._escapeRatio = 0;
        this._escaped = false;
        this._rewards = {
            exp: null,
            gold: null,
            items: null
        };
        this._turnForced = false;
    }

    public static isBattleTest() {
        return this._battleTest;
    }

    public static setBattleTest(battleTest) {
        this._battleTest = battleTest;
    }

    public static setEventCallback(callback) {
        this._eventCallback = callback;
    }

    public static setLogWindow(logWindow) {
        this._logWindow = logWindow;
    }

    public static setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
    }

    public static setSpriteset(spriteset) {
        this._spriteset = spriteset;
    }

    public static onEncounter() {
        this._preemptive = Math.random() < this.ratePreemptive();
        this._surprise =
            Math.random() < this.rateSurprise() && !this._preemptive;
    }

    public static ratePreemptive() {
        return $gameParty.ratePreemptive($gameTroop.agility());
    }

    public static rateSurprise() {
        return $gameParty.rateSurprise($gameTroop.agility());
    }

    public static saveBgmAndBgs() {
        this._mapBgm = AudioManager.saveBgm();
        this._mapBgs = AudioManager.saveBgs();
    }

    public static playBattleBgm() {
        AudioManager.playBgm($gameSystem.battleBgm());
        AudioManager.stopBgs();
    }

    public static playVictoryMe() {
        AudioManager.playMe($gameSystem.victoryMe());
    }

    public static playDefeatMe() {
        AudioManager.playMe($gameSystem.defeatMe());
    }

    public static replayBgmAndBgs() {
        if (this._mapBgm) {
            AudioManager.replayBgm(this._mapBgm);
        } else {
            AudioManager.stopBgm();
        }
        if (this._mapBgs) {
            AudioManager.replayBgs(this._mapBgs);
        }
    }

    public static makeEscapeRatio() {
        this._escapeRatio = (0.5 * $gameParty.agility()) / $gameTroop.agility();
    }

    public static update() {
        if (!this.isBusy() && !this.updateEvent()) {
            switch (this._phase) {
                case "start":
                    this.startInput();
                    break;
                case "turn":
                    this.updateTurn();
                    break;
                case "action":
                    this.updateAction();
                    break;
                case "turnEnd":
                    this.updateTurnEnd();
                    break;
                case "battleEnd":
                    this.updateBattleEnd();
                    break;
            }
        }
    }

    public static updateEvent() {
        switch (this._phase) {
            case "start":
            case "turn":
            case "turnEnd":
                if (this.isActionForced()) {
                    this.processForcedAction();
                    return true;
                } else {
                    return this.updateEventMain();
                }
        }
        return this.checkAbort();
    }

    public static updateEventMain() {
        $gameTroop.updateInterpreter();
        $gameParty.requestMotionRefresh();
        if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
            return true;
        }
        $gameTroop.setupBattleEvent();
        if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
            return true;
        }
        return false;
    }

    public static isBusy() {
        return (
            $gameMessage.isBusy() ||
            this._spriteset.isBusy() ||
            this._logWindow.isBusy()
        );
    }

    public static isInputting() {
        return this._phase === "input";
    }

    public static isInTurn() {
        return this._phase === "turn";
    }

    public static isTurnEnd() {
        return this._phase === "turnEnd";
    }

    public static isAborting() {
        return this._phase === "aborting";
    }

    public static isBattleEnd() {
        return this._phase === "battleEnd";
    }

    public static canEscape() {
        return this._canEscape;
    }

    public static canLose() {
        return this._canLose;
    }

    public static isEscaped() {
        return this._escaped;
    }

    public static actor() {
        return this._actorIndex >= 0
            ? $gameParty.members()[this._actorIndex]
            : null;
    }

    public static clearActor() {
        this.changeActor(-1, "");
    }

    public static changeActor(newActorIndex, lastActorActionState) {
        const lastActor = this.actor();
        this._actorIndex = newActorIndex;
        const newActor = this.actor();
        if (lastActor) {
            lastActor.setActionState(lastActorActionState);
        }
        if (newActor) {
            newActor.setActionState("inputting");
        }
    }

    public static startBattle() {
        this._phase = "start";
        $gameSystem.onBattleStart();
        $gameParty.onBattleStart();
        $gameTroop.onBattleStart();
        this.displayStartMessages();
    }

    public static displayStartMessages() {
        $gameTroop.enemyNames().forEach(function(name) {
            $gameMessage.add(Utils.format(TextManager.emerge, name));
        });
        if (this._preemptive) {
            $gameMessage.add(
                Utils.format(TextManager.preemptive, $gameParty.name())
            );
        } else if (this._surprise) {
            $gameMessage.add(
                Utils.format(TextManager.surprise, $gameParty.name())
            );
        }
        $gameTroop.members().forEach(function(enemy) {
            enemy.recoverAll();
        });
    }

    public static startInput() {
        this._phase = "input";
        $gameParty.makeActions();
        $gameTroop.makeActions();
        this.clearActor();
        if (this._surprise || !$gameParty.canInput()) {
            this.startTurn();
        }
    }

    public static inputtingAction() {
        return this.actor() ? this.actor().inputtingAction() : null;
    }

    public static selectNextCommand() {
        do {
            if (!this.actor() || !this.actor().selectNextCommand()) {
                this.changeActor(this._actorIndex + 1, "waiting");
                if (this._actorIndex >= $gameParty.size()) {
                    this.startTurn();
                    break;
                }
            }
        } while (!this.actor().canInput());
    }

    public static selectPreviousCommand() {
        do {
            if (!this.actor() || !this.actor().selectPreviousCommand()) {
                this.changeActor(this._actorIndex - 1, "undecided");
                if (this._actorIndex < 0) {
                    return;
                }
            }
        } while (!this.actor().canInput());
    }

    public static refreshStatus() {
        this._statusWindow.refresh();
    }

    public static startTurn() {
        this._phase = "turn";
        this.clearActor();
        $gameTroop.increaseTurn();
        this.makeActionOrders();
        $gameParty.requestMotionRefresh();
        this._logWindow.startTurn();
    }

    public static updateTurn() {
        $gameParty.requestMotionRefresh();
        if (!this._subject) {
            this._subject = this.getNextSubject();
        }
        if (this._subject) {
            this.processTurn();
        } else {
            this.endTurn();
        }
    }

    public static processTurn() {
        const subject = this._subject;
        const action = subject.currentAction();
        if (action) {
            action.prepare();
            if (action.isValid()) {
                this.startAction();
            }
            subject.removeCurrentAction();
        } else {
            subject.onAllActionsEnd();
            this.refreshStatus();
            this._logWindow.displayAutoAffectedStatus(subject);
            this._logWindow.displayCurrentState(subject);
            this._logWindow.displayRegeneration(subject);
            this._subject = this.getNextSubject();
        }
    }

    public static endTurn() {
        this._phase = "turnEnd";
        this._preemptive = false;
        this._surprise = false;
        this.allBattleMembers().forEach(function(battler) {
            battler.onTurnEnd();
            this.refreshStatus();
            this._logWindow.displayAutoAffectedStatus(battler);
            this._logWindow.displayRegeneration(battler);
        }, this);
        if (this.isForcedTurn()) {
            this._turnForced = false;
        }
    }

    public static isForcedTurn() {
        return this._turnForced;
    }

    public static updateTurnEnd() {
        this.startInput();
    }

    public static getNextSubject() {
        while (true) {
            const battler = this._actionBattlers.shift();
            if (!battler) {
                return null;
            }
            if (battler.isBattleMember() && battler.isAlive()) {
                return battler;
            }
        }
    }

    public static allBattleMembers(): Game_Battler[] {
        return [...$gameParty.members(), ...$gameTroop.members()];
    }

    public static makeActionOrders() {
        let battlers = [];
        if (!this._surprise) {
            battlers = battlers.concat($gameParty.members());
        }
        if (!this._preemptive) {
            battlers = battlers.concat($gameTroop.members());
        }
        battlers.forEach(function(battler) {
            battler.makeSpeed();
        });
        battlers.sort(function(a, b) {
            return b.speed() - a.speed();
        });
        this._actionBattlers = battlers;
    }

    public static startAction() {
        const subject = this._subject;
        const action = subject.currentAction();
        const targets = action.makeTargets();
        this._phase = "action";
        this._action = action;
        this._targets = targets;
        subject.useItem(action.item());
        this._action.applyGlobal();
        this.refreshStatus();
        this._logWindow.startAction(subject, action, targets);
    }

    public static updateAction() {
        const target = this._targets.shift();
        if (target) {
            this.invokeAction(this._subject, target);
        } else {
            this.endAction();
        }
    }

    public static endAction() {
        this._logWindow.endAction(this._subject);
        this._phase = "turn";
    }

    public static invokeAction(subject, target) {
        this._logWindow.push("pushBaseLine");
        if (Math.random() < this._action.itemCnt(target)) {
            this.invokeCounterAttack(subject, target);
        } else if (Math.random() < this._action.itemMrf(target)) {
            this.invokeMagicReflection(subject, target);
        } else {
            this.invokeNormalAction(subject, target);
        }
        subject.setLastTarget(target);
        this._logWindow.push("popBaseLine");
        this.refreshStatus();
    }

    public static invokeNormalAction(subject, target) {
        const realTarget = this.applySubstitute(target);
        this._action.apply(realTarget);
        this._logWindow.displayActionResults(subject, realTarget);
    }

    public static invokeCounterAttack(subject, target) {
        const action = new Game_Action(target);
        action.setAttack();
        action.apply(subject);
        this._logWindow.displayCounter(target);
        this._logWindow.displayActionResults(target, subject);
    }

    public static invokeMagicReflection(subject, target) {
        this._action._reflectionTarget = target;
        this._logWindow.displayReflection(target);
        this._action.apply(subject);
        this._logWindow.displayActionResults(target, subject);
    }

    public static applySubstitute(target) {
        if (this.checkSubstitute(target)) {
            const substitute = target.friendsUnit().substituteBattler();
            if (substitute && target !== substitute) {
                this._logWindow.displaySubstitute(substitute, target);
                return substitute;
            }
        }
        return target;
    }

    public static checkSubstitute(target) {
        return target.isDying() && !this._action.isCertainHit();
    }

    public static isActionForced() {
        return !!this._actionForcedBattler;
    }

    public static forceAction(battler) {
        this._actionForcedBattler = battler;
        const index = this._actionBattlers.indexOf(battler);
        if (index >= 0) {
            this._actionBattlers.splice(index, 1);
        }
    }

    public static processForcedAction() {
        if (this._actionForcedBattler) {
            this._turnForced = true;
            this._subject = this._actionForcedBattler;
            this._actionForcedBattler = null;
            this.startAction();
            this._subject.removeCurrentAction();
        }
    }

    public static abort() {
        this._phase = "aborting";
    }

    public static checkBattleEnd() {
        if (this._phase) {
            if (this.checkAbort()) {
                return true;
            } else if ($gameParty.isAllDead()) {
                this.processDefeat();
                return true;
            } else if ($gameTroop.isAllDead()) {
                this.processVictory();
                return true;
            }
        }
        return false;
    }

    public static checkAbort() {
        if ($gameParty.isEmpty() || this.isAborting()) {
            SoundManager.playEscape();
            this._escaped = true;
            this.processAbort();
        }
        return false;
    }

    public static processVictory() {
        $gameParty.removeBattleStates();
        $gameParty.performVictory();
        this.playVictoryMe();
        this.replayBgmAndBgs();
        this.makeRewards();
        this.displayVictoryMessage();
        this.displayRewards();
        this.gainRewards();
        this.endBattle(0);
    }

    public static processEscape() {
        $gameParty.performEscape();
        SoundManager.playEscape();
        const success = this._preemptive
            ? true
            : Math.random() < this._escapeRatio;
        if (success) {
            $gameParty.removeBattleStates();
            this.displayEscapeSuccessMessage();
            this._escaped = true;
            this.processAbort();
        } else {
            this.displayEscapeFailureMessage();
            this._escapeRatio += 0.1;
            $gameParty.clearActions();
            this.startTurn();
        }
        return success;
    }

    public static processAbort() {
        $gameParty.removeBattleStates();
        this.replayBgmAndBgs();
        this.endBattle(1);
    }

    public static processDefeat() {
        this.displayDefeatMessage();
        this.playDefeatMe();
        if (this._canLose) {
            this.replayBgmAndBgs();
        } else {
            AudioManager.stopBgm();
        }
        this.endBattle(2);
    }

    public static endBattle(result) {
        this._phase = "battleEnd";
        if (this._eventCallback) {
            this._eventCallback(result);
        }
        if (result === 0) {
            $gameSystem.onBattleWin();
        } else if (this._escaped) {
            $gameSystem.onBattleEscape();
        }
    }

    public static updateBattleEnd() {
        if (this.isBattleTest()) {
            AudioManager.stopBgm();
            SceneManager.exit();
        } else if (!this._escaped && $gameParty.isAllDead()) {
            if (this._canLose) {
                $gameParty.reviveBattleMembers();
                SceneManager.pop();
            } else {
                SceneManager.goto(Scene_Gameover);
            }
        } else {
            SceneManager.pop();
        }
        this._phase = null;
    }

    public static makeRewards() {
        this._rewards = {
            gold: $gameTroop.goldTotal(),
            exp: $gameTroop.expTotal(),
            items: $gameTroop.makeDropItems()
        };
    }

    public static displayVictoryMessage() {
        $gameMessage.add(Utils.format(TextManager.victory, $gameParty.name()));
    }

    public static displayDefeatMessage() {
        $gameMessage.add(Utils.format(TextManager.defeat, $gameParty.name()));
    }

    public static displayEscapeSuccessMessage() {
        $gameMessage.add(
            Utils.format(TextManager.escapeStart, $gameParty.name())
        );
    }

    public static displayEscapeFailureMessage() {
        $gameMessage.add(
            Utils.format(TextManager.escapeStart, $gameParty.name())
        );
        $gameMessage.add("\\." + TextManager.escapeFailure);
    }

    public static displayRewards() {
        this.displayExp();
        this.displayGold();
        this.displayDropItems();
    }

    public static displayExp() {
        const exp = this._rewards.exp;
        if (exp > 0) {
            const text = Utils.format(
                TextManager.obtainExp,
                exp,
                TextManager.exp
            );
            $gameMessage.add("\\." + text);
        }
    }

    public static displayGold() {
        const gold = this._rewards.gold;
        if (gold > 0) {
            $gameMessage.add(
                "\\." + Utils.format(TextManager.obtainGold, gold)
            );
        }
    }

    public static displayDropItems() {
        const items = this._rewards.items;
        if (items.length > 0) {
            $gameMessage.newPage();
            items.forEach(function(item) {
                $gameMessage.add(
                    Utils.format(TextManager.obtainItem, item.name)
                );
            });
        }
    }

    public static gainRewards() {
        this.gainExp();
        this.gainGold();
        this.gainDropItems();
    }

    public static gainExp() {
        const exp = this._rewards.exp;
        $gameParty.allMembers().forEach(function(actor) {
            actor.gainExp(exp);
        });
    }

    public static gainGold() {
        $gameParty.gainGold(this._rewards.gold);
    }

    public static gainDropItems() {
        const items = this._rewards.items;
        items.forEach(function(item) {
            $gameParty.gainItem(item, 1);
        });
    }
}
