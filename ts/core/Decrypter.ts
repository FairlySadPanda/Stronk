import AudioManager from "../managers/AudioManager";
import Bitmap from "./Bitmap";

declare var $dataSystem: any;

export default class Decrypter {

    public static hasEncryptedImages: boolean = false;
    public static hasEncryptedAudio: boolean = false;
    public static _requestImgFile: any[] = [];
    public static _headerlength: number = 16;
    public static _xhrOk: number = 400;
    public static _encryptionKey: string = "";
    public static _ignoreList: string[] = [
        "img/system/Window.png"
    ];
    public static SIGNATURE: string = "5250474d56000000";
    public static VER: string = "000301";
    public static REMAIN: string = "0000000000";
    public static checkImgIgnore: (url: any) => boolean;
    public static decryptImg: (url: any, bitmap: any) => void;
    public static decryptHTML5Audio: (url: any, bgm: any, pos: any) => void;
    public static cutArrayHeader: (arrayBuffer: any, length: any) => any;
    public static extToEncryptExt: (url: any) => any;
    public static readEncryptionkey: () => void;
    public static decryptArrayBuffer(response: any): any {
        throw new Error("Method not implemented.");
    }
    public static createBlobUrl(arrayBuffer: any): any {
        throw new Error("Method not implemented.");
    }

}

Decrypter.checkImgIgnore = function (url){
    for(let cnt = 0; cnt < this._ignoreList.length; cnt++) {
        if(url === this._ignoreList[cnt]) { return true; }
    }
    return false;
};

Decrypter.decryptImg = function (url, bitmap) {
    url = this.extToEncryptExt(url);

    const requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();

    requestFile.onload = function () {
        if(this.status < Decrypter._xhrOk) {
            const arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
            bitmap._image.src = Decrypter.createBlobUrl(arrayBuffer);
            bitmap._image.addEventListener("load", bitmap._loadListener = Bitmap.prototype._onLoad.bind(bitmap));
            bitmap._image.addEventListener("error", bitmap._errorListener = bitmap._loader || Bitmap.prototype._onError.bind(bitmap));
        }
    };

    requestFile.onerror = function () {
        if (bitmap._loader) {
            bitmap._loader();
        } else {
            bitmap._onError();
        }
    };
};

Decrypter.decryptHTML5Audio = function (url, bgm, pos) {
    const requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();

    requestFile.onload = function () {
        if(this.status < Decrypter._xhrOk) {
            const arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
            const url = Decrypter.createBlobUrl(arrayBuffer);
            AudioManager.createDecryptBuffer(url, bgm, pos);
        }
    };
};

Decrypter.cutArrayHeader = function (arrayBuffer, length) {
    return arrayBuffer.slice(length);
};

Decrypter.decryptArrayBuffer = function (arrayBuffer) {
    if (!arrayBuffer) { return null; }
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
            byteArray[i] = byteArray[i] ^ parseInt(Decrypter._encryptionKey[i], 16);
            view.setUint8(i, byteArray[i]);
        }
    }

    return arrayBuffer;
};

Decrypter.createBlobUrl = function (arrayBuffer){
    const blob = new Blob([arrayBuffer]);
    return window.URL.createObjectURL(blob);
};

Decrypter.extToEncryptExt = function (url) {
    const ext = url.split(".").pop();
    let encryptedExt = ext;

    if(ext === "ogg") { encryptedExt = ".rpgmvo"; }
    else if(ext === "m4a") { encryptedExt = ".rpgmvm"; }
    else if(ext === "png") { encryptedExt = ".rpgmvp"; }
    else { encryptedExt = ext; }

    return url.slice(0, url.lastIndexOf(ext) - 1) + encryptedExt;
};

Decrypter.readEncryptionkey = function (){
    this._encryptionKey = $dataSystem.encryptionKey.split(/(.{2})/).filter(Boolean);
};
