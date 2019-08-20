import Decrypter from "../core/Decrypter";
import Graphics from "../core/Graphics";
import Html5Audio from "../core/Html5Audio";
import Utils from "../core/Utils";
import WebAudio from "../core/WebAudio";

export default abstract class AudioManager {
    private static _masterVolume = 1; // (min: 0, max: 1)
    private static _bgmVolume = 100;
    private static _bgsVolume = 100;
    private static _meVolume = 100;
    private static _seVolume = 100;
    private static _currentBgm = null;
    private static _currentBgs = null;
    private static _bgmBuffer = null;
    private static _bgsBuffer = null;
    private static _meBuffer = null;
    private static _seBuffers = [];
    private static _staticBuffers = [];
    private static _replayFadeTime = 0.5;
    private static _path = "audio/";
    private static _blobUrl = null;
    private static _currentMe: number;

    public static playBgm(bgm, pos?) {
        if (AudioManager.isCurrentBgm(bgm)) {
            AudioManager.updateBgmParameters(bgm);
        } else {
            AudioManager.stopBgm();
            if (bgm.name) {
                if (
                    Decrypter.hasEncryptedAudio &&
                    AudioManager.shouldUseHtml5Audio()
                ) {
                    AudioManager.playEncryptedBgm(bgm, pos);
                } else {
                    AudioManager._bgmBuffer = AudioManager.createBuffer(
                        "bgm",
                        bgm.name
                    );
                    AudioManager.updateBgmParameters(bgm);
                    if (!AudioManager._meBuffer) {
                        AudioManager._bgmBuffer.play(true, pos || 0);
                    }
                }
            }
        }
        AudioManager.updateCurrentBgm(bgm, pos);
    }

    public static playEncryptedBgm(bgm, pos) {
        const ext = AudioManager.audioFileExt();
        let url =
            AudioManager._path + "bgm/" + encodeURIComponent(bgm.name) + ext;
        url = Decrypter.extToEncryptExt(url);
        Decrypter.decryptHTML5Audio(url, bgm, pos);
    }

    public static createDecryptBuffer(url, bgm, pos) {
        AudioManager._blobUrl = url;
        AudioManager._bgmBuffer = AudioManager.createBuffer("bgm", bgm.name);
        AudioManager.updateBgmParameters(bgm);
        if (!AudioManager._meBuffer) {
            AudioManager._bgmBuffer.play(true, pos || 0);
        }
        AudioManager.updateCurrentBgm(bgm, pos);
    }

    public static replayBgm(bgm) {
        if (AudioManager.isCurrentBgm(bgm)) {
            AudioManager.updateBgmParameters(bgm);
        } else {
            AudioManager.playBgm(bgm, bgm.pos);
            if (AudioManager._bgmBuffer) {
                AudioManager._bgmBuffer.fadeIn(AudioManager._replayFadeTime);
            }
        }
    }

    public static isCurrentBgm(bgm) {
        return (
            AudioManager._currentBgm &&
            AudioManager._bgmBuffer &&
            AudioManager._currentBgm.name === bgm.name
        );
    }

    public static updateBgmParameters(bgm) {
        AudioManager.updateBufferParameters(
            AudioManager._bgmBuffer,
            AudioManager._bgmVolume,
            bgm
        );
    }

    public static updateCurrentBgm(bgm, pos) {
        AudioManager._currentBgm = {
            name: bgm.name,
            volume: bgm.volume,
            pitch: bgm.pitch,
            pan: bgm.pan,
            pos: pos
        };
    }

    public static stopBgm() {
        if (AudioManager._bgmBuffer) {
            AudioManager._bgmBuffer.stop();
            AudioManager._bgmBuffer = null;
            AudioManager._currentBgm = null;
        }
    }

    public static fadeOutBgm(duration) {
        if (AudioManager._bgmBuffer && AudioManager._currentBgm) {
            AudioManager._bgmBuffer.fadeOut(duration);
            AudioManager._currentBgm = null;
        }
    }

    public static fadeInBgm(duration) {
        if (AudioManager._bgmBuffer && AudioManager._currentBgm) {
            AudioManager._bgmBuffer.fadeIn(duration);
        }
    }

