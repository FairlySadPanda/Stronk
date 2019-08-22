import Input from "../core/Input";
import TouchInput from "../core/TouchInput";
import AudioManager from "../managers/AudioManager";
import BattleManager from "../managers/BattleManager";
import DataManager from "../managers/DataManager";
import ImageManager from "../managers/ImageManager";
import SceneManager from "../managers/SceneManager";
import SoundManager from "../managers/SoundManager";
import Spriteset_Map from "../sprites/Spriteset_Map";
import Window_MapName from "../windows/Window_MapName";
import Window_MenuCommand from "../windows/Window_MenuCommand";
import Window_Message from "../windows/Window_Message";
import Window_ScrollText from "../windows/Window_ScrollText";
import Scene_Base from "./Scene_Base";
import Scene_Battle from "./Scene_Battle";
import Scene_Debug from "./Scene_Debug";
import Scene_Gameover from "./Scene_Gameover";
import Scene_Load from "./Scene_Load";
import Scene_Menu from "./Scene_Menu";
import Scene_Title from "./Scene_Title";

export default class Scene_Map extends Scene_Base {
    public menuCalling: boolean;
    private _transfer: boolean;
    private _mapNameWindow: Window_MapName;
    private _messageWindow: Window_Message;
    private _spriteset: Spriteset_Map;
    private _scrollTextWindow: Window_ScrollText;
    private _waitCount: number;
    private _encounterEffectDuration: number;
    private _mapLoaded: boolean;
    private _touchCount: number;

    public constructor() {
        super();
        this._waitCount = 0;
        this._encounterEffectDuration = 0;
        this._mapLoaded = false;
        this._touchCount = 0;
    }

    public create() {
        super.create();
        this._transfer = $gamePlayer.isTransferring();
        const mapId = this._transfer
            ? $gamePlayer.newMapId()
            : $gameMap.mapId();
        DataManager.loadMapData(mapId);
    }

    public isReady() {
        if (!this._mapLoaded && DataManager.isMapLoaded()) {
            this.onMapLoaded();
            this._mapLoaded = true;
        }
        return (
            this._mapLoaded && super.isReady() && this.importantBitmapsAreLoaded
        );
    }

    public onMapLoaded() {
        if (this._transfer) {
            $gamePlayer.performTransfer();
        }
        this.createDisplayObjects();
    }

    public start() {
        super.start();
        SceneManager.clearStack();
        if (this._transfer) {
            this.fadeInForTransfer();
            this._mapNameWindow.open();
            $gameMap.autoplay();
        } else if (this.needsFadeIn()) {
            this.startFadeIn(this.fadeSpeed(), false);
        }
        this.menuCalling = false;
    }

    public update() {
        this.updateDestination();
        this.updateMainMultiply();
        if (this.isSceneChangeOk()) {
            this.updateScene();
        } else if (SceneManager.isNextScene(Scene_Battle)) {
            this.updateEncounterEffect();
        }
        this.updateWaitCount();
        super.update();
    }

    public updateMainMultiply() {
        this.updateMain();
        if (this.isFastForward()) {
            if (!this.isMapTouchOk()) {
                this.updateDestination();
            }
            this.updateMain();
        }
    }

    public updateMain() {
        const active = this.isActive();
        $gameMap.update(active);
        $gamePlayer.update(active);
        $gameTimer.update(active);
        $gameScreen.update();
    }

    public isFastForward() {
        return (
            $gameMap.isEventRunning() &&
            !SceneManager.isSceneChanging() &&
            (Input.isLongPressed("ok") || TouchInput.isLongPressed())
        );
    }

    public stop() {
        super.stop();
        $gamePlayer.straighten();
        this._mapNameWindow.close();
        if (this.needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        } else if (SceneManager.isNextScene(Scene_Map)) {
            this.fadeOutForTransfer();
        } else if (SceneManager.isNextScene(Scene_Battle)) {
            this.launchBattle();
        }
    }

    public isBusy() {
        return (
            (this._messageWindow && this._messageWindow.isClosing()) ||
            this._waitCount > 0 ||
            this._encounterEffectDuration > 0 ||
            super.isBusy()
        );
    }

    public terminate() {
        super.terminate();
        if (!SceneManager.isNextScene(Scene_Battle)) {
            this._spriteset.update();
            this._mapNameWindow.hide();
            SceneManager.snapForBackground();
        } else {
            ImageManager.clearRequest();
        }

        if (SceneManager.isNextScene(Scene_Map)) {
            ImageManager.clearRequest();
        }

        $gameScreen.clearZoom();

        this.removeChild(this._fadeSprite);
        this.removeChild(this._mapNameWindow);
        this.removeChild(this._windowLayer);
        this.removeChild(this._spriteset);
    }

    public needsFadeIn() {
        return (
            SceneManager.isPreviousScene(Scene_Battle) ||
            SceneManager.isPreviousScene(Scene_Load)
        );
    }

