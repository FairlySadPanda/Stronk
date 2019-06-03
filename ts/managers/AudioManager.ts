import Decrypter from "../core/Decrypter";
import Graphics from "../core/Graphics";
import Html5Audio from "../core/Html5Audio";
import Utils from "../core/Utils";
import WebAudio from "../core/WebAudio";

export default abstract class AudioManager {
    public static _masterVolume: number;    public static _bgmVolume: number;
    public static _bgsVolume: number;
    public static _meVolume: number;
    public static _seVolume: number;
    public static _currentBgm: any;
    public static _currentBgs: any;
    public static _bgmBuffer: any;
    public static _bgsBuffer: any;
    public static _meBuffer: any;
    public static _seBuffers: any[];
    public static _staticBuffers: any[];
    public static _replayFadeTime: number;
    public static _path: string;
    public static _blobUrl: any;
    public static playBgm: (bgm: any, pos?: any) => void;
    public static playEncryptedBgm: (bgm: any, pos: any) => void;
    public static createDecryptBuffer: (url: any, bgm: any, pos: any) => void;
    public static replayBgm: (bgm: any) => void;
    public static isCurrentBgm: (bgm: any) => boolean;
    public static updateBgmParameters: (bgm: any) => void;
    public static updateCurrentBgm: (bgm: any, pos: any) => void;
    public static stopBgm: () => void;
    public static fadeOutBgm: (duration: any) => void;
    public static fadeInBgm: (duration: any) => void;
    public static playBgs: (bgs: any, pos?: any) => void;
    public static replayBgs: (bgs: any) => void;
    public static isCurrentBgs: (bgs: any) => boolean;
    public static updateBgsParameters: (bgs: any) => void;
    public static updateCurrentBgs: (bgs: any, pos: any) => void;
    public static stopBgs: () => void;
    public static fadeOutBgs: (duration: any) => void;
    public static fadeInBgs: (duration: any) => void;
    public static playMe: (me: any) => void;
    public static updateMeParameters: (me: any) => void;
    public static fadeOutMe: (duration: any) => void;
    public static stopMe: () => void;
    public static playSe: (se: any) => void;
    public static updateSeParameters: (buffer: any, se: any) => void;
    public static stopSe: () => void;
    public static playStaticSe: (se: any) => void;
    public static loadStaticSe: (se: any) => void;
    public static isStaticSe: (se: any) => boolean;
    public static stopAll: () => void;
    public static saveBgm: () => any;
    public static saveBgs: () => any;
    public static makeEmptyAudioObject: () => { "name": string; "volume": number; "pitch": number; };
    public static createBuffer: (folder: any, name: any) => WebAudio | typeof Html5Audio;
    public static updateBufferParameters: (buffer: any, configVolume: any, audio: any) => void;
    public static audioFileExt: () => ".ogg" | ".m4a";
    public static shouldUseHtml5Audio: () => boolean;
    public static checkErrors: () => void;
    public static checkWebAudioError: (webAudio: any) => void;
    public static bgmVolume: any;
    public static bgsVolume: any;
    public static meVolume: any;
    public static seVolume: any;
}

AudioManager._masterVolume   = 1;   // (min: 0, max: 1)
AudioManager._bgmVolume      = 100;
AudioManager._bgsVolume      = 100;
AudioManager._meVolume       = 100;
AudioManager._seVolume       = 100;
AudioManager._currentBgm     = null;
AudioManager._currentBgs     = null;
AudioManager._bgmBuffer      = null;
AudioManager._bgsBuffer      = null;
AudioManager._meBuffer       = null;
AudioManager._seBuffers      = [];
AudioManager._staticBuffers  = [];
AudioManager._replayFadeTime = 0.5;
AudioManager._path           = "audio/";
AudioManager._blobUrl        = null;

Object.defineProperty(AudioManager, "masterVolume", {
    "get"() {
        return AudioManager._masterVolume;
    },
    "set"(value) {
        AudioManager._masterVolume = value;
        WebAudio.setMasterVolume(AudioManager._masterVolume);
        Graphics.setVideoVolume(AudioManager._masterVolume);
    },
    "configurable": true
});

Object.defineProperty(AudioManager, "bgmVolume", {
    "get"() {
        return AudioManager._bgmVolume;
    },
    "set"(value) {
        AudioManager._bgmVolume = value;
        AudioManager.updateBgmParameters(AudioManager._currentBgm);
    },
    "configurable": true
});

