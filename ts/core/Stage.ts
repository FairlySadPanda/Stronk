import * as PIXI from "pixi.js";

export class Stage extends PIXI.Container {
    public interactive: boolean;

    public constructor() {
        super();
        this.interactive = false;
    }
}