    public static playBgs(bgs, pos?) {
        if (AudioManager.isCurrentBgs(bgs)) {
            AudioManager.updateBgsParameters(bgs);
        } else {
            AudioManager.stopBgs();
            if (bgs.name) {
                AudioManager._bgsBuffer = AudioManager.createBuffer(
                    "bgs",
                    bgs.name
                );
                AudioManager.updateBgsParameters(bgs);
                AudioManager._bgsBuffer.play(true, pos || 0);
            }
        }
        AudioManager.updateCurrentBgs(bgs, pos);
    }

    public static replayBgs(bgs) {
        if (AudioManager.isCurrentBgs(bgs)) {
            AudioManager.updateBgsParameters(bgs);
        } else {
            AudioManager.playBgs(bgs, bgs.pos);
            if (AudioManager._bgsBuffer) {
                AudioManager._bgsBuffer.fadeIn(AudioManager._replayFadeTime);
            }
        }
    }

    public static isCurrentBgs(bgs) {
        return (
            AudioManager._currentBgs &&
            AudioManager._bgsBuffer &&
            AudioManager._currentBgs.name === bgs.name
        );
    }

    public static updateBgsParameters(bgs) {
        AudioManager.updateBufferParameters(
            AudioManager._bgsBuffer,
            AudioManager._bgsVolume,
            bgs
        );
    }

    public static updateCurrentBgs(bgs, pos) {
        AudioManager._currentBgs = {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: pos
        };
    }

    public static stopBgs() {
        if (AudioManager._bgsBuffer) {
            AudioManager._bgsBuffer.stop();
            AudioManager._bgsBuffer = null;
            AudioManager._currentBgs = null;
        }
    }

    public static fadeOutBgs(duration) {
        if (AudioManager._bgsBuffer && AudioManager._currentBgs) {
            AudioManager._bgsBuffer.fadeOut(duration);
            AudioManager._currentBgs = null;
        }
    }

    public static fadeInBgs(duration) {
        if (AudioManager._bgsBuffer && AudioManager._currentBgs) {
            AudioManager._bgsBuffer.fadeIn(duration);
        }
    }

    public static playMe(me) {
        AudioManager.stopMe();
        if (me.name) {
            if (AudioManager._bgmBuffer && AudioManager._currentBgm) {
                AudioManager._currentBgm.pos = AudioManager._bgmBuffer.seek();
                AudioManager._bgmBuffer.stop();
            }
            AudioManager._meBuffer = AudioManager.createBuffer("me", me.name);
            AudioManager.updateMeParameters(me);
            AudioManager._meBuffer.play(false);
            AudioManager._meBuffer.addStopListener(
                AudioManager.stopMe.bind(this)
            );
        }
    }

    public static updateMeParameters(me) {
        AudioManager.updateBufferParameters(
            AudioManager._meBuffer,
            AudioManager._meVolume,
            me
        );
    }

    public static fadeOutMe(duration) {
        if (AudioManager._meBuffer) {
            AudioManager._meBuffer.fadeOut(duration);
        }
    }

    public static stopMe() {
        if (AudioManager._meBuffer) {
            AudioManager._meBuffer.stop();
            AudioManager._meBuffer = null;
            if (
                AudioManager._bgmBuffer &&
                AudioManager._currentBgm &&
                !AudioManager._bgmBuffer.isPlaying()
            ) {
                AudioManager._bgmBuffer.play(
                    true,
                    AudioManager._currentBgm.pos
                );
                AudioManager._bgmBuffer.fadeIn(AudioManager._replayFadeTime);
            }
        }
    }

    public static playSe(se) {
        if (se.name) {
            AudioManager._seBuffers = AudioManager._seBuffers.filter(function(
                audio
            ) {
                return audio.isPlaying();
            });
            const buffer = AudioManager.createBuffer("se", se.name);
            AudioManager.updateSeParameters(buffer, se);
            buffer.play(false, 0);
            AudioManager._seBuffers.push(buffer);
        }
    }

    public static updateSeParameters(buffer, se) {
        AudioManager.updateBufferParameters(buffer, AudioManager._seVolume, se);
    }

    public static stopSe() {
        AudioManager._seBuffers.forEach(function(buffer) {
            buffer.stop();
        });
        AudioManager._seBuffers = [];
    }

    public static playStaticSe(se) {
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
    }

    public static loadStaticSe(se) {
        if (se.name && !AudioManager.isStaticSe(se)) {
            const buffer = AudioManager.createBuffer("se", se.name);
            (buffer as WebAudio).reservedSeName = se.name;
            AudioManager._staticBuffers.push(buffer);
            if (AudioManager.shouldUseHtml5Audio()) {
                Html5Audio.setStaticSe((buffer as WebAudio).url);
            }
        }
    }

