import { Sprite_Base } from "./Sprite_Base";
import { Sprite_Damage } from "./Sprite_Damage";
import { Game_Battler } from "../objects/Game_Battler";
import { ConfigManager } from "../managers/ConfigManager";
import { BattleManager } from "../managers/BattleManager";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";
import { ScreenSprite } from "../core/ScreenSprite";

// -----------------------------------------------------------------------------
// Sprite_Battler
//
// The superclass of Sprite_Actor and Sprite_Enemy.

export class Sprite_Battler extends Sprite_Base {
    private _battler: Game_Battler;

    public get battler(): Game_Battler {
        return this._battler;
    }

    public set battler(value: Game_Battler) {
        this._battler = value;
    }

    private _damages: Sprite_Damage[];
    protected _homeX: number;
    protected _homeY: number;
    private _offsetX: number;
    private _offsetY: number;
    private _targetOffsetX: number;
    private _targetOffsetY: number;
    private _movementDuration: number;
    private _selectionEffectCount: number;
    private _postSpriteInitialized: boolean;
    protected _mainSprite: Sprite_Base;

    public constructor(battler?) {
        super();
        this.preSpriteInitialize(battler);
        this.initMembers();
        this.setBattler(battler);
    }

    public preSpriteInitialize(battler) {}

    public postSpriteInitialize() {
        this._postSpriteInitialized = true;
    }

    public initMembers() {
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this._battler = null;
        this._damages = [];
        this._homeX = 0;
        this._homeY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._targetOffsetX = NaN;
        this._targetOffsetY = NaN;
        this._movementDuration = 0;
        this._selectionEffectCount = 0;
        this.adjustAnchor();
        this.setZ();
    }

    public setBattler(battler) {
        this._battler = battler;
        if (battler) battler.setBattler(this);
    }

    public setHome(x, y) {
        this._homeX = x;
        this._homeY = y;
        this.updatePosition();
    }

    public update() {
        super.update();
        if (this._battler) {
            this.updateMain();
            this.updateAnimation();
            this.updateDamagePopup();
            this.updateSelectionEffect();
        } else {
            this.bitmap = null;
        }
        if (this._postSpriteInitialized) return;
        this.postSpriteInitialize();
    }

    public updateVisibility() {
        super.updateVisibility();
        if (!this._battler || !this._battler.isSpriteVisible()) {
            this.visible = false;
        }
    }

    public updateMain() {
        if (this._battler.isSpriteVisible()) {
            this.updateBitmap();
            this.updateFrame();
        }
        this.updateMove();
        this.updatePosition();
    }

    public updateBitmap() {}

    public updateFrame() {}

    public updateMove() {
        if (this._movementDuration > 0) {
            const d = this._movementDuration;
            this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
            this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
            this._movementDuration--;
            if (this._movementDuration === 0) {
                this.onMoveEnd();
            }
        }
    }

    public updatePosition() {
        this.x = this._homeX + this._offsetX;
        this.y = this._homeY + this._offsetY;
    }

    public updateAnimation() {
        this.setupAnimation();
    }

    public updateDamagePopup() {
        this.setupDamagePopup();
        if (this._damages.length > 0) {
            for (let i = 0; i < this._damages.length; i++) {
                this._damages[i].update();
            }
            if (!this._damages[0].isPlaying()) {
                this.parent.removeChild(this._damages[0]);
                this._damages.shift();
            }
        }
    }

    public updateSelectionEffect() {
        const target = this._effectTarget;
        if (this._battler.isSelected()) {
            this._selectionEffectCount++;
            if (this._selectionEffectCount % 30 < 15) {
                target.setBlendColor([255, 255, 255, 64]);
            } else {
                target.setBlendColor([0, 0, 0, 0]);
            }
        } else if (this._selectionEffectCount > 0) {
            this._selectionEffectCount = 0;
            target.setBlendColor([0, 0, 0, 0]);
        }
    }

    public setupAnimation() {
        while (this._battler.isAnimationRequested()) {
            const data = this._battler.shiftAnimation();
            const animation = $dataAnimations[data.animationId];
            const mirror = data.mirror;
            const delay = animation.position === 3 ? 0 : data.delay;
            this.startAnimation(animation, mirror, delay);
            for (let i = 0; i < this._animationSprites.length; i++) {
                const sprite = this._animationSprites[i];
                sprite.visible = this._battler.isSpriteVisible();
            }
        }
    }

