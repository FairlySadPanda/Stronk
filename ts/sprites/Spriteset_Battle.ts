import Graphics from "../core/Graphics";
import Sprite from "../core/Sprite";
import TilingSprite from "../core/TilingSprite";
import BattleManager from "../managers/BattleManager";
import ImageManager from "../managers/ImageManager";
import SceneManager from "../managers/SceneManager";
import Sprite_Actor from "./Sprite_Actor";
import Sprite_Enemy from "./Sprite_Enemy";
import Spriteset_Base from "./Spriteset_Base";

//-----------------------------------------------------------------------------
// Spriteset_Battle
//
// The set of sprites on the battle screen.

export default class Spriteset_Battle extends Spriteset_Base {
    public _battlebackLocated: boolean;
    public createBackground: () => void;
    public createBattleField: () => void;
    public createBattleback: () => void;
    public updateBattleback: () => void;
    public locateBattleback: () => void;
    public battleback1Bitmap: () => any;
    public battleback2Bitmap: () => any;
    public battleback1Name: () => any;
    public battleback2Name: () => any;
    public overworldBattleback1Name: () => any;
    public overworldBattleback2Name: () => any;
    public normalBattleback1Name: () => any;
    public normalBattleback2Name: () => any;
    public terrainBattleback1Name: (type: any) => "Wasteland" | "DirtField" | "Desert" | "Lava1" | "Lava2" | "Snowfield" | "Clouds" | "PoisonSwamp";
    public terrainBattleback2Name: (type: any) => "Wasteland" | "Desert" | "Snowfield" | "Clouds" | "PoisonSwamp" | "Forest" | "Cliff" | "Lava";
    public defaultBattleback1Name: () => string;
    public defaultBattleback2Name: () => string;
    public shipBattleback1Name: () => string;
    public shipBattleback2Name: () => string;
    public autotileType: (z: any) => any;
    public createEnemies: () => void;
    public compareEnemySprite: (a: any, b: any) => number;
    public createActors: () => void;
    public updateActors: () => void;
    public battlerSprites: () => any;
    public isAnimationPlaying: () => any;
    public isEffecting: () => any;
    public isAnyoneMoving: () => any;
    public isBusy: () => any;
    public constructor() {
        super();
        this._battlebackLocated = false;
    }
}

Spriteset_Battle.prototype.createLowerLayer = function () {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBackground();
    this.createBattleField();
    this.createBattleback();
    this.createEnemies();
    this.createActors();
};

Spriteset_Battle.prototype.createBackground = function () {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._baseSprite.addChild(this._backgroundSprite);
};

Spriteset_Battle.prototype.update = function () {
    Spriteset_Base.prototype.update.call(this);
    this.updateActors();
    this.updateBattleback();
};

Spriteset_Battle.prototype.createBattleField = function () {
    const width = Graphics.boxWidth;
    const height = Graphics.boxHeight;
    const x = (Graphics.width - width) / 2;
    const y = (Graphics.height - height) / 2;
    this._battleField = new Sprite();
    this._battleField.setFrame(x, y, width, height);
    this._battleField.x = x;
    this._battleField.y = y;
    this._baseSprite.addChild(this._battleField);
};

Spriteset_Battle.prototype.createBattleback = function () {
    const margin = 32;
    const x = -this._battleField.x - margin;
    const y = -this._battleField.y - margin;
    const width = Graphics.width + margin * 2;
    const height = Graphics.height + margin * 2;
    this._back1Sprite = new TilingSprite();
    this._back2Sprite = new TilingSprite();
    this._back1Sprite.bitmap = this.battleback1Bitmap();
    this._back2Sprite.bitmap = this.battleback2Bitmap();
    this._back1Sprite.move(x, y, width, height);
    this._back2Sprite.move(x, y, width, height);
    this._battleField.addChild(this._back1Sprite);
    this._battleField.addChild(this._back2Sprite);
};

Spriteset_Battle.prototype.updateBattleback = function () {
    if (!this._battlebackLocated) {
        this.locateBattleback();
        this._battlebackLocated = true;
    }
};

Spriteset_Battle.prototype.locateBattleback = function () {
    const width = this._battleField.width;
    const height = this._battleField.height;
    const sprite1 = this._back1Sprite;
    const sprite2 = this._back2Sprite;
    sprite1.origin.x = sprite1.x + (sprite1.bitmap.width - width) / 2;
    sprite2.origin.x = sprite1.y + (sprite2.bitmap.width - width) / 2;
    if ($gameSystem.isSideView()) {
        sprite1.origin.y = sprite1.x + sprite1.bitmap.height - height;
        sprite2.origin.y = sprite1.y + sprite2.bitmap.height - height;
    }
};

Spriteset_Battle.prototype.battleback1Bitmap = function () {
    return ImageManager.loadBattleback1(this.battleback1Name());
};

