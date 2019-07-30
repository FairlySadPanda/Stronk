import AudioManager from "../managers/AudioManager";
import Bitmap from "./Bitmap";

export default class Decrypter {
    private static _ignoreList: any = [];
    private static _headerlength: number;
    private static _encryptionKey: any;
    private static _xhrOk: any;
    public static status: any;
    public static SIGNATURE: any;
    public static VER: any;
    public static REMAIN: any;
    public static hasEncryptedImages: boolean;
    public static hasEncryptedAudio: boolean;

    public static checkImgIgnore(url) {
        for (let cnt = 0; cnt < this._ignoreList.length; cnt++) {
            if (url === this._ignoreList[cnt]) {
                return true;
            }
        }
        return false;
    }

    public static decryptImg(url, bitmap) {
        url = this.extToEncryptExt(url);

        const requestFile = new XMLHttpRequest();
        requestFile.open("GET", url);
        requestFile.responseType = "arraybuffer";
        requestFile.send();
        requestFile.onload = () => {
            if (this.status < Decrypter._xhrOk) {
                const arrayBuffer = Decrypter.decryptArrayBuffer(
                    requestFile.response
                );
                bitmap._image.src = Decrypter.createBlobUrl(arrayBuffer);
                bitmap._image.addEventListener(
                    "load",
                    (bitmap._loadListener = Bitmap.prototype._onLoad.bind(
                        bitmap
                    ))
                );
                bitmap._image.addEventListener(
                    "error",
                    (bitmap._errorListener =
                        bitmap._loader ||
                        Bitmap.prototype._onError.bind(bitmap))
                );
            }
        };

        requestFile.onerror = () => {
            if (bitmap._loader) {
                bitmap._loader();
            } else {
                bitmap._onError();
            }
        };
    }

    public static decryptHTML5Audio(url, bgm, pos) {
        const requestFile = new XMLHttpRequest();
        requestFile.open("GET", url);
        requestFile.responseType = "arraybuffer";
        requestFile.send();

        requestFile.onload = () => {
            if (this.status < Decrypter._xhrOk) {
                const arrayBuffer = Decrypter.decryptArrayBuffer(
                    requestFile.response
                );
                const url = Decrypter.createBlobUrl(arrayBuffer);
                AudioManager.createDecryptBuffer(url, bgm, pos);
            }
        };
    }

    public static cutArrayHeader(arrayBuffer, length) {
        return arrayBuffer.slice(length);
    }

    public static decryptArrayBuffer(arrayBuffer) {
        if (!arrayBuffer) {
            return null;
        }
        const header = new Uint8Array(arrayBuffer, 0, this._headerlength);

        let i;
        const ref = this.SIGNATURE + this.VER + this.REMAIN;
        const refBytes = new Uint8Array(16);
        for (i = 0; i < this._headerlength; i++) {
            refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
        }
        for (i = 0; i < this._headerlength; i++) {
            if (header[i] !== refBytes[i]) {
                throw new Error("Header is wrong");
            }
        }

        arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
        const view = new DataView(arrayBuffer);
        this.readEncryptionkey();
        if (arrayBuffer) {
            const byteArray = new Uint8Array(arrayBuffer);
            for (i = 0; i < this._headerlength; i++) {
                byteArray[i] =
                    byteArray[i] ^ parseInt(Decrypter._encryptionKey[i], 16);
                view.setUint8(i, byteArray[i]);
            }
        }

        return arrayBuffer;
    }

    public static createBlobUrl(arrayBuffer) {
        const blob = new Blob([arrayBuffer]);
        return window.URL.createObjectURL(blob);
    }

    public static extToEncryptExt(url) {
        const ext = url.split(".").pop();
        let encryptedExt = ext;

        if (ext === "ogg") {
            encryptedExt = ".rpgmvo";
        } else if (ext === "m4a") {
            encryptedExt = ".rpgmvm";
        } else if (ext === "png") {
            encryptedExt = ".rpgmvp";
        } else {
            encryptedExt = ext;
        }

        return url.slice(0, url.lastIndexOf(ext) - 1) + encryptedExt;
    }

    public static readEncryptionkey() {
        this._encryptionKey = $dataSystem.encryptionKey
            .split(/(.{2})/)
            .filter(Boolean);
    }
}
