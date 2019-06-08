import Sprite from "../core/Sprite";
import Utils from "../core/Utils";
import Sprite_Animation from "./Sprite_Animation";

// -----------------------------------------------------------------------------
// Sprite_Base
//
// The sprite class with a feature which displays animations.

export default class Sprite_Base extends Sprite {
    protected _animationSprites: any[];
    protected _effectTarget: Sprite_Base;
    private _hiding: boolean;

    public constructor() {
        super();
        this._animationSprites = [];
        this._effectTarget = this;
        this._hiding = false;
    }

    public update() {
        super.update();
        this.updateVisibility();
        this.updateAnimationSprites();
    }

    public hide() {
        this._hiding = true;
        this.updateVisibility();
    }

    public show() {
        this._hiding = false;
        this.updateVisibility();
    }

    public updateVisibility() {
        this.visible = !this._hiding;
    }

    public updateAnimationSprites() {
        if (this._animationSprites.length > 0) {
            const sprites = Utils.arrayClone(this._animationSprites);
            this._animationSprites = [];
            for (let i = 0; i < sprites.length; i++) {
                const sprite = sprites[i];
                if (sprite.isPlaying()) {
                    this._animationSprites.push(sprite);
                } else {
                    sprite.remove();
                }
            }
        }
    }

    public startAnimation(animation, mirror, delay) {
        const sprite = new Sprite_Animation();
        sprite.setup(this._effectTarget, animation, mirror, delay);
        this.parent.addChild(sprite);
        this._animationSprites.push(sprite);
    }

    public isAnimationPlaying() {
        return this._animationSprites.length > 0;
    }
}
