import Game_Character, { Game_Character_OnLoad } from "./Game_Character";

interface Game_Follower_OnLoad extends Game_Character_OnLoad {
    _memberIndex: number;
}

export default class Game_Follower extends Game_Character {
    private _memberIndex: number;

    public constructor(memberIndex?: number, gameLoadInput?: Game_Follower_OnLoad) {
        super(gameLoadInput);
        this._memberIndex = memberIndex;
        this.setTransparent($dataSystem.optTransparent);
        this.setThrough(true);

        if (gameLoadInput) {
            this._memberIndex = gameLoadInput._memberIndex;
        }
    }

    public refresh() {
        const characterName = this.isVisible() ? this.actor().characterName() : "";
        const characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
        this.setImage(characterName, characterIndex);
    }

    public actor() {
        return $gameParty.battleMembers()[this._memberIndex];
    }

    public isVisible() {
        return this.actor() && $gamePlayer.followers().isVisible();
    }

    public update() {
        super.update();
        this.setMoveSpeed($gamePlayer.realMoveSpeed());
        this.setOpacity($gamePlayer.opacity());
        this.setBlendMode($gamePlayer.blendMode());
        this.setWalkAnime($gamePlayer.hasWalkAnime());
        this.setStepAnime($gamePlayer.hasStepAnime());
        this.setDirectionFix($gamePlayer.isDirectionFixed());
        this.setTransparent($gamePlayer.isTransparent());
    }

    public chaseCharacter(character) {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (sx !== 0 && sy !== 0) {
            this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
        } else if (sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6);
        } else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
        }
        this.setMoveSpeed($gamePlayer.realMoveSpeed());
    }

}
