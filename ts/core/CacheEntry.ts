import { CacheMap } from "./CacheMap";

export class CacheEntry {
    private cache: CacheMap;
    private key: string;
    private item: string;
    private cached: boolean;
    private touchTicks: number;
    private touchSeconds: number;
    private ttlTicks: number;
    private ttlSeconds: number;
    private freedByTTL: boolean;
    private _reservationId: string;

    public constructor(cache: CacheMap, key: string, item: string) {
        this.cache = cache;
        this.key = key;
        this.item = item;
        this.cached = false;
        this.touchTicks = 0;
        this.touchSeconds = 0;
        this.ttlTicks = 0;
        this.ttlSeconds = 0;
        this.freedByTTL = false;
    }

    public free(byTTL: boolean): void {
        this.freedByTTL = byTTL || false;
        if (this.cached) {
            this.cached = false;
            delete this.cache.inner[this.key];
        }
    }

    public allocate(): CacheEntry {
        if (!this.cached) {
            this.cache.inner[this.key] = this;
            this.cached = true;
        }
        this.touch();
        return this;
    }

    public isStillAlive(): boolean {
        return (
            (this.ttlTicks === 0 ||
                this.touchTicks + this.ttlTicks < this.cache.updateTicks) &&
            (this.ttlSeconds === 0 ||
                this.touchSeconds + this.ttlSeconds < this.cache.updateSeconds)
        );
    }

    public touch(): void {
        if (this.cached) {
            this.touchTicks = this.cache.updateTicks;
            this.touchSeconds = this.cache.updateSeconds;
        } else if (this.freedByTTL) {
            this.freedByTTL = false;
            if (!this.cache.inner[this.key]) {
                this.cache.inner[this.key] = this;
            }
        }
    }

    public get reservationId(): string {
        return this._reservationId;
    }

    public set reservationId(value: string) {
        this._reservationId = value;
    }
}
