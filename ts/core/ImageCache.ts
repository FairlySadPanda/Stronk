import Bitmap from "./Bitmap";
import ImageCacheEntry from "./ImageCacheEntry";

export default class ImageCache {

    private limit: number = 10000000; // 10 million
    private items: ImageCacheEntry[] = [];

    public add(key: string, value: Bitmap): void {
        this.items[key] = {
            "bitmap": value,
            "touch": Date.now(),
            "key": key
        };

        this.truncateCache();
        return;
    }

    public get(key: string): Bitmap {
        if (this.items[key]) {
            const item = this.items[key];
            item.touch = Date.now();
            return item.bitmap;
        }
    }

    public reserve(key: string, value: Bitmap, reservationId: string): void {
        if(!this.items[key]){
            this.items[key] = {
                "bitmap": value,
                "touch": Date.now(),
                "key": key
            };
        }

        this.items[key].reservationId = reservationId;
        return;
    }

    public releaseReservation(reservationId): void {
        for (const item of this.items) {
            if (item.reservationId === reservationId) {
                item.reservationId = undefined;
            }
        }

        return;
    }

    public isReady(): boolean {
        for (const item of this.items) {
            if (!item.bitmap.isRequestOnly() && !item.bitmap.isReady()) {
                return false;
            }
        }
        return true;
    }

    public getErrorBitmap(): Bitmap {
        for (const item of this.items) {
            if (item.bitmap.isError()) {
                return item.bitmap;
            }
        }

        return null;
    }

    //TODO: Refactor this function to make more sense
    private truncateCache(): void {
        let sizeLeft = this.limit;

        const items = this.items;

        Object.keys(this.items).map(function (key){
            return items[key];
        }).sort(function (a, b){
            return b.touch - a.touch;
        }).forEach(function (item){
            if(sizeLeft > 0 || this._mustBeHeld(item)){
                const bitmap = item.bitmap;
                sizeLeft -= bitmap.width * bitmap.height;
            }else{
                delete items[item.key];
            }
        }.bind(this));
        return;
    }

    private mustBeHeld(item: ImageCacheEntry): boolean {
        if(item.bitmap.isRequestOnly()) {
            return false;
        }

        if(item.reservationId) {
            return true;
        }

        if(!item.bitmap.isReady()) {
            return true;
        }

        return false;
    }
}
