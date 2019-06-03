import Utils from "../core/Utils";
import Game_Action from "../objects/Game_Action";
import Scene_Gameover from "../scenes/Scene_Gameover";
import AudioManager from "./AudioManager";
import SceneManager from "./SceneManager";
import SoundManager from "./SoundManager";
import TextManager from "./TextManager";

export default abstract class BattleManager {
    public static setup: (troopId: any, canEscape: any, canLose: any) => void;
    public static initMembers: () => void;
    public static isBattleTest: () => any;
    public static setBattleTest: (battleTest: any) => void;
    public static setEventCallback: (callback: any) => void;
    public static setLogWindow: (logWindow: any) => void;
    public static setStatusWindow: (statusWindow: any) => void;
    public static setSpriteset: (spriteset: any) => void;
    public static onEncounter: () => void;
    public static ratePreemptive: () => any;
    public static rateSurprise: () => any;
    public static saveBgmAndBgs: () => void;
    public static playBattleBgm: () => void;
    public static playVictoryMe: () => void;
    public static playDefeatMe: () => void;
    public static replayBgmAndBgs: () => void;
    public static makeEscapeRatio: () => void;
    public static update: () => void;
    public static updateEvent: () => any;
    public static updateEventMain: () => boolean;
    public static isBusy: () => any;
    public static isInputting: () => boolean;
    public static isInTurn: () => boolean;
    public static isTurnEnd: () => boolean;
    public static isAborting: () => boolean;
    public static isBattleEnd: () => boolean;
    public static canEscape: () => any;
    public static canLose: () => any;
    public static isEscaped: () => any;
    public static actor: () => any;
    public static clearActor: () => void;
    public static changeActor: (newActorIndex: any, lastActorActionState: any) => void;
    public static startBattle: () => void;
    public static displayStartMessages: () => void;
    public static startInput: () => void;
    public static inputtingAction: () => any;
    public static selectNextCommand: () => void;
    public static selectPreviousCommand: () => void;
    public static refreshStatus: () => void;
    public static startTurn: () => void;
    public static updateTurn: () => void;
    public static processTurn: () => void;
    public static endTurn: () => void;
    public static isForcedTurn: () => any;
    public static updateTurnEnd: () => void;
    public static getNextSubject: () => any;
    public static allBattleMembers: () => any;
    public static makeActionOrders: () => void;
    public static startAction: () => void;
    public static updateAction: () => void;
    public static endAction: () => void;
    public static invokeAction: (subject: any, target: any) => void;
    public static invokeNormalAction: (subject: any, target: any) => void;
    public static invokeCounterAttack: (subject: any, target: any) => void;
    public static invokeMagicReflection: (subject: any, target: any) => void;
    public static applySubstitute: (target: any) => any;
    public static checkSubstitute: (target: any) => boolean;
    public static isActionForced: () => boolean;
    public static forceAction: (battler: any) => void;
    public static processForcedAction: () => void;
    public static abort: () => void;
    public static checkBattleEnd: () => boolean;
    public static checkAbort: () => boolean;
    public static processVictory: () => void;
    public static processEscape: () => boolean;
    public static processAbort: () => void;
    public static processDefeat: () => void;
    public static endBattle: (result: any) => void;
    public static updateBattleEnd: () => void;
    public static makeRewards: () => void;
    public static displayVictoryMessage: () => void;
    public static displayDefeatMessage: () => void;
    public static displayEscapeSuccessMessage: () => void;
    public static displayEscapeFailureMessage: () => void;
    public static displayRewards: () => void;
    public static displayExp: () => void;
    public static displayGold: () => void;
    public static displayDropItems: () => void;
    public static gainRewards: () => void;
    public static gainExp: () => void;
    public static gainGold: () => void;
    public static gainDropItems: () => void;

}

BattleManager.setup = function (troopId, canEscape, canLose) {
    this.initMembers();
    this._canEscape = canEscape;
    this._canLose = canLose;
    $gameTroop.setup(troopId);
    $gameScreen.onBattleStart();
    this.makeEscapeRatio();
};

BattleManager.initMembers = function () {
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
    this._rewards = {};
    this._turnForced = false;
};

BattleManager.isBattleTest = function () {
    return this._battleTest;
};

