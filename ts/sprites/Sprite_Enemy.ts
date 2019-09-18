import { Graphics } from "../core/Graphics";
import { ImageManager } from "../managers/ImageManager";
import { SoundManager } from "../managers/SoundManager";
import { Sprite_Battler } from "./Sprite_Battler";
import { Sprite_StateIcon } from "./Sprite_StateIcon";
import { ConfigManager } from "../managers/ConfigManager";
import { Game_Enemy } from "../objects/Game_Enemy";
import { Game_Battler } from "../objects/Game_Battler";

// -----------------------------------------------------------------------------
// Sprite_Enemy
//
// The sprite for displaying an enemy.

export class Sprite_Enemy extends Sprite_Battler {
    private _enemy: Game_Enemy;
    private _appeared: boolean;
    private _battlerName: string;
    private _battlerHue: number;
    private _effectType: any;
    private _effectDuration: number;
    private _shake: number;
    private _stateIconSprite: Sprite_StateIcon;

    public initMembers() {
        super.initMembers();
        this._enemy = null;
        this._appeared = false;
        this._battlerName = "";
        this._battlerHue = 0;
        this._effectType = null;
        this._effectDuration = 0;
        this._shake = 0;
        this.createStateIconSprite();
    }

    public createStateIconSprite() {
        this._stateIconSprite = new Sprite_StateIcon();
        this.addChild(this._stateIconSprite);
    }

    public setBattler(battler: Game_Enemy) {
        super.setBattler(battler);
        this._enemy = battler;

        // Figure out how to translate the screenX and screenY data, which assumes a resolution of 816 x 624, to the field's resolution.
        const xLocAsMultipleOfDefaultWidth = battler.screenX() / 816;
        const yLocAsMultipleOfDefaultHeight = battler.screenY() / 614;
        this.setHome(
            ConfigManager.fieldResolution.widthPx *
                xLocAsMultipleOfDefaultWidth,
            ConfigManager.fieldResolution.heightPx *
                yLocAsMultipleOfDefaultHeight
        );

        this._stateIconSprite.setup(battler);
    }

    public update() {
        super.update();
        if (this._enemy) {
            this.updateEffect();
            this.updateStateSprite();
        }
    }

    public updateBitmap() {
        super.updateBitmap();
        const name = this._enemy.battlerName();
        const hue = this._enemy.battlerHue();
        if (this._battlerName !== name || this._battlerHue !== hue) {
            this._battlerName = name;
            this._battlerHue = hue;
            this.loadBitmap(name, hue);
            this.initVisibility();
        }
    }

    public loadBitmap(name, hue) {
        if ($gameSystem.isSideView()) {
            this.bitmap = ImageManager.loadSvEnemy(name, hue);
        } else {
            this.bitmap = ImageManager.loadEnemy(name, hue);
        }
    }

    public updateFrame() {
        super.updateFrame();
        let frameHeight = this.bitmap.height;
        if (this._effectType === "bossCollapse") {
            frameHeight = this._effectDuration;
        }
        this.setFrame(0, 0, this.bitmap.width, frameHeight);
    }

    public updatePosition() {
        super.updatePosition();
        this.x += this._shake;
    }

    public updateStateSprite() {
        this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
        if (this._stateIconSprite.y < 20 - this.y) {
            this._stateIconSprite.y = 20 - this.y;
        }
    }

    public initVisibility() {
        this._appeared = this._enemy.isAlive();
        if (!this._appeared) {
            this.opacity = 0;
        }
    }

    public setupEffect() {
        if (this._appeared && this._enemy.isEffectRequested()) {
            this.startEffect(this._enemy.effectType());
            this._enemy.clearEffect();
        }
        if (!this._appeared && this._enemy.isAlive()) {
            this.startEffect("appear");
        } else if (this._appeared && this._enemy.isHidden()) {
            this.startEffect("disappear");
        }
    }

    public startEffect(effectType) {
        this._effectType = effectType;
        switch (this._effectType) {
            case "appear":
                this.startAppear();
                break;
            case "disappear":
                this.startDisappear();
                break;
            case "whiten":
                this.startWhiten();
                break;
            case "blink":
                this.startBlink();
                break;
            case "collapse":
                this.startCollapse();
                break;
            case "bossCollapse":
                this.startBossCollapse();
                break;
            case "instantCollapse":
                this.startInstantCollapse();
                break;
        }
        this.revertToNormal();
    }

    public startAppear() {
        this._effectDuration = 16;
        this._appeared = true;
    }

    public startDisappear() {
        this._effectDuration = 32;
        this._appeared = false;
    }

    public startWhiten() {
        this._effectDuration = 16;
    }

    public startBlink() {
        this._effectDuration = 20;
    }

    public startCollapse() {
        this._effectDuration = 32;
        this._appeared = false;
    }

    public startBossCollapse() {
        this._effectDuration = this.bitmap.height;
        this._appeared = false;
    }

    public startInstantCollapse() {
        this._effectDuration = 16;
        this._appeared = false;
    }

    public updateEffect() {
        this.setupEffect();
        if (this._effectDuration > 0) {
            this._effectDuration--;
            switch (this._effectType) {
                case "whiten":
                    this.updateWhiten();
                    break;
                case "blink":
                    this.updateBlink();
                    break;
                case "appear":
                    this.updateAppear();
                    break;
                case "disappear":
                    this.updateDisappear();
                    break;
                case "collapse":
                    this.updateCollapse();
                    break;
                case "bossCollapse":
                    this.updateBossCollapse();
                    break;
                case "instantCollapse":
                    this.updateInstantCollapse();
                    break;
            }
            if (this._effectDuration === 0) {
                this._effectType = null;
            }
        }
    }

    public isEffecting() {
        return this._effectType !== null;
    }

    public revertToNormal() {
        this._shake = 0;
        this.blendMode = 0;
        this.opacity = 255;
        this.setBlendColor([0, 0, 0, 0]);
    }

    public updateWhiten() {
        const alpha = 128 - (16 - this._effectDuration) * 10;
        this.setBlendColor([255, 255, 255, alpha]);
    }

    public updateBlink() {
        this.opacity = this._effectDuration % 10 < 5 ? 255 : 0;
    }

    public updateAppear() {
        this.opacity = (16 - this._effectDuration) * 16;
    }

    public updateDisappear() {
        this.opacity = 256 - (32 - this._effectDuration) * 10;
    }

    public updateCollapse() {
        this.blendMode = Graphics.BLEND_ADD;
        this.setBlendColor([255, 128, 128, 128]);
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
    }

    public updateBossCollapse() {
        this._shake = (this._effectDuration % 2) * 4 - 2;
        this.blendMode = Graphics.BLEND_ADD;
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
        this.setBlendColor([255, 255, 255, 255 - this.opacity]);
        if (this._effectDuration % 20 === 19) {
            SoundManager.playBossCollapse2();
        }
    }

    public updateInstantCollapse() {
        this.opacity = 0;
    }

    public damageOffsetX() {
        return 0;
    }

    public damageOffsetY() {
        return -8;
    }

    public updateSelectionEffect() {
        if (this._battler.isActor()) {
            super.updateSelectionEffect();
        } else {
            if (this._battler.isSelected()) {
                this.startEffect("whiten");
            }
        }
    }
}