    public static isStaticSe(se) {
        for (let i = 0; i < AudioManager._staticBuffers.length; i++) {
            const buffer = AudioManager._staticBuffers[i];
            if (buffer.reservedSeName === se.name) {
                return true;
            }
        }
        return false;
    }

    public static stopAll() {
        AudioManager.stopMe();
        AudioManager.stopBgm();
        AudioManager.stopBgs();
        AudioManager.stopSe();
    }

    public static saveBgm() {
        if (AudioManager._currentBgm) {
            const bgm = AudioManager._currentBgm;
            return {
                name: bgm.name,
                volume: bgm.volume,
                pitch: bgm.pitch,
                pan: bgm.pan,
                pos: AudioManager._bgmBuffer
                    ? AudioManager._bgmBuffer.seek()
                    : 0
            };
        } else {
            return AudioManager.makeEmptyAudioObject();
        }
    }

    public static saveBgs() {
        if (AudioManager._currentBgs) {
            const bgs = AudioManager._currentBgs;
            return {
                name: bgs.name,
                volume: bgs.volume,
                pitch: bgs.pitch,
                pan: bgs.pan,
                pos: AudioManager._bgsBuffer
                    ? AudioManager._bgsBuffer.seek()
                    : 0
            };
        } else {
            return AudioManager.makeEmptyAudioObject();
        }
    }

    public static makeEmptyAudioObject() {
        return { name: "", volume: 0, pitch: 0 };
    }

    public static createBuffer(folder, name) {
        const ext = AudioManager.audioFileExt();
        const url =
            AudioManager._path + folder + "/" + encodeURIComponent(name) + ext;
        if (AudioManager.shouldUseHtml5Audio() && folder === "bgm") {
            if (AudioManager._blobUrl) {
                Html5Audio.setup(AudioManager._blobUrl);
            } else {
                Html5Audio.setup(url);
            }
            return Html5Audio;
        } else {
            return new WebAudio(url);
        }
    }

    public static updateBufferParameters(buffer, configVolume, audio) {
        if (buffer && audio) {
            buffer.volume = (configVolume * (audio.volume || 0)) / 10000;
            buffer.pitch = (audio.pitch || 0) / 100;
            buffer.pan = (audio.pan || 0) / 100;
        }
    }

    public static audioFileExt() {
        if (WebAudio.canPlayOgg() && !Utils.isMobileDevice()) {
            return ".ogg";
        } else {
            return ".m4a";
        }
    }

    public static shouldUseHtml5Audio() {
        return false;
    }

    public static checkErrors() {
        AudioManager.checkWebAudioError(AudioManager._bgmBuffer);
        AudioManager.checkWebAudioError(AudioManager._bgsBuffer);
        AudioManager.checkWebAudioError(AudioManager._meBuffer);
        AudioManager._seBuffers.forEach(function(buffer) {
            AudioManager.checkWebAudioError(buffer);
        });
        AudioManager._staticBuffers.forEach(function(buffer) {
            AudioManager.checkWebAudioError(buffer);
        });
    }

    public static checkWebAudioError(webAudio) {
        if (webAudio && webAudio.isError()) {
            throw new Error("Failed to load: " + webAudio.url);
        }
    }

    public static get masterVolume() {
        return AudioManager._masterVolume;
    }

    public static set masterVolume(value) {
        AudioManager._masterVolume = value;
        WebAudio.setMasterVolume(AudioManager._masterVolume);
        Graphics.setVideoVolume(AudioManager._masterVolume);
    }

    public static get bgmVolume() {
        return AudioManager._bgmVolume;
    }

    public static set bgmVolume(value) {
        AudioManager._bgmVolume = value;
        AudioManager.updateBgmParameters(AudioManager._currentBgm);
    }

    public static get bgsVolume() {
        return AudioManager._bgsVolume;
    }

    public static set bgsVolume(value) {
        AudioManager._bgsVolume = value;
        AudioManager.updateBgsParameters(AudioManager._currentBgs);
    }

    public static get meVolume() {
        return AudioManager._meVolume;
    }

    public static set meVolume(value) {
        AudioManager._meVolume = value;
        AudioManager.updateMeParameters(this._currentMe);
    }

    public static get seVolume() {
        return AudioManager._seVolume;
    }

    public static set seVolume(value) {
        AudioManager._seVolume = value;
    }
}
