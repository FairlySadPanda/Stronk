import { Bitmap } from "../core/Bitmap";
import { Sprite } from "../core/Sprite";
import { BattleManager } from "../managers/BattleManager";
import { ConfigManager } from "../managers/ConfigManager";
import { ImageManager } from "../managers/ImageManager";
import { Game_Actor } from "../objects/Game_Actor";
import { Game_Enemy } from "../objects/Game_Enemy";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";
import { Window_Base } from "../windows/Window_Base";
import { Sprite_Base } from "./Sprite_Base";
import { Sprite_Battler } from "./Sprite_Battler";
import { Sprite_StateOverlay } from "./Sprite_StateOverlay";
import { Sprite_Weapon } from "./Sprite_Weapon";

interface Motion {
    index: number;
    loop: boolean;
}

interface Motions {
    walk: Motion;
    wait: Motion;
    chant: Motion;
    guard: Motion;
    damage: Motion;
    evade: Motion;
    thrust: Motion;
    swing: Motion;
    missile: Motion;
    skill: Motion;
    spell: Motion;
    item: Motion;
    escape: Motion;
    victory: Motion;
    dying: Motion;
    abnormal: Motion;
    sleep: Motion;
    dead: Motion;
}

// -----------------------------------------------------------------------------
// Sprite_Actor
//
// The sprite for displaying an actor.

export class Sprite_Actor extends Sprite_Battler {
    public static MOTIONS: Motions = {
        walk: { index: 0, loop: true },
        wait: { index: 1, loop: true },
        chant: { index: 2, loop: true },
        guard: { index: 3, loop: true },
        damage: { index: 4, loop: false },
        evade: { index: 5, loop: false },
        thrust: { index: 6, loop: false },
        swing: { index: 7, loop: false },
        missile: { index: 8, loop: false },
        skill: { index: 9, loop: false },
        spell: { index: 10, loop: false },
        item: { index: 11, loop: false },
        escape: { index: 12, loop: true },
        victory: { index: 13, loop: true },
        dying: { index: 14, loop: true },
        abnormal: { index: 15, loop: true },
        sleep: { index: 16, loop: true },
        dead: { index: 17, loop: true }
    };

    private _battlerName: string;
    private _motion: any;
    private _motionCount: number;
    private _pattern: number;
    private _shadowSprite: Sprite;
    private _weaponSprite: Sprite_Weapon;
    private _stateSprite: Sprite_StateOverlay;
    private _actor: any;
    _checkAliveStatus: boolean;
    _hideShadows: any;

    public constructor(battler?: undefined) {
        super(battler);
        this.moveToStartPosition();
    }

    public initMembers() {
        super.initMembers();
        this._battlerName = "";
        this._motion = null;
        this._motionCount = 0;
        this._pattern = 0;
        this.createShadowSprite();
        this.createWeaponSprite();
        this.createMainSprite();
        this.createStateSprite();
    }

    public createMainSprite() {
        this._mainSprite = new Sprite_Base();
        this._mainSprite.anchor.x = 0.5;
        this._mainSprite.anchor.y = 1;
        this.addChild(this._mainSprite);
        this._effectTarget = this._mainSprite;
    }

    public createShadowSprite() {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow2");
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 0.5;
        this._shadowSprite.y = -2;
        this.addChild(this._shadowSprite);
    }

    public createWeaponSprite() {
        this._weaponSprite = new Sprite_Weapon();
        this.addChild(this._weaponSprite);
    }

    public createStateSprite() {
        this._stateSprite = new Sprite_StateOverlay();
        this.addChild(this._stateSprite);
    }

    public setBattler(battler: Game_Enemy | Game_Actor) {
        super.setBattler.call(this, battler);
        const changed = battler !== this._actor;
        if (changed) {
            this._actor = battler;
            if (battler) {
                this.setActorHome(battler.index());
            }
            this.startEntryMotion();
            this._stateSprite.setup(battler);
        }
    }

