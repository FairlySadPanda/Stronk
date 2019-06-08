import Window_Base from "./Window_Base";

// -----------------------------------------------------------------------------
// Window_MapName
//
// The window for displaying the map name on the map screen.

export default class Window_MapName extends Window_Base {
    public opacity: number;
    public contentsOpacity: number;
    private _showCount: number;

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

    public windowWidth() {
        return 360;
    }

    public windowHeight() {
        return this.fittingHeight(1);
    }

    public update() {
        super.update();
        if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
            this.updateFadeIn();
            this._showCount--;
        } else {
            this.updateFadeOut();
        }
    }

    public updateFadeIn() {
        this.contentsOpacity += 16;
    }

    public updateFadeOut() {
        this.contentsOpacity -= 16;
    }

    public open() {
        this.refresh();
        this._showCount = 150;
    }

    public close() {
        this._showCount = 0;
    }

    public refresh() {
        this.contents.clear();
        if ($gameMap.displayName()) {
            const width = this.contentsWidth();
            this.drawBackground(0, 0, width, this.lineHeight());
            this.drawText(
                $gameMap.displayName(),
                0,
                0,
                width,
                undefined,
                "center"
            );
        }
    }

    public drawBackground(x, y, width, height) {
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
    }
}