Object.defineProperty(AudioManager, "bgsVolume", {
    "get"() {
        return AudioManager._bgsVolume;
    },
    "set"(value) {
        AudioManager._bgsVolume = value;
        AudioManager.updateBgsParameters(AudioManager._currentBgs);
    },
    "configurable": true
});

Object.defineProperty(AudioManager, "meVolume", {
    "get"() {
        return AudioManager._meVolume;
    },
    "set"(value) {
        AudioManager._meVolume = value;
        AudioManager.updateMeParameters(this._currentMe);
    },
    "configurable": true
});

Object.defineProperty(AudioManager, "seVolume", {
    "get"() {
        return AudioManager._seVolume;
    },
    "set"(value) {
        AudioManager._seVolume = value;
    },
    "configurable": true
});

AudioManager.playBgm = function (bgm, pos?) {
    if (AudioManager.isCurrentBgm(bgm)) {
        AudioManager.updateBgmParameters(bgm);
    } else {
        AudioManager.stopBgm();
        if (bgm.name) {
            if(Decrypter.hasEncryptedAudio && AudioManager.shouldUseHtml5Audio()){
                AudioManager.playEncryptedBgm(bgm, pos);
            }
            else {
                AudioManager._bgmBuffer = AudioManager.createBuffer("bgm", bgm.name);
                AudioManager.updateBgmParameters(bgm);
                if (!AudioManager._meBuffer) {
                    AudioManager._bgmBuffer.play(true, pos || 0);
                }
            }
        }
    }
    AudioManager.updateCurrentBgm(bgm, pos);
};

AudioManager.playEncryptedBgm = function (bgm, pos) {
    const ext = AudioManager.audioFileExt();
    let url = AudioManager._path + "bgm/" + encodeURIComponent(bgm.name) + ext;
    url = Decrypter.extToEncryptExt(url);
    Decrypter.decryptHTML5Audio(url, bgm, pos);
};

AudioManager.createDecryptBuffer = function (url, bgm, pos){
    AudioManager._blobUrl = url;
    AudioManager._bgmBuffer = AudioManager.createBuffer("bgm", bgm.name);
    AudioManager.updateBgmParameters(bgm);
    if (!AudioManager._meBuffer) {
        AudioManager._bgmBuffer.play(true, pos || 0);
    }
    AudioManager.updateCurrentBgm(bgm, pos);
};

AudioManager.replayBgm = function (bgm) {
    if (AudioManager.isCurrentBgm(bgm)) {
        AudioManager.updateBgmParameters(bgm);
    } else {
        AudioManager.playBgm(bgm, bgm.pos);
        if (AudioManager._bgmBuffer) {
            AudioManager._bgmBuffer.fadeIn(AudioManager._replayFadeTime);
        }
    }
};

AudioManager.isCurrentBgm = function (bgm) {
    return (AudioManager._currentBgm && AudioManager._bgmBuffer &&
            AudioManager._currentBgm.name === bgm.name);
};

AudioManager.updateBgmParameters = function (bgm) {
    AudioManager.updateBufferParameters(AudioManager._bgmBuffer, AudioManager._bgmVolume, bgm);
};

AudioManager.updateCurrentBgm = function (bgm, pos) {
    AudioManager._currentBgm = {
        "name": bgm.name,
        "volume": bgm.volume,
        "pitch": bgm.pitch,
        "pan": bgm.pan,
        "pos": pos
    };
};

AudioManager.stopBgm = function () {
    if (AudioManager._bgmBuffer) {
        AudioManager._bgmBuffer.stop();
        AudioManager._bgmBuffer = null;
        AudioManager._currentBgm = null;
    }
};

AudioManager.fadeOutBgm = function (duration) {
    if (AudioManager._bgmBuffer && AudioManager._currentBgm) {
        AudioManager._bgmBuffer.fadeOut(duration);
        AudioManager._currentBgm = null;
    }
};

AudioManager.fadeInBgm = function (duration) {
    if (AudioManager._bgmBuffer && AudioManager._currentBgm) {
        AudioManager._bgmBuffer.fadeIn(duration);
    }
};

