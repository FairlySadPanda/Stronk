import Bitmap from "../core/Bitmap";
import Graphics from "../core/Graphics";
import Input from "../core/Input";
import Sprite from "../core/Sprite";
import TouchInput from "../core/TouchInput";

import Utils from "../core/Utils";
import DataManager from "../managers/DataManager";
import SoundManager from "../managers/SoundManager";
import TextManager from "../managers/TextManager";
import Window_Selectable from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_BattleLog
//
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.

export default class Window_BattleLog extends Window_Selectable {
    public opacity: number;
    public _lines: any[];
    public _methods: any[];
    public _waitCount: number;
    public _waitMode: string;
    public _baseLineStack: any[];
    public _spriteset: any;
    public setSpriteset: (spriteset: any) => void;
    public maxLines: () => number;
    public numLines: () => any;
    public messageSpeed: () => number;
    public isBusy: () => any;
    public updateWait: () => any;
    public updateWaitCount: () => boolean;
    public updateWaitMode: () => boolean;
    public setWaitMode: (waitMode: any) => void;
    public callNextMethod: () => void;
    public isFastForward: () => any;
    public push: (methodName: any) => void;
    public clear: () => void;
    public wait: () => void;
    public waitForEffect: () => void;
    public waitForMovement: () => void;
    public addText: (text: any) => void;
    public pushBaseLine: () => void;
    public popBaseLine: () => void;
    public waitForNewLine: () => void;
    public popupDamage: (target: any) => void;
    public performActionStart: (subject: any, action: any) => void;
    public performAction: (subject: any, action: any) => void;
    public performActionEnd: (subject: any) => void;
    public performDamage: (target: any) => void;
    public performMiss: (target: any) => void;
    public performRecovery: (target: any) => void;
    public performEvasion: (target: any) => void;
    public performMagicEvasion: (target: any) => void;
    public performCounter: (target: any) => void;
    public performReflection: (target: any) => void;
    public performSubstitute: (substitute: any, target: any) => void;
    public performCollapse: (target: any) => void;
    public showAnimation: (
        subject: any,
        targets: any,
        animationId: any
    ) => void;
    public showAttackAnimation: (subject: any, targets: any) => void;
    public showActorAttackAnimation: (subject: any, targets: any) => void;
    public showEnemyAttackAnimation: (subject: any, targets: any) => void;
    public showNormalAnimation: (
        targets: any,
        animationId: any,
        mirror: any
    ) => void;
    public animationBaseDelay: () => number;
    public animationNextDelay: () => number;
    public drawBackground: () => void;
    public backRect: () => { x: number; y: any; width: any; height: number };
    public backColor: () => string;
    public backPaintOpacity: () => number;
    public drawLineText: (index: any) => void;
    public startTurn: () => void;
    public startAction: (subject: any, action: any, targets: any) => void;
    public endAction: (subject: any) => void;
    public displayCurrentState: (subject: any) => void;
    public displayRegeneration: (subject: any) => void;
    public displayAction: (subject: any, item: any) => void;
    public displayCounter: (target: any) => void;
    public displayReflection: (target: any) => void;
    public displaySubstitute: (substitute: any, target: any) => void;
    public displayActionResults: (subject: any, target: any) => void;
    public displayFailure: (target: any) => void;
    public displayCritical: (target: any) => void;
    public displayDamage: (target: any) => void;
    public displayMiss: (target: any) => void;
    public displayEvasion: (target: any) => void;
    public displayHpDamage: (target: any) => void;
    public displayMpDamage: (target: any) => void;
    public displayTpDamage: (target: any) => void;
    public displayAffectedStatus: (target: any) => void;
    public displayAutoAffectedStatus: (target: any) => void;
    public displayChangedStates: (target: any) => void;
    public displayAddedStates: (target: any) => void;
    public displayRemovedStates: (target: any) => void;
    public displayChangedBuffs: (target: any) => void;
    public displayBuffs: (target: any, buffs: any, fmt: any) => void;
    public makeHpDamageText: (target: any) => any;
    public makeMpDamageText: (target: any) => any;
    public makeTpDamageText: (target: any) => any;
    public constructor() {
        super(
            0,
            0,
            Window_BattleLog.prototype.windowWidth(),
            Window_BattleLog.prototype.windowHeight()
        );
        this.opacity = 0;
        this._lines = [];
        this._methods = [];
        this._waitCount = 0;
        this._waitMode = "";
        this._baseLineStack = [];
        this._spriteset = null;
        this.createBackBitmap();
        this.createBackSprite();
        this.refresh();
    }
    public windowWidth(): any {
        throw new Error("Method not implemented.");
    }
    public windowHeight(): any {
        throw new Error("Method not implemented.");
    }
    public createBackBitmap(): any {
        throw new Error("Method not implemented.");
    }
    public createBackSprite(): any {
        throw new Error("Method not implemented.");
    }
}

