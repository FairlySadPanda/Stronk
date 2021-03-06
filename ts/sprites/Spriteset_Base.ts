import { Graphics } from "../core/Graphics";
import { Rectangle } from "../core/Rectangle";
import { ScreenSprite } from "../core/ScreenSprite";
import { Sprite } from "../core/Sprite";
import { ToneFilter } from "../core/ToneFilter";
import { ToneSprite } from "../core/ToneSprite";
import { Utils } from "../core/Utils";
import { Sprite_Picture } from "./Sprite_Picture";
import { Sprite_Timer } from "./Sprite_Timer";
import { ConfigManager } from "../managers/ConfigManager";

// -----------------------------------------------------------------------------
// Spriteset_Base
//
// The superclass of Spriteset_Map and Spriteset_Battle.

export abstract class Spriteset_Base extends Sprite {
    protected _baseSprite: Sprite;
    private _tone: number[];
    private _blackScreen: ScreenSprite;
    private _toneFilter: ToneFilter;
    private _toneSprite: ToneSprite;
    private _pictureContainer: Sprite;
    private _timerSprite: Sprite_Timer;
    private _flashSprite: ScreenSprite;
    private _fadeSprite: ScreenSprite;
    private _bitmapPromises: Promise<void>[];

    protected get bitmapPromises(): Promise<void>[] {
        if (!this._bitmapPromises) {
            this._bitmapPromises = [];
        }
        return this._bitmapPromises;
    }

    public constructor() {
        super();
        this.setFrame(
            0,
            0,
            ConfigManager.currentResolution.widthPx,
            ConfigManager.currentResolution.heightPx
        );
        this._tone = [0, 0, 0, 0];
        this.opaque = true;
        this.createLowerLayer();
        this.createToneChanger();
        this.createUpperLayer();
        this.update();
    }

    public createLowerLayer() {
        this.createBaseSprite();
    }

    public createUpperLayer() {
        this.createPictures();
        this.createTimer();
        this.createScreenSprites();
    }

    public update() {
        super.update();
        this.updateScreenSprites();
        this.updateToneChanger();
        this.updatePosition();
    }

    public createBaseSprite() {
        this._baseSprite = new Sprite();
        this._baseSprite.setFrame(
            ConfigManager.xOffset,
            0,
            this.width,
            this.height
        );
        this._blackScreen = new ScreenSprite();
        this._blackScreen.opacity = 255;
        this.addChild(this._baseSprite);
        this._baseSprite.addChild(this._blackScreen);
    }

    public createToneChanger() {
        this.createWebGLToneChanger();
    }

    public createWebGLToneChanger() {
        const margin = 48;
        const width = ConfigManager.currentResolution.widthPx + margin * 2;
        const height = ConfigManager.currentResolution.heightPx + margin * 2;
        this._toneFilter = new ToneFilter();
        this._toneFilter.enabled = false;
        this._baseSprite.filters = [this._toneFilter];
        this._baseSprite.filterArea = new Rectangle(
            -margin,
            -margin,
            width,
            height
        );
    }

    public createPictures() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        const x = (ConfigManager.fieldResolution.widthPx - width) / 2;
        const y = (ConfigManager.fieldResolution.heightPx - height) / 2;
        this._pictureContainer = new Sprite();
        this._pictureContainer.setFrame(x, y, width, height);
        for (let i = 1; i <= $gameScreen.maxPictures(); i++) {
            this._pictureContainer.addChild(new Sprite_Picture(i));
        }
        this.addChild(this._pictureContainer);
    }

    public createTimer() {
        this._timerSprite = new Sprite_Timer();
        this.addChild(this._timerSprite);
    }

    public createScreenSprites() {
        this._flashSprite = new ScreenSprite();
        this._fadeSprite = new ScreenSprite();
        this.addChild(this._flashSprite);
        this.addChild(this._fadeSprite);
    }

    public updateScreenSprites() {
        const color = $gameScreen.flashColor();
        this._flashSprite.setColor(color[0], color[1], color[2]);
        this._flashSprite.opacity = color[3];
        this._fadeSprite.opacity = 255 - $gameScreen.brightness();
    }

    public updateToneChanger() {
        const tone = $gameScreen.tone();
        if (!Utils.arrayEquals(this._tone, tone)) {
            this._tone = Utils.arrayClone(tone);
            this.updateWebGLToneChanger();
        }
    }

    public updateWebGLToneChanger() {
        const tone = this._tone;
        this._toneFilter.reset();
        if (tone[0] || tone[1] || tone[2] || tone[3]) {
            this._toneFilter.enabled = true;
            this._toneFilter.adjustTone(tone[0], tone[1], tone[2]);
            this._toneFilter.adjustSaturation(-tone[3]);
        } else {
            this._toneFilter.enabled = false;
        }
    }

    public updatePosition() {
        const screen = $gameScreen;
        const scale = screen.zoomScale();
        this.scale.x = scale;
        this.scale.y = scale;
        this.x = Math.round(-screen.zoomX() * (scale - 1));
        this.y = Math.round(-screen.zoomY() * (scale - 1));
        this.x += Math.round(screen.shake());
    }

    public isNeedToWaitForLoadingComplete(): boolean {
        return this.bitmapPromises.length > 0;
    }

    public async waitForloadingComplete(): Promise<void> {
        await Promise.all(this.bitmapPromises);
    }
}
