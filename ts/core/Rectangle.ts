import * as PIXI from "pixi.js";

export default class Rectangle extends PIXI.Rectangle {
    private static _emptyRectangle = new Rectangle(0, 0, 0, 0);

    public static get emptyRectangle(): Rectangle {
        return this._emptyRectangle;
    }
}
