
import Sprite_Base from "./Sprite_Base";
import Sprite_Damage from "./Sprite_Damage";

//-----------------------------------------------------------------------------
// Sprite_Battler
//
// The superclass of Sprite_Actor and Sprite_Enemy.

export default class Sprite_Battler extends Sprite_Base {
    public setHome: (x: any, y: any) => void;
    public updateMain: () => void;
    public updateBitmap: () => void;
    public updateFrame: () => void;
    public updateMove: () => void;
    public updatePosition: () => void;
    public updateAnimation: () => void;
    public updateDamagePopup: () => void;
    public updateSelectionEffect: () => void;
    public setupAnimation: () => void;
    public setupDamagePopup: () => void;
    public damageOffsetX: () => number;
    public damageOffsetY: () => number;
    public startMove: (x: any, y: any, duration: any) => void;
    public onMoveEnd: () => void;
    public isEffecting: () => boolean;
    public isMoving: () => boolean;
    public inHomePosition: () => boolean;
    public constructor(battler?) {
        super();
        this.initMembers();
        this.setBattler(battler);
    }
    public initMembers(): any {
        throw new Error("Method not implemented.");
    }
    public setBattler(battler: any): any {
        throw new Error("Method not implemented.");
    }
}

Sprite_Battler.prototype.initMembers = function () {
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
};

Sprite_Battler.prototype.setBattler = function (battler) {
    this._battler = battler;
};

Sprite_Battler.prototype.setHome = function (x, y) {
    this._homeX = x;
    this._homeY = y;
    this.updatePosition();
};

Sprite_Battler.prototype.update = function () {
    Sprite_Base.prototype.update.call(this);
    if (this._battler) {
        this.updateMain();
        this.updateAnimation();
        this.updateDamagePopup();
        this.updateSelectionEffect();
    } else {
        this.bitmap = null;
    }
};

Sprite_Battler.prototype.updateVisibility = function () {
    Sprite_Base.prototype.updateVisibility.call(this);
    if (!this._battler || !this._battler.isSpriteVisible()) {
        this.visible = false;
    }
};

Sprite_Battler.prototype.updateMain = function () {
    if (this._battler.isSpriteVisible()) {
        this.updateBitmap();
        this.updateFrame();
    }
    this.updateMove();
    this.updatePosition();
};

Sprite_Battler.prototype.updateBitmap = function () {
};

Sprite_Battler.prototype.updateFrame = function () {
};

Sprite_Battler.prototype.updateMove = function () {
    if (this._movementDuration > 0) {
        const d = this._movementDuration;
        this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
        this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
        this._movementDuration--;
        if (this._movementDuration === 0) {
            this.onMoveEnd();
        }
    }
};

Sprite_Battler.prototype.updatePosition = function () {
    this.x = this._homeX + this._offsetX;
    this.y = this._homeY + this._offsetY;
};

Sprite_Battler.prototype.updateAnimation = function () {
    this.setupAnimation();
};

Sprite_Battler.prototype.updateDamagePopup = function () {
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
};

Sprite_Battler.prototype.updateSelectionEffect = function () {
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
};

Sprite_Battler.prototype.setupAnimation = function () {
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
};

Sprite_Battler.prototype.setupDamagePopup = function () {
    if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            const sprite = new Sprite_Damage();
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
            sprite.setup(this._battler);
            this._damages.push(sprite);
            this.parent.addChild(sprite);
        }
        this._battler.clearDamagePopup();
        this._battler.clearResult();
    }
};

Sprite_Battler.prototype.damageOffsetX = function () {
    return 0;
};

Sprite_Battler.prototype.damageOffsetY = function () {
    return 0;
};

Sprite_Battler.prototype.startMove = function (x, y, duration) {
    if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
        this._targetOffsetX = x;
        this._targetOffsetY = y;
        this._movementDuration = duration;
        if (duration === 0) {
            this._offsetX = x;
            this._offsetY = y;
        }
    }
};

Sprite_Battler.prototype.onMoveEnd = function () {
};

Sprite_Battler.prototype.isEffecting = function () {
    return false;
};

Sprite_Battler.prototype.isMoving = function () {
    return this._movementDuration > 0;
};

Sprite_Battler.prototype.inHomePosition = function () {
    return this._offsetX === 0 && this._offsetY === 0;
};
