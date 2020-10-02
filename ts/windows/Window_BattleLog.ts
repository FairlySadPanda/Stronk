import { Bitmap } from "../core/Bitmap";
import { Graphics } from "../core/Graphics";
import { Input } from "../core/Input";
import { Sprite } from "../core/Sprite";
import { TouchInput } from "../core/TouchInput";
import { Utils } from "../core/Utils";
import { BattleManager } from "../managers/BattleManager";
import { DataManager } from "../managers/DataManager";
import { SoundManager } from "../managers/SoundManager";
import { TextManager } from "../managers/TextManager";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";
import { Window_Selectable } from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_BattleLog
//
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.

export class Window_BattleLog extends Window_Selectable {
    public opacity: number;
    private _lines: any[];
    private _methods: any[];
    private _waitCount: number;
    private _waitMode: string;
    private _baseLineStack: any[];
    private _spriteset: any;
    private _backBitmap: Bitmap;
    private _backSprite: Sprite;
    _actionIcon: any;

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

    public setSpriteset(spriteset) {
        this._spriteset = spriteset;
    }

    public windowWidth() {
        return Graphics.boxWidth;
    }

    public windowHeight() {
        return this.fittingHeight(this.maxLines());
    }

    public maxLines() {
        return 10;
    }

    public createBackBitmap() {
        this._backBitmap = new Bitmap(this.width, this.height);
    }

    public createBackSprite() {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = this._backBitmap;
        this._backSprite.y = this.y;
        this.addChildToBack(this._backSprite);
    }

    public numLines() {
        return this._lines.length;
    }

    public messageSpeed() {
        return 16;
    }

    public isBusy() {
        return (
            this._waitCount > 0 || this._waitMode || this._methods.length > 0
        );
    }

    public update() {
        if (!this.updateWait()) {
            this.callNextMethod();
        }
    }

    public updateWait() {
        return this.updateWaitCount() || this.updateWaitMode();
    }

    public setWaitMode(waitMode) {
        this._waitMode = waitMode;
    }

    public callNextMethod() {
        if (this._methods.length > 0) {
            const method = this._methods.shift();
            if (method.name && this[method.name]) {
                this[method.name].apply(this, method.params);
            } else {
                throw new Error("Method not found: " + method.name);
            }
        }
    }

    public isFastForward() {
        if (Yanfly.Param.BECOptSpeed) return true;
        return (
            Input.isLongPressed("ok") ||
            Input.isPressed("shift") ||
            TouchInput.isLongPressed()
        );
    }

    public push(...args) {
        const methodArgs = Array.prototype.slice.call(args, 1);
        this._methods.push({ name: args[0], params: methodArgs });
    }

    public clear() {
        this._lines = [];
        this._baseLineStack = [];
        this.refresh();
    }

    public wait() {
        this._waitCount = this.messageSpeed();
    }

    public waitForMovement() {
        this.setWaitMode("movement");
    }

    public addText(text) {
        this._lines.push(text);
        this.refresh();
        this.wait();
    }

    public pushBaseLine() {
        this._baseLineStack.push(this._lines.length);
    }

    public popBaseLine() {
        const baseLine = this._baseLineStack.pop();
        while (this._lines.length > baseLine) {
            this._lines.pop();
        }
    }

    public waitForNewLine() {
        let baseLine = 0;
        if (this._baseLineStack.length > 0) {
            baseLine = this._baseLineStack[this._baseLineStack.length - 1];
        }
        if (this._lines.length > baseLine) {
            this.wait();
        }
    }

    public performActionStart(subject, action) {
        subject.performActionStart(action);
    }

    public performAction(subject, action) {
        subject.performAction(action);
    }

    public performActionEnd(subject) {
        subject.performActionEnd();
    }

    public performDamage(target) {
        target.performDamage();
    }

    public performMiss(target) {
        target.performMiss();
    }

    public performRecovery(target) {
        target.performRecovery();
    }

    public performEvasion(target) {
        target.performEvasion();
    }

    public performMagicEvasion(target) {
        target.performMagicEvasion();
    }

    public performCounter(target) {
        target.performCounter();
    }

    public performReflection(target) {
        target.performReflection();
    }

