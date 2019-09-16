import * as fs from "fs";
import * as LZString from "lz-string";
import * as path from "path";
import { Utils } from "../core/Utils";

export abstract class StorageManager {
    public static save(savefileId, json) {
        if (this.isLocalMode()) {
            this.saveToLocalFile(savefileId, json);
        } else {
            this.saveToWebStorage(savefileId, json);
        }
    }

    public static load(savefileId) {
        if (this.isLocalMode()) {
            return this.loadFromLocalFile(savefileId);
        } else {
            return this.loadFromWebStorage(savefileId);
        }
    }

    public static exists(savefileId) {
        if (this.isLocalMode()) {
            return this.localFileExists(savefileId);
        } else {
            return this.webStorageExists(savefileId);
        }
    }

    public static remove(savefileId) {
        if (this.isLocalMode()) {
            this.removeLocalFile(savefileId);
        } else {
            this.removeWebStorage(savefileId);
        }
    }

    public static backup(savefileId) {
        if (this.exists(savefileId)) {
            if (this.isLocalMode()) {
                const data = this.loadFromLocalFile(savefileId);
                const compressed = LZString.compressToBase64(data);
                const dirPath = this.localFileDirectoryPath();
                const filePath = this.localFilePath(savefileId) + ".bak";
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, compressed);
            } else {
                const data = this.loadFromWebStorage(savefileId);
                const compressed = LZString.compressToBase64(data);
                const key = this.webStorageKey(savefileId) + "bak";
                localStorage.setItem(key, compressed);
            }
        }
    }

    public static backupExists(savefileId) {
        if (this.isLocalMode()) {
            return this.localFileBackupExists(savefileId);
        } else {
            return this.webStorageBackupExists(savefileId);
        }
    }

    public static cleanBackup(savefileId) {
        if (this.backupExists(savefileId)) {
            if (this.isLocalMode()) {
                const dirPath = this.localFileDirectoryPath();
                const filePath = this.localFilePath(savefileId);
                fs.unlinkSync(filePath + ".bak");
            } else {
                const key = this.webStorageKey(savefileId);
                localStorage.removeItem(key + "bak");
            }
        }
    }

    public static restoreBackup(savefileId) {
        if (this.backupExists(savefileId)) {
            if (this.isLocalMode()) {
                const data = this.loadFromLocalBackupFile(savefileId);
                const compressed = LZString.compressToBase64(data);

                const dirPath = this.localFileDirectoryPath();
                const filePath = this.localFilePath(savefileId);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, compressed);
                fs.unlinkSync(filePath + ".bak");
            } else {
                const data = this.loadFromWebStorageBackup(savefileId);
                const compressed = LZString.compressToBase64(data);
                const key = this.webStorageKey(savefileId);
                localStorage.setItem(key, compressed);
                localStorage.removeItem(key + "bak");
            }
        }
    }

    public static isLocalMode() {
        return Utils.isNwjs();
    }

    public static saveToLocalFile(savefileId, json) {
        const data = LZString.compressToBase64(json);

        const dirPath = this.localFileDirectoryPath();
        const filePath = this.localFilePath(savefileId);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, data);
    }

    public static loadFromLocalFile(savefileId) {
        let data = null;

        const filePath = this.localFilePath(savefileId);
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath, { encoding: "utf8" });
        }
        return LZString.decompressFromBase64(data);
    }

    public static loadFromLocalBackupFile(savefileId) {
        let data = null;

        const filePath = this.localFilePath(savefileId) + ".bak";
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath, { encoding: "utf8" });
        }
        return LZString.decompressFromBase64(data);
    }

    public static localFileBackupExists(savefileId) {
        return fs.existsSync(this.localFilePath(savefileId) + ".bak");
    }

    public static localFileExists(savefileId) {
        return fs.existsSync(this.localFilePath(savefileId));
    }

    public static removeLocalFile(savefileId) {
        const filePath = this.localFilePath(savefileId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    public static saveToWebStorage(savefileId, json) {
        const key = this.webStorageKey(savefileId);
        const data = LZString.compressToBase64(json);
        localStorage.setItem(key, data);
    }

    public static loadFromWebStorage(savefileId) {
        const key = this.webStorageKey(savefileId);
        const data = localStorage.getItem(key);
        return LZString.decompressFromBase64(data);
    }

    public static loadFromWebStorageBackup(savefileId) {
        const key = this.webStorageKey(savefileId) + "bak";
        const data = localStorage.getItem(key);
        return LZString.decompressFromBase64(data);
    }

    public static webStorageBackupExists(savefileId) {
        const key = this.webStorageKey(savefileId) + "bak";
        return !!localStorage.getItem(key);
    }

    public static webStorageExists(savefileId) {
        const key = this.webStorageKey(savefileId);
        return !!localStorage.getItem(key);
    }

    public static removeWebStorage(savefileId) {
        const key = this.webStorageKey(savefileId);
        localStorage.removeItem(key);
    }

    public static localFileDirectoryPath() {
        const base = path.dirname(process.mainModule.filename);
        return path.join(base, "save/");
    }

    public static localFilePath(savefileId) {
        let name;
        if (savefileId < 0) {
            name = "config.rpgsave";
        } else if (savefileId === 0) {
            name = "global.rpgsave";
        } else {
            name = Utils.format("file%1.rpgsave", savefileId);
        }
        return this.localFileDirectoryPath() + name;
    }

    public static webStorageKey(savefileId) {
        if (savefileId < 0) {
            return "RPG Config";
        } else if (savefileId === 0) {
            return "RPG Global";
        } else {
            return Utils.format("RPG File%1", savefileId);
        }
    }
}
