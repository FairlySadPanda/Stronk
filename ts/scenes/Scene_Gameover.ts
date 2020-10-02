import { Input } from "../core/Input";
import { Sprite } from "../core/Sprite";
import { TouchInput } from "../core/TouchInput";
import { AudioManager } from "../managers/AudioManager";
import { ImageManager } from "../managers/ImageManager";
import { SceneManager } from "../managers/SceneManager";
import { Scene_Base } from "./Scene_Base";
import { Scene_Title } from "./Scene_Title";
import { ConfigManager } from "../managers/ConfigManager";

export class Scene_Gameover extends Scene_Base {
    private _backSprite: Sprite;

    public create() {
        super.create();
        this.playGameoverMusic();
        this.createBackground();
    }

    public start() {
        super.start();
        this.startFadeIn(this.slowFadeSpeed(), false);
    }

    public update() {
        if (this.isActive() && !this.isBusy() && this.isTriggered()) {
            this.gotoTitle();
        }
        super.update();
    }

    public stop() {
        super.stop();
        this.fadeOutAll();
    }

    public terminate() {
        this._bypassFirstClear = true;
        super.terminate();
        AudioManager.stopAll();
        this.clearChildren();
    }

    public playGameoverMusic() {
        AudioManager.stopBgm();
        AudioManager.stopBgs();
        AudioManager.playMe($dataSystem.gameoverMe);
    }

    public createBackground() {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadSystem("GameOver");
        this.addChild(this._backSprite);
    }

    public isTriggered() {
        return Input.isTriggered("ok") || TouchInput.isTriggered();
    }

    public gotoTitle() {
        SceneManager.goto(Scene_Title);
    }

    public rescaleBackground() {
        this.rescaleImageSprite(this._backSprite);
    }

    public rescaleImageSprite(sprite) {
        if (sprite.bitmap.width <= 0 || sprite.bitmap <= 0) {
            return setTimeout(this.rescaleImageSprite.bind(this, sprite), 5);
        }
        const width = ConfigManager.currentResolution.widthPx;
        const height = ConfigManager.currentResolution.heightPx;
        const ratioX = width / sprite.bitmap.width;
        const ratioY = height / sprite.bitmap.height;
        if (ratioX > 1.0) sprite.scale.x = ratioX;
        if (ratioY > 1.0) sprite.scale.y = ratioY;
        this.centerSprite(sprite);
    }

    public centerSprite(sprite) {
        sprite.x = ConfigManager.currentResolution.widthPx / 2;
        sprite.y = ConfigManager.currentResolution.heightPx / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    }
}