Window_BattleLog.prototype.setSpriteset = function(spriteset) {
    this._spriteset = spriteset;
};

Window_BattleLog.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_BattleLog.prototype.windowHeight = function() {
    return this.fittingHeight(this.maxLines());
};

Window_BattleLog.prototype.maxLines = function() {
    return 10;
};

Window_BattleLog.prototype.createBackBitmap = function() {
    this._backBitmap = new Bitmap(this.width, this.height);
};

Window_BattleLog.prototype.createBackSprite = function() {
    this._backSprite = new Sprite();
    this._backSprite.bitmap = this._backBitmap;
    this._backSprite.y = this.y;
    this.addChildToBack(this._backSprite);
};

Window_BattleLog.prototype.numLines = function() {
    return this._lines.length;
};

Window_BattleLog.prototype.messageSpeed = function() {
    return 16;
};

Window_BattleLog.prototype.isBusy = function() {
    return this._waitCount > 0 || this._waitMode || this._methods.length > 0;
};

Window_BattleLog.prototype.update = function() {
    if (!this.updateWait()) {
        this.callNextMethod();
    }
};

Window_BattleLog.prototype.updateWait = function() {
    return this.updateWaitCount() || this.updateWaitMode();
};

Window_BattleLog.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount -= this.isFastForward() ? 3 : 1;
        if (this._waitCount < 0) {
            this._waitCount = 0;
        }
        return true;
    }
    return false;
};

Window_BattleLog.prototype.updateWaitMode = function() {
    let waiting = false;
    switch (this._waitMode) {
        case "effect":
            waiting = this._spriteset.isEffecting();
            break;
        case "movement":
            waiting = this._spriteset.isAnyoneMoving();
            break;
    }
    if (!waiting) {
        this._waitMode = "";
    }
    return waiting;
};

Window_BattleLog.prototype.setWaitMode = function(waitMode) {
    this._waitMode = waitMode;
};

Window_BattleLog.prototype.callNextMethod = function() {
    if (this._methods.length > 0) {
        const method = this._methods.shift();
        if (method.name && this[method.name]) {
            this[method.name].apply(this, method.params);
        } else {
            throw new Error("Method not found: " + method.name);
        }
    }
};

Window_BattleLog.prototype.isFastForward = function() {
    return (
        Input.isLongPressed("ok") ||
        Input.isPressed("shift") ||
        TouchInput.isLongPressed()
    );
};

Window_BattleLog.prototype.push = function(methodName) {
    const methodArgs = Array.prototype.slice.call(arguments, 1);
    this._methods.push({ name: methodName, params: methodArgs });
};

Window_BattleLog.prototype.clear = function() {
    this._lines = [];
    this._baseLineStack = [];
    this.refresh();
};

Window_BattleLog.prototype.wait = function() {
    this._waitCount = this.messageSpeed();
};

Window_BattleLog.prototype.waitForEffect = function() {
    this.setWaitMode("effect");
};

Window_BattleLog.prototype.waitForMovement = function() {
    this.setWaitMode("movement");
};

Window_BattleLog.prototype.addText = function(text) {
    this._lines.push(text);
    this.refresh();
    this.wait();
};

Window_BattleLog.prototype.pushBaseLine = function() {
    this._baseLineStack.push(this._lines.length);
};

Window_BattleLog.prototype.popBaseLine = function() {
    const baseLine = this._baseLineStack.pop();
    while (this._lines.length > baseLine) {
        this._lines.pop();
    }
};

