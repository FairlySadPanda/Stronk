import Graphics from "../core/Graphics";
import Sprite from "../core/Sprite";
import TilingSprite from "../core/TilingSprite";
import BattleManager from "../managers/BattleManager";
import ImageManager from "../managers/ImageManager";
import SceneManager from "../managers/SceneManager";
import Spriteset_Base from "./Spriteset_Base";
import Sprite_Actor from "./Sprite_Actor";
import Sprite_Enemy from "./Sprite_Enemy";
import Sprite_Battler from "./Sprite_Battler";

// -----------------------------------------------------------------------------
// Spriteset_Battle
//
// The set of sprites on the battle screen.

export default class Spriteset_Battle extends Spriteset_Base {
    private _battlebackLocated: boolean;
    private _backgroundSprite: Sprite;
    private _battleField: Sprite;
    private _back1Sprite: TilingSprite;
    private _back2Sprite: TilingSprite;
    private _enemySprites: Sprite_Enemy[];
    private _actorSprites: Sprite_Actor[];
    private _loadingDone: boolean;

    public constructor() {
        super();
        this._battlebackLocated = false;
    }

    public createLowerLayer() {
        super.createLowerLayer();
        this.createBackground();
        this.createBattleField();
        this.createBattleback().then(() => {
            this.createEnemies().then(() => {
                this._loadingDone = true;
                this.createActors();
            });
        });
    }

    public createBackground() {
        this._backgroundSprite = new Sprite(SceneManager.backgroundBitmap());
        this._baseSprite.addChild(this._backgroundSprite);
    }

    public update() {
        super.update();
        this._loadingDone ? this.updateActors() : null;
        this.updateBattleback();
    }