    public moveToStartPosition() {
        if (BattleManager.bypassMoveToStartLocation) return;
        if ($gameSystem.isSideView() && this._checkAliveStatus) {
            this.startMove(300, 0, 0);
        }
    }

    public setActorHome(index: number) {
        const screenWidth = ConfigManager.fieldResolution.widthPx;
        const screenHeight = ConfigManager.fieldResolution.heightPx;
        const maxSize = $gameParty.maxBattleMembers();
        const partySize = $gameParty.battleMembers().length;
        let statusHeight = eval(Yanfly.Param.BECCommandRows);
        statusHeight *= Window_Base.prototype.lineHeight.call(this);
        statusHeight += Window_Base.prototype.standardPadding.call(this) * 2;
        let homeX = 0;
        let homeY = 0;
        if ($gameSystem.isSideView()) {
            let code = Yanfly.Param.BECHomePosX;
            try {
                homeX = eval(code);
            } catch (e) {
                Yanfly.Util.displayError(
                    e,
                    code,
                    "SIDE VIEW HOME X FORMULA ERROR"
                );
            }
            code = Yanfly.Param.BECHomePosY;
            try {
                homeY = eval(code);
            } catch (e) {
                homeY = 0;
                Yanfly.Util.displayError(
                    e,
                    code,
                    "SIDE VIEW HOME Y FORMULA ERROR"
                );
            }
        } else {
            let code = Yanfly.Param.BECFrontPosX;
            try {
                homeX = eval(code);
            } catch (e) {
                homeX = 0;
                Yanfly.Util.displayError(
                    e,
                    code,
                    "FRONT VIEW HOME X FORMULA ERROR"
                );
            }
            code = Yanfly.Param.BECFrontPosY;
            try {
                homeY = eval(code);
            } catch (e) {
                homeY = 0;
                Yanfly.Util.displayError(
                    e,
                    code,
                    "FRONT VIEW HOME Y FORMULA ERROR"
                );
            }
        }
        this._checkAliveStatus = false;
        if ($gameParty.battleMembers()[index]) {
            var actor = $gameParty.battleMembers()[index];
            if (actor.isAlive()) this._checkAliveStatus = true;
        }
        this.setHome(homeX, homeY);
        this.moveToStartPosition();
    }

    public update() {
        super.update();
        this.updateShadow();
        if (this._actor) {
            this.updateMotion();
        }
    }

    public updateShadow() {
        if (this._hideShadows === undefined) {
            this._hideShadows = Yanfly.Param.BECShowShadows;
        }
        if (!this._hideShadows) {
            return (this._shadowSprite.visible = false);
        }
        this._shadowSprite.visible = !!this._actor;
    }

    public updateMain() {
        super.updateMain();
        if (this._actor.isSpriteVisible() && !this.isMoving()) {
            this.updateTargetPosition();
        }
    }

    public setupMotion() {}

    public setupWeaponAnimation() {
        if (this._actor.isWeaponAnimationRequested()) {
            this._weaponSprite.setup(this._actor.weaponImageId());
            this._actor.clearWeaponAnimation();
        }
    }

    public startMotion(motionType: string) {
        const newMotion = Sprite_Actor.MOTIONS[motionType];
        if (this._motion !== newMotion) {
            this._motion = newMotion;
            this._motionCount = 0;
            this._pattern = 0;
        }
    }

    public updateBitmap() {
        let name = this._actor.battlerName();
        let needUpdate = false;
        if (this._battlerName !== name) needUpdate = true;
        super.updateBitmap();
        if (this._battlerName !== name) {
            this._battlerName = name;
            this._mainSprite.bitmap = ImageManager.loadSvActor(name);
        }
        if (needUpdate) this.adjustAnchor();
    }

