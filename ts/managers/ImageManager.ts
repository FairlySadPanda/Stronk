import { Bitmap } from "../core/Bitmap";
import { CacheMap } from "../core/CacheMap";
import { ImageCache } from "../core/ImageCache";
import { RequestQueue } from "../core/RequestQueue";
import { Utils } from "../core/Utils";

export abstract class ImageManager {
    public static cache = new CacheMap(ImageManager);

    public static loadAnimation(filename, hue?): Bitmap {
        return this.loadBitmap("img/animations/", filename, hue, true);
    }
    public static loadBattleback1(filename, hue?): Bitmap {
        return this.loadBitmap("img/battlebacks1/", filename, hue, true);
    }
    public static loadBattleback2(filename, hue?): Bitmap {
        return this.loadBitmap("img/battlebacks2/", filename, hue, true);
    }
    public static loadEnemy(filename, hue?): Bitmap {
        return this.loadBitmap("img/enemies/", filename, hue, true);
    }
    public static loadCharacter(filename, hue?): Bitmap {
        return this.loadBitmap("img/characters/", filename, hue, false);
    }
    public static loadFace(filename, hue?): Bitmap {
        return this.loadBitmap("img/faces/", filename, hue, true);
    }

    public static loadParallax(filename, hue?): Bitmap {
        return this.loadBitmap("img/parallaxes/", filename, hue, true);
    }

    public static loadPicture(filename, hue?): Bitmap {
        return this.loadBitmap("img/pictures/", filename, hue, true);
    }

    public static loadSvActor(filename, hue?): Bitmap {
        return this.loadBitmap("img/sv_actors/", filename, hue, false);
    }

    public static loadSvEnemy(filename, hue?): Bitmap {
        return this.loadBitmap("img/sv_enemies/", filename, hue, true);
    }

    public static loadSystem(filename, hue?): Bitmap {
        return this.loadBitmap("img/system/", filename, hue, false);
    }

    public static loadTileset(filename, hue?): Bitmap {
        return this.loadBitmap("img/tilesets/", filename, hue, false);
    }

    public static loadTitle1(filename, hue?): Bitmap {
        return this.loadBitmap("img/titles1/", filename, hue, true);
    }

    public static loadTitle2(filename, hue?): Bitmap {
        return this.loadBitmap("img/titles2/", filename, hue, true);
    }

    public static loadBitmap(
        folder: string,
        filename?: string,
        hue?: number,
        smooth?: boolean
    ): Bitmap {
        if (filename) {
            const path = folder + encodeURIComponent(filename) + ".png";
            const bitmap = this.loadNormalBitmap(path, hue || 0);
            bitmap.smooth = smooth;
            return bitmap;
        } else {
            return this.loadEmptyBitmap();
        }
    }

    public static loadEmptyBitmap(): Bitmap {
        let empty = this._imageCache.get("empty");
        if (!empty) {
            empty = new Bitmap();
            this._imageCache.add("empty", empty);
            this._imageCache.reserve(
                "empty",
                empty,
                this._systemReservationId.toString()
            );
        }

        return empty;
    }

    public static loadNormalBitmap(path, hue?): Bitmap {
        const key = this._generateCacheKey(path, hue);
        let bitmap = this._imageCache.get(key);
        if (!bitmap) {
            bitmap = Bitmap.load(path);
            this._callCreationHook(bitmap);

            bitmap.addLoadListener(function() {
                bitmap.rotateHue(hue);
            });
            this._imageCache.add(key, bitmap);
        } else if (!bitmap.isReady()) {
            bitmap.decode();
        }

        return bitmap;
    }

    public static clear() {
        this._imageCache = new ImageCache();
    }

    public static isReady(): boolean {
        return this._imageCache.isReady();
    }

    public static isObjectCharacter(filename): boolean {
        const sign = filename.match(/^[!$]+/);
        return sign && sign[0].includes("!");
    }

    public static isBigCharacter(filename): boolean {
        const sign = filename.match(/^[!$]+/);
        return sign && sign[0].includes("$");
    }

    public static isZeroParallax(filename): boolean {
        return filename.charAt(0) === "!";
    }

