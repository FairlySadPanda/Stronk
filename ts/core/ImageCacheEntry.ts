import { Bitmap } from "./Bitmap";
import { CacheEntry } from "./CacheEntry";

export class ImageCacheEntry extends CacheEntry {
    private _bitmap: Bitmap;

    public get bitmap(): Bitmap {
        return this._bitmap;
    }
    public set bitmap(value: Bitmap) {
        this._bitmap = value;
    }
}