BattleManager.setBattleTest = function (battleTest) {
    this._battleTest = battleTest;
};

BattleManager.setEventCallback = function (callback) {
    this._eventCallback = callback;
};

BattleManager.setLogWindow = function (logWindow) {
    this._logWindow = logWindow;
};

BattleManager.setStatusWindow = function (statusWindow) {
    this._statusWindow = statusWindow;
};

BattleManager.setSpriteset = function (spriteset) {
    this._spriteset = spriteset;
};

BattleManager.onEncounter = function () {
    this._preemptive = (Math.random() < this.ratePreemptive());
    this._surprise = (Math.random() < this.rateSurprise() && !this._preemptive);
};

BattleManager.ratePreemptive = function () {
    return $gameParty.ratePreemptive($gameTroop.agility());
};

BattleManager.rateSurprise = function () {
    return $gameParty.rateSurprise($gameTroop.agility());
};

BattleManager.saveBgmAndBgs = function () {
    this._mapBgm = AudioManager.saveBgm();
    this._mapBgs = AudioManager.saveBgs();
};

BattleManager.playBattleBgm = function () {
    AudioManager.playBgm($gameSystem.battleBgm());
    AudioManager.stopBgs();
};

BattleManager.playVictoryMe = function () {
    AudioManager.playMe($gameSystem.victoryMe());
};

BattleManager.playDefeatMe = function () {
    AudioManager.playMe($gameSystem.defeatMe());
};

BattleManager.replayBgmAndBgs = function () {
    if (this._mapBgm) {
        AudioManager.replayBgm(this._mapBgm);
    } else {
        AudioManager.stopBgm();
    }
    if (this._mapBgs) {
        AudioManager.replayBgs(this._mapBgs);
    }
};

BattleManager.makeEscapeRatio = function () {
    this._escapeRatio = 0.5 * $gameParty.agility() / $gameTroop.agility();
};

BattleManager.update = function () {
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
};

BattleManager.updateEvent = function () {
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
};

BattleManager.updateEventMain = function () {
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
};

BattleManager.isBusy = function () {
    return ($gameMessage.isBusy() || this._spriteset.isBusy() ||
            this._logWindow.isBusy());
};

BattleManager.isInputting = function () {
    return this._phase === "input";
};

BattleManager.isInTurn = function () {
    return this._phase === "turn";
};

BattleManager.isTurnEnd = function () {
    return this._phase === "turnEnd";
};

BattleManager.isAborting = function () {
    return this._phase === "aborting";
};

BattleManager.isBattleEnd = function () {
    return this._phase === "battleEnd";
};

BattleManager.canEscape = function () {
    return this._canEscape;
};

BattleManager.canLose = function () {
    return this._canLose;
};

BattleManager.isEscaped = function () {
    return this._escaped;
};

BattleManager.actor = function () {
    return this._actorIndex >= 0 ? $gameParty.members()[this._actorIndex] : null;
};

BattleManager.clearActor = function () {
    this.changeActor(-1, "");
};

BattleManager.changeActor = function (newActorIndex, lastActorActionState) {
    const lastActor = this.actor();
    this._actorIndex = newActorIndex;
    const newActor = this.actor();
    if (lastActor) {
        lastActor.setActionState(lastActorActionState);
    }
    if (newActor) {
        newActor.setActionState("inputting");
    }
};

BattleManager.startBattle = function () {
    this._phase = "start";
    $gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
    this.displayStartMessages();
};

BattleManager.displayStartMessages = function () {
    $gameTroop.enemyNames().forEach(function (name) {
        $gameMessage.add(Utils.format(TextManager.emerge, name));
    });
    if (this._preemptive) {
        $gameMessage.add(Utils.format(TextManager.preemptive, $gameParty.name()));
    } else if (this._surprise) {
        $gameMessage.add(Utils.format(TextManager.surprise, $gameParty.name()));
    }
};

BattleManager.startInput = function () {
    this._phase = "input";
    $gameParty.makeActions();
    $gameTroop.makeActions();
    this.clearActor();
    if (this._surprise || !$gameParty.canInput()) {
        this.startTurn();
    }
};

BattleManager.inputtingAction = function () {
    return this.actor() ? this.actor().inputtingAction() : null;
};