Spriteset_Battle.prototype.battleback2Bitmap = function () {
    return ImageManager.loadBattleback2(this.battleback2Name());
};

Spriteset_Battle.prototype.battleback1Name = function () {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback1Name;
    } else if ($gameMap.battleback1Name()) {
        return $gameMap.battleback1Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback1Name();
    } else {
        return "";
    }
};

Spriteset_Battle.prototype.battleback2Name = function () {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback2Name;
    } else if ($gameMap.battleback2Name()) {
        return $gameMap.battleback2Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback2Name();
    } else {
        return "";
    }
};

Spriteset_Battle.prototype.overworldBattleback1Name = function () {
    if ($gameMap.battleback1Name() === "") { return ""; }
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback1Name();
    } else {
        return this.normalBattleback1Name();
    }
};

Spriteset_Battle.prototype.overworldBattleback2Name = function () {
    if ($gameMap.battleback2Name() === "") { return ""; }
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback2Name();
    } else {
        return this.normalBattleback2Name();
    }
};

Spriteset_Battle.prototype.normalBattleback1Name = function () {
    return (this.terrainBattleback1Name(this.autotileType(1)) ||
            this.terrainBattleback1Name(this.autotileType(0)) ||
            this.defaultBattleback1Name());
};

Spriteset_Battle.prototype.normalBattleback2Name = function () {
    return (this.terrainBattleback2Name(this.autotileType(1)) ||
            this.terrainBattleback2Name(this.autotileType(0)) ||
            this.defaultBattleback2Name());
};

Spriteset_Battle.prototype.terrainBattleback1Name = function (type) {
    switch (type) {
    case 24: case 25:
        return "Wasteland";
    case 26: case 27:
        return "DirtField";
    case 32: case 33:
        return "Desert";
    case 34:
        return "Lava1";
    case 35:
        return "Lava2";
    case 40: case 41:
        return "Snowfield";
    case 42:
        return "Clouds";
    case 4: case 5:
        return "PoisonSwamp";
    default:
        return null;
    }
};

Spriteset_Battle.prototype.terrainBattleback2Name = function (type) {
    switch (type) {
    case 20: case 21:
        return "Forest";
    case 22: case 30: case 38:
        return "Cliff";
    case 24: case 25: case 26: case 27:
        return "Wasteland";
    case 32: case 33:
        return "Desert";
    case 34: case 35:
        return "Lava";
    case 40: case 41:
        return "Snowfield";
    case 42:
        return "Clouds";
    case 4: case 5:
        return "PoisonSwamp";
    }
};

Spriteset_Battle.prototype.defaultBattleback1Name = function () {
    return "Grassland";
};

Spriteset_Battle.prototype.defaultBattleback2Name = function () {
    return "Grassland";
};

Spriteset_Battle.prototype.shipBattleback1Name = function () {
    return "Ship";
};

Spriteset_Battle.prototype.shipBattleback2Name = function () {
    return "Ship";
};

Spriteset_Battle.prototype.autotileType = function (z) {
    return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
};

Spriteset_Battle.prototype.createEnemies = function () {
    const enemies = $gameTroop.members();
    const sprites = [];
    for (let i = 0; i < enemies.length; i++) {
        sprites[i] = new Sprite_Enemy(enemies[i]);
    }
    sprites.sort(this.compareEnemySprite.bind(this));
    for (let j = 0; j < sprites.length; j++) {
        this._battleField.addChild(sprites[j]);
    }
    this._enemySprites = sprites;
};

Spriteset_Battle.prototype.compareEnemySprite = function (a, b) {
    if (a.y !== b.y) {
        return a.y - b.y;
    } else {
        return b.spriteId - a.spriteId;
    }
};

Spriteset_Battle.prototype.createActors = function () {
    this._actorSprites = [];
    for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
        this._actorSprites[i] = new Sprite_Actor();
        this._battleField.addChild(this._actorSprites[i]);
    }
};

Spriteset_Battle.prototype.updateActors = function () {
    const members = $gameParty.battleMembers();
    for (let i = 0; i < this._actorSprites.length; i++) {
        this._actorSprites[i].setBattler(members[i]);
    }
};

Spriteset_Battle.prototype.battlerSprites = function () {
    return this._enemySprites.concat(this._actorSprites);
};

Spriteset_Battle.prototype.isAnimationPlaying = function () {
    return this.battlerSprites().some(function (sprite) {
        return sprite.isAnimationPlaying();
    });
};

Spriteset_Battle.prototype.isEffecting = function () {
    return this.battlerSprites().some(function (sprite) {
        return sprite.isEffecting();
    });
};

Spriteset_Battle.prototype.isAnyoneMoving = function () {
    return this.battlerSprites().some(function (sprite) {
        return sprite.isMoving();
    });
};

Spriteset_Battle.prototype.isBusy = function () {
    return this.isAnimationPlaying() || this.isAnyoneMoving();
};