    public static reserveAnimation(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/animations/",
            filename,
            hue,
            true,
            reservationId
        );
    }

    public static reserveBattleback1(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/battlebacks1/",
            filename,
            hue,
            true,
            reservationId
        );
    }

    public static reserveBattleback2(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/battlebacks2/",
            filename,
            hue,
            true,
            reservationId
        );
    }

    public static reserveEnemy(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/enemies/",
            filename,
            hue,
            true,
            reservationId
        );
    }

    public static reserveCharacter(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/characters/",
            filename,
            hue,
            false,
            reservationId
        );
    }

    public static reserveFace(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/faces/",
            filename,
            hue,
            true,
            reservationId
        );
    }

    public static reserveParallax(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/parallaxes/",
            filename,
            hue,
            true,
            reservationId
        );
    }

    public static reservePicture(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/pictures/",
            filename,
            hue,
            true,
            reservationId
        );
    }

    public static reserveSvActor(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/sv_actors/",
            filename,
            hue,
            false,
            reservationId
        );
    }

    public static reserveSvEnemy(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/sv_enemies/",
            filename,
            hue,
            true,
            reservationId
        );
    }

    public static reserveSystem(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/system/",
            filename,
            hue,
            false,
            reservationId || this._systemReservationId
        );
    }

    public static reserveTileset(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/tilesets/",
            filename,
            hue,
            false,
            reservationId
        );
    }

    public static reserveTitle1(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/titles1/",
            filename,
            hue,
            true,
            reservationId
        );
    }

    public static reserveTitle2(filename, hue?, reservationId?): Bitmap {
        return this.reserveBitmap(
            "img/titles2/",
            filename,
            hue,
            true,
            reservationId
        );
    }

    public static reserveBitmap(
        folder,
        filename,
        hue,
        smooth,
        reservationId
    ): Bitmap {
        if (filename) {
            const path = folder + encodeURIComponent(filename) + ".png";
            const bitmap = this.reserveNormalBitmap(
                path,
                hue || 0,
                reservationId || this._defaultReservationId
            );
            bitmap.smooth = smooth;
            return bitmap;
        } else {
            return this.loadEmptyBitmap();
        }
    }

    public static reserveNormalBitmap(path, hue?, reservationId?): Bitmap {
        const bitmap = this.loadNormalBitmap(path, hue);
        this._imageCache.reserve(
            this._generateCacheKey(path, hue),
            bitmap,
            reservationId
        );
        return bitmap;
    }

    public static releaseReservation(reservationId) {
        this._imageCache.releaseReservation(reservationId);
    }

    public static setDefaultReservationId(reservationId) {
        this._defaultReservationId = reservationId;
    }

    public static requestAnimation(filename, hue?): Bitmap {
        return this.requestBitmap("img/animations/", filename, hue, true);
    }

    public static requestBattleback1(filename, hue?): Bitmap {
        return this.requestBitmap("img/battlebacks1/", filename, hue, true);
    }

    public static requestBattleback2(filename, hue?: Bitmap) {
        return this.requestBitmap("img/battlebacks2/", filename, hue, true);
    }

    public static requestEnemy(filename, hue?): Bitmap {
        return this.requestBitmap("img/enemies/", filename, hue, true);
    }

    public static requestCharacter(filename, hue?): Bitmap {
        return this.requestBitmap("img/characters/", filename, hue, false);
    }

    public static requestFace(filename, hue?): Bitmap {
        return this.requestBitmap("img/faces/", filename, hue, true);
    }

    public static requestParallax(filename, hue?): Bitmap {
        return this.requestBitmap("img/parallaxes/", filename, hue, true);
    }

    public static requestPicture(filename, hue?): Bitmap {
        return this.requestBitmap("img/pictures/", filename, hue, true);
    }

    public static requestSvActor(filename, hue?): Bitmap {
        return this.requestBitmap("img/sv_actors/", filename, hue, false);
    }

    public static requestSvEnemy(filename, hue?): Bitmap {
        return this.requestBitmap("img/sv_enemies/", filename, hue, true);
    }

    public static requestSystem(filename, hue?): Bitmap {
        return this.requestBitmap("img/system/", filename, hue, false);
    }

    public static requestTileset(filename, hue?): Bitmap {
        return this.requestBitmap("img/tilesets/", filename, hue, false);
    }

    public static requestTitle1(filename, hue?): Bitmap {
        return this.requestBitmap("img/titles1/", filename, hue, true);
    }

    public static requestTitle2(filename, hue?): Bitmap {
        return this.requestBitmap("img/titles2/", filename, hue, true);
    }

    public static requestBitmap(folder, filename, hue, smooth): Bitmap {
        if (filename) {
            const path = folder + encodeURIComponent(filename) + ".png";
            const bitmap = this.requestNormalBitmap(path, hue || 0);
            bitmap.smooth = smooth;
            return bitmap;
        } else {
            return this.loadEmptyBitmap();
        }
    }

    public static requestNormalBitmap(path, hue?): Bitmap {
        const key = this._generateCacheKey(path, hue);
        let bitmap = this._imageCache.get(key);
        if (!bitmap) {
            bitmap = Bitmap.request(path);
            this._callCreationHook(bitmap);

            bitmap.addLoadListener(function() {
                bitmap.rotateHue(hue);
            });
            this._imageCache.add(key, bitmap);
            this._requestQueue.enqueue(key, bitmap);
        } else {
            this._requestQueue.raisePriority(key);
        }

        return bitmap;
    }

    public static update() {
        this._requestQueue.update();
    }

    public static clearRequest() {
        this._requestQueue.clear();
    }

    public static setCreationHook(hook) {
        this._creationHook = hook;
    }
    private static _creationHook: any;

    private static _imageCache = new ImageCache();
    private static _requestQueue = new RequestQueue();
    private static _systemReservationId = Utils.generateRuntimeId();
    private static _defaultReservationId: any;

    private static _generateCacheKey(path, hue?) {
        return path + ":" + hue;
    }

    private static _callCreationHook(bitmap) {
        if (this._creationHook) {
            this._creationHook(bitmap);
        }
    }
}
