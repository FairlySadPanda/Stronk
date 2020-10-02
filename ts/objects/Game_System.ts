import { AudioManager } from "../managers/AudioManager";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

interface Game_System_OnLoad {
    _saveEnabled: boolean;
    _menuEnabled: boolean;
    _encounterEnabled: boolean;
    _formationEnabled: boolean;
    _battleCount: number;
    _winCount: number;
    _escapeCount: number;
    _saveCount: number;
    _versionId: number;
    _framesOnSave: number;
    _bgmOnSave: any;
    _bgsOnSave: any;
    _windowTone: number[];
    _battleBgm: any;
    _victoryMe: any;
    _defeatMe: any;
    _savedBgm: any;
    _walkingBgm: any;
}

export class Game_System {
    private _saveEnabled: boolean;
    private _menuEnabled: boolean;
    private _encounterEnabled: boolean;
    private _formationEnabled: boolean;
    private _battleCount: number;
    private _winCount: number;
    private _escapeCount: number;
    private _saveCount: number;
    private _versionId: number;
    private _framesOnSave: number;
    private _bgmOnSave: any;
    private _bgsOnSave: any;
    private _windowTone: number[];
    private _battleBgm: any;
    private _victoryMe: any;
    private _defeatMe: any;
    private _savedBgm: any;
    private _walkingBgm: any;
    _battleSystem: string;

    public constructor(gameLoadInput?: Game_System_OnLoad) {
        if (gameLoadInput) {
            this._saveEnabled = gameLoadInput._saveEnabled;
            this._menuEnabled = gameLoadInput._menuEnabled;
            this._encounterEnabled = gameLoadInput._encounterEnabled;
            this._formationEnabled = gameLoadInput._formationEnabled;
            this._battleCount = gameLoadInput._battleCount;
            this._winCount = gameLoadInput._winCount;
            this._escapeCount = gameLoadInput._escapeCount;
            this._saveCount = gameLoadInput._saveCount;
            this._versionId = gameLoadInput._versionId;
            this._framesOnSave = gameLoadInput._framesOnSave;
            this._bgmOnSave = gameLoadInput._bgmOnSave;
            this._bgsOnSave = gameLoadInput._bgsOnSave;
            this._windowTone = gameLoadInput._windowTone;
            this._battleBgm = gameLoadInput._battleBgm;
            this._victoryMe = gameLoadInput._victoryMe;
            this._defeatMe = gameLoadInput._defeatMe;
            this._savedBgm = gameLoadInput._savedBgm;
            this._walkingBgm = gameLoadInput._walkingBgm;
        } else {
            this._saveEnabled = true;
            this._menuEnabled = true;
            this._encounterEnabled = true;
            this._formationEnabled = true;
            this._battleCount = 0;
            this._winCount = 0;
            this._escapeCount = 0;
            this._saveCount = 0;
            this._versionId = 0;
            this._framesOnSave = 0;
            this._bgmOnSave = null;
            this._bgsOnSave = null;
            this._windowTone = [0, 0, 0];
            this._battleBgm = null;
            this._victoryMe = null;
            this._defeatMe = null;
            this._savedBgm = null;
            this._walkingBgm = null;
        }
        this.initBattleSystem();
    }

    public initBattleSystem() {
        this._battleSystem = Yanfly.Param.BECSystem.toLowerCase();
    }

    public getBattleSystem() {
        if (this._battleSystem === undefined) this.initBattleSystem();
        return this._battleSystem;
    }

    public setBattleSystem(type) {
        this._battleSystem = type.toLowerCase();
    }

    public isJapanese() {
        return $dataSystem.locale.match(/^ja/);
    }

    public isChinese() {
        return $dataSystem.locale.match(/^zh/);
    }

    public isKorean() {
        return $dataSystem.locale.match(/^ko/);
    }

    public isCJK() {
        return $dataSystem.locale.match(/^(ja|zh|ko)/);
    }

    public isRussian() {
        return $dataSystem.locale.match(/^ru/);
    }

    public isSideView() {
        return $dataSystem.optSideView;
    }

    public isSaveEnabled() {
        return this._saveEnabled;
    }

    public disableSave() {
        this._saveEnabled = false;
    }

    public enableSave() {
        this._saveEnabled = true;
    }

    public isMenuEnabled() {
        return this._menuEnabled;
    }

    public disableMenu() {
        this._menuEnabled = false;
    }

    public enableMenu() {
        this._menuEnabled = true;
    }

    public isEncounterEnabled() {
        return this._encounterEnabled;
    }

    public disableEncounter() {
        this._encounterEnabled = false;
    }

    public enableEncounter() {
        this._encounterEnabled = true;
    }

    public isFormationEnabled() {
        return this._formationEnabled;
    }

    public disableFormation() {
        this._formationEnabled = false;
    }

    public enableFormation() {
        this._formationEnabled = true;
    }

    public battleCount() {
        return this._battleCount;
    }

    public winCount() {
        return this._winCount;
    }

    public escapeCount() {
        return this._escapeCount;
    }

    public saveCount() {
        return this._saveCount;
    }

    public versionId() {
        return this._versionId;
    }

    public windowTone() {
        return this._windowTone || $dataSystem.windowTone;
    }

    public setWindowTone(value) {
        this._windowTone = value;
    }

    public battleBgm() {
        return this._battleBgm || $dataSystem.battleBgm;
    }

    public setBattleBgm(value) {
        this._battleBgm = value;
    }

    public victoryMe() {
        return this._victoryMe || $dataSystem.victoryMe;
    }

    public setVictoryMe(value) {
        this._victoryMe = value;
    }

    public defeatMe() {
        return this._defeatMe || $dataSystem.defeatMe;
    }

    public setDefeatMe(value) {
        this._defeatMe = value;
    }

    public onBattleStart() {
        this._battleCount++;
    }

    public onBattleWin() {
        this._winCount++;
    }

    public onBattleEscape() {
        this._escapeCount++;
    }

    public onBeforeSave() {
        this._saveCount++;
        this._versionId = $dataSystem.versionId;
        this._bgmOnSave = AudioManager.saveBgm();
        this._bgsOnSave = AudioManager.saveBgs();
    }

    public onAfterLoad() {
        AudioManager.playBgm(this._bgmOnSave);
        AudioManager.playBgs(this._bgsOnSave);
    }

    public saveBgm() {
        this._savedBgm = AudioManager.saveBgm();
    }

    public replayBgm() {
        if (this._savedBgm) {
            AudioManager.replayBgm(this._savedBgm);
        }
    }

    public saveWalkingBgm() {
        this._walkingBgm = AudioManager.saveBgm();
    }

    public replayWalkingBgm() {
        if (this._walkingBgm) {
            AudioManager.playBgm(this._walkingBgm);
        }
    }

    public saveWalkingBgm2() {
        this._walkingBgm = $dataMap.bgm;
    }
}
