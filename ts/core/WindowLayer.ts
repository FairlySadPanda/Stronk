import * as PIXI from "pixi.js";
import { Window } from "./Window";

export class WindowLayer extends PIXI.Container {
    /**
     * The width of the window layer in pixels.
     *
     * @property width
     * @type Number
     */
    public get width() {
        return this._width;
    }

    public set width(value: number) {
        this._width = value;
    }

    /**
     * The height of the window layer in pixels.
     *
     * @property height
     * @type Number
     */
    public get height() {
        return this._height;
    }

    public set height(value: number) {
        this._height = value;
    }

    public static voidFilter = new PIXI.filters.AlphaFilter();

    private _width: number;
    private _height: number;
    private _windowMask: PIXI.Graphics;

    public constructor() {
        super();
        this._width = 0;
        this._height = 0;

        this._windowMask = new PIXI.Graphics();
        this._windowMask.beginFill(0xffffff, 1);
        this._windowMask.drawRect(0, 0, 0, 0);
        this._windowMask.endFill();

        this.filterArea = new PIXI.Rectangle();
        this.filters = [WindowLayer.voidFilter];

        // temporary fix for memory leak bug
        this.on("removed", this.onRemoveAsAChild);
    }

    public onRemoveAsAChild() {
        this.removeChildren();
    }

    /**
     * Sets the x, y, width, and height all at once.
     *
     * @method move
     * @param {Number} x The x coordinate of the window layer
     * @param {Number} y The y coordinate of the window layer
     * @param {Number} width The width of the window layer
     * @param {Number} height The height of the window layer
     */
    public move(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Updates the window layer for each frame.
     *
     * @method update
     */
    public update() {
        this.children.forEach(function(child) {
            // @ts-ignore
            child.update ? child.update() : null;
        });
    }

    /**
     * @method _render
     * @param {Object} renderSession
     * @private
     */
    public render(renderer: PIXI.Renderer) {
        if (!this.visible || !this.renderable) {
            return;
        }

        if (this.children.length === 0) {
            return;
        }

        renderer.batch.flush();
        this.filterArea.copyFrom(
            new PIXI.Rectangle(this.x, this.y, this.width, this.height)
        );
        renderer.filter.push(this, this.filters);
        renderer.batch.currentRenderer.start();

        const shift = new PIXI.Point();
        const projection = renderer.projection;
        const projectionMatrix = projection.projectionMatrix;
        shift.x = Math.round(
            ((projectionMatrix.tx + 1) / 2) * projection.sourceFrame.width
        );
        shift.y = Math.round(
            ((projectionMatrix.ty + 1) / 2) * projection.sourceFrame.height
        );

        for (const child of this.children as Window[]) {
            if (child._isWindow && child.visible && child.openness > 0) {
                this._maskWindow(child, shift);
                renderer.mask.push(child, new PIXI.MaskData(this._windowMask));
                renderer.clear();
                renderer.mask.pop(child);
                renderer.batch.currentRenderer.start();
                child.render(renderer);
                renderer.batch.currentRenderer.flush();
            }
        }

        renderer.batch.flush();
        renderer.filter.pop();
        renderer.mask.pop(this);

        for (let j = 0; j < this.children.length; j++) {
            const child = this.children[j] as Window;
            if (!child._isWindow) {
                this.children[j].render(renderer);
            }
        }
    }

    /**
     * @method _maskWindow
     * @param {Window} window
     * @private
     */
    private _maskWindow(window, shift) {
        this._windowMask.clear();
        this._windowMask.x = this.x + shift.x + window.x;
        this._windowMask.y =
            this.x +
            shift.y +
            window.y +
            (window.height / 2) * (1 - window._openness / 255);
        this._windowMask.width = window.width;
        this._windowMask.height = (window.height * window._openness) / 255;
    }
}
