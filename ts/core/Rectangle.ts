import "pixi.js";

export default class Rectangle extends PIXI.Rectangle {

    private static _emptyRectangle = new Rectangle(0, 0, 0, 0);

    public constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y, width, height);
    }

    public static get emptyRectangle(): Rectangle {
        return this._emptyRectangle;
    }

}
