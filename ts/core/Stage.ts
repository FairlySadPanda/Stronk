import "pixi.js";

export default class Stage extends PIXI.Container {
    public interactive: boolean;

    public constructor() {
        super();
        this.interactive = false;
    }
}
