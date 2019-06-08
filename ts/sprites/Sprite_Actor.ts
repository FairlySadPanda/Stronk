import Sprite from "../core/Sprite";
import BattleManager from "../managers/BattleManager";
import ImageManager from "../managers/ImageManager";
import Sprite_Base from "./Sprite_Base";
import Sprite_Battler from "./Sprite_Battler";
import Sprite_StateOverlay from "./Sprite_StateOverlay";
import Sprite_Weapon from "./Sprite_Weapon";

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

export default class Sprite_Actor extends Sprite_Battler {
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
    private _mainSprite: Sprite_Base;
    private _shadowSprite: Sprite;
    private _weaponSprite: Sprite_Weapon;
    private _stateSprite: Sprite_StateOverlay;
    private _actor: any;

    public constructor(battler?) {
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

    public setBattler(battler) {
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
        this.startMove(300, 0, 0);
    }

    public setActorHome(index) {
        this.setHome(600 + index * 32, 280 + index * 48);
    }

    public update() {
        super.update();
        this.updateShadow();
        if (this._actor) {
            this.updateMotion();
        }
    }

    public updateShadow() {
        this._shadowSprite.visible = !!this._actor;
    }

    public updateMain() {
        super.updateMain();
        if (this._actor.isSpriteVisible() && !this.isMoving()) {
            this.updateTargetPosition();
        }
    }

    public setupMotion() {
        if (this._actor.isMotionRequested()) {
            this.startMotion(this._actor.motionType());
            this._actor.clearMotion();
        }
    }

    public setupWeaponAnimation() {
        if (this._actor.isWeaponAnimationRequested()) {
            this._weaponSprite.setup(this._actor.weaponImageId());
            this._actor.clearWeaponAnimation();
        }
    }

    public startMotion(motionType) {
        const newMotion = Sprite_Actor.MOTIONS[motionType];
        if (this._motion !== newMotion) {
            this._motion = newMotion;
            this._motionCount = 0;
            this._pattern = 0;
        }
    }

    public updateTargetPosition() {
        if (this._actor.isInputting() || this._actor.isActing()) {
            this.stepForward();
        } else if (this._actor.canMove() && BattleManager.isEscaped()) {
            this.retreat();
        } else if (!this.inHomePosition()) {
            this.stepBack();
        }
    }

    public updateBitmap() {
        super.updateBitmap();
        const name = this._actor.battlerName();
        if (this._battlerName !== name) {
            this._battlerName = name;
            this._mainSprite.bitmap = ImageManager.loadSvActor(name);
        }
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
    }

    public updateMove() {
        const bitmap = this._mainSprite.bitmap;
        if (!bitmap || bitmap.isReady()) {
            super.updateMove();
        }
    }

    public updateMotion() {
        this.setupMotion();
        this.setupWeaponAnimation();
        if (this._actor.isMotionRefreshRequested()) {
            this.refreshMotion();
            this._actor.clearMotion();
        }
        this.updateMotionCount();
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
        const motionGuard = Sprite_Actor.MOTIONS["guard"];
        if (actor) {
            if (this._motion === motionGuard && !BattleManager.isInputting()) {
                return;
            }
            const stateMotion = actor.stateMotionIndex();
            if (actor.isInputting() || actor.isActing()) {
                this.startMotion("walk");
            } else if (stateMotion === 3) {
                this.startMotion("dead");
            } else if (stateMotion === 2) {
                this.startMotion("sleep");
            } else if (actor.isChanting()) {
                this.startMotion("chant");
            } else if (actor.isGuard() || actor.isGuardWaiting()) {
                this.startMotion("guard");
            } else if (stateMotion === 1) {
                this.startMotion("abnormal");
            } else if (actor.isDying()) {
                this.startMotion("dying");
            } else if (actor.isUndecided()) {
                this.startMotion("walk");
            } else {
                this.startMotion("wait");
            }
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

    public stepForward() {
        this.startMove(-48, 0, 12);
    }

    public stepBack() {
        this.startMove(0, 0, 12);
    }

    public retreat() {
        this.startMove(300, 0, 30);
    }

    public onMoveEnd() {
        super.onMoveEnd();
        if (!BattleManager.isBattleEnd()) {
            this.refreshMotion();
        }
    }

    public damageOffsetX() {
        return -32;
    }

    public damageOffsetY() {
        return 0;
    }
}
