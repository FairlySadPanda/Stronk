import Bitmap from "./Bitmap";
import ImageCacheEntry from "./ImageCacheEntry";

export default class ImageCache {
    private limit: number = 10000000; // 10 million
    private items: ImageCacheEntry[] = [];

    public add(key: string, value: Bitmap): void {
        this.items[key] = {
            bitmap: value,
            touch: Date.now(),
            key: key
        };

        this.truncateCache();
    }

    public get(key: string): Bitmap | null {
        if (this.items[key]) {
            const item = this.items[key];
            item.touch = Date.now();
            return item.bitmap;
        }
        return null;
    }

    public reserve(key: string, value: Bitmap, reservationId: string): void {
        if (!this.items[key]) {
            this.items[key] = {
                bitmap: value,
                touch: Date.now(),
                key: key
            };
        }

        this.items[key].reservationId = reservationId;
    }

    public releaseReservation(reservationId): void {
        const items = this.items;
        Object.keys(items)
            .map(function(key) {
                return items[key];
            })
            .forEach(function(item) {
                if (item.reservationId === reservationId) {
                    delete item.reservationId;
                }
            });
    }

    public isReady(): boolean {
        const items = this.items;
        return !Object.keys(items).some(function(key) {
            return (
                !items[key].bitmap.isRequestOnly() &&
                !items[key].bitmap.isReady()
            );
        });
    }

    public getErrorBitmap(): Bitmap {
        let bitmap = null;
        if (
            Object.keys(this.items).some(function(key) {
                if (this.items[key].bitmap.isError()) {
                    bitmap = this.items[key].bitmap;
                    return true;
                }
                return false;
            })
        ) {
            return bitmap;
        }

        return null;
    }

    // TODO: Refactor this function to make more sense
    private truncateCache(): void {
        let sizeLeft = this.limit;

        const items = this.items;

        Object.keys(this.items)
            .map(function(key) {
                return items[key];
            })
            .sort(function(a, b) {
                return b.touch - a.touch;
            })
            .forEach(
                function(item) {
                    if (sizeLeft > 0 || this.mustBeHeld(item)) {
                        const bitmap = item.bitmap;
                        sizeLeft -= bitmap.width * bitmap.height;
                    } else {
                        delete items[item.key];
                    }
                }.bind(this)
            );
    }

    private mustBeHeld(item: ImageCacheEntry): boolean {
        if (item.bitmap.isRequestOnly()) {
            return false;
        }

        if (item.reservationId) {
            return true;
        }

        if (!item.bitmap.isReady()) {
            return true;
        }

        return false;
    }
}
