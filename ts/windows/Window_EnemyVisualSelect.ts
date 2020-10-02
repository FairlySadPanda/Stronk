import { Window_Base } from "./Window_Base";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";
import { Graphics } from "../core/Graphics";
import { SceneManager } from "../managers/SceneManager";
import { Utils } from "../core/Utils";
import { Scene_Battle } from "../scenes/Scene_Battle";

export class Window_EnemyVisualSelect extends Window_Base {
    private _battler: any;
    private _battlerName: string;
    private _requestRefresh: boolean;
    private _showSelectCursor: any;
    private _showEnemyName: any;
    private _nameTextWidth: any;
    private _minX: number;
    private _maxX: number;
    private _minY: number;
    private _maxY: number;

    public constructor() {
        super(0, 0, 1, 1);
        this._battler = null;
        this._battlerName = "";
        this._requestRefresh = false;
        this._showSelectCursor = Yanfly.Param.BECShowSelectBox;
        this._showEnemyName = Yanfly.Param.BECShowEnemyName;
        this.contentsOpacity = 0;
        this.opacity = 0;
    }

    public setBattler(battler) {
        if (this._battler === battler) return;
        this._battler = battler;
        this._battlerName = battler.name();
    }

    public update() {
        super.update();
        if (!this._battler) return;
        this.updateWindowAspects();
    }

    public updateWindowAspects() {
        this.updateBattlerName();
        this.updateWindowSize();
        this.updateWindowPosition();
        this.updateOpacity();
        this.updateRefresh();
        this.updateCursor();
    }

    public updateBattlerName() {
        if (this._battlerName !== this._battler.name())
            this._battlerName = this._battler.name();
        this._requestRefresh = true;
        this._nameTextWidth = undefined;
    }

    public updateWindowSize() {
        let spriteWidth = this._battler.spriteWidth();
        this.contents.fontSize = Yanfly.Param.BECEnemyFontSize;
        if (this._nameTextWidth === undefined) {
            this._nameTextWidth = this.textWidth(this._battler.name());
        }
        let textWidth = this._nameTextWidth;
        textWidth += this.textPadding() * 2;
        let width =
            Math.max(spriteWidth, textWidth) + this.standardPadding() * 2;
        width = Math.ceil(width);
        let height = this._battler.spriteHeight() + this.standardPadding() * 2;
        height = Math.ceil(height);
        height = Math.max(
            height,
            this.lineHeight() + this.standardPadding() * 2
        );
        if (width === this.width && height === this.height) return;
        this.width = width;
        this.height = height;
        this.createContents();
        this._requestRefresh = true;
        this.makeWindowBoundaries();
    }

    public makeWindowBoundaries() {
        if (!this._requestRefresh) return;
        this._minX = -1 * this.standardPadding();
        this._maxX = Graphics.boxWidth - this.width + this.standardPadding();
        this._minY = -1 * this.standardPadding();
        this._maxY = Graphics.boxHeight - this.height + this.standardPadding();
        this._maxY -= (SceneManager.scene as Scene_Battle).statusWindow.height;
    }

    public updateWindowPosition() {
        if (!this._battler) return;
        this.x = (-1 * this.width) / 2;
        this.y = -1 * this.height + this.standardPadding();
        this.x += this._battler.spritePosX();
        this.y += this._battler.spritePosY();
        this.x = Utils.clamp(this.x, this._minX, this._maxX);
        this.y = Utils.clamp(this.y, this._minY, this._maxY);
    }

    public updateOpacity() {
        if (this.isShowWindow()) {
            this.contentsOpacity += 32;
        } else {
            this.contentsOpacity -= 32;
        }
    }

    public isShowWindow() {
        let scene = SceneManager.scene as Scene_Battle;
        if (!scene.enemyWindow) return false;
        let enemyWindow = scene.enemyWindow;
        if (!enemyWindow.active) return false;
        if (!this._battler.isAppeared()) return false;
        if (this._battler.isDead()) {
            return enemyWindow.selectDead;
        }
        return enemyWindow._enemies.includes(this._battler);
    }

    public updateCursor() {
        if (this.isShowCursor()) {
            let wy = this.contents.height - this.lineHeight();
            this.setCursorRect(0, wy, this.contents.width, this.lineHeight());
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    }

    public isShowCursor() {
        if (!this._showSelectCursor) return false;
        let scene = SceneManager.scene as Scene_Battle;
        if (!scene.enemyWindow) return false;
        let enemyWindow = scene.enemyWindow;
        if (!enemyWindow.active) return false;
        if (!this._battler.isAppeared()) return false;
        return this._battler.isSelected();
    }

    public updateRefresh() {
        if (this._requestRefresh) this.refresh();
    }

    public refresh() {
        this.contents.clear();
        if (!this._battler) return;
        if (!this._showEnemyName) return;
        if (this._battler.isHidden()) return;
        this._requestRefresh = false;
        this.contents.fontSize = Yanfly.Param.BECEnemyFontSize;
        let text = this._battler.name();
        let wy = this.contents.height - this.lineHeight();
        this.drawText(text, 0, wy, this.contents.width, undefined, "center");
    }
}
