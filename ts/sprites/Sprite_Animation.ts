import { ScreenSprite } from "../core/ScreenSprite";
import { Sprite } from "../core/Sprite";
import { Utils } from "../core/Utils";
import { AudioManager } from "../managers/AudioManager";
import { ImageManager } from "../managers/ImageManager";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

// -----------------------------------------------------------------------------
// Sprite_Animation
//
// The sprite for displaying an animation.

export class Sprite_Animation extends Sprite {
    private static _checker1 = {};
    private static _checker2 = {};

    private _reduceArtifacts: boolean;
    private _target: any;
    private _animation: any;
    private _mirror: boolean;
    private _delay: number;
    private _rate: number;
    private _duration: number;
    private _flashColor: number[];
    private _flashDuration: number;
    private _screenFlashDuration: number;
    private _hidingDuration: number;
    private _bitmap1: any;
    private _bitmap2: any;
    private _cellSprites: any[];
    private _screenFlashSprite: any;
    private _duplicated: boolean;

    public constructor() {
        super();
        this._reduceArtifacts = true;
        this.initMembers();
    }

    public initMembers() {
        this._target = null;
        this._animation = null;
        this._mirror = false;
        this._delay = 0;
        this._rate = 4;
        this._duration = 0;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._screenFlashDuration = 0;
        this._hidingDuration = 0;
        this._bitmap1 = null;
        this._bitmap2 = null;
        this._cellSprites = [];
        this._screenFlashSprite = null;
        this._duplicated = false;
        this.z = 8;
    }

    public setup(target, animation, mirror, delay) {
        this._target = target;
        this._animation = animation;
        this._mirror = mirror;
        this._delay = delay;
        if (this._animation) {
            this.remove();
            this.setupRate();
            this.setupDuration();
            this.loadBitmaps();
            this.createSprites();
        }
    }

    public remove() {
        if (this.parent && this.parent.removeChild(this)) {
            this._target.setBlendColor([0, 0, 0, 0]);
            this._target.show();
        }
    }

    public setupRate() {
        this._rate = Yanfly.Param.AnimationRate;
    }

    public setupDuration() {
        this._duration = this._animation.frames.length * this._rate + 1;
    }

    public update() {
        super.update();
        this.updateMain();
        this.updateFlash();
        this.updateScreenFlash();
        this.updateHiding();
        Sprite_Animation._checker1 = {};
        Sprite_Animation._checker2 = {};
    }