AudioManager.playBgs = function (bgs, pos?) {
    if (AudioManager.isCurrentBgs(bgs)) {
        AudioManager.updateBgsParameters(bgs);
    } else {
        AudioManager.stopBgs();
        if (bgs.name) {
            AudioManager._bgsBuffer = AudioManager.createBuffer("bgs", bgs.name);
            AudioManager.updateBgsParameters(bgs);
            AudioManager._bgsBuffer.play(true, pos || 0);
        }
    }
    AudioManager.updateCurrentBgs(bgs, pos);
};

AudioManager.replayBgs = function (bgs) {
    if (AudioManager.isCurrentBgs(bgs)) {
        AudioManager.updateBgsParameters(bgs);
    } else {
        AudioManager.playBgs(bgs, bgs.pos);
        if (AudioManager._bgsBuffer) {
            AudioManager._bgsBuffer.fadeIn(AudioManager._replayFadeTime);
        }
    }
};

AudioManager.isCurrentBgs = function (bgs) {
    return (AudioManager._currentBgs && AudioManager._bgsBuffer &&
            AudioManager._currentBgs.name === bgs.name);
};

AudioManager.updateBgsParameters = function (bgs) {
    AudioManager.updateBufferParameters(AudioManager._bgsBuffer, AudioManager._bgsVolume, bgs);
};

AudioManager.updateCurrentBgs = function (bgs, pos) {
    AudioManager._currentBgs = {
        "name": bgs.name,
        "volume": bgs.volume,
        "pitch": bgs.pitch,
        "pan": bgs.pan,
        "pos": pos
    };
};

AudioManager.stopBgs = function () {
    if (AudioManager._bgsBuffer) {
        AudioManager._bgsBuffer.stop();
        AudioManager._bgsBuffer = null;
        AudioManager._currentBgs = null;
    }
};

AudioManager.fadeOutBgs = function (duration) {
    if (AudioManager._bgsBuffer && AudioManager._currentBgs) {
        AudioManager._bgsBuffer.fadeOut(duration);
        AudioManager._currentBgs = null;
    }
};

AudioManager.fadeInBgs = function (duration) {
    if (AudioManager._bgsBuffer && AudioManager._currentBgs) {
        AudioManager._bgsBuffer.fadeIn(duration);
    }
};

AudioManager.playMe = function (me) {
    AudioManager.stopMe();
    if (me.name) {
        if (AudioManager._bgmBuffer && AudioManager._currentBgm) {
            AudioManager._currentBgm.pos = AudioManager._bgmBuffer.seek();
            AudioManager._bgmBuffer.stop();
        }
        AudioManager._meBuffer = AudioManager.createBuffer("me", me.name);
        AudioManager.updateMeParameters(me);
        AudioManager._meBuffer.play(false);
        AudioManager._meBuffer.addStopListener(AudioManager.stopMe.bind(this));
    }
};

AudioManager.updateMeParameters = function (me) {
    AudioManager.updateBufferParameters(AudioManager._meBuffer, AudioManager._meVolume, me);
};

AudioManager.fadeOutMe = function (duration) {
    if (AudioManager._meBuffer) {
        AudioManager._meBuffer.fadeOut(duration);
    }
};

AudioManager.stopMe = function () {
    if (AudioManager._meBuffer) {
        AudioManager._meBuffer.stop();
        AudioManager._meBuffer = null;
        if (AudioManager._bgmBuffer && AudioManager._currentBgm && !AudioManager._bgmBuffer.isPlaying()) {
            AudioManager._bgmBuffer.play(true, AudioManager._currentBgm.pos);
            AudioManager._bgmBuffer.fadeIn(AudioManager._replayFadeTime);
        }
    }
};

AudioManager.playSe = function (se) {
    if (se.name) {
        AudioManager._seBuffers = AudioManager._seBuffers.filter(function (audio) {
            return audio.isPlaying();
        });
        const buffer = AudioManager.createBuffer("se", se.name);
        AudioManager.updateSeParameters(buffer, se);
        buffer.play(false);
        AudioManager._seBuffers.push(buffer);
    }
};

AudioManager.updateSeParameters = function (buffer, se) {
    AudioManager.updateBufferParameters(buffer, AudioManager._seVolume, se);
};

AudioManager.stopSe = function () {
    AudioManager._seBuffers.forEach(function (buffer) {
        buffer.stop();
    });
    AudioManager._seBuffers = [];
};