    public performSubstitute(substitute, target) {
        substitute.performSubstitute(target);
    }

    public performCollapse(target) {
        target.performCollapse();
    }

    public showAnimation(subject, targets, animationId) {
        if (animationId < 0) {
            this.showAttackAnimation(subject, targets);
        } else {
            this.showNormalAnimation(targets, animationId);
        }
    }

    public showAttackAnimation(subject, targets) {
        if (subject.isActor()) {
            this.showActorAttackAnimation(subject, targets);
        } else {
            this.showEnemyAttackAnimation(subject, targets);
        }
    }

    public showActorAttackAnimation(subject, targets) {
        this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
        this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
    }

    public showEnemyAttackAnimation(subject, targets) {
        if ($gameSystem.isSideView()) {
            this.showNormalAnimation(
                targets,
                subject.attackAnimationId(),
                false
            );
        } else {
            this.showNormalAnimation(
                targets,
                subject.attackAnimationId(),
                false
            );
            SoundManager.playEnemyAttack();
        }
    }

    public showActorAtkAniMirror(subject, targets) {
        if (subject.isActor()) {
            this.showNormalAnimation(
                targets,
                subject.attackAnimationId1(),
                true
            );
            this.showNormalAnimation(
                targets,
                subject.attackAnimationId2(),
                false
            );
        } else {
            this.showNormalAnimation(
                targets,
                subject.attackAnimationId1(),
                true
            );
        }
    }

    public showNormalAnimation(targets, animationId, mirror?) {
        const animation = $dataAnimations[animationId];
        if (animation) {
            if (animation.position === 3) {
                targets.forEach(function(target) {
                    target.startAnimation(animationId, mirror, 0);
                });
            } else {
                let delay = this.animationBaseDelay();
                const nextDelay = this.animationNextDelay();
                targets.forEach(function(target) {
                    target.startAnimation(animationId, mirror, delay);
                    delay += nextDelay;
                });
            }
        }
    }

    public async refresh() {
        this.drawBackground();
        this.contents.clear();
        const promises = [];
        for (let i = 0; i < this._lines.length; i++) {
            promises.push(this.drawLineText(i));
        }
        await Promise.all(promises);
    }

    public drawBackground() {
        const rect = this.backRect();
        const color = this.backColor();
        this._backBitmap.clear();
        this._backBitmap.paintOpacity = this.backPaintOpacity();
        this._backBitmap.fillRect(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            color
        );
        this._backBitmap.paintOpacity = 255;
    }

    public backRect() {
        return {
            x: 0,
            y: this.padding,
            width: this.width,
            height: this.numLines() * this.lineHeight()
        };
    }

    public backColor() {
        return "#000000";
    }

    public backPaintOpacity() {
        return 64;
    }

    public drawLineText(index) {
        if (this._lines[index].match("<CENTER>")) {
            this.drawCenterLine(index);
        } else if (this._lines[index].match("<SIMPLE>")) {
            this.drawSimpleActionLine(index);
        } else {
            const rect = this.itemRectForText(index);
            this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
            this.drawTextEx(this._lines[index], rect.x, rect.y);
        }
    }

    public startTurn() {
        this.push("wait");
    }

    public displayCurrentState(subject) {
        if (!Yanfly.Param.BECShowStateText) return;
        const stateText = subject.mostImportantStateText();
        if (stateText) {
            this.push("addText", subject.name() + stateText);
            this.push("wait");
            this.push("clear");
        }
    }

    public displayRegeneration(subject) {
        this.push("popupDamage", subject);
    }