    public updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
            this._target.setBlendColor(this._flashColor);
        }
    }

    public updateScreenFlash() {
        if (this._screenFlashDuration > 0) {
            const d = this._screenFlashDuration--;
            if (this._screenFlashSprite) {
                this._screenFlashSprite.x = -this.absoluteX();
                this._screenFlashSprite.y = -this.absoluteY();
                this._screenFlashSprite.opacity *= (d - 1) / d;
                this._screenFlashSprite.visible = this._screenFlashDuration > 0;
            }
        }
    }

    public absoluteX() {
        let x = 0;
        let object: PIXI.Container = this;
        while (object) {
            x += object.x;
            object = object.parent;
        }
        return x;
    }

    public absoluteY() {
        let y = 0;
        let object: PIXI.Container = this;
        while (object) {
            y += object.y;
            object = object.parent;
        }
        return y;
    }

    public updateHiding() {
        if (this._hidingDuration > 0) {
            this._hidingDuration--;
            if (this._hidingDuration === 0) {
                this._target.show();
            }
        }
    }

    public isPlaying() {
        return this._duration > 0;
    }

    public loadBitmaps() {
        const name1 = this._animation.animation1Name;
        const name2 = this._animation.animation2Name;
        const hue1 = this._animation.animation1Hue;
        const hue2 = this._animation.animation2Hue;
        this._bitmap1 = ImageManager.loadAnimation(name1, hue1);
        this._bitmap2 = ImageManager.loadAnimation(name2, hue2);
    }

    public isReady() {
        return (
            this._bitmap1 &&
            this._bitmap1.isReady() &&
            this._bitmap2 &&
            this._bitmap2.isReady()
        );
    }

    public createSprites() {
        if (!Sprite_Animation._checker2[this._animation]) {
            this.createCellSprites();
            if (this._animation.position === 3) {
                Sprite_Animation._checker2[this._animation] = true;
            }
            this.createScreenFlashSprite();
        }
        if (Sprite_Animation._checker1[this._animation]) {
            this._duplicated = true;
        } else {
            this._duplicated = false;
            if (this._animation.position === 3) {
                Sprite_Animation._checker1[this._animation] = true;
            }
        }
    }

    public createCellSprites() {
        this._cellSprites = [];
        for (let i = 0; i < 16; i++) {
            const sprite = new Sprite();
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            this._cellSprites.push(sprite);
            this.addChild(sprite);
        }
    }

    public createScreenFlashSprite() {
        this._screenFlashSprite = new ScreenSprite();
        this.addChild(this._screenFlashSprite);
    }

    public updateMain() {
        if (this.isPlaying() && this.isReady()) {
            if (this._delay > 0) {
                this._delay--;
            } else {
                this._duration--;
                this.updatePosition();
                if (this._duration % this._rate === 0) {
                    this.updateFrame();
                }
            }
        }
    }

    public updatePosition() {
        if (this._animation.position === 3) {
            this.x = this.parent.width / 2;
            this.y = this.parent.height / 2;
        } else {
            const parent = this._target.parent;
            const grandparent = parent ? parent.parent : null;
            this.x = this._target.x;
            this.y = this._target.y;
            if (this.parent === grandparent) {
                this.x += parent.x;
                this.y += parent.y;
            }
            if (this._animation.position === 0) {
                this.y -= this._target.height;
            } else if (this._animation.position === 1) {
                this.y -= this._target.height / 2;
            }
        }
    }

    public updateFrame() {
        if (this._duration > 0) {
            const frameIndex = this.currentFrameIndex();
            this.updateAllCellSprites(this._animation.frames[frameIndex]);
            this._animation.timings.forEach(function(timing) {
                if (timing.frame === frameIndex) {
                    this.processTimingData(timing);
                }
            }, this);
        }
    }

    public currentFrameIndex() {
        return (
            this._animation.frames.length -
            Math.floor((this._duration + this._rate - 1) / this._rate)
        );
    }

    public updateAllCellSprites(frame) {
        for (let i = 0; i < this._cellSprites.length; i++) {
            const sprite = this._cellSprites[i];
            if (i < frame.length) {
                this.updateCellSprite(sprite, frame[i]);
            } else {
                sprite.visible = false;
            }
        }
    }

    public updateCellSprite(sprite, cell) {
        const pattern = cell[0];
        if (pattern >= 0) {
            const sx = (pattern % 5) * 192;
            const sy = Math.floor((pattern % 100) / 5) * 192;
            const mirror = this._mirror;
            sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
            sprite.setFrame(sx, sy, 192, 192);
            sprite.x = cell[1];
            sprite.y = cell[2];
            sprite.rotation = (cell[4] * Math.PI) / 180;
            sprite.scale.x = cell[3] / 100;

            if (cell[5]) {
                sprite.scale.x *= -1;
            }
            if (mirror) {
                sprite.x *= -1;
                sprite.rotation *= -1;
                sprite.scale.x *= -1;
            }

            sprite.scale.y = cell[3] / 100;
            sprite.opacity = cell[6];
            sprite.blendMode = cell[7];
            sprite.visible = true;
        } else {
            sprite.visible = false;
        }
    }

    public processTimingData(timing) {
        const duration = timing.flashDuration * this._rate;
        switch (timing.flashScope) {
            case 1:
                this.startFlash(timing.flashColor, duration);
                break;
            case 2:
                this.startScreenFlash(timing.flashColor, duration);
                break;
            case 3:
                this.startHiding(duration);
                break;
        }
        if (!this._duplicated && timing.se) {
            AudioManager.playSe(timing.se);
        }
    }

    public startFlash(color, duration) {
        this._flashColor = Utils.arrayClone(color);
        this._flashDuration = duration;
    }

    public startScreenFlash(color, duration) {
        this._screenFlashDuration = duration;
        if (this._screenFlashSprite) {
            this._screenFlashSprite.setColor(color[0], color[1], color[2]);
            this._screenFlashSprite.opacity = color[3];
        }
    }

    public startHiding(duration) {
        this._hidingDuration = duration;
        this._target.hide();
    }
}