AudioManager.playStaticSe = function (se) {
    if (se.name) {
        AudioManager.loadStaticSe(se);
        for (let i = 0; i < AudioManager._staticBuffers.length; i++) {
            const buffer = AudioManager._staticBuffers[i];
            if (buffer.reservedSeName === se.name) {
                buffer.stop();
                AudioManager.updateSeParameters(buffer, se);
                buffer.play(false);
                break;
            }
        }
    }
};

AudioManager.loadStaticSe = function (se) {
    if (se.name && !AudioManager.isStaticSe(se)) {
        const buffer = AudioManager.createBuffer("se", se.name);
        buffer.reservedSeName = se.name;
        AudioManager._staticBuffers.push(buffer);
        if (AudioManager.shouldUseHtml5Audio()) {
            Html5Audio.setStaticSe(buffer._url);
        }
    }
};

AudioManager.isStaticSe = function (se) {
    for (let i = 0; i < AudioManager._staticBuffers.length; i++) {
        const buffer = AudioManager._staticBuffers[i];
        if (buffer.reservedSeName === se.name) {
            return true;
        }
    }
    return false;
};

AudioManager.stopAll = function () {
    AudioManager.stopMe();
    AudioManager.stopBgm();
    AudioManager.stopBgs();
    AudioManager.stopSe();
};

AudioManager.saveBgm = function () {
    if (AudioManager._currentBgm) {
        const bgm = AudioManager._currentBgm;
        return {
            "name": bgm.name,
            "volume": bgm.volume,
            "pitch": bgm.pitch,
            "pan": bgm.pan,
            "pos": AudioManager._bgmBuffer ? AudioManager._bgmBuffer.seek() : 0
        };
    } else {
        return AudioManager.makeEmptyAudioObject();
    }
};

AudioManager.saveBgs = function () {
    if (AudioManager._currentBgs) {
        const bgs = AudioManager._currentBgs;
        return {
            "name": bgs.name,
            "volume": bgs.volume,
            "pitch": bgs.pitch,
            "pan": bgs.pan,
            "pos": AudioManager._bgsBuffer ? AudioManager._bgsBuffer.seek() : 0
        };
    } else {
        return AudioManager.makeEmptyAudioObject();
    }
};

AudioManager.makeEmptyAudioObject = function () {
    return { "name": "", "volume": 0, "pitch": 0 };
};

AudioManager.createBuffer = function (folder, name) {
    const ext = AudioManager.audioFileExt();
    const url = AudioManager._path + folder + "/" + encodeURIComponent(name) + ext;
    if (AudioManager.shouldUseHtml5Audio() && folder === "bgm") {
        if(AudioManager._blobUrl) { Html5Audio.setup(AudioManager._blobUrl); }
        else { Html5Audio.setup(url); }
        return Html5Audio;
    } else {
        return new WebAudio(url);
    }
};

AudioManager.updateBufferParameters = function (buffer, configVolume, audio) {
    if (buffer && audio) {
        buffer.volume = configVolume * (audio.volume || 0) / 10000;
        buffer.pitch = (audio.pitch || 0) / 100;
        buffer.pan = (audio.pan || 0) / 100;
    }
};

AudioManager.audioFileExt = function () {
    if (WebAudio.canPlayOgg() && !Utils.isMobileDevice()) {
        return ".ogg";
    } else {
        return ".m4a";
    }
};

AudioManager.shouldUseHtml5Audio = function () {
    // The only case where we wanted html5audio was android/ no encrypt
    // Atsuma-ru asked to force webaudio there too, so just return false for ALL    // return Utils.isAndroidChrome() && !Decrypter.hasEncryptedAudio;
 return false;
};

AudioManager.checkErrors = function () {
    AudioManager.checkWebAudioError(AudioManager._bgmBuffer);
    AudioManager.checkWebAudioError(AudioManager._bgsBuffer);
    AudioManager.checkWebAudioError(AudioManager._meBuffer);
    AudioManager._seBuffers.forEach(function (buffer) {
        AudioManager.checkWebAudioError(buffer);
    }.bind(this));
    AudioManager._staticBuffers.forEach(function (buffer) {
        AudioManager.checkWebAudioError(buffer);
    }.bind(this));
};

AudioManager.checkWebAudioError = function (webAudio) {
    if (webAudio && webAudio.isError()) {
        throw new Error("Failed to load: " + webAudio.url);
    }
};
