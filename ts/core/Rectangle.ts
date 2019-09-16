import * as PIXI from "pixi.js";

export class Rectangle extends PIXI.Rectangle {
    private static _emptyRectangle = new Rectangle(0, 0, 0, 0);

    public static get emptyRectangle(): Rectangle {
        return this._emptyRectangle;
    }
}