    public needsSlowFadeOut() {
        return (
            SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover) ||
            SceneManager.isNextScene(Scene_Battle)
        );
    }

    public updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }

    public updateDestination() {
        if (this.isMapTouchOk()) {
            this.processMapTouch();
        } else {
            $gameTemp.clearDestination();
            this._touchCount = 0;
        }
    }

    public isMapTouchOk() {
        return this.isActive() && $gamePlayer.canMove();
    }

    public processMapTouch() {
        if (TouchInput.isTriggered() || this._touchCount > 0) {
            if (TouchInput.isPressed()) {
                if (this._touchCount === 0 || this._touchCount >= 15) {
                    const x = $gameMap.canvasToMapX(TouchInput.x);
                    const y = $gameMap.canvasToMapY(TouchInput.y);
                    $gameTemp.setDestination(x, y);
                }
                this._touchCount++;
            } else {
                this._touchCount = 0;
            }
        }
    }

    public isSceneChangeOk() {
        return this.isActive() && !$gameMessage.isBusy();
    }

    public updateScene() {
        this.checkGameover();
        if (!SceneManager.isSceneChanging()) {
            this.updateTransferPlayer();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateEncounter();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateCallMenu();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateCallDebug();
        }
    }

    public createDisplayObjects() {
        this.createSpriteset();
        this.createMapNameWindow();
        this.createWindowLayer();
        this.createAllWindows();
    }

    public createSpriteset() {
        this._spriteset = new Spriteset_Map();
        this._spriteset.waitForloadingComplete().then(() => {
            this.importantBitmapsAreLoaded = true;
        });
        this.addChild(this._spriteset);
    }

    public createAllWindows() {
        this.createMessageWindow();
        this.createScrollTextWindow();
    }

    public createMapNameWindow() {
        this._mapNameWindow = new Window_MapName();
        this.addChild(this._mapNameWindow);
    }

    public createMessageWindow() {
        this._messageWindow = new Window_Message();
        this.addWindow(this._messageWindow);
        this._messageWindow.subWindows().forEach(function(window) {
            this.addWindow(window);
        }, this);
    }

    public createScrollTextWindow() {
        this._scrollTextWindow = new Window_ScrollText();
        this.addWindow(this._scrollTextWindow);
    }

    public updateTransferPlayer() {
        if ($gamePlayer.isTransferring()) {
            SceneManager.goto(Scene_Map);
        }
    }

    public updateEncounter() {
        if ($gamePlayer.executeEncounter()) {
            SceneManager.push(Scene_Battle);
        }
    }

    public updateCallMenu() {
        if (this.isMenuEnabled()) {
            if (this.isMenuCalled()) {
                this.menuCalling = true;
            }
            if (this.menuCalling && !$gamePlayer.isMoving()) {
                this.callMenu();
            }
        } else {
            this.menuCalling = false;
        }
    }

    public isMenuEnabled() {
        return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning();
    }

    public isMenuCalled() {
        return Input.isTriggered("menu") || TouchInput.isCancelled();
    }

    public callMenu() {
        SoundManager.playOk();
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
        $gameTemp.clearDestination();
        this._mapNameWindow.hide();
        this._waitCount = 2;
    }

    public updateCallDebug() {
        if (this.isDebugCalled()) {
            SceneManager.push(Scene_Debug);
        }
    }

    public isDebugCalled() {
        return Input.isTriggered("debug") && $gameTemp.isPlaytest();
    }

    public fadeInForTransfer() {
        this.startFadeIn(this.fadeSpeed(), $gamePlayer.fadeType() === 1);
    }

    public fadeOutForTransfer() {
        const fadeType = $gamePlayer.fadeType();
        switch (fadeType) {
            case 0:
            case 1:
                this.startFadeOut(this.fadeSpeed(), fadeType === 1);
                break;
        }
    }

    public launchBattle() {
        BattleManager.saveBgmAndBgs();
        this.stopAudioOnBattleStart();
        SoundManager.playBattleStart();
        this.startEncounterEffect();
        this._mapNameWindow.hide();
    }

    public stopAudioOnBattleStart() {
        if (!AudioManager.isCurrentBgm($gameSystem.battleBgm())) {
            AudioManager.stopBgm();
        }
        AudioManager.stopBgs();
        AudioManager.stopMe();
        AudioManager.stopSe();
    }

    public startEncounterEffect() {
        this._spriteset.hideCharacters();
        this._encounterEffectDuration = this.encounterEffectSpeed();
    }

    public updateEncounterEffect() {
        if (this._encounterEffectDuration > 0) {
            this._encounterEffectDuration--;
            const speed = this.encounterEffectSpeed();
            const n = speed - this._encounterEffectDuration;
            const p = n / speed;
            const q = ((p - 1) * 20 * p + 5) * p + 1;
            const zoomX = $gamePlayer.screenX();
            const zoomY = $gamePlayer.screenY() - 24;
            if (n === 2) {
                $gameScreen.setZoom(zoomX, zoomY, 1);
                this.snapForBattleBackground();
                this.startFlashForEncounter(speed / 2);
            }
            $gameScreen.setZoom(zoomX, zoomY, q);
            if (n === Math.floor(speed / 6)) {
                this.startFlashForEncounter(speed / 2);
            }
            if (n === Math.floor(speed / 2)) {
                BattleManager.playBattleBgm();
                this.startFadeOut(this.fadeSpeed());
            }
        }
    }

    public snapForBattleBackground() {
        this._windowLayer.visible = false;
        SceneManager.snapForBackground();
        this._windowLayer.visible = true;
    }

    public startFlashForEncounter(duration) {
        const color = [255, 255, 255, 255];
        $gameScreen.startFlash(color, duration);
    }

    public encounterEffectSpeed() {
        return 60;
    }
}
