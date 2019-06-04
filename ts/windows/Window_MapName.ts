import Window_Base from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_MapName
//
// The window for displaying the map name on the map screen.

export default class Window_MapName extends Window_Base {
    public opacity: number;
    public contentsOpacity: number;
    public _showCount: number;
    public updateFadeIn: () => void;
    public updateFadeOut: () => void;
    public drawBackground: (x: any, y: any, width: any, height: any) => void;
    public constructor() {
        super(
            0,
            0,
            Window_MapName.prototype.windowWidth(),
            Window_MapName.prototype.windowHeight()
        );
        this.opacity = 0;
        this.contentsOpacity = 0;
        this._showCount = 0;
        this.refresh();
    }
    public windowWidth(): any {
        throw new Error("Method not implemented.");
    }
    public windowHeight(): any {
        throw new Error("Method not implemented.");
    }
    public refresh(): any {
        throw new Error("Method not implemented.");
    }
}

Window_MapName.prototype.windowWidth = function() {
    return 360;
};

Window_MapName.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_MapName.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
        this.updateFadeIn();
        this._showCount--;
    } else {
        this.updateFadeOut();
    }
};

Window_MapName.prototype.updateFadeIn = function() {
    this.contentsOpacity += 16;
};

Window_MapName.prototype.updateFadeOut = function() {
    this.contentsOpacity -= 16;
};

Window_MapName.prototype.open = function() {
    this.refresh();
    this._showCount = 150;
};

Window_MapName.prototype.close = function() {
    this._showCount = 0;
};

Window_MapName.prototype.refresh = function() {
    this.contents.clear();
    if ($gameMap.displayName()) {
        const width = this.contentsWidth();
        this.drawBackground(0, 0, width, this.lineHeight());
        this.drawText($gameMap.displayName(), 0, 0, width, "center");
    }
};

Window_MapName.prototype.drawBackground = function(x, y, width, height) {
    const color1 = this.dimColor1();
    const color2 = this.dimColor2();
    this.contents.gradientFillRect(x, y, width / 2, height, color2, color1);
    this.contents.gradientFillRect(
        x + width / 2,
        y,
        width / 2,
        height,
        color1,
        color2
    );
};
