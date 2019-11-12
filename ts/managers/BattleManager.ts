import { Utils } from "../core/Utils";
import { Game_Action } from "../objects/Game_Action";
import { Game_Battler } from "../objects/Game_Battler";
import { Scene_Gameover } from "../scenes/Scene_Gameover";
import { AudioManager } from "./AudioManager";
import { SceneManager } from "./SceneManager";
import { SoundManager } from "./SoundManager";
import { TextManager } from "./TextManager";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";
import { JsonEx } from "../core/JsonEx";
import { Game_Actor } from "../objects/Game_Actor";
import { Game_Enemy } from "../objects/Game_Enemy";
import { Sprite_Battler } from "../sprites/Sprite_Battler";

interface Rewards {
    gold: number;
    exp: number;
    items: any;
}

export abstract class BattleManager {
    private static _canEscape: any;
    private static _canLose: any;
    private static _phase: string;
    private static _battleTest: boolean;
    private static _eventCallback: any;
    private static _preemptive: boolean;
    private static _surprise: boolean;
    private static _actorIndex: number;
    private static _actionForcedBattler: any;
    private static _mapBgm: any;
    private static _mapBgs: any;
    private static _actionBattlers: any[];
    private static _subject: Game_Battler;
    private static _action: any;
    private static _targets: any[];
    private static _logWindow: any;
    private static _statusWindow: any;
    private static _spriteset: any;
    private static _escapeRatio: number;
    private static _escaped: boolean;
    private static _rewards: Rewards;
    private static _turnForced: boolean;
    private static _forceSelection: boolean;
    private static _allSelection: boolean;
    private static _victoryPhase: boolean;
    private static _forceActionQueue: any[];
    private static _escapeFailBoost: any;
    private static _timeBasedStates: any;
    private static _timeBasedBuffs: any;
    private static _registeredSprites: any;
    private static _spritePriority: any;
    private static _processTurn: boolean;
    private static _windowLayer: any;
    private static _enteredEndPhase: boolean;
    private static _performedBattlers: any;
    private static _processingForcedAction: any;
    private static _allTargets: any;
    private static _individualTargets: any;
    private static _phaseSteps: string[];
    private static _returnPhase: string;
    private static _actionList: any[];
    private static _preForcePhase: string;
    private static _target: any;
    private static _conditionFlags: any;
    private static _trueFlags: any;
    private static _actSeq: any;
    private static _bypassMoveToStartLocation: any;

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
        this._forceSelection = false;
        this._allSelection = false;
        this._victoryPhase = false;
        this._forceActionQueue = [];
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
        if (this.isDTB()) {
            let code = Yanfly.Param.BECEscRatio;
            try {
                this._escapeRatio = eval(code);
            } catch (e) {
                this._escapeRatio = 0;
                Yanfly.Util.displayError(e, code, "ESCAPE RATIO FORMULA ERROR");
            }
            code = Yanfly.Param.BECEscFail;
            try {
                this._escapeFailBoost = eval(code);
            } catch (e) {
                this._escapeFailBoost = 0;
                Yanfly.Util.displayError(
                    e,
                    code,
                    "ESCAPE FAIL BOOST FORMULA ERROR"
                );
            }
        } else {
            this._escapeFailBoost = 0.1;
            this._escapeRatio =
                (0.5 * $gameParty.agility()) / $gameTroop.agility();
        }
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
                case "phaseChange":
                    this.updatePhase();
                    break;
                case "actionList":
                    this.updateActionList();
                    break;
                case "actionTargetList":
                    this.updateActionTargetList();
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
        if (this._processingForcedAction) return false;
        switch (this._phase) {
            case "start":
            case "turn":
            case "turnEnd":
            case "actionList":
            case "actionTargetList":
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

    public static startBattle() {
        this._phase = "start";
        $gameSystem.onBattleStart();
        $gameParty.onBattleStart();
        $gameTroop.onBattleStart();
        this.displayStartMessages();
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
        } while (this.actor() && !this.actor().canInput());
    }

    public static selectPreviousCommand() {
        do {
            if (!this.actor() || !this.actor().selectPreviousCommand()) {
                this.changeActor(this._actorIndex - 1, "undecided");
                if (this._actorIndex < 0) {
                    return;
                }
            }
        } while (this.actor() && !this.actor().canInput());
    }

    public static refreshStatus() {
        this._statusWindow.refresh();
    }

