import Graphics from "../core/Graphics";
import AudioManager from "../managers/AudioManager";
import BattleManager from "../managers/BattleManager";
import ImageManager from "../managers/ImageManager";
import SceneManager from "../managers/SceneManager";
import Spriteset_Battle from "../sprites/Spriteset_Battle";
import Window_ActorCommand from "../windows/Window_ActorCommand";
import Window_BattleActor from "../windows/Window_BattleActor";
import Window_BattleEnemy from "../windows/Window_BattleEnemy";
import Window_BattleItem from "../windows/Window_BattleItem";
import Window_BattleLog from "../windows/Window_BattleLog";
import Window_BattleSkill from "../windows/Window_BattleSkill";
import Window_BattleStatus from "../windows/Window_BattleStatus";
import Window_Help from "../windows/Window_Help";
import Window_Message from "../windows/Window_Message";
import Window_PartyCommand from "../windows/Window_PartyCommand";
import Window_ScrollText from "../windows/Window_ScrollText";
import Scene_Base from "./Scene_Base";
import Scene_Gameover from "./Scene_Gameover";
import Scene_Title from "./Scene_Title";
import Window_ItemList from "../windows/Window_ItemList";
import Window_SkillList from "../windows/Window_SkillList";

export default class Scene_Battle extends Scene_Base {
    private _partyCommandWindow: Window_PartyCommand;
    private _actorCommandWindow: Window_ActorCommand;
    private _skillWindow: Window_SkillList;
    private _itemWindow: Window_ItemList;
    private _actorWindow: Window_BattleActor;
    private _enemyWindow: Window_BattleEnemy;
    private _statusWindow: Window_BattleStatus;
    private _messageWindow: Window_Message;
    private _helpWindow: Window_Help;
    private _scrollTextWindow: Window_ScrollText;
    private _spriteset: Spriteset_Battle;
    private _logWindow: Window_BattleLog;

    public create() {
        super.create();
        this.createDisplayObjects();
    }

    public start() {
        super.start();
        this.startFadeIn(this.fadeSpeed(), false);
        BattleManager.playBattleBgm();
        BattleManager.startBattle();
    }

    public update() {
        const active = this.isActive();
        $gameTimer.update(active);
        $gameScreen.update();
        this.updateStatusWindow();
        this.updateWindowPositions();
        if (active && !this.isBusy()) {
            this.updateBattleProcess();
        }
        super.update();
    }

    public updateBattleProcess() {
        if (
            !this.isAnyInputWindowActive() ||
            BattleManager.isAborting() ||
            BattleManager.isBattleEnd()
        ) {
            BattleManager.update();
            this.changeInputWindow();
        }
    }

    public isAnyInputWindowActive() {
        return (
            this._partyCommandWindow.active ||
            this._actorCommandWindow.active ||
            this._skillWindow.active ||
            this._itemWindow.active ||
            this._actorWindow.active ||
            this._enemyWindow.active
        );
    }

    public changeInputWindow() {
        if (BattleManager.isInputting()) {
            if (BattleManager.actor()) {
                this.startActorCommandSelection();
            } else {
                this.startPartyCommandSelection();
            }
        } else {
            this.endCommandSelection();
        }
    }

    public stop() {
        super.stop();
        if (this.needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        } else {
            this.startFadeOut(this.fadeSpeed(), false);
        }
        this._statusWindow.close();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    }

    public terminate() {
        super.terminate();
        $gameParty.onBattleEnd();
        $gameTroop.onBattleEnd();
        AudioManager.stopMe();

        ImageManager.clearRequest();
    }