Window_BattleLog.prototype.waitForNewLine = function() {
    let baseLine = 0;
    if (this._baseLineStack.length > 0) {
        baseLine = this._baseLineStack[this._baseLineStack.length - 1];
    }
    if (this._lines.length > baseLine) {
        this.wait();
    }
};

Window_BattleLog.prototype.popupDamage = function(target) {
    target.startDamagePopup();
};

Window_BattleLog.prototype.performActionStart = function(subject, action) {
    subject.performActionStart(action);
};

Window_BattleLog.prototype.performAction = function(subject, action) {
    subject.performAction(action);
};

Window_BattleLog.prototype.performActionEnd = function(subject) {
    subject.performActionEnd();
};

Window_BattleLog.prototype.performDamage = function(target) {
    target.performDamage();
};

Window_BattleLog.prototype.performMiss = function(target) {
    target.performMiss();
};

Window_BattleLog.prototype.performRecovery = function(target) {
    target.performRecovery();
};

Window_BattleLog.prototype.performEvasion = function(target) {
    target.performEvasion();
};

Window_BattleLog.prototype.performMagicEvasion = function(target) {
    target.performMagicEvasion();
};

Window_BattleLog.prototype.performCounter = function(target) {
    target.performCounter();
};

Window_BattleLog.prototype.performReflection = function(target) {
    target.performReflection();
};

Window_BattleLog.prototype.performSubstitute = function(substitute, target) {
    substitute.performSubstitute(target);
};

Window_BattleLog.prototype.performCollapse = function(target) {
    target.performCollapse();
};

Window_BattleLog.prototype.showAnimation = function(
    subject,
    targets,
    animationId
) {
    if (animationId < 0) {
        this.showAttackAnimation(subject, targets);
    } else {
        this.showNormalAnimation(targets, animationId);
    }
};

Window_BattleLog.prototype.showAttackAnimation = function(subject, targets) {
    if (subject.isActor()) {
        this.showActorAttackAnimation(subject, targets);
    } else {
        this.showEnemyAttackAnimation(subject, targets);
    }
};

Window_BattleLog.prototype.showActorAttackAnimation = function(
    subject,
    targets
) {
    this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
    this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
};

Window_BattleLog.prototype.showEnemyAttackAnimation = function(
    subject,
    targets
) {
    SoundManager.playEnemyAttack();
};

Window_BattleLog.prototype.showNormalAnimation = function(
    targets,
    animationId,
    mirror
) {
    const animation = $dataAnimations[animationId];
    if (animation) {
        let delay = this.animationBaseDelay();
        const nextDelay = this.animationNextDelay();
        targets.forEach(function(target) {
            target.startAnimation(animationId, mirror, delay);
            delay += nextDelay;
        });
    }
};

Window_BattleLog.prototype.animationBaseDelay = function() {
    return 8;
};

Window_BattleLog.prototype.animationNextDelay = function() {
    return 12;
};

Window_BattleLog.prototype.refresh = function() {
    this.drawBackground();
    this.contents.clear();
    for (let i = 0; i < this._lines.length; i++) {
        this.drawLineText(i);
    }
};

Window_BattleLog.prototype.drawBackground = function() {
    const rect = this.backRect();
    const color = this.backColor();
    this._backBitmap.clear();
    this._backBitmap.paintOpacity = this.backPaintOpacity();
    this._backBitmap.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this._backBitmap.paintOpacity = 255;
};

Window_BattleLog.prototype.backRect = function() {
    return {
        x: 0,
        y: this.padding,
        width: this.width,
        height: this.numLines() * this.lineHeight()
    };
};

Window_BattleLog.prototype.backColor = function() {
    return "#000000";
};

Window_BattleLog.prototype.backPaintOpacity = function() {
    return 64;
};

