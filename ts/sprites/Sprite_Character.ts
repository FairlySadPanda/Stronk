import Sprite from "../core/Sprite";
import ImageManager from "../managers/ImageManager";
import Sprite_Balloon from "./Sprite_Balloon";
import Sprite_Base from "./Sprite_Base";
import Game_Character from "../objects/Game_Character";

// -----------------------------------------------------------------------------
// Sprite_Character
//
// The sprite for displaying a character.

export default class Sprite_Character extends Sprite_Base {
    private _character: Game_Character;
    private _balloonDuration: number;
    private _tilesetId: number;
    private _upperBody: any;
    private _lowerBody: any;
    private _tileId: any;
    private _characterName: any;
    private _characterIndex: any;
    private _isBigCharacter: any;
    private _bushDepth: number;
    private _balloonSprite: any;

    public constructor(character: Game_Character) {
        super();
        this.initMembers();
        this.setCharacter(character);
    }

    public initMembers() {
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this._character = null;
        this._balloonDuration = 0;
        this._tilesetId = 0;
        this._upperBody = null;
        this._lowerBody = null;
    }

    public setCharacter(character) {
        this._character = character;
    }

    public update() {
        super.update();
        this.updateBitmap();
        this.updateFrame();
        this.updatePosition();
        this.updateAnimation();
        this.updateBalloon();
        this.updateOther();
    }

    public updateVisibility() {
        super.updateVisibility();
        if (this._character.isTransparent()) {
            this.visible = false;
        }
    }

    public isTile() {
        return this._character.tileId() > 0;
    }

    public tilesetBitmap(tileId) {
        const tileset = $gameMap.tileset();
        const setNumber = 5 + Math.floor(tileId / 256);
        return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
    }

    public updateBitmap() {
        if (this.isImageChanged()) {
            this._tilesetId = $gameMap.tilesetId();
            this._tileId = this._character.tileId();
            this._characterName = this._character.characterName();
            this._characterIndex = this._character.characterIndex();
            if (this._tileId > 0) {
                this.setTileBitmap();
            } else {
                this.setCharacterBitmap();
            }
        }
    }

    public isImageChanged() {
        return (
            this._tilesetId !== $gameMap.tilesetId() ||
            this._tileId !== this._character.tileId() ||
            this._characterName !== this._character.characterName() ||
            this._characterIndex !== this._character.characterIndex()
        );
    }

    public setTileBitmap() {
        this.bitmap = this.tilesetBitmap(this._tileId);
    }

    public setCharacterBitmap() {
        this.bitmap = ImageManager.loadCharacter(this._characterName);
        this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
    }

    public updateFrame() {
        if (this._tileId > 0) {
            this.updateTileFrame();
        } else {
            this.updateCharacterFrame();
        }
    }

    public updateTileFrame() {
        const pw = this.patternWidth();
        const ph = this.patternHeight();
        const sx =
            ((Math.floor(this._tileId / 128) % 2) * 8 + (this._tileId % 8)) *
            pw;
        const sy = (Math.floor((this._tileId % 256) / 8) % 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    }

    public updateCharacterFrame() {
        const pw = this.patternWidth();
        const ph = this.patternHeight();
        const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
        const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
        this.updateHalfBodySprites();
        if (this._bushDepth > 0) {
            const d = this._bushDepth;
            this._upperBody.setFrame(sx, sy, pw, ph - d);
            this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
            this.setFrame(sx, sy, 0, ph);
        } else {
            this.setFrame(sx, sy, pw, ph);
        }
    }

    public characterBlockX() {
        if (this._isBigCharacter) {
            return 0;
        } else {
            const index = this._character.characterIndex();
            return (index % 4) * 3;
        }
    }

    public characterBlockY() {
        if (this._isBigCharacter) {
            return 0;
        } else {
            const index = this._character.characterIndex();
            return Math.floor(index / 4) * 4;
        }
    }

    public characterPatternX() {
        return this._character.pattern();
    }

    public characterPatternY() {
        return (this._character.direction() - 2) / 2;
    }

    public patternWidth() {
        if (this._tileId > 0) {
            return $gameMap.tileWidth();
        } else if (this._isBigCharacter) {
            return this.bitmap.width / 3;
        } else {
            return this.bitmap.width / 12;
        }
    }

    public patternHeight() {
        if (this._tileId > 0) {
            return $gameMap.tileHeight();
        } else if (this._isBigCharacter) {
            return this.bitmap.height / 4;
        } else {
            return this.bitmap.height / 8;
        }
    }

    public updateHalfBodySprites() {
        if (this._bushDepth > 0) {
            this.createHalfBodySprites();
            this._upperBody.bitmap = this.bitmap;
            this._upperBody.visible = true;
            this._upperBody.y = -this._bushDepth;
            this._lowerBody.bitmap = this.bitmap;
            this._lowerBody.visible = true;
            this._upperBody.setBlendColor(this.getBlendColor());
            this._lowerBody.setBlendColor(this.getBlendColor());
            this._upperBody.setColorTone(this.getColorTone());
            this._lowerBody.setColorTone(this.getColorTone());
        } else if (this._upperBody) {
            this._upperBody.visible = false;
            this._lowerBody.visible = false;
        }
    }

    public createHalfBodySprites() {
        if (!this._upperBody) {
            this._upperBody = new Sprite();
            this._upperBody.anchor.x = 0.5;
            this._upperBody.anchor.y = 1;
            this.addChild(this._upperBody);
        }
        if (!this._lowerBody) {
            this._lowerBody = new Sprite();
            this._lowerBody.anchor.x = 0.5;
            this._lowerBody.anchor.y = 1;
            this._lowerBody.opacity = 128;
            this.addChild(this._lowerBody);
        }
    }

    public updatePosition() {
        this.x = this._character.screenX();
        this.y = this._character.screenY();
        this.z = this._character.screenZ();
    }

    public updateAnimation() {
        this.setupAnimation();
        if (!this.isAnimationPlaying()) {
            this._character.endAnimation();
        }
        if (!this.isBalloonPlaying()) {
            this._character.endBalloon();
        }
    }

    public updateOther() {
        this.opacity = this._character.opacity();
        this.blendMode = this._character.blendMode();
        this._bushDepth = this._character.bushDepth();
    }

    public setupAnimation() {
        if (this._character.animationId() > 0) {
            const animation = $dataAnimations[this._character.animationId()];
            this.startAnimation(animation, false, 0);
            this._character.startAnimation();
        }
    }

    public setupBalloon() {
        if (this._character.balloonId() > 0) {
            this.startBalloon();
            this._character.startBalloon();
        }
    }

    public startBalloon() {
        if (!this._balloonSprite) {
            this._balloonSprite = new Sprite_Balloon();
        }
        this._balloonSprite.setup(this._character.balloonId());
        this.parent.addChild(this._balloonSprite);
    }

    public updateBalloon() {
        this.setupBalloon();
        if (this._balloonSprite) {
            this._balloonSprite.x = this.x;
            this._balloonSprite.y = this.y - this.height;
            if (!this._balloonSprite.isPlaying()) {
                this.endBalloon();
            }
        }
    }

    public endBalloon() {
        if (this._balloonSprite) {
            this.parent.removeChild(this._balloonSprite);
            this._balloonSprite = null;
        }
    }

    public isBalloonPlaying() {
        return !!this._balloonSprite;
    }
}
