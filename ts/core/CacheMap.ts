import CacheEntry from "./CacheEntry";

export default class CacheMap {

    private manager: any;
    private _inner: CacheEntry[];
    private lastRemovedEntries: CacheEntry[];
    private _updateTicks: number;
    private lastCheckTTL: number;
    private delayCheckTTL: number;
    private _updateSeconds: number;

    public constructor(manager: any) {
        this.manager = manager;
        this._inner = [];
        this.lastRemovedEntries = [];
        this._updateTicks = 0;
        this.lastCheckTTL = 0;
        this.delayCheckTTL = 100.0;
        this._updateSeconds = Date.now();
    }

    public get inner(): object {
        return this._inner;
    }

    public get updateTicks(): number {
        return this._updateTicks;
    }

    public get updateSeconds(): number {
        return this._updateSeconds;
    }

    public checkTTL(): void {
        if (!this.lastRemovedEntries) {
            this.lastRemovedEntries = [];
        }
        for (const entry of this._inner) {
            if (!entry.isStillAlive()) {
                this._inner.push(entry);
            }
        }
        for (const entry of this.lastRemovedEntries) {
            entry.free(true);
        }
        this.lastRemovedEntries.length = 0;
    }

    public getItem(key: string): CacheEntry|null {
        return this._inner[key] ? this._inner[key].item : null;
    }

    public clear(): void {
        for(const entry of this._inner) {
            entry.free(false);
        }
    }

    public setItem(key: string, item: string): CacheEntry {
        return new CacheEntry(this, key, item).allocate();
    }

    public update(ticks: number, delta: number): void {
        this._updateTicks += ticks;
        this._updateSeconds += delta;
        if (this.updateSeconds >= this.delayCheckTTL + this.lastCheckTTL) {
            this.lastCheckTTL = this.updateSeconds;
            this.checkTTL();
        }
    }

}