    public needsSlowFadeOut() {
        return (
            SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover)
        );
    }

    public updateStatusWindow() {
        if ($gameMessage.isBusy()) {
            this._statusWindow.close();
            this._partyCommandWindow.close();
            this._actorCommandWindow.close();
        } else if (this.isActive() && !this._messageWindow.isClosing()) {
            this._statusWindow.open();
        }
    }

    public updateWindowPositions() {
        let statusX = 0;
        if (BattleManager.isInputting()) {
            statusX = this._partyCommandWindow.width;
        } else {
            statusX = this._partyCommandWindow.width / 2;
        }
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x += 16;
            if (this._statusWindow.x > statusX) {
                this._statusWindow.x = statusX;
            }
        }
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x -= 16;
            if (this._statusWindow.x < statusX) {
                this._statusWindow.x = statusX;
            }
        }
    }

    public createDisplayObjects() {
        this.createSpriteset().then(() => {
            this.createWindowLayer();
            this.createAllWindows();
            BattleManager.setLogWindow(this._logWindow);
            BattleManager.setStatusWindow(this._statusWindow);
            BattleManager.setSpriteset(this._spriteset);
            this._logWindow.setSpriteset(this._spriteset);
        });
    }

    public async createSpriteset() {
        this._spriteset = new Spriteset_Battle();
        await this._spriteset.waitForloadingComplete();
        this.addChild(this._spriteset);
    }

    public createAllWindows() {
        this.createLogWindow();
        this.createStatusWindow();
        this.createPartyCommandWindow();
        this.createActorCommandWindow();
        this.createHelpWindow();
        this.createSkillWindow();
        this.createItemWindow();
        this.createActorWindow();
        this.createEnemyWindow();
        this.createMessageWindow();
        this.createScrollTextWindow();
    }

    public createLogWindow() {
        this._logWindow = new Window_BattleLog();
        this.addWindow(this._logWindow);
    }

    public createStatusWindow() {
        this._statusWindow = new Window_BattleStatus();
        this.addWindow(this._statusWindow);
    }

    public createPartyCommandWindow() {
        this._partyCommandWindow = new Window_PartyCommand();
        this._partyCommandWindow.setHandler(
            "fight",
            this.commandFight.bind(this)
        );
        this._partyCommandWindow.setHandler(
            "escape",
            this.commandEscape.bind(this)
        );
        this._partyCommandWindow.deselect();
        this.addWindow(this._partyCommandWindow);
    }

    public createActorCommandWindow() {
        this._actorCommandWindow = new Window_ActorCommand();
        this._actorCommandWindow.setHandler(
            "attack",
            this.commandAttack.bind(this)
        );
        this._actorCommandWindow.setHandler(
            "skill",
            this.commandSkill.bind(this)
        );
        this._actorCommandWindow.setHandler(
            "guard",
            this.commandGuard.bind(this)
        );
        this._actorCommandWindow.setHandler(
            "item",
            this.commandItem.bind(this)
        );
        this._actorCommandWindow.setHandler(
            "cancel",
            this.selectPreviousCommand.bind(this)
        );
        this.addWindow(this._actorCommandWindow);
    }

    public createHelpWindow() {
        this._helpWindow = new Window_Help();
        this._helpWindow.visible = false;
        this.addWindow(this._helpWindow);
    }

    public createSkillWindow() {
        const wy = this._helpWindow.y + this._helpWindow.height;
        const wh = this._statusWindow.y - wy;
        this._skillWindow = new Window_BattleSkill(
            0,
            wy,
            Graphics.boxWidth,
            wh
        );
        this._skillWindow.setHelpWindow(this._helpWindow);
        this._skillWindow.setHandler("ok", this.onSkillOk.bind(this));
        this._skillWindow.setHandler("cancel", this.onSkillCancel.bind(this));
        this.addWindow(this._skillWindow);
    }

    public createItemWindow() {
        const wy = this._helpWindow.y + this._helpWindow.height;
        const wh = this._statusWindow.y - wy;
        this._itemWindow = new Window_BattleItem(0, wy, Graphics.boxWidth, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
    }

    public createActorWindow() {
        this._actorWindow = new Window_BattleActor(0, this._statusWindow.y);
        this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    }

    public createEnemyWindow() {
        this._enemyWindow = new Window_BattleEnemy(0, this._statusWindow.y);
        this._enemyWindow.x = Graphics.boxWidth - this._enemyWindow.width;
        this._enemyWindow.setHandler("ok", this.onEnemyOk.bind(this));
        this._enemyWindow.setHandler("cancel", this.onEnemyCancel.bind(this));
        this.addWindow(this._enemyWindow);
    }

    public createMessageWindow() {
        this._messageWindow = new Window_Message();
        this.addWindow(this._messageWindow);
        this._messageWindow.subWindows().forEach(function(window) {
            this.addWindow(window);
        }, this);
    }

    public createScrollTextWindow() {
        this._scrollTextWindow = new Window_ScrollText();
        this.addWindow(this._scrollTextWindow);
    }

    public refreshStatus() {
        this._statusWindow.refresh();
    }

    public startPartyCommandSelection() {
        this.refreshStatus();
        this._statusWindow.deselect();
        this._statusWindow.open();
        this._actorCommandWindow.close();
        this._partyCommandWindow.setup();
    }

    public commandFight() {
        this.selectNextCommand();
    }

    public commandEscape() {
        BattleManager.processEscape();
        this.changeInputWindow();
    }

    public startActorCommandSelection() {
        this._statusWindow.select(BattleManager.actor().index());
        this._partyCommandWindow.close();
        this._actorCommandWindow.setup(BattleManager.actor());
    }

    public commandAttack() {
        BattleManager.inputtingAction().setAttack();
        this.selectEnemySelection();
    }

    public commandSkill() {
        this._skillWindow.setActor(BattleManager.actor());
        this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
        this._skillWindow.refresh();
        this._skillWindow.show();
        this._skillWindow.activate();
    }

    public commandGuard() {
        BattleManager.inputtingAction().setGuard();
        this.selectNextCommand();
    }

    public commandItem() {
        this._itemWindow.refresh();
        this._itemWindow.show();
        this._itemWindow.activate();
    }

    public selectNextCommand() {
        BattleManager.selectNextCommand();
        this.changeInputWindow();
    }

    public selectPreviousCommand() {
        BattleManager.selectPreviousCommand();
        this.changeInputWindow();
    }

    public selectActorSelection() {
        this._actorWindow.refresh();
        this._actorWindow.show();
        this._actorWindow.activate();
    }

    public onActorOk() {
        const action = BattleManager.inputtingAction();
        action.setTarget(this._actorWindow.index());
        this._actorWindow.hide();
        this._skillWindow.hide();
        this._itemWindow.hide();
        this.selectNextCommand();
    }

    public onActorCancel() {
        this._actorWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case "skill":
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case "item":
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    }

    public selectEnemySelection() {
        this._enemyWindow.refresh();
        this._enemyWindow.show();
        this._enemyWindow.select(0);
        this._enemyWindow.activate();
    }

    public onEnemyOk() {
        const action = BattleManager.inputtingAction();
        action.setTarget(this._enemyWindow.enemyIndex());
        this._enemyWindow.hide();
        this._skillWindow.hide();
        this._itemWindow.hide();
        this.selectNextCommand();
    }

    public onEnemyCancel() {
        this._enemyWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case "attack":
                this._actorCommandWindow.activate();
                break;
            case "skill":
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case "item":
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    }

    public onSkillOk() {
        const skill = this._skillWindow.item();
        const action = BattleManager.inputtingAction();
        action.setSkill(skill.id);
        BattleManager.actor().setLastBattleSkill(skill);
        this.onSelectAction();
    }

    public onSkillCancel() {
        this._skillWindow.hide();
        this._actorCommandWindow.activate();
    }

    public onItemOk() {
        const item = this._itemWindow.item();
        const action = BattleManager.inputtingAction();
        action.setItem(item.id);
        $gameParty.setLastItem(item);
        this.onSelectAction();
    }

    public onItemCancel() {
        this._itemWindow.hide();
        this._actorCommandWindow.activate();
    }

    public onSelectAction() {
        const action = BattleManager.inputtingAction();
        this._skillWindow.hide();
        this._itemWindow.hide();
        if (!action.needsSelection()) {
            this.selectNextCommand();
        } else if (action.isForOpponent()) {
            this.selectEnemySelection();
        } else {
            this.selectActorSelection();
        }
    }

    public endCommandSelection() {
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
        this._statusWindow.deselect();
    }
}