BattleManager.selectNextCommand = function () {
    do {
        if (!this.actor() || !this.actor().selectNextCommand()) {
            this.changeActor(this._actorIndex + 1, "waiting");
            if (this._actorIndex >= $gameParty.size()) {
                this.startTurn();
                break;
            }
        }
    } while (!this.actor().canInput());
};

BattleManager.selectPreviousCommand = function () {
    do {
        if (!this.actor() || !this.actor().selectPreviousCommand()) {
            this.changeActor(this._actorIndex - 1, "undecided");
            if (this._actorIndex < 0) {
                return;
            }
        }
    } while (!this.actor().canInput());
};

BattleManager.refreshStatus = function () {
    this._statusWindow.refresh();
};

BattleManager.startTurn = function () {
    this._phase = "turn";
    this.clearActor();
    $gameTroop.increaseTurn();
    this.makeActionOrders();
    $gameParty.requestMotionRefresh();
    this._logWindow.startTurn();
};

BattleManager.updateTurn = function () {
    $gameParty.requestMotionRefresh();
    if (!this._subject) {
        this._subject = this.getNextSubject();
    }
    if (this._subject) {
        this.processTurn();
    } else {
        this.endTurn();
    }
};

BattleManager.processTurn = function () {
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
};

BattleManager.endTurn = function () {
    this._phase = "turnEnd";
    this._preemptive = false;
    this._surprise = false;
    this.allBattleMembers().forEach(function (battler) {
        battler.onTurnEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(battler);
        this._logWindow.displayRegeneration(battler);
    }, this);
    if (this.isForcedTurn()) {
        this._turnForced = false;
    }
};

BattleManager.isForcedTurn = function () {
    return this._turnForced;
};

BattleManager.updateTurnEnd = function () {
    this.startInput();
};

BattleManager.getNextSubject = function () {
    while (true) {
        const battler = this._actionBattlers.shift();
        if (!battler) {
            return null;
        }
        if (battler.isBattleMember() && battler.isAlive()) {
            return battler;
        }
    }
};

BattleManager.allBattleMembers = function () {
    return $gameParty.members().concat($gameTroop.members());
};

BattleManager.makeActionOrders = function () {
    let battlers = [];
    if (!this._surprise) {
        battlers = battlers.concat($gameParty.members());
    }
    if (!this._preemptive) {
        battlers = battlers.concat($gameTroop.members());
    }
    battlers.forEach(function (battler) {
        battler.makeSpeed();
    });
    battlers.sort(function (a, b) {
        return b.speed() - a.speed();
    });
    this._actionBattlers = battlers;
};

BattleManager.startAction = function () {
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
};

BattleManager.updateAction = function () {
    const target = this._targets.shift();
    if (target) {
        this.invokeAction(this._subject, target);
    } else {
        this.endAction();
    }
};

BattleManager.endAction = function () {
    this._logWindow.endAction(this._subject);
    this._phase = "turn";
};

BattleManager.invokeAction = function (subject, target) {
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
};

BattleManager.invokeNormalAction = function (subject, target) {
    const realTarget = this.applySubstitute(target);
    this._action.apply(realTarget);
    this._logWindow.displayActionResults(subject, realTarget);
};

BattleManager.invokeCounterAttack = function (subject, target) {
    const action = new Game_Action(target);
    action.setAttack();
    action.apply(subject);
    this._logWindow.displayCounter(target);
    this._logWindow.displayActionResults(target, subject);
};

BattleManager.invokeMagicReflection = function (subject, target) {
	this._action._reflectionTarget = target;
    this._logWindow.displayReflection(target);
    this._action.apply(subject);
    this._logWindow.displayActionResults(target, subject);
};

BattleManager.applySubstitute = function (target) {
    if (this.checkSubstitute(target)) {
        const substitute = target.friendsUnit().substituteBattler();
        if (substitute && target !== substitute) {
            this._logWindow.displaySubstitute(substitute, target);
            return substitute;
        }
    }
    return target;
};

BattleManager.checkSubstitute = function (target) {
    return target.isDying() && !this._action.isCertainHit();
};

BattleManager.isActionForced = function () {
    return !!this._actionForcedBattler;
};

BattleManager.forceAction = function (battler) {
    this._actionForcedBattler = battler;
    const index = this._actionBattlers.indexOf(battler);
    if (index >= 0) {
        this._actionBattlers.splice(index, 1);
    }
};