    public static startTurn() {
        this._enteredEndPhase = false;
        this._phase = "turn";
        this.clearActor();
        $gameTroop.increaseTurn();
        $gameParty.onTurnStart();
        $gameTroop.onTurnStart();
        this._performedBattlers = [];
        this.makeActionOrders();
        $gameParty.requestMotionRefresh();
        this._logWindow.startTurn();
        this._subject = this.getNextSubject();
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
        this._processTurn = true;
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
        this._processTurn = false;
    }

    public static endTurn() {
        if (this.isTurnBased() && this._spriteset.isPopupPlaying()) return;
        if (this.isTurnBased() && this._enteredEndPhase) {
            this._phase = "turnEnd";
            this._preemptive = false;
            this._surprise = false;
            return;
        }
        this._enteredEndPhase = true;
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
        BattleManager.refreshAllMembers();
    }

    public static isForcedTurn() {
        return this._turnForced;
    }

    public static updateTurnEnd() {
        this.startInput();
    }

    public static getNextSubject() {
        //if ($gameTroop.turnCount() <= 0) return;
        this._performedBattlers = this._performedBattlers || [];
        this.makeActionOrders();
        for (;;) {
            const battlerArray = [];
            for (let i = 0; i < this._actionBattlers.length; ++i) {
                const obj = this._actionBattlers[i];
                if (!this._performedBattlers.includes(obj))
                    battlerArray.push(obj);
            }
            this._actionBattlers = battlerArray;
            const battler = this._actionBattlers.shift();
            if (!battler) return null;
            if (battler.isBattleMember() && battler.isAlive()) {
                this.pushPerformedBattler(battler);
                return battler;
            }
        }
    }

    public static pushPerformedBattler(battler: any) {
        this._performedBattlers.push(battler);
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
        if (!subject) return this.endAction();
        const action = subject.currentAction();
        this._action = action;
        if (!this._action) return this.endAction();
        if (!this._action.item()) return this.endAction();
        const targets = action.makeTargets();
        this.setTargets(targets);
        this._allTargets = targets.slice();
        this._individualTargets = targets.slice();
        this._phase = "phaseChange";
        this._phaseSteps = ["setup", "whole", "target", "follow", "finish"];
        this._returnPhase = "";
        this._actionList = [];
        subject.useItem(this._action.item());
        this._action.applyGlobal();
        this._logWindow.startAction(this._subject, this._action, this._targets);
    }

    public static updateAction() {
        const target = this._targets.shift();
        if (target) {
            this.invokeAction(this._subject, target);
        } else {
            if (this._returnPhase === "target") {
                this.setTargets([this._individualTargets[0]]);
                this._phase = "actionTargetList";
            } else {
                this.setTargets(this._allTargets.slice());
                this._phase = "actionList";
            }
        }
    }

    public static endAction() {
        if (this._subject) {
            this._subject.onAllActionsEnd();
        }
        if (this._processingForcedAction) {
            this._subject.removeCurrentAction();
            this._phase = this._preForcePhase;
        }
        this._processingForcedAction = false;
        if (this.loadPreForceActionSettings()) return;
        this._logWindow.endAction(this._subject);
        this._phase = "turn";
    }

    public static invokeAction(subject, target) {
        if (!Yanfly.Param.BECOptSpeed) this._logWindow.push("pushBaseLine");
        if (Math.random() < this._action.itemMrf(target)) {
            this.invokeMagicReflection(subject, target);
        } else if (Math.random() < this._action.itemCnt(target)) {
            this.invokeCounterAttack(subject, target);
        } else {
            this.invokeNormalAction(subject, target);
        }
        if (subject) subject.setLastTarget(target);
        if (!Yanfly.Param.BECOptSpeed) this._logWindow.push("popBaseLine");
    }

    public static invokeNormalAction(subject, target) {
        const realTarget = this.applySubstitute(target);
        this._action.apply(realTarget);
        this._logWindow.displayActionResults(subject, realTarget);
    }

    public static invokeCounterAttack(
        subject: Game_Battler,
        target: Game_Battler
    ) {
        const action = new Game_Action(target);
        this._logWindow.displayCounter(target);
        action.setAttack();
        action.apply(subject);
        this._logWindow.displayActionResults(target, subject);
        if (subject.isDead()) subject.performCollapse();
    }

    public static invokeMagicReflection(subject, target) {
        this._action._reflectionTarget = target;
        this._logWindow.displayReflection(target);
        this._action.apply(subject);
        this._logWindow.displayActionResults(target, subject);
        if (subject.isDead()) subject.performCollapse();
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
        if (this._subject) this._subject.clearResult();
        this.createForceActionFailSafes();
        this.savePreForceActionSettings();
        this._actionForcedBattler = battler;
        const index = this._actionBattlers.indexOf(battler);
        if (index >= 0) {
            this._actionBattlers.splice(index, 1);
        }
    }