    public displayAction(subject, item) {
        if (Yanfly.Param.BECFullActText) {
            const numMethods = this._methods.length;
            if (DataManager.isSkill(item)) {
                if (item.message1) {
                    this.push(
                        "addText",
                        subject.name() + Utils.format(item.message1, item.name)
                    );
                }
                if (item.message2) {
                    this.push(
                        "addText",
                        Utils.format(item.message2, item.name)
                    );
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
        } else {
            this._actionIcon = this.displayIcon(item);
            var text = this.displayText(item);
            this.push("addText", "<SIMPLE>" + text);
            if (item.message2) {
                this.push("addText", "<CENTER>" + item.message2.format(text));
            }
        }
    }

    public displayIcon(item) {
        if (!item) return 0;
        return item.battleDisplayIcon;
    }

    public displayText(item) {
        if (!item) return "";
        return item.battleDisplayText;
    }

    public displayActionResults(subject, target) {
        if (Yanfly.Param.BECOptSpeed) {
            if (target.result.used) {
                this.displayCritical(target);
                this.displayDamage(target);
                this.displayAffectedStatus(target);
                this.displayFailure(target);
            }
        } else {
            if (target.result.used) {
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
        }

        if (target.isDead()) target.performCollapse();
    }

    public displayFailure(target) {
        if (!Yanfly.Param.BECShowFailText) return;
        if (target.result.isHit() && !target.result.success) {
            this.push(
                "addText",
                Utils.format(TextManager.actionFailure, target.name())
            );
        }
    }

    public displayCritical(target) {
        if (!Yanfly.Param.BECShowCritText) return;
        if (target.result.critical) {
            if (target.isActor()) {
                this.push("addText", TextManager.criticalToActor);
            } else {
                this.push("addText", TextManager.criticalToEnemy);
            }
        }
    }

    public displayDamage(target) {
        if (target.result.missed) {
            this.displayMiss(target);
        } else if (target.result.evaded) {
            this.displayEvasion(target);
        } else {
            this.displayHpDamage(target);
            this.displayMpDamage(target);
            this.displayTpDamage(target);
        }
    }

    public displayMiss(target) {
        if (!Yanfly.Param.BECShowMissText) return;
        let fmt;
        if (target.result.physical) {
            fmt = target.isActor()
                ? TextManager.actorNoHit
                : TextManager.enemyNoHit;
            this.push("performMiss", target);
        } else {
            fmt = TextManager.actionFailure;
        }
        this.push("addText", Utils.format(fmt, target.name()));
    }

    public displayEvasion(target) {
        if (!Yanfly.Param.BECShowEvaText) return;
        let fmt;
        if (target.result.physical) {
            fmt = TextManager.evasion;
            this.push("performEvasion", target);
        } else {
            fmt = TextManager.magicEvasion;
            this.push("performMagicEvasion", target);
        }
        this.push("addText", Utils.format(fmt, target.name()));
    }

    public displayHpDamage(target) {
        if (!Yanfly.Param.BECShowHpText) return;
        if (target.result.hpAffected) {
            if (target.result.hpDamage > 0 && !target.result.drain) {
                this.push("performDamage", target);
            }
            if (target.result.hpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeHpDamageText(target));
        }
    }

    public displayMpDamage(target) {
        if (!Yanfly.Param.BECShowMpText) return;
        if (target.isAlive() && target.result.mpDamage !== 0) {
            if (target.result.mpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeMpDamageText(target));
        }
    }

    public displayTpDamage(target) {
        if (!Yanfly.Param.BECShowTpText) return;
        if (target.isAlive() && target.result.tpDamage !== 0) {
            if (target.result.tpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeTpDamageText(target));
        }
    }

    public displayAffectedStatus(target) {
        if (target.result.isStatusAffected()) {
            this.push("pushBaseLine");
            this.displayChangedStates(target);
            this.displayChangedBuffs(target);
            this.push("waitForNewLine");
            this.push("popBaseLine");
        }
    }

    public displayAutoAffectedStatus(target) {
        if (target.result.isStatusAffected()) {
            this.displayAffectedStatus(target);
            this.push("clear");
        }
    }

    public displayChangedStates(target) {
        this.displayAddedStates(target);
        this.displayRemovedStates(target);
    }

    public displayAddedStates(target) {
        if (!Yanfly.Param.BECShowStateText) return;
        target.result.addedStateObjects().forEach(function(state) {
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
    }

    public displayRemovedStates(target) {
        if (!Yanfly.Param.BECShowStateText) return;
        target.result.removedStateObjects().forEach(function(state) {
            if (state.message4) {
                this.push("popBaseLine");
                this.push("pushBaseLine");
                this.push("addText", target.name() + state.message4);
            }
        }, this);
    }

    public displayChangedBuffs(target) {
        if (!Yanfly.Param.BECShowBuffText) return;
        const result = target.result;
        this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
        this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
        this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
    }

    public displayBuffs(target, buffs, fmt) {
        buffs.forEach(function(paramId) {
            this.push("popBaseLine");
            this.push("pushBaseLine");
            this.push(
                "addText",
                fmt.format(target.name(), TextManager.param(paramId))
            );
        }, this);
    }

    public makeHpDamageText(target) {
        const result = target.result;
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
            fmt = isActor
                ? TextManager.actorRecovery
                : TextManager.enemyRecovery;
            return Utils.format(fmt, target.name(), TextManager.hp, -damage);
        } else {
            fmt = isActor
                ? TextManager.actorNoDamage
                : TextManager.enemyNoDamage;
            return Utils.format(fmt, target.name());
        }
    }

    public makeMpDamageText(target) {
        const result = target.result;
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
            fmt = isActor
                ? TextManager.actorRecovery
                : TextManager.enemyRecovery;
            return Utils.format(fmt, target.name(), TextManager.mp, -damage);
        } else {
            return "";
        }
    }

    public makeTpDamageText(target) {
        const result = target.result;
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
    }

    public updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount -= 1;
            if (this._waitCount < 0) {
                this._waitCount = 0;
            }
            return true;
        }
        return false;
    }

    public animationBaseDelay() {
        return Yanfly.Param.BECAniBaseDel;
    }

    public animationNextDelay() {
        return Yanfly.Param.BECAniNextDel;
    }

    public updateWaitMode() {
        var waiting = false;
        switch (this._waitMode) {
            case "effect":
                waiting = this._spriteset.isEffecting();
                break;
            case "movement":
                waiting = this._spriteset.isAnyoneMoving();
                break;
            case "animation":
                waiting = this._spriteset.isAnimationPlaying();
                break;
            case "popups":
                waiting = this._spriteset.isPopupPlaying();
                break;
        }
        if (!waiting) {
            this._waitMode = "";
        }
        return waiting;
    }

    public startAction(subject, action, targets) {}

    public endAction(subject) {}

    public waitForAnimation() {
        this.setWaitMode("animation");
    }

    public waitForEffect() {
        this.setWaitMode("effect");
    }

    public waitForPopups() {
        this.setWaitMode("popups");
    }

    public textWidthEx(text) {
        return this.drawTextEx(
            text,
            0,
            this.contents.height + this.lineHeight()
        );
    }

    public drawCenterLine(index) {
        let text = this._lines[index].replace("<CENTER>", "");
        let rect = this.itemRectForText(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        let tw = this.textWidthEx(text);
        let wx = rect.x + (rect.width - tw) / 2;
        this.resetFontSettings();
        this.drawTextEx(text, wx, rect.y);
    }

    public drawSimpleActionLine(index) {
        let text = this._lines[index].replace("<SIMPLE>", "");
        let rect = this.itemRectForText(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        if (this._actionIcon) {
            let tw = this.textWidth(text);
            let ix = (rect.width - tw) / 2 - 4;
            this.drawIcon(this._actionIcon, ix, rect.y + 2);
        }
        this.drawText(
            text,
            rect.x,
            rect.y,
            Graphics.boxWidth,
            undefined,
            "center"
        );
    }

    public displayCounter(target) {
        if (Yanfly.Param.BECShowCntText) {
            this.addText(
                Utils.format(TextManager.counterAttack, target.name())
            );
        }
        target.performCounter();
        this.showAttackAnimation(target, [BattleManager.subject]);
        this.waitForAnimation();
    }

    public displayReflection(target) {
        if (Yanfly.Param.BECShowRflText) {
            this.addText(
                Utils.format(TextManager.magicReflection, target.name())
            );
        }
        target.performReflection();
        let animationId = BattleManager.action.item().animationId;
        this.showNormalAnimation([BattleManager.subject], animationId);
        this.waitForAnimation();
    }

    public displaySubstitute(substitute, target) {
        if (Yanfly.Param.BECShowSubText) {
            let substName = substitute.name();
            this.addText(
                Utils.format(TextManager.substitute, substName, target.name())
            );
        }
        substitute.performSubstitute(target);
    }

    public popupDamage(target) {}
}
