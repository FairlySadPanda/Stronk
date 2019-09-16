import { Bitmap } from "./Bitmap";

export class RequestQueue {
    private queue: any[] = [];

    public enqueue(key: string, value: Bitmap): void {
        this.queue.push({
            key: key,
            value: value
        });
    }

    public update(): void {
        if (this.queue.length === 0) {
            return;
        }

        if (this.queue[0].value.isRequestReady()) {
            this.queue.shift();
            if (this.queue.length !== 0) {
                this.queue[0].value.startRequest();
            }
        } else {
            this.queue[0].value.startRequest();
        }
    }

    public raisePriority(key: string): void {
        for (let n = 0; n < this.queue.length; n++) {
            const item = this.queue[n];
            if (item.key === key) {
                this.queue.splice(n, 1);
                this.queue.unshift(item);
                break;
            }
        }
    }

    public clear(): void {
        this.queue.splice(0);
    }
}