    public createBattleField() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        const x = (Graphics.width - width) / 2;
        const y = (Graphics.height - height) / 2;
        this._battleField = new Sprite();
        this._battleField.setFrame(x, y, width, height);
        this._battleField.x = x;
        this._battleField.y = y;
        this._baseSprite.addChild(this._battleField);
    }

    public async createBattleback() {
        const margin = 32;
        const x = -this._battleField.x - margin;
        const y = -this._battleField.y - margin;
        const width = Graphics.width + margin * 2;
        const height = Graphics.height + margin * 2;
        this._back1Sprite = new TilingSprite(this.battleback1Bitmap());
        this._back2Sprite = new TilingSprite(this.battleback2Bitmap());
        await this._back1Sprite.bitmap.imagePromise;
        await this._back2Sprite.bitmap.imagePromise;
        this._back1Sprite.move(x, y, width, height);
        this._battleField.addChild(this._back1Sprite);
        this._back2Sprite.move(x, y, width, height);
        this._battleField.addChild(this._back2Sprite);
    }

    public updateBattleback() {
        if (!this._battlebackLocated) {
            this.locateBattleback();
            this._battlebackLocated = true;
        }
    }

    public locateBattleback() {
        const width = this._battleField.width;
        const height = this._battleField.height;
        const sprite1 = this._back1Sprite;
        const sprite2 = this._back2Sprite;
        sprite1.bitmap.imagePromise.then(() => {
            sprite1.origin.x = sprite1.x + (sprite1.bitmap.width - width) / 2;
        });
        sprite2.bitmap.imagePromise.then(() => {
            sprite2.origin.x = sprite1.y + (sprite2.bitmap.width - width) / 2;
        });

        if ($gameSystem.isSideView()) {
            sprite1.origin.y = sprite1.x + sprite1.bitmap.height - height;
            sprite2.origin.y = sprite1.y + sprite2.bitmap.height - height;
        }
    }

    public battleback1Bitmap() {
        return ImageManager.loadBattleback1(this.battleback1Name());
    }

    public battleback2Bitmap() {
        return ImageManager.loadBattleback2(this.battleback2Name());
    }

    public battleback1Name() {
        if (BattleManager.isBattleTest()) {
            return $dataSystem.battleback1Name;
        } else if ($gameMap.battleback1Name()) {
            return $gameMap.battleback1Name();
        } else if ($gameMap.isOverworld()) {
            return this.overworldBattleback1Name();
        } else {
            return "";
        }
    }

    public battleback2Name() {
        if (BattleManager.isBattleTest()) {
            return $dataSystem.battleback2Name;
        } else if ($gameMap.battleback2Name()) {
            return $gameMap.battleback2Name();
        } else if ($gameMap.isOverworld()) {
            return this.overworldBattleback2Name();
        } else {
            return "";
        }
    }

    public overworldBattleback1Name() {
        if ($gameMap.battleback1Name() === "") {
            return "";
        }
        if ($gamePlayer.isInVehicle()) {
            return this.shipBattleback1Name();
        } else {
            return this.normalBattleback1Name();
        }
    }

    public overworldBattleback2Name() {
        if ($gameMap.battleback2Name() === "") {
            return "";
        }
        if ($gamePlayer.isInVehicle()) {
            return this.shipBattleback2Name();
        } else {
            return this.normalBattleback2Name();
        }
    }

    public normalBattleback1Name() {
        return (
            this.terrainBattleback1Name(this.autotileType(1)) ||
            this.terrainBattleback1Name(this.autotileType(0)) ||
            this.defaultBattleback1Name()
        );
    }

    public normalBattleback2Name() {
        return (
            this.terrainBattleback2Name(this.autotileType(1)) ||
            this.terrainBattleback2Name(this.autotileType(0)) ||
            this.defaultBattleback2Name()
        );
    }

    public terrainBattleback1Name(type) {
        switch (type) {
            case 24:
            case 25:
                return "Wasteland";
            case 26:
            case 27:
                return "DirtField";
            case 32:
            case 33:
                return "Desert";
            case 34:
                return "Lava1";
            case 35:
                return "Lava2";
            case 40:
            case 41:
                return "Snowfield";
            case 42:
                return "Clouds";
            case 4:
            case 5:
                return "PoisonSwamp";
            default:
                return null;
        }
    }

    public terrainBattleback2Name(type) {
        switch (type) {
            case 20:
            case 21:
                return "Forest";
            case 22:
            case 30:
            case 38:
                return "Cliff";
            case 24:
            case 25:
            case 26:
            case 27:
                return "Wasteland";
            case 32:
            case 33:
                return "Desert";
            case 34:
            case 35:
                return "Lava";
            case 40:
            case 41:
                return "Snowfield";
            case 42:
                return "Clouds";
            case 4:
            case 5:
                return "PoisonSwamp";
        }
    }

    public defaultBattleback1Name() {
        return "Grassland";
    }

    public defaultBattleback2Name() {
        return "Grassland";
    }

    public shipBattleback1Name() {
        return "Ship";
    }

    public shipBattleback2Name() {
        return "Ship";
    }

    public autotileType(z) {
        return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
    }

    public async createEnemies() {
        const enemies = $gameTroop.members();
        const sprites: Sprite_Enemy[] = [];
        const promises = [];
        for (let i = 0; i < enemies.length; i++) {
            sprites[i] = new Sprite_Enemy(enemies[i]);
            sprites[i].update();
            promises.push(sprites[i].bitmap.imagePromise);
        }
        sprites.sort(this.compareEnemySprite.bind(this));
        for (let j = 0; j < sprites.length; j++) {
            this._battleField.addChild(sprites[j]);
        }
        this._enemySprites = sprites;
        await Promise.all(promises);
    }

    public compareEnemySprite(a, b) {
        if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return b.spriteId - a.spriteId;
        }
    }

    public createActors() {
        this._actorSprites = [];
        for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
            this._actorSprites[i] = new Sprite_Actor();
            this._battleField.addChild(this._actorSprites[i]);
        }
    }

    public updateActors() {
        const members = $gameParty.battleMembers();
        for (let i = 0; i < this._actorSprites.length; i++) {
            this._actorSprites[i].setBattler(members[i]);
        }
    }

    public battlerSprites(): Sprite_Battler[] {
        return [...this._enemySprites, ...this._actorSprites];
    }

    public isAnimationPlaying() {
        return this.battlerSprites().some(function(sprite) {
            return sprite.isAnimationPlaying();
        });
    }

    public isEffecting() {
        return this.battlerSprites().some(function(sprite) {
            return sprite.isEffecting();
        });
    }

    public isAnyoneMoving() {
        return this.battlerSprites().some(function(sprite) {
            return sprite.isMoving();
        });
    }

    public isBusy() {
        return this.isAnimationPlaying() || this.isAnyoneMoving();
    }
}
