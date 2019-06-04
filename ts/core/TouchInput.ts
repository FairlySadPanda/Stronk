import Graphics from "./Graphics";
import Utils from "./Utils";

interface TouchInputEvent {
    triggered: boolean;
    cancelled: boolean;
    moved: boolean;
    released: boolean;
    wheelX: number;
    wheelY: number;
}

declare let window: any;

export default class TouchInput {
    public static get wheelX(): number {
        return this._wheelX;
    }

    public static get wheelY(): number {
        return this._wheelY;
    }

    public static get x(): number {
        return this._x;
    }

    public static get y(): number {
        return this._y;
    }

    public static get date(): number {
        return this._date;
    }

    public static keyRepeatWait = 24;
    public static keyRepeatInterval = 6;

    public static initialize() {
        this.clear();
        this.setupEventHandlers();
    }

    public static clear() {
        this.mousePressed = false;
        this.screenPressed = false;
        this.pressedTime = 0;
        this.events = {
            triggered: false,
            cancelled: false,
            moved: false,
            released: false,
            wheelX: 0,
            wheelY: 0
        };
        this.triggered = false;
        this.cancelled = false;
        this.moved = false;
        this.released = false;
        this._wheelX = 0;
        this._wheelY = 0;
        this._x = 0;
        this._y = 0;
        this._date = 0;
    }

    public static update() {
        this.triggered = this.events.triggered;
        this.cancelled = this.events.cancelled;
        this.moved = this.events.moved;
        this.released = this.events.released;
        this._wheelX = this.events.wheelX;
        this._wheelY = this.events.wheelY;
        this.events.triggered = false;
        this.events.cancelled = false;
        this.events.moved = false;
        this.events.released = false;
        this.events.wheelX = 0;
        this.events.wheelY = 0;
        if (this.isPressed()) {
            this.pressedTime++;
        }
    }

    public static isPressed(): boolean {
        return this.mousePressed || this.screenPressed;
    }

    public static isTriggered(): boolean {
        return this.triggered;
    }

    public static isRepeated(): boolean {
        return (
            this.isPressed() &&
            (this.triggered ||
                (this.pressedTime >= this.keyRepeatWait &&
                    this.pressedTime % this.keyRepeatInterval === 0))
        );
    }

    public static isLongPressed(): boolean {
        return this.isPressed() && this.pressedTime >= this.keyRepeatWait;
    }

    public static isCancelled(): boolean {
        return this.cancelled;
    }

    public static isMoved(): boolean {
        return this.moved;
    }

    public static isReleased(): boolean {
        return this.released;
    }

    private static mousePressed: boolean;
    private static screenPressed: boolean;
    private static pressedTime: number;
    private static events: TouchInputEvent;
    private static triggered: boolean;
    private static cancelled: boolean;
    private static moved: boolean;
    private static released: boolean;
    private static _wheelX: number;
    private static _wheelY: number;
    private static _x: number;
    private static _y: number;
    private static _date: number;

    private static setupEventHandlers() {
        const isSupportPassive = Utils.isSupportPassiveEvent();
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
        document.addEventListener("wheel", this.onWheel.bind(this));
        document.addEventListener(
            "touchstart",
            this.onTouchStart.bind(this),
            isSupportPassive ? { passive: false } : false
        );
        document.addEventListener(
            "touchmove",
            this.onTouchMove.bind(this),
            isSupportPassive ? { passive: false } : false
        );
        document.addEventListener("touchend", this.onTouchEnd.bind(this));
        document.addEventListener("touchcancel", this.onTouchCancel.bind(this));
        document.addEventListener("pointerdown", this.onPointerDown.bind(this));
    }

    private static onMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            this.onLeftButtonDown(event);
        } else if (event.button === 1) {
            this.onMiddleButtonDown(event);
        } else if (event.button === 2) {
            this.onRightButtonDown(event);
        }
    }

    private static onLeftButtonDown(event: MouseEvent) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this.mousePressed = true;
            this.pressedTime = 0;
            this.onTrigger(x, y);
        }
    }

    private static onMiddleButtonDown(event: MouseEvent) {}

    private static onRightButtonDown(event: MouseEvent) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this.onCancel(x, y);
        }
    }

    private static onMouseMove(event: MouseEvent) {
        if (this.mousePressed) {
            const x = Graphics.pageToCanvasX(event.pageX);
            const y = Graphics.pageToCanvasY(event.pageY);
            this.onMove(x, y);
        }
    }

    private static onMouseUp(event: MouseEvent) {
        if (event.button === 0) {
            const x = Graphics.pageToCanvasX(event.pageX);
            const y = Graphics.pageToCanvasY(event.pageY);
            this.mousePressed = false;
            this.onRelease(x, y);
        }
    }

    private static onWheel(event: WheelEvent) {
        this.events.wheelX += event.deltaX;
        this.events.wheelY += event.deltaY;
        event.preventDefault();
    }

    private static onTouchStart(event: TouchEvent) {
        // @ts-ignore
        for (const touch of event.changedTouches) {
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            if (Graphics.isInsideCanvas(x, y)) {
                this.screenPressed = true;
                this.pressedTime = 0;
                if (event.touches.length >= 2) {
                    this.onCancel(x, y);
                } else {
                    this.onTrigger(x, y);
                }
                event.preventDefault();
            }
        }

        if (window.cordova || window.navigator.standalone) {
            event.preventDefault();
        }
    }

    private static onTouchMove(event: TouchEvent) {
        // @ts-ignore
        for (const touch of event.changedTouches) {
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            this.onMove(x, y);
        }
    }

    private static onTouchEnd(event: TouchEvent) {
        // @ts-ignore
        for (const touch of event.changedTouches) {
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            this.screenPressed = false;
            this.onRelease(x, y);
        }
    }

    private static onTouchCancel() {
        this.screenPressed = false;
    }

    private static onPointerDown(event: PointerEvent) {
        if (event.pointerType === "touch" && !event.isPrimary) {
            const x = Graphics.pageToCanvasX(event.pageX);
            const y = Graphics.pageToCanvasY(event.pageY);
            if (Graphics.isInsideCanvas(x, y)) {
                // For Microsoft Edge
                this.onCancel(x, y);
                event.preventDefault();
            }
        }
    }

    private static onTrigger(x: number, y: number) {
        this.events.triggered = true;
        this._x = x;
        this._y = y;
        this._date = Date.now();
    }

    private static onCancel(x: number, y: number) {
        this.events.cancelled = true;
        this._x = x;
        this._y = y;
    }

    private static onMove(x: number, y: number) {
        this.events.moved = true;
        this._x = x;
        this._y = y;
    }

    private static onRelease(x: number, y: number) {
        this.events.released = true;
        this._x = x;
        this._y = y;
    }
}
