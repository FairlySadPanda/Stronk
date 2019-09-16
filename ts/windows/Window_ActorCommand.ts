import { Graphics } from "../core/Graphics";
import { ConfigManager } from "../managers/ConfigManager";

import { TextManager } from "../managers/TextManager";
import { Game_Actor } from "../objects/Game_Actor";
import { Window_Command } from "./Window_Command";
import { Skill } from "../interfaces/Skill";

// -----------------------------------------------------------------------------
// Window_ActorCommand
//
// The window for selecting an actor's action on the battle screen.

export class Window_ActorCommand extends Window_Command {
    public openness: number;
    private _actor: Game_Actor;

    public constructor() {
        super(
            0,
            Graphics.boxHeight - Window_ActorCommand.prototype.windowHeight()
        );
        this.openness = 0;
        this.deactivate();
        this._actor = null;
    }

    public windowWidth() {
        return 192;
    }

    public numVisibleRows() {
        return 4;
    }

    public makeCommandList() {
        if (this._actor) {
            this.addAttackCommand();
            this.addSkillCommands();
            this.addGuardCommand();
            this.addItemCommand();
        }
    }

    public addAttackCommand() {
        this.addCommand(TextManager.attack, "attack", this._actor.canAttack());
    }

    public addSkillCommands() {
        const skillTypes = this._actor.addedSkillTypes();
        skillTypes.sort(function(a: number, b: number) {
            return a - b;
        });
        skillTypes.forEach(function(stypeId: string | number) {
            const name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, "skill", true, stypeId);
        }, this);
    }

    public addGuardCommand() {
        this.addCommand(TextManager.guard, "guard", this._actor.canGuard());
    }

    public addItemCommand() {
        this.addCommand(TextManager.item, "item");
    }

    public setup(actor) {
        this._actor = actor;
        this.clearCommandList();
        this.makeCommandList();
        this.refresh();
        this.selectLast();
        this.activate();
        this.open();
    }

    public processOk() {
        if (this._actor) {
            if (ConfigManager.commandRemember) {
                this._actor.setLastCommandSymbol(this.currentSymbol());
            } else {
                this._actor.setLastCommandSymbol("");
            }
        }
        super.processOk();
    }

    public selectLast() {
        this.select(0);
        if (this._actor && ConfigManager.commandRemember) {
            const symbol = this._actor.lastCommandSymbol();
            this.selectSymbol(symbol);
            if (symbol === "skill") {
                const skill = this._actor.lastBattleSkill();
                if (skill) {
                    this.selectExt((skill as Skill).stypeId);
                }
            }
        }
    }
}