    public static processForcedAction() {
        if (this._actionForcedBattler) {
            this._preForcePhase = this._phase;
            this._processingForcedAction = true;
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
        if (this._phase === "actionList") return false;
        else if (this._phase === "actionTargetList") return false;
        else if (this._phase === "action") return false;
        else if (this._phase === "phaseChange") return false;
        else if ($gameTroop.isEventRunning()) return false;
        else if (this._phase) {
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
        this._logWindow.clear();
        this._victoryPhase = true;
        if (this._windowLayer) this._windowLayer.x = 0;
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
        let success = this._preemptive
            ? true
            : Math.random() < this._escapeRatio;
        if ($gamePlayer.isDebugThrough()) success = true;
        if (success) {
            $gameParty.performEscapeSuccess();
            this.displayEscapeSuccessMessage();
            this._escaped = true;
            this.processAbort();
        } else {
            this.displayEscapeFailureMessage();
            this._escapeRatio += this._escapeFailBoost;
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

    public static isBattleSystem(value) {
        return value.toLowerCase() === $gameSystem.getBattleSystem();
    }

    public static isDTB() {
        return this.isBattleSystem("dtb");
    }

    public static isTurnBased() {
        if (this.isDTB()) return true;
        return false;
    }

    public static isTickBased() {
        return !this.isTurnBased();
    }

    public static tickRate() {
        return 1;
    }

    public static forceSelection() {
        this._forceSelection = true;
    }

    public static isForceSelection() {
        return this._forceSelection;
    }

    public static resetSelection() {
        this._forceSelection = false;
    }

    public static startAllSelection() {
        this._allSelection = true;
    }

    public static isAllSelection() {
        return this._allSelection && this.isInputting();
    }

    public static stopAllSelection() {
        this._allSelection = false;
    }

    public static timeBasedStates() {
        if (!$gameParty.inBattle()) return false;
        if (this.isTurnBased()) return false;
        if (this._timeBasedStates !== undefined) return this._timeBasedStates;
        this._timeBasedStates = Yanfly.Param.BECTimeStates;
        return this._timeBasedStates;
    }

    public static timeBasedBuffs() {
        if (!$gameParty.inBattle()) return false;
        if (this.isTurnBased()) return false;
        if (this._timeBasedBuffs !== undefined) return this._timeBasedBuffs;
        this._timeBasedBuffs = Yanfly.Param.BECTimeBuffs;
        return this._timeBasedBuffs;
    }

    public static displayStartMessages() {
        if (Yanfly.Param.BECEmergeText) {
            $gameTroop.enemyNames().forEach(function(name) {
                $gameMessage.add(Utils.format(TextManager.emerge, name));
            });
        }
        if (this._preemptive && Yanfly.Param.BECPreEmpText) {
            $gameMessage.add(
                Utils.format(TextManager.preemptive, $gameParty.name())
            );
        } else if (this._surprise && Yanfly.Param.BECSurpText) {
            $gameMessage.add(
                Utils.format(TextManager.surprise, $gameParty.name())
            );
        }
    }

    public static registerSprite(
        battler: Game_Battler,
        sprite: Sprite_Battler
    ) {
        let id = 0;
        if (!this._registeredSprites) this._registeredSprites = {};
        if (battler.isActor()) id = 100000 + (battler as Game_Actor).actorId();
        if (battler.isEnemy()) id = 200000 + (battler as Game_Enemy).index();
        this._registeredSprites[id] = sprite;
    }

    public static getSprite(battler: Game_Battler): Sprite_Battler {
        let id = 0;
        if (!this._registeredSprites) this._registeredSprites = {};
        if (battler.isActor()) id = 100000 + (battler as Game_Actor).actorId();
        if (battler.isEnemy()) id = 200000 + (battler as Game_Enemy).index();
        return this._registeredSprites[id];
    }

    public static setSpritePriority() {
        if ($gameSystem.isSideView()) {
            this._spritePriority = Yanfly.Param.BECSideSpPrio;
        } else {
            this._spritePriority = Yanfly.Param.BECFrontSprite;
        }
        if (this._spritePriority === false) this._spritePriority = 0;
        if (this._spritePriority === true) this._spritePriority = 1;
    }

    public static getSpritePriority() {
        if (!this._spritePriority) this.setSpritePriority();
        return this._spritePriority;
    }

    public static changeActor(newActorIndex, lastActorActionState) {
        let lastActor = this.actor();
        this._actorIndex = newActorIndex;
        let newActor = this.actor();
        if (lastActor) {
            lastActor.setActionState(lastActorActionState);
            lastActor.spriteReturnHome();
        }
        if (newActor) {
            newActor.setActionState("inputting");
            newActor.spriteStepForward();
        }
    }

    public static createActions() {
        $gameParty.createActions();
        $gameTroop.createActions();
    }

    public static clearInputtingAction() {
        if (this.inputtingAction()) this.inputtingAction().clear();
    }

    public static refreshAllMembers() {
        $gameParty.refreshMembers();
        $gameTroop.refreshMembers();
    }

    public static queueForceAction(user, skillId, target) {
        let targetIndex = target.index();
        if (target === undefined) {
            targetIndex = 0;
        } else if (typeof target === "number") {
            targetIndex = target;
        }
        let param = [
            user.isEnemy() ? 0 : 1,
            user.isActor() ? user.actorId() : user.index(),
            skillId,
            targetIndex
        ];
        let command = {
            code: 339,
            indent: 0,
            parameters: param
        };
        $gameTemp.forceActionQueue(command);
        this.clearResults();
        if (this.isTickBased()) this._phase = "action";
    }

    public static addText(text, wait) {
        if (!SceneManager.scene._logWindow) return;
        wait = wait || 0;
        SceneManager.scene._logWindow.addText(text);
        if (wait <= 0) return;
        let last = this._actionList[this._actionList.length - 1];
        if (last && last[0] === "WAIT") return;
        this._actionList.push(["WAIT", [wait]]);
    }

    public static clearResults() {
        let group = this.allBattleMembers();
        let length = group.length;
        for (let i = 0; i < length; ++i) {
            let member = group[i];
            if (member) member.clearResult();
        }
        this._allTargets = [];
        this._targets = [];
        this._target = undefined;
    }

    public static createForceActionFailSafes() {
        this._actionList = this._actionList || [];
        this._targets = this._targets || [];
        this._allTargets = this._allTargets || [];
        this._individualTargets = this._individualTargets || [];
        this._phaseSteps = this._phaseSteps || [];
        this._conditionFlags = this._conditionFlags || [];
        this._trueFlags = this._trueFlags || [];
    }

    public static savePreForceActionSettings() {
        let settings = this.setPreForceActionSettings();
        this._forceActionQueue.push(settings);
    }

    public static setPreForceActionSettings() {
        return {
            subject: this._subject,
            action: JsonEx.makeDeepCopy(this._action),
            actionList: JsonEx.makeDeepCopy(this._actionList),
            targets: this._targets.slice(),
            allTargets: this._allTargets.slice(),
            indTargets: this._individualTargets.slice(),
            phaseSteps: JsonEx.makeDeepCopy(this._phaseSteps),
            returnPhase: this._returnPhase,
            phase: this._phase,
            conditionFlags: JsonEx.makeDeepCopy(this._conditionFlags),
            trueFlags: JsonEx.makeDeepCopy(this._trueFlags)
        };
    }

    public static loadPreForceActionSettings() {
        let settings = this._forceActionQueue[0];
        if (settings) {
            this._forceActionQueue.shift();
            this.resetPreForceActionSettings(settings);
            return this._subject && this._subject.isAppeared();
        } else {
            return false;
        }
    }

    public static resetPreForceActionSettings(settings) {
        this._subject = settings["subject"];
        this._action = settings["action"];
        this._actionList = settings["actionList"];
        this._targets = settings["targets"];
        this._allTargets = settings["allTargets"];
        this._individualTargets = settings["indTargets"];
        this._phaseSteps = settings["phaseSteps"];
        this._returnPhase = settings["returnPhase"];
        this._conditionFlags = settings["conditionFlags"];
        this._trueFlags = settings["trueFlags"];
        this._phase = settings["phase"];
    }

    public static setTargets(array) {
        this._targets = [];
        const max = array.length;
        for (let i = 0; i < max; ++i) {
            const target = array[i];
            if (target) this._targets.push(target);
        }
    }

    public static updatePhase() {
        let phase = this._phaseSteps.shift();
        if (phase) this.createPhaseChanges();
        switch (phase) {
            case "setup":
                this.createSetupActions();
                break;
            case "whole":
                this.createWholeActions();
                break;
            case "target":
                this.createTargetActions();
                break;
            case "follow":
                this.createFollowActions();
                break;
            case "finish":
                this.createFinishActions();
                break;
            default:
                this.endAction();
                break;
        }
    }

    public static createPhaseChanges() {
        this._phase = "actionList";
        this.setTargets(this._allTargets.slice());
        this._conditionFlags = [];
        this._trueFlags = [];
    }

    public static createSetupActions() {
        $gameTemp.clearActionSequenceSettings();
        this._returnPhase = "setup";
        this._actionList = this._action.item().setupActions.slice();
    }

    public static createWholeActions() {
        this._returnPhase = "whole";
        this._actionList = this._action.item().wholeActions.slice();
    }

    public static createTargetActions() {
        this._returnPhase = "target";
        this._phase = "actionTargetList";
        this.setTargets([this._individualTargets[0]]);
        this._actionList = this._action.item().targetActions.slice();
    }

    public static createFollowActions() {
        this._returnPhase = "follow";
        this._actionList = this._action.item().followActions.slice();
    }

    public static createFinishActions() {
        this._returnPhase = "finish";
        this._actionList = this._action.item().finishActions.slice();
    }

    public static updateActionList() {
        for (;;) {
            this._actSeq = this._actionList.shift();
            if (this._actSeq) {
                if (!this.actionConditionsMet(this._actSeq)) continue;
                let seqName = this._actSeq[0].toUpperCase();
                if (
                    !this.processActionSequenceCheck(seqName, this._actSeq[1])
                ) {
                    break;
                }
            } else {
                this._phase = "phaseChange";
                break;
            }
        }
    }

    public static updateActionTargetList() {
        for (;;) {
            this._actSeq = this._actionList.shift();
            if (this._actSeq) {
                if (!this.actionConditionsMet(this._actSeq)) continue;
                let seqName = this._actSeq[0].toUpperCase();
                if (
                    !this.processActionSequenceCheck(seqName, this._actSeq[1])
                ) {
                    break;
                }
            } else if (this._individualTargets.length > 0) {
                this._individualTargets.shift();
                if (this._individualTargets.length > 0) {
                    this.setTargets([this._individualTargets[0]]);
                    this._actionList = this._action
                        .item()
                        .targetActions.slice();
                } else {
                    this._phase = "phaseChange";
                    break;
                }
            } else {
                this._phase = "phaseChange";
                break;
            }
        }
    }

    public static processActionSequenceCheck(actionName, actionArgs) {
        // IF condition
        if (actionName.match(/IF[ ](.*)/i)) {
            return this.actionIfConditions(actionName, actionArgs);
        }
        return this.processActionSequence(actionName, actionArgs);
    }

    public static processActionSequence(actionName, actionArgs) {
        // NO ACTION
        if (actionName === "") {
            return true;
        }
        // ACTION ANIMATION
        if (actionName === "ACTION ANIMATION") {
            return this.actionActionAnimation(actionArgs);
        }
        // ACTION EFFECT
        if (actionName === "ACTION COMMON EVENT") {
            return this.actionActionCommonEvent();
        }
        // ACTION EFFECT
        if (actionName === "ACTION EFFECT") {
            return this.actionActionEffect(actionArgs);
        }
        // ANI WAIT: frames
        if (["ANI WAIT", "ANIWAIT", "ANIMATION WAIT"].includes(actionName)) {
            return this.actionAniWait(actionArgs[0]);
        }
        // CAST ANIMATION
        if (actionName === "CAST ANIMATION") {
            return this.actionCastAnimation();
        }
        // CLEAR BATTLE LOG
        if (actionName === "CLEAR BATTLE LOG") {
            return this.actionClearBattleLog();
        }
        // DEATH BREAK
        if (actionName === "DEATH BREAK") {
            return this.actionDeathBreak();
        }
        // DISPLAY ACTION
        if (actionName === "DISPLAY ACTION") {
            return this.actionDisplayAction();
        }
        // IMMORTAL: targets, true/false
        if (actionName === "IMMORTAL") {
            return this.actionImmortal(actionArgs);
        }
        // MOTION WAIT
        if (actionName === "MOTION WAIT") {
            return this.actionMotionWait(actionArgs);
        }
        // PERFORM ACTION
        if (actionName === "PERFORM ACTION") {
            return this.actionPerformAction();
        }
        // PERFORM FINISH
        if (actionName === "PERFORM FINISH") {
            return this.actionPerformFinish();
        }
        // PERFORM START
        if (actionName === "PERFORM START") {
            return this.actionPerformStart();
        }
        // WAIT: frames
        if (actionName === "WAIT") {
            return this.actionWait(actionArgs[0]);
        }
        // WAIT FOR ANIMATION
        if (actionName === "WAIT FOR ANIMATION") {
            return this.actionWaitForAnimation();
        }
        // WAIT FOR EFFECT
        if (actionName === "WAIT FOR EFFECT") {
            return this.actionWaitForEffect();
        }
        // WAIT FOR MOVEMENT
        if (actionName === "WAIT FOR MOVEMENT") {
            return this.actionWaitForMovement();
        }
        // WAIT FOR NEW LINE
        if (actionName === "WAIT FOR NEW LINE") {
            return this.actionWaitForNewLine();
        }
        // WAIT FOR POPUPS
        if (actionName === "WAIT FOR POPUPS") {
            return this.actionWaitForPopups();
        }
        return false;
    }

    public static makeActionTargets(string) {
        let targets = [];
        string = string.toUpperCase();
        if (["SUBJECT", "USER"].includes(string)) {
            return [this._subject];
        }
        if (["TARGET", "TARGETS"].includes(string)) {
            let group = this._targets;
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (["ACTORS", "EXISTING ACTORS", "ALIVE ACTORS"].includes(string)) {
            let group = $gameParty.aliveMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (["ACTORS ALL", "ALL ACTORS", "PARTY"].includes(string)) {
            let group = $gameParty.battleMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (["DEAD ACTORS", "DEAD ACTOR"].includes(string)) {
            let group = $gameParty.deadMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target) targets.push(target);
            }
            return targets;
        }
        if (["ACTORS NOT USER", "ACTORS NOT SUBJECT"].includes(string)) {
            let group = $gameParty.aliveMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target !== this._subject && target.isAppeared()) {
                    targets.push(target);
                }
            }
            return targets;
        }
        if (
            [
                "ENEMIES",
                "EXISTING ENEMIES",
                "ALIVE ENEMIES",
                "TROOP",
                "TROOPS"
            ].includes(string)
        ) {
            let group = $gameTroop.aliveMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (["ENEMIES ALL", "ALL ENEMIES"].includes(string)) {
            let group = $gameTroop.members();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (["DEAD ENEMIES", "DEAD ENEMY"].includes(string)) {
            let group = $gameTroop.deadMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target) targets.push(target);
            }
            return targets;
        }
        if (
            [
                "ENEMIES NOT USER",
                "ENEMIES NOT SUBJECT",
                "TROOP NOT USER",
                "TROOP NOT SUBJECT"
            ].includes(string)
        ) {
            let group = $gameTroop.aliveMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target !== this._subject && target.isAppeared()) {
                    targets.push(target);
                }
            }
            return targets;
        }
        if (string.match(/ACTOR[ ](\d+)/i)) {
            let target = $gameParty.battleMembers()[parseInt(RegExp.$1)];
            if (target && target.isAppeared()) return [target];
        }
        if (string.match(/ENEMY[ ](\d+)/i)) {
            let target = $gameTroop.members()[parseInt(RegExp.$1)];
            if (target && target.isAppeared()) return [target];
        }
        if (["FRIEND", "FRIENDS", "ALLIES"].includes(string)) {
            let group = this._action.friendsUnit().aliveMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (["ALL FRIENDS", "ALL ALLIES"].includes(string)) {
            let group = this._action.friendsUnit().members();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (["DEAD FRIEND", "DEAD FRIENDS", "DEAD ALLIES"].includes(string)) {
            let group = this._action.friendsUnit().deadMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (["OPPONENT", "OPPONENTS", "RIVALS", "FOES"].includes(string)) {
            let group = this._action.opponentsUnit().aliveMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (["ALL OPPONENTS", "ALL RIVALS", "ALL FOES"].includes(string)) {
            let group = this._action.opponentsUnit().members();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (
            [
                "DEAD OPPONENT",
                "DEAD OPPONENTS",
                "DEAD RIVALS",
                "DEAD FOES"
            ].includes(string)
        ) {
            let group = this._action.opponentsUnit().deadMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target) targets.push(target);
            }
            return targets;
        }
        if (["FRIENDS NOT USER", "ALLIES NOT USER"].includes(string)) {
            let group = this._action.friendsUnit().aliveMembers();
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target !== this._subject && target.isAppeared()) {
                    targets.push(target);
                }
            }
            return targets;
        }
        if (string.match(/(?:FRIEND|ALLY)[ ](\d+)/i)) {
            let target = this._action.friendsUnit().members()[
                parseInt(RegExp.$1)
            ];
            if (target && target.isAppeared()) return [target];
        }
        if (string.match(/(?:OPPONENT|FOE|RIVAL)[ ](\d+)/i)) {
            let target = this._action.opponentsUnit().members()[
                parseInt(RegExp.$1)
            ];
            if (target && target.isAppeared()) return [target];
        }
        if (["ALL ALIVE"].includes(string)) {
            let group = this._action.friendsUnit().aliveMembers();
            group = group.concat(this._action.opponentsUnit().aliveMembers());
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (["ALL MEMBERS"].includes(string)) {
            let group = this._action.friendsUnit().members();
            group = group.concat(this._action.opponentsUnit().members());
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            return targets;
        }
        if (["ALL DEAD"].includes(string)) {
            let group = this._action.friendsUnit().deadMembers();
            group = group.concat(this._action.opponentsUnit().deadMembers());
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target) targets.push(target);
            }
            return targets;
        }
        if (["ALL NOT USER"].includes(string)) {
            let group = this._action.friendsUnit().aliveMembers();
            group = group.concat(this._action.opponentsUnit().aliveMembers());
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target !== this._subject && target.isAppeared()) {
                    targets.push(target);
                }
            }
            return targets;
        }
        if (["FOCUS", "PARTICIPANTS"].includes(string)) {
            let group = this._targets;
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target && target.isAppeared()) targets.push(target);
            }
            if (!targets.includes(this._subject)) targets.push(this._subject);
            return targets;
        }
        if (["NOT FOCUS", "NONPARTICIPANTS"].includes(string)) {
            let group = this._action.friendsUnit().members();
            group = group.concat(this._action.opponentsUnit().members());
            for (let i = 0; i < group.length; ++i) {
                let target = group[i];
                if (target) {
                    if (target === this._subject) continue;
                    if (target.isHidden()) continue;
                    if (this._targets.includes(target)) continue;

                    if (target.isDead()) {
                        if (!target.isActor()) {
                            continue;
                        }
                    }

                    targets.push(target);
                }
            }
            return targets;
        }
        if (string.match(/(?:CHAR|CHARA|CHARACTER)[ ](\d+)/i)) {
            let actorId = parseInt(RegExp.$1);
            let actor = $gameActors.actor(actorId);
            if (actor && $gameParty.battleMembers().includes(actor)) {
                return [actor];
            }
        }
        if ("FIRST" === string.toUpperCase()) {
            return [this._targets[0]];
        }
        return targets;
    }

    public static actionConditionsMet(actSeq) {
        let ci = this._conditionFlags.length - 1;
        let actionName = actSeq[0];
        let actionArgs = actSeq[1];
        let subject = this._subject;
        let user = this._subject;
        let target = this._targets[0];
        let targets = this._targets;
        let action = this._action;
        let item = this._action.item();
        if (actionName.match(/ELSE[ ]IF[ ](.*)/i)) {
            if (this._conditionFlags.length <= 0) return false;
            if (this._conditionFlags[ci]) {
                this._conditionFlags[ci] = false;
                this._trueFlags[ci] = true;
            } else if (!this._conditionFlags[ci] && !this._trueFlags[ci]) {
                let text = String(RegExp.$1);
                try {
                    this._conditionFlags[ci] = eval(text);
                    this._trueFlags[ci] = eval(text);
                } catch (e) {
                    Yanfly.Util.displayError(
                        e,
                        text,
                        "ACTION SEQUENCE IF CONDITION ERROR"
                    );
                    this._conditionFlags[ci] = false;
                    this._trueFlags[ci] = false;
                }
            }
            return false;
        } else if (actionName.match(/ELSE[ ]*(.*)/i)) {
            if (this._conditionFlags.length <= 0) return false;
            if (this._conditionFlags[ci]) {
                this._conditionFlags[ci] = false;
                this._trueFlags[ci] = true;
            } else if (!this._conditionFlags[ci] && !this._trueFlags[ci]) {
                this._conditionFlags[ci] = true;
                this._trueFlags[ci] = true;
            }
            return false;
        } else if (actionName.toUpperCase() === "END") {
            if (this._conditionFlags.length <= 0) return false;
            this._conditionFlags.pop();
            this._trueFlags.pop();
            return false;
        }
        if (this._conditionFlags.length > 0) return this._conditionFlags[ci];
        return true;
    }

    public static actionActionAnimation(actionArgs) {
        let targets = this._targets;
        if (actionArgs && actionArgs[0]) {
            let targets = this.makeActionTargets(actionArgs[0]);
        }
        let mirror = false;
        if (actionArgs && actionArgs[1]) {
            if (actionArgs[1].toUpperCase() === "MIRROR") mirror = true;
        }
        let subject = this._subject;
        let group = targets.filter(Yanfly.Util.onlyUnique);
        let aniId = this._action.item().animationId;
        if (aniId < 0) {
            if (mirror) {
                this._logWindow.showActorAtkAniMirror(subject, group);
            } else {
                this._logWindow.showAttackAnimation(subject, group);
            }
        } else {
            this._logWindow.showNormalAnimation(group, aniId, mirror);
        }
        return true;
    }

    public static actionActionCommonEvent() {
        this._action.item().effects.forEach(function(effect) {
            if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
                $gameTemp.reserveCommonEvent(effect.dataId);
            }
        }, this);
        return false;
    }

    public static actionActionEffect(actionArgs) {
        let targets = this._targets;
        if (actionArgs && actionArgs[0]) {
            let targets = this.makeActionTargets(actionArgs[0]);
        }
        targets.forEach(function(target) {
            if (target !== undefined) {
                let alreadyDead = target.isDead();
                this.invokeAction(this._subject, target);
                if (target.isDead() && !alreadyDead) {
                    target.performCollapse();
                }
            }
        }, this);
        return true;
    }

    public static actionAniWait(frames) {
        frames *= Yanfly.Param.AnimationRate || 4;
        this._logWindow._waitCount = parseInt(frames);
        return false;
    }

    public static actionCastAnimation() {
        if (!$gameSystem.isSideView() && this._subject.isActor()) return true;
        if (
            !this._action.isAttack() &&
            !this._action.isGuard() &&
            this._action.isSkill()
        ) {
            if (this._action.item().castAnimation > 0) {
                let ani = $dataAnimations[this._action.item().castAnimation];
                this._logWindow.showAnimation(
                    this._subject,
                    [this._subject],
                    this._action.item().castAnimation
                );
            }
        }
        return true;
    }

    public static actionClearBattleLog() {
        this._logWindow.clear();
        return false;
    }

    public static actionDeathBreak() {
        if (this._subject.isDead()) {
            this._targets = [];
            this._actionList = [];
            this._individualTargets = [];
            this._phase = "phaseChange";
            return false;
        }
        return true;
    }

    public static actionDisplayAction() {
        this._logWindow.displayAction(this._subject, this._action.item());
        return false;
    }

    public static actionIfConditions(actionName, actionArgs) {
        let subject = this._subject;
        let user = this._subject;
        let target = this._targets[0];
        let critical = false;
        if (target && target.result()) critical = target.result().critical;
        let targets = this._targets;
        let action = this._action;
        let item = this._action.item();
        actionName = this._actSeq[0];
        if (actionName.match(/IF[ ](.*)/i)) {
            let text = String(RegExp.$1);
            try {
                this._conditionFlags.push(eval(text));
            } catch (e) {
                this._conditionFlags.push(false);
                Yanfly.Util.displayError(
                    e,
                    text,
                    "ACTION SEQUENCE IF CONDITION ERROR"
                );
            }
            this._trueFlags.push(false);
            let ci = this._conditionFlags.length;
        }
        return true;
    }

    public static actionImmortal(actionArgs) {
        let value = false;
        let targets = this.makeActionTargets(actionArgs[0]).filter(
            Yanfly.Util.onlyUnique
        );
        try {
            value = eval(String(actionArgs[1]).toLowerCase());
        } catch (e) {
            value = false;
        }
        targets.forEach(function(target) {
            if (value) {
                target.addImmortal();
            } else {
                let alreadyDead = target.isDead();
                target.removeImmortal();
            }
        }, this);
        return true;
    }

    public static actionMotionWait(actionArgs) {
        let targets = this.makeActionTargets(actionArgs[0]);
        if (targets[0].isActor() && targets[0].isSpriteVisible()) {
            this._logWindow._waitCount += 12;
            return false;
        }
        return true;
    }

    public static actionPerformAction() {
        this._logWindow.performAction(this._subject, this._action);
        if (this._subject.isActor() && this._subject.isSpriteVisible) {
            this._logWindow._waitCount += 20;
            return false;
        }
        return true;
    }

    public static actionPerformFinish() {
        this._logWindow.performActionEnd(this._subject);
        $gameParty.aliveMembers().forEach(function(member) {
            member.spriteReturnHome();
        });
        $gameTroop.aliveMembers().forEach(function(member) {
            member.spriteReturnHome();
        });
        return true;
    }

    public static actionPerformStart() {
        this._logWindow.performActionStart(this._subject, this._action);
        return true;
    }

    public static actionWait(frames) {
        this._logWindow._waitCount = parseInt(frames);
        return false;
    }

    public static actionWaitForAnimation() {
        this._logWindow.waitForAnimation();
        return false;
    }

    public static actionWaitForEffect() {
        this._logWindow.waitForEffect();
        return false;
    }

    public static actionWaitForMovement() {
        this._logWindow.waitForMovement();
        return false;
    }

    public static actionWaitForNewLine() {
        this._logWindow.waitForNewLine();
        return false;
    }

    public static actionWaitForPopups() {
        this._logWindow.waitForPopups();
        return false;
    }
}
