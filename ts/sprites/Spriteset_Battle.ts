import { Graphics } from "../core/Graphics";
import { Sprite } from "../core/Sprite";
import { TilingSprite } from "../core/TilingSprite";
import { BattleManager } from "../managers/BattleManager";
import { ImageManager } from "../managers/ImageManager";
import { SceneManager } from "../managers/SceneManager";
import { Spriteset_Base } from "./Spriteset_Base";
import { Sprite_Actor } from "./Sprite_Actor";
import { Sprite_Enemy } from "./Sprite_Enemy";
import { Sprite_Battler } from "./Sprite_Battler";
import { ConfigManager } from "../managers/ConfigManager";

// -----------------------------------------------------------------------------
// Spriteset_Battle
//
// The set of sprites on the battle screen.

export class Spriteset_Battle extends Spriteset_Base {
    private _battlebackLocated: boolean;
    private _backgroundSprite: Sprite;
    private _battleField: Sprite;
    private _back1Sprite: Sprite;
    private _back2Sprite: Sprite;
    private _back1TilingSprite: TilingSprite;
    private _back2TilingSprite: TilingSprite;
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
        this.updateZCoordinates();
    }

    public updateZCoordinates() {
        // if (Imported.YEP_ImprovedBattlebacks) {
        //     this.updateBattlebackGroupRemove();
        // } else {
        this._battleField.removeChild(this._back1Sprite);
        this._battleField.removeChild(this._back2Sprite);
        // }
        this._battleField.children.sort(this.battleFieldDepthCompare);
        // if (Imported.YEP_ImprovedBattlebacks) {
        //     this.updateBattlebackGroupAdd();
        // } else {
        this._battleField.addChildAt(this._back2Sprite, 0);
        this._battleField.addChildAt(this._back1Sprite, 0);
        // }
    }

    public battleFieldDepthCompare(a, b) {
        let priority = BattleManager.getSpritePriority();
        if (a._battler && b._battler && priority !== 0) {
            if (priority === 1) {
                if (a._battler.isActor() && b._battler.isEnemy()) return 1;
                if (a._battler.isEnemy() && b._battler.isActor()) return -1;
            } else if (priority === 2) {
                if (a._battler.isActor() && b._battler.isEnemy()) return -1;
                if (a._battler.isEnemy() && b._battler.isActor()) return 1;
            }
        }
        if (a.z < b.z) return -1;
        if (a.z > b.z) return 1;
        if (a.y < b.y) return -1;
        if (a.y > b.y) return 1;
        return 0;
    }

    public isPopupPlaying() {
        return this.battlerSprites().some(function(sprite) {
            return sprite.isPopupPlaying();
        });
    }

    public createBattleField() {
        if (
            ConfigManager.graphicsOptions.screenResolution.reposition === true
        ) {
            const width = ConfigManager.fieldResolution.widthPx;
            const height = ConfigManager.fieldResolution.heightPx;
            this._battleField = new Sprite();
            this._battleField.setFrame(0, 0, width, height);
            this._battleField.x = 0;
            this._battleField.y = 0;
            this._baseSprite.addChild(this._battleField);
        } else {
            const width = ConfigManager.fieldResolution.widthPx;
            const height = ConfigManager.fieldResolution.heightPx;
            const x = (ConfigManager.fieldResolution.widthPx - width) / 2;
            const y = (ConfigManager.fieldResolution.heightPx - height) / 2;
            this._battleField = new Sprite();
            this._battleField.setFrame(x, y, width, height);
            this._battleField.x = x;
            this._battleField.y = y;
            this._baseSprite.addChild(this._battleField);
        }
    }

    public async createBattleback() {
        if (
            ConfigManager.graphicsOptions.screenResolution.reposition === true
        ) {
            this._back1Sprite = new Sprite(this.battleback1Bitmap());
            this._back2Sprite = new Sprite(this.battleback2Bitmap());
            this._battleField.addChild(this._back1Sprite);
            this._battleField.addChild(this._back2Sprite);
            await this._back1Sprite.bitmap.imagePromise;
            await this._back2Sprite.bitmap.imagePromise;
        } else {
            const margin = 32;
            const x = -this._battleField.x - margin;
            const y = -this._battleField.y - margin;
            const width = ConfigManager.fieldResolution.widthPx + margin * 2;
            const height = ConfigManager.fieldResolution.heightPx + margin * 2;
            this._back1TilingSprite = new TilingSprite(
                this.battleback1Bitmap()
            );
            this._back2TilingSprite = new TilingSprite(
                this.battleback2Bitmap()
            );
            this._back1TilingSprite.move(x, y, width, height);
            this._battleField.addChild(this._back1TilingSprite);
            this._back2TilingSprite.move(x, y, width, height);
            this._battleField.addChild(this._back2TilingSprite);
            await this._back1TilingSprite.bitmap.imagePromise;
            await this._back2TilingSprite.bitmap.imagePromise;
        }
    }

    public updateBattleback() {
        if (!this._battlebackLocated) {
            this.locateBattleback();
            this._battlebackLocated = true;
        }
    }

    public locateBattleback() {
        if (
            ConfigManager.graphicsOptions.screenResolution.reposition === true
        ) {
            const sprite1 = this._back1Sprite;
            const sprite2 = this._back2Sprite;
            sprite1.bitmap.imagePromise.then(() => {
                const xCorrection1 =
                    ConfigManager.fieldResolution.widthPx / sprite1.width;
                const yCorrection1 =
                    ConfigManager.fieldResolution.heightPx / sprite1.height;
                sprite1.scale.x = xCorrection1;
                sprite1.scale.y = yCorrection1;
            });
            sprite2.bitmap.imagePromise.then(() => {
                const xCorrection2 =
                    ConfigManager.fieldResolution.widthPx / sprite2.width;
                const yCorrection2 =
                    ConfigManager.fieldResolution.heightPx / sprite2.height;
                sprite2.scale.x = xCorrection2;
                sprite2.scale.y = yCorrection2;
            });
        } else {
            const width = this._battleField.width;
            const height = this._battleField.height;
            const sprite1 = this._back1TilingSprite;
            const sprite2 = this._back2TilingSprite;
            sprite1.bitmap.imagePromise.then(() => {
                sprite1.origin.x =
                    sprite1.x + (sprite1.bitmap.width - width) / 2;
            });
            sprite2.bitmap.imagePromise.then(() => {
                sprite2.origin.x =
                    sprite1.y + (sprite2.bitmap.width - width) / 2;
            });

            if ($gameSystem.isSideView()) {
                sprite1.origin.y = sprite1.x + sprite1.bitmap.height - height;
                sprite2.origin.y = sprite1.y + sprite2.bitmap.height - height;
            }
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
        const sprites = [...this._enemySprites, ...this._actorSprites];
        const length = sprites.length;
        const result: Sprite_Battler[] = [];
        for (let i = 0; i < length; ++i) {
            const sprite = sprites[i];
            if (!sprite) continue;
            if (!sprite.battler) continue;
            result.push(sprite);
        }
        return result;
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
        return false;
    }
}