    public updateFrame() {
        super.updateFrame();
        const bitmap = this._mainSprite.bitmap;
        if (bitmap) {
            const motionIndex = this._motion ? this._motion.index : 0;
            const pattern = this._pattern < 3 ? this._pattern : 1;
            const cw = bitmap.width / 9;
            const ch = bitmap.height / 6;
            const cx = Math.floor(motionIndex / 6) * 3 + pattern;
            const cy = motionIndex % 6;
            this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
        }

        if (!this._mainSprite) return;
        if (!this._mainSprite.bitmap) return;
        if (this._mainSprite.bitmap.width > 0 && !this.bitmap) {
            var sw = this._mainSprite.bitmap.width / 9;
            var sh = this._mainSprite.bitmap.height / 6;
            this.bitmap = new Bitmap(sw, sh);
        }
    }

    public updateMove() {
        const bitmap = this._mainSprite.bitmap;
        if (!bitmap || bitmap.isReady()) {
            super.updateMove();
        }
    }

    public updateMotionCount() {
        if (this._motion && ++this._motionCount >= this.motionSpeed()) {
            if (this._motion.loop) {
                this._pattern = (this._pattern + 1) % 4;
            } else if (this._pattern < 2) {
                this._pattern++;
            } else {
                this.refreshMotion();
            }
            this._motionCount = 0;
        }
    }

    public motionSpeed() {
        return 12;
    }

    public refreshMotion() {
        const actor = this._actor;
        if (!actor) return;
        const motionGuard = Sprite_Actor.MOTIONS["guard"];
        if (this._motion === motionGuard && !BattleManager.isInputting())
            return;
        const stateMotion = actor.stateMotionIndex();
        if (actor.isInputting() || actor.isActing()) {
            this.startMotion(actor.idleMotion());
        } else if (stateMotion === 3) {
            this.startMotion(actor.deadMotion());
        } else if (stateMotion === 2) {
            this.startMotion(actor.sleepMotion());
        } else if (actor.isChanting()) {
            this.startMotion(actor.chantMotion());
        } else if (actor.isGuard() || actor.isGuardWaiting()) {
            this.startMotion(actor.guardMotion());
        } else if (stateMotion === 1) {
            this.startMotion(actor.abnormalMotion());
        } else if (actor.isDying()) {
            this.startMotion(actor.dyingMotion());
        } else if (actor.isUndecided()) {
            this.startMotion(actor.idleMotion());
        } else {
            this.startMotion(actor.waitMotion());
        }
    }

    public startEntryMotion() {
        if (this._actor && this._actor.canMove()) {
            this.startMotion("walk");
            this.startMove(0, 0, 30);
        } else if (!this.isMoving()) {
            this.refreshMotion();
            this.startMove(0, 0, 0);
        }
    }

    public stepBack() {
        this.startMove(0, 0, 12);
    }

    public retreat() {
        this.startMove(1200, 0, 120);
    }

    public damageOffsetX() {
        return -32;
    }

    public damageOffsetY() {
        return 0;
    }

    public forceMotion(motionType) {
        const newMotion = Sprite_Actor.MOTIONS[motionType];
        this._motion = newMotion;
        this._motionCount = 0;
        this._pattern = 0;
    }

    public updateTargetPosition() {}

    public updateMotion() {
        this.updateMotionCount();
    }

    public onMoveEnd() {
        Sprite_Battler.prototype.onMoveEnd.call(this);
    }

    public stepForward() {
        this.startMove(-Yanfly.Param.BECStepDist, 0, 12);
    }

    public stepFlinch() {
        var flinchX = this.x - this._homeX + Yanfly.Param.BECFlinchDist;
        var flinchY = this.y - this._homeY;
        this.startMove(flinchX, flinchY, 6);
    }

    public stepSubBack() {
        var backX = this._mainSprite.width / 2;
        this.startMove(backX, 0, 6);
    }

    public adjustAnchor() {
        if (!this._mainSprite) {
            return;
        }
        this._mainSprite.anchor.x = this._actor.anchorX();
        this._mainSprite.anchor.y = this._actor.anchorY();
    }
}