Window_BattleLog.prototype.drawLineText = function(index) {
    const rect = this.itemRectForText(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
};

Window_BattleLog.prototype.startTurn = function() {
    this.push("wait");
};

Window_BattleLog.prototype.startAction = function(subject, action, targets) {
    const item = action.item();
    this.push("performActionStart", subject, action);
    this.push("waitForMovement");
    this.push("performAction", subject, action);
    this.push(
        "showAnimation",
        subject,
        Utils.arrayClone(targets),
        item.animationId
    );
    this.displayAction(subject, item);
};

Window_BattleLog.prototype.endAction = function(subject) {
    this.push("waitForNewLine");
    this.push("clear");
    this.push("performActionEnd", subject);
};

Window_BattleLog.prototype.displayCurrentState = function(subject) {
    const stateText = subject.mostImportantStateText();
    if (stateText) {
        this.push("addText", subject.name() + stateText);
        this.push("wait");
        this.push("clear");
    }
};

Window_BattleLog.prototype.displayRegeneration = function(subject) {
    this.push("popupDamage", subject);
};

Window_BattleLog.prototype.displayAction = function(subject, item) {
    const numMethods = this._methods.length;
    if (DataManager.isSkill(item)) {
        if (item.message1) {
            this.push(
                "addText",
                subject.name() + Utils.format(item.message1, item.name)
            );
        }
        if (item.message2) {
            this.push("addText", Utils.format(item.message2, item.name));
        }
    } else {
        this.push(
            "addText",
            Utils.format(TextManager.useItem, subject.name(), item.name)
        );
    }
    if (this._methods.length === numMethods) {
        this.push("wait");
    }
};

Window_BattleLog.prototype.displayCounter = function(target) {
    this.push("performCounter", target);
    this.push(
        "addText",
        Utils.format(TextManager.counterAttack, target.name())
    );
};

Window_BattleLog.prototype.displayReflection = function(target) {
    this.push("performReflection", target);
    this.push(
        "addText",
        Utils.format(TextManager.magicReflection, target.name())
    );
};

Window_BattleLog.prototype.displaySubstitute = function(substitute, target) {
    const substName = substitute.name();
    this.push("performSubstitute", substitute, target);
    this.push(
        "addText",
        Utils.format(TextManager.substitute, substName, target.name())
    );
};

Window_BattleLog.prototype.displayActionResults = function(subject, target) {
    if (target.result().used) {
        this.push("pushBaseLine");
        this.displayCritical(target);
        this.push("popupDamage", target);
        this.push("popupDamage", subject);
        this.displayDamage(target);
        this.displayAffectedStatus(target);
        this.displayFailure(target);
        this.push("waitForNewLine");
        this.push("popBaseLine");
    }
};

Window_BattleLog.prototype.displayFailure = function(target) {
    if (target.result().isHit() && !target.result().success) {
        this.push(
            "addText",
            Utils.format(TextManager.actionFailure, target.name())
        );
    }
};

Window_BattleLog.prototype.displayCritical = function(target) {
    if (target.result().critical) {
        if (target.isActor()) {
            this.push("addText", TextManager.criticalToActor);
        } else {
            this.push("addText", TextManager.criticalToEnemy);
        }
    }
};

Window_BattleLog.prototype.displayDamage = function(target) {
    if (target.result().missed) {
        this.displayMiss(target);
    } else if (target.result().evaded) {
        this.displayEvasion(target);
    } else {
        this.displayHpDamage(target);
        this.displayMpDamage(target);
        this.displayTpDamage(target);
    }
};

Window_BattleLog.prototype.displayMiss = function(target) {
    let fmt;
    if (target.result().physical) {
        fmt = target.isActor()
            ? TextManager.actorNoHit
            : TextManager.enemyNoHit;
        this.push("performMiss", target);
    } else {
        fmt = TextManager.actionFailure;
    }
    this.push("addText", Utils.format(fmt, target.name()));
};

Window_BattleLog.prototype.displayEvasion = function(target) {
    let fmt;
    if (target.result().physical) {
        fmt = TextManager.evasion;
        this.push("performEvasion", target);
    } else {
        fmt = TextManager.magicEvasion;
        this.push("performMagicEvasion", target);
    }
    this.push("addText", Utils.format(fmt, target.name()));
};

Window_BattleLog.prototype.displayHpDamage = function(target) {
    if (target.result().hpAffected) {
        if (target.result().hpDamage > 0 && !target.result().drain) {
            this.push("performDamage", target);
        }
        if (target.result().hpDamage < 0) {
            this.push("performRecovery", target);
        }
        this.push("addText", this.makeHpDamageText(target));
    }
};

Window_BattleLog.prototype.displayMpDamage = function(target) {
    if (target.isAlive() && target.result().mpDamage !== 0) {
        if (target.result().mpDamage < 0) {
            this.push("performRecovery", target);
        }
        this.push("addText", this.makeMpDamageText(target));
    }
};

Window_BattleLog.prototype.displayTpDamage = function(target) {
    if (target.isAlive() && target.result().tpDamage !== 0) {
        if (target.result().tpDamage < 0) {
            this.push("performRecovery", target);
        }
        this.push("addText", this.makeTpDamageText(target));
    }
};

Window_BattleLog.prototype.displayAffectedStatus = function(target) {
    if (target.result().isStatusAffected()) {
        this.push("pushBaseLine");
        this.displayChangedStates(target);
        this.displayChangedBuffs(target);
        this.push("waitForNewLine");
        this.push("popBaseLine");
    }
};

Window_BattleLog.prototype.displayAutoAffectedStatus = function(target) {
    if (target.result().isStatusAffected()) {
        this.displayAffectedStatus(target, null);
        this.push("clear");
    }
};

Window_BattleLog.prototype.displayChangedStates = function(target) {
    this.displayAddedStates(target);
    this.displayRemovedStates(target);
};

Window_BattleLog.prototype.displayAddedStates = function(target) {
    target
        .result()
        .addedStateObjects()
        .forEach(function(state) {
            const stateMsg = target.isActor() ? state.message1 : state.message2;
            if (state.id === target.deathStateId()) {
                this.push("performCollapse", target);
            }
            if (stateMsg) {
                this.push("popBaseLine");
                this.push("pushBaseLine");
                this.push("addText", target.name() + stateMsg);
                this.push("waitForEffect");
            }
        }, this);
};

Window_BattleLog.prototype.displayRemovedStates = function(target) {
    target
        .result()
        .removedStateObjects()
        .forEach(function(state) {
            if (state.message4) {
                this.push("popBaseLine");
                this.push("pushBaseLine");
                this.push("addText", target.name() + state.message4);
            }
        }, this);
};

Window_BattleLog.prototype.displayChangedBuffs = function(target) {
    const result = target.result();
    this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
    this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
    this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
};

Window_BattleLog.prototype.displayBuffs = function(target, buffs, fmt) {
    buffs.forEach(function(paramId) {
        this.push("popBaseLine");
        this.push("pushBaseLine");
        this.push(
            "addText",
            fmt.format(target.name(), TextManager.param(paramId))
        );
    }, this);
};

Window_BattleLog.prototype.makeHpDamageText = function(target) {
    const result = target.result();
    const damage = result.hpDamage;
    const isActor = target.isActor();
    let fmt;
    if (damage > 0 && result.drain) {
        fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
        return Utils.format(fmt, target.name(), TextManager.hp, damage);
    } else if (damage > 0) {
        fmt = isActor ? TextManager.actorDamage : TextManager.enemyDamage;
        return Utils.format(fmt, target.name(), damage);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
        return Utils.format(fmt, target.name(), TextManager.hp, -damage);
    } else {
        fmt = isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage;
        return Utils.format(fmt, target.name());
    }
};

Window_BattleLog.prototype.makeMpDamageText = function(target) {
    const result = target.result();
    const damage = result.mpDamage;
    const isActor = target.isActor();
    let fmt;
    if (damage > 0 && result.drain) {
        fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
        return Utils.format(fmt, target.name(), TextManager.mp, damage);
    } else if (damage > 0) {
        fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
        return Utils.format(fmt, target.name(), TextManager.mp, damage);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
        return Utils.format(fmt, target.name(), TextManager.mp, -damage);
    } else {
        return "";
    }
};

Window_BattleLog.prototype.makeTpDamageText = function(target) {
    const result = target.result();
    const damage = result.tpDamage;
    const isActor = target.isActor();
    let fmt;
    if (damage > 0) {
        fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
        return Utils.format(fmt, target.name(), TextManager.tp, damage);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
        return Utils.format(fmt, target.name(), TextManager.tp, -damage);
    } else {
        return "";
    }
};
