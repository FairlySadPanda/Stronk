import Rectangle from "../core/Rectangle";
import Sprite from "../core/Sprite";
import TouchInput from "../core/TouchInput";

// -----------------------------------------------------------------------------
// Sprite_Button
//
// The sprite for displaying a button.

export default class Sprite_Button extends Sprite {
    private _touching: boolean;
    private _coldFrame: any;
    private _hotFrame: any;
    private _clickHandler: any;

    public constructor() {
        super();
        this._touching = false;
        this._coldFrame = null;
        this._hotFrame = null;
        this._clickHandler = null;
    }

    public update() {
        super.update();
        this.updateFrame();
        this.processTouch();
    }

    public updateFrame() {
        let frame: { x: any; y: any; width: any; height: any };
        if (this._touching) {
            frame = this._hotFrame;
        } else {
            frame = this._coldFrame;
        }
        if (frame) {
            this.setFrame(frame.x, frame.y, frame.width, frame.height);
        }
    }

    public setColdFrame(x: number, y: number, width: number, height: number) {
        this._coldFrame = new Rectangle(x, y, width, height);
    }

    public setHotFrame(x: number, y: number, width: number, height: number) {
        this._hotFrame = new Rectangle(x, y, width, height);
    }

    public setClickHandler(method: any) {
        this._clickHandler = method;
    }

    public callClickHandler() {
        if (this._clickHandler) {
            this._clickHandler();
        }
    }

    public processTouch() {
        if (this.isActive()) {
            if (TouchInput.isTriggered() && this.isButtonTouched()) {
                this._touching = true;
            }
            if (this._touching) {
                if (TouchInput.isReleased() || !this.isButtonTouched()) {
                    this._touching = false;
                    if (TouchInput.isReleased()) {
                        this.callClickHandler();
                    }
                }
            }
        } else {
            this._touching = false;
        }
    }

    public isActive() {
        let node: PIXI.Container = this;
        while (node) {
            if (!node.visible) {
                return false;
            }
            node = node.parent;
        }
        return true;
    }

    public isButtonTouched() {
        const x = this.canvasToLocalX(TouchInput.x);
        const y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    public canvasToLocalX(x: number) {
        let node: PIXI.Container = this;
        while (node) {
            x -= node.x;
            node = node.parent;
        }
        return x;
    }

    public canvasToLocalY(y: number) {
        let node: PIXI.Container = this;
        while (node) {
            y -= node.y;
            node = node.parent;
        }
        return y;
    }
}