    public damageOffsetX() {
        return 0;
    }

    public damageOffsetY() {
        return 0;
    }

    public startMove(x, y, duration) {
        if (this._battler && !this._battler.spriteCanMove()) return;
        if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
            this._targetOffsetX = x;
            this._targetOffsetY = y;
            this._movementDuration = duration;
            if (duration === 0) {
                this._offsetX = x;
                this._offsetY = y;
            }
        }
    }

    public onMoveEnd() {}

    public isEffecting() {
        return false;
    }

    public isMoving() {
        return this._movementDuration > 0;
    }

    public inHomePosition() {
        return this._offsetX === 0 && this._offsetY === 0;
    }

    public adjustAnchor() {
        this.anchor.x = 0.5;
        this.anchor.y = 1.0;
    }

    public setZ() {
        this.z = 1;
    }

    public setupDamagePopup() {
        if (this._battler.isDamagePopupRequested()) {
            if (this._battler.isSpriteVisible()) {
                let sprite = new Sprite_Damage();
                sprite.x = this.x + this.damageOffsetX();
                sprite.y = this.y + this.damageOffsetY();
                sprite.setup(this._battler);
                this.pushDamageSprite(sprite);
                BattleManager._spriteset.addChild(sprite);
                this._battler.clearResult();
            }
        } else {
            this._battler.clearDamagePopup();
        }
    }

    public pushDamageSprite(sprite) {
        let heightBuffer = Yanfly.Param.BECPopupOverlap;
        if (Yanfly.Param.BECNewPopBottom) {
            this._damages.push(sprite);
            this._damages.forEach(function(spr) {
                for (let i = 0; i < spr.children.length; i++) {
                    let childSprite = spr.children[i] as ScreenSprite;
                    childSprite.anchor.y += heightBuffer;
                }
            }, this);
        } else {
            this._damages.push(sprite);
            heightBuffer *= this._damages.length;
            for (let i = 0; i < sprite.children.length; i++) {
                let childSprite = sprite.children[i];
                childSprite.anchor.y += heightBuffer;
            }
        }
    }

    public stepForward() {
        this.startMove(Yanfly.Param.BECStepDist, 0, 12);
    }

    public stepBack() {
        this.startMove(0, 0, 12);
    }

    public stepFlinch() {
        let flinchX = this.x - this._homeX - Yanfly.Param.BECFlinchDist;
        let flinchY = this.y - this._homeY;
        this.startMove(flinchX, flinchY, 6);
    }

    public stepSubBack() {
        let backX = (-1 * this.width) / 2;
        this.startMove(backX, 0, 6);
    }

    public stepToSubstitute(focus) {
        let target = focus.battler();
        let targetX = this.x - this._homeX + (target._homeX - this._homeX);
        let targetY = this.y - this._homeY + (target._homeY - this._homeY);
        if (focus.isActor()) targetX -= this._mainSprite.width / 2;
        if (focus.isEnemy()) targetX += this.width / 2;
        this.startMove(targetX, targetY, 1);
    }

    public startMotion(motionType) {}

    public forceMotion(motionType) {}

    public refreshMotion() {}

    public startActionMotion() {}

    public moveForward(distance, frames) {
        distance = parseInt(distance);
        frames = parseInt(frames);
        if (this._battler.isActor()) distance *= -1;
        let moveX = this.x - this._homeX + distance;
        let moveY = this.y - this._homeY;
        this.startMove(moveX, moveY, frames);
    }

    public moveToPoint(pointX, pointY, frames) {
        pointX = parseInt(pointX);
        pointY = parseInt(pointY);
        let targetX = pointX - this._homeX;
        let targetY = pointY - this._homeY;
        this.startMove(targetX, targetY, frames);
    }

    public setMirror(value) {
        if (this.scale.x > 0 && value) this.scale.x *= -1;
        if (this.scale.x < 0 && !value) this.scale.x *= -1;
    }

    public isPopupPlaying() {
        if (this._damages.length > 0) {
            for (let i = 0; i < this._damages.length; ++i) {
                return this._damages[i].isPlaying();
            }
        }
        return false;
    }
}
