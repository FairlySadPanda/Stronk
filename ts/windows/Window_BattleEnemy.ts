import Graphics from "../core/Graphics";
import Game_Enemy from "../objects/Game_Enemy";
import Window_Selectable from "./Window_Selectable";

//-----------------------------------------------------------------------------
// Window_BattleEnemy
//
// The window for selecting a target enemy on the battle screen.

export default class Window_BattleEnemy extends Window_Selectable {

    private get _enemies(): Game_Enemy[] {
        if(!this.__enemies) {
            this.__enemies = $gameTroop.aliveMembers();
        }
        return this.__enemies;
    }

    private __enemies: Game_Enemy[];

    public constructor(x, y) {
        super(x, y, Window_BattleEnemy.prototype.windowWidth(),  Window_BattleEnemy.prototype.windowHeight());
        this.refresh();
        this.hide();
    }

    public windowWidth() {
        return Graphics.boxWidth - 192;
    }

    public windowHeight() {
        return this.fittingHeight(this.numVisibleRows());
    }

    public numVisibleRows() {
        return 4;
    }

    public maxCols() {
        return 2;
    }

    public maxItems() {
        return this._enemies.length;
    }

    public enemy() {
        return this._enemies[this.index()];
    }

    public enemyIndex() {
        const enemy = this.enemy();
        return enemy ? enemy.index() : -1;
    }

    public drawItem(index) {
        this.resetTextColor();
        const name = this._enemies[index].name();
        const rect = this.itemRectForText(index);
        this.drawText(name, rect.x, rect.y, rect.width);
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

    public refresh() {
        this.__enemies = $gameTroop.aliveMembers();
        super.refresh();
    }

    public select(index) {
        super.select(index);
        $gameTroop.select(this.enemy());
    }

}
