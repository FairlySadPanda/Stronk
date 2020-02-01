import { Rectangle } from "../core/Rectangle";
import { TouchInput } from "../core/TouchInput";
import { ConfigManager } from "../managers/ConfigManager";
import { SoundManager } from "../managers/SoundManager";
import { Game_Enemy } from "../objects/Game_Enemy";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";
import { Window_Selectable } from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_BattleEnemy
//
// The window for selecting a target enemy on the battle screen.

export class Window_BattleEnemy extends Window_Selectable {
    private _selectDead: boolean;

    public get selectDead(): boolean {
        return this._selectDead;
    }

    public set selectDead(value: boolean) {
        this._selectDead = value;
    }

    public get _enemies(): Game_Enemy[] {
        if (!this.__enemies) {
            this.__enemies = $gameTroop.aliveMembers();
        }
        return this.__enemies;
    }

    private __enemies: Game_Enemy[];

    public constructor(x: number, y: number) {
        if (Yanfly.Param.BECEnemySelect) {
            x -= ConfigManager.currentResolution.widthPx * 200;
            y -= ConfigManager.currentResolution.heightPx * 200;
        }
        super(
            x,
            y,
            Window_BattleEnemy.prototype.windowWidth(),
            Window_BattleEnemy.prototype.windowHeight()
        );
        this.refresh();
        this.hide();
    }

    public windowWidth() {
        return ConfigManager.currentResolution.widthPx - 192;
    }

    public windowHeight() {
        return this.fittingHeight(this.numVisibleRows());
    }

    public numVisibleRows() {
        return 4;
    }

    public maxCols() {
        if (Yanfly.Param.BECEnemySelect) return this._enemies.length;
        return 2;
    }

    public maxItems() {
        return this._enemies.length;
    }

    public allowedTargets() {
        let targets = [];
        targets = targets.concat($gameTroop.aliveMembers());
        return targets;
    }

    public enemy() {
        return this._enemies[this.index()];
    }

    public enemyIndex() {
        const enemy = this.enemy();
        return enemy ? enemy.index() : -1;
    }

    public async drawItem(index) {
        this.resetTextColor();
        const name = this._enemies[index].name();
        const rect = this.itemRectForText(index);
        await this.drawText(name, rect.x, rect.y, rect.width);
    }

    public show() {
        this.refresh();
        this.select(0);
        super.show();
    }

    public hide() {
        super.hide();
        $gameTroop.select(null);
    }

    public async refresh() {
        this.__enemies = this.allowedTargets();
        this.sortTargets();
        await super.refresh();
    }

    public select(index) {
        super.select(index);
        $gameTroop.select(this.enemy());
    }

    public sortTargets() {
        this._enemies.sort(function(a, b) {
            if (a.spritePosX() === b.spritePosX()) {
                return a.spritePosY() - b.spritePosY();
            }
            return a.spritePosX() - b.spritePosX();
        });
    }

    public autoSelect() {
        if (
            Yanfly.Param.BECEnemyAutoSel === 0 ||
            Yanfly.Param.BECEnemyAutoSel === "0"
        ) {
            var selectIndex = 0;
        } else {
            var selectIndex = this.furthestRight();
        }
        this.select(selectIndex);
    }

    public furthestRight() {
        return this.maxItems() - 1;
    }

    public updateHelp() {
        if (!this._helpWindow) return;
        this._helpWindow.setBattler(this.enemy());
    }

    public processTouch() {
        if (Yanfly.Param.BECEnemySelect && this.isOpenAndActive()) {
            if (TouchInput.isTriggered() && !this.isTouchedInsideFrame()) {
                if (this.getClickedEnemy() >= 0) {
                    var index = this.getClickedEnemy();
                    if (this.index() === index) {
                        return this.processOk();
                    } else {
                        SoundManager.playCursor();
                        return this.select(index);
                    }
                }
            }
            if (TouchInput.isPressed() && !this.isTouchedInsideFrame()) {
                if (this.getClickedEnemy() >= 0) {
                    var index = this.getClickedEnemy();
                    if (this.index() !== index) {
                        SoundManager.playCursor();
                        return this.select(index);
                    }
                }
            }
            if (Yanfly.Param.BECSelectMouseOver) {
                var index = this.getMouseOverEnemy();
                if (index >= 0 && this.index() !== index) {
                    SoundManager.playCursor();
                    return this.select(index);
                }
            }
        }
        super.processTouch();
    }

    public getClickedEnemy() {
        for (let i = 0; i < this._enemies.length; ++i) {
            let enemy = this._enemies[i];
            if (!enemy) continue;
            if (this.isClickedEnemy(enemy)) {
                if (this._selectDead && !enemy.isDead()) continue;
                let index = this._enemies.indexOf(enemy);
                if (this._inputLock && index !== this.index()) continue;
                return index;
            }
        }
        return -1;
    }

    public isClickedEnemy(enemy) {
        if (!enemy) return false;
        if (!enemy.isSpriteVisible()) return false;
        if ($gameTemp.mouseOverSelectDisabled()) return false;
        let x = TouchInput.x;
        let y = TouchInput.y;
        let rect = new Rectangle();
        rect.width = enemy.spriteWidth();
        rect.height = enemy.spriteHeight();
        rect.x = enemy.spritePosX() - rect.width / 2;
        rect.y = enemy.spritePosY() - rect.height;
        return (
            x >= rect.x &&
            y >= rect.y &&
            x < rect.x + rect.width &&
            y < rect.y + rect.height
        );
    }

    public getMouseOverEnemy() {
        for (let i = 0; i < this._enemies.length; ++i) {
            let enemy = this._enemies[i];
            if (!enemy) continue;
            if (this.isMouseOverEnemy(enemy)) {
                if (this._selectDead && !enemy.isDead()) continue;
                let index = this._enemies.indexOf(enemy);
                if (this._inputLock && index !== this.index()) continue;
                return index;
            }
        }
        return -1;
    }

    public isMouseOverEnemy(enemy) {
        if (!enemy) return false;
        if (!enemy.isSpriteVisible()) return false;
        if ($gameTemp.mouseOverSelectDisabled()) return false;
        let x = TouchInput._mouseOverX;
        let y = TouchInput._mouseOverY;
        let rect = new Rectangle();
        rect.width = enemy.spriteWidth();
        rect.height = enemy.spriteHeight();
        rect.x = enemy.spritePosX() - rect.width / 2;
        rect.y = enemy.spritePosY() - rect.height;
        return (
            x >= rect.x &&
            y >= rect.y &&
            x < rect.x + rect.width &&
            y < rect.y + rect.height
        );
    }
}