BattleManager.processForcedAction = function () {
    if (this._actionForcedBattler) {
        this._turnForced = true;
        this._subject = this._actionForcedBattler;
        this._actionForcedBattler = null;
        this.startAction();
        this._subject.removeCurrentAction();
    }
};

BattleManager.abort = function () {
    this._phase = "aborting";
};

BattleManager.checkBattleEnd = function () {
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
};

BattleManager.checkAbort = function () {
    if ($gameParty.isEmpty() || this.isAborting()) {
        SoundManager.playEscape();
        this._escaped = true;
        this.processAbort();
    }
    return false;
};

BattleManager.processVictory = function () {
    $gameParty.removeBattleStates();
    $gameParty.performVictory();
    this.playVictoryMe();
    this.replayBgmAndBgs();
    this.makeRewards();
    this.displayVictoryMessage();
    this.displayRewards();
    this.gainRewards();
    this.endBattle(0);
};

BattleManager.processEscape = function () {
    $gameParty.performEscape();
    SoundManager.playEscape();
    const success = this._preemptive ? true : (Math.random() < this._escapeRatio);
    if (success) {
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
};

BattleManager.processAbort = function () {
    $gameParty.removeBattleStates();
    this.replayBgmAndBgs();
    this.endBattle(1);
};

BattleManager.processDefeat = function () {
    this.displayDefeatMessage();
    this.playDefeatMe();
    if (this._canLose) {
        this.replayBgmAndBgs();
    } else {
        AudioManager.stopBgm();
    }
    this.endBattle(2);
};

BattleManager.endBattle = function (result) {
    this._phase = "battleEnd";
    if (this._eventCallback) {
        this._eventCallback(result);
    }
    if (result === 0) {
        $gameSystem.onBattleWin();
    } else if (this._escaped) {
        $gameSystem.onBattleEscape();
    }
};

BattleManager.updateBattleEnd = function () {
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
};

BattleManager.makeRewards = function () {
    this._rewards = {};
    this._rewards.gold = $gameTroop.goldTotal();
    this._rewards.exp = $gameTroop.expTotal();
    this._rewards.items = $gameTroop.makeDropItems();
};

BattleManager.displayVictoryMessage = function () {
    $gameMessage.add(Utils.format(TextManager.victory, $gameParty.name()));
};

BattleManager.displayDefeatMessage = function () {
    $gameMessage.add(Utils.format(TextManager.defeat, $gameParty.name()));
};

BattleManager.displayEscapeSuccessMessage = function () {
    $gameMessage.add(Utils.format(TextManager.escapeStart, $gameParty.name()));
};

BattleManager.displayEscapeFailureMessage = function () {
    $gameMessage.add(Utils.format(TextManager.escapeStart, $gameParty.name()));
    $gameMessage.add("\\." + TextManager.escapeFailure);
};

BattleManager.displayRewards = function () {
    this.displayExp();
    this.displayGold();
    this.displayDropItems();
};

BattleManager.displayExp = function () {
    const exp = this._rewards.exp;
    if (exp > 0) {
        const text = TextManager.obtainExp.format(exp, TextManager.exp);
        $gameMessage.add("\\." + text);
    }
};

BattleManager.displayGold = function () {
    const gold = this._rewards.gold;
    if (gold > 0) {
        $gameMessage.add("\\." + Utils.format(TextManager.obtainGold, gold));
    }
};

BattleManager.displayDropItems = function () {
    const items = this._rewards.items;
    if (items.length > 0) {
        $gameMessage.newPage();
        items.forEach(function (item) {
            $gameMessage.add(Utils.format(TextManager.obtainItem, item.name));
        });
    }
};

BattleManager.gainRewards = function () {
    this.gainExp();
    this.gainGold();
    this.gainDropItems();
};

BattleManager.gainExp = function () {
    const exp = this._rewards.exp;
    $gameParty.allMembers().forEach(function (actor) {
        actor.gainExp(exp);
    });
};

BattleManager.gainGold = function () {
    $gameParty.gainGold(this._rewards.gold);
};

BattleManager.gainDropItems = function () {
    const items = this._rewards.items;
    items.forEach(function (item) {
        $gameParty.gainItem(item, 1);
    });
};
