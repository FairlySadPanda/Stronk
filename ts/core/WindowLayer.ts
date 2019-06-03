import "pixi.js";

export default class WindowLayer extends PIXI.Container {

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

    private _windowRect: any;
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
        this._windowRect = this._windowMask.graphicsData[0].shape;

        this.filterArea = new PIXI.Rectangle();
        this.filters = [WindowLayer.voidFilter];

        //temporary fix for memory leak bug
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
        this.children.forEach(function (child) {
            if (child.update) {
                child.update();
            }
        });
    }

    /**
     * @method _renderWebGL
     * @param {Object} renderSession
     * @private
     */
    public renderWebGL(renderer: PIXI.WebGLRenderer) {
        if (!this.visible || !this.renderable) {
            return;
        }

        if (this.children.length===0) {
            return;
        }

        renderer.flush();
        this.filterArea.copy(this);
        renderer.filterManager.pushFilter(this, this.filters);
        renderer.currentRenderer.start();

        const shift = new PIXI.Point();
        const rt = renderer._activeRenderTarget;
        const projectionMatrix = rt.projectionMatrix;
        shift.x = Math.round((projectionMatrix.tx + 1) / 2 * rt.sourceFrame.width);
        shift.y = Math.round((projectionMatrix.ty + 1) / 2 * rt.sourceFrame.height);

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child._isWindow && child.visible && child.openness > 0) {
                this._maskWindow(child, shift);
                renderer.maskManager.pushScissorMask(this, this._windowMask);
                renderer.clear();
                renderer.maskManager.popScissorMask();
                renderer.currentRenderer.start();
                child.renderWebGL(renderer);
                renderer.currentRenderer.flush();
            }
        }

        renderer.flush();
        renderer.filterManager.popFilter();
        renderer.maskManager.popScissorMask();

        for (let j = 0; j < this.children.length; j++) {
            if (!this.children[j]._isWindow) {
                this.children[j].renderWebGL(renderer);
            }
        }
    }

    /**
     * @method _maskWindow
     * @param {Window} window
     * @private
     */
    private _maskWindow(window, shift) {
        this._windowMask._currentBounds = null;
        this._windowMask.boundsDirty = Number(true);
        const rect = this._windowRect;
        rect.x = this.x + shift.x + window.x;
        rect.y = this.x + shift.y + window.y + window.height / 2 * (1 - window._openness / 255);
        rect.width = window.width;
        rect.height = window.height * window._openness / 255;
    }

}
