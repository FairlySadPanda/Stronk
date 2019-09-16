import { DataManager } from "../managers/DataManager";
import { TextManager } from "../managers/TextManager";
import { Window_Selectable } from "./Window_Selectable";

// -----------------------------------------------------------------------------
// Window_SavefileList
//
// The window for selecting a save file on the save and load screens.

export class Window_SavefileList extends Window_Selectable {
    private _mode: any;

    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this.activate();
        this._mode = null;
    }

    public setMode(mode) {
        this._mode = mode;
    }

    public maxItems() {
        return DataManager.maxSavefiles();
    }

    public maxVisibleItems() {
        return 5;
    }

    public itemHeight() {
        const innerHeight = this.height - this.padding * 2;
        return Math.floor(innerHeight / this.maxVisibleItems());
    }

    public async drawItem(index) {
        const id = index + 1;
        const valid = DataManager.isThisGameFile(id);
        const info = DataManager.loadSavefileInfo(id);
        const rect = this.itemRectForText(index);
        this.resetTextColor();
        if (this._mode === "load") {
            this.changePaintOpacity(valid);
        }
        await this.drawFileId(id, rect.x, rect.y);
        if (info) {
            this.changePaintOpacity(valid);
            await this.drawContents(info, rect, valid);
            this.changePaintOpacity(true);
        }
    }

    public drawFileId(id, x, y) {
        if (DataManager.isAutoSaveFileId(id)) {
            if (this._mode === "save") {
                this.changePaintOpacity(false);
            }
            this.drawText(TextManager.file + " " + id + "(Auto)", x, y, 180);
        } else {
            this.drawText(TextManager.file + " " + id, x, y, 180);
        }
    }

    public async drawContents(info, rect, valid) {
        const bottom = rect.y + rect.height;
        if (rect.width >= 420) {
            await this.drawGameTitle(
                info,
                rect.x + 192,
                rect.y,
                rect.width - 192
            );
            if (valid) {
                await this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
            }
        }
        const lineHeight = this.lineHeight();
        const y2 = bottom - lineHeight;
        if (y2 >= lineHeight) {
            await this.drawPlaytime(info, rect.x, y2, rect.width);
        }
    }

    public async drawGameTitle(info, x, y, width) {
        if (info.title) {
            await this.drawText(info.title, x, y, width);
        }
    }

    public async drawPartyCharacters(info, x, y) {
        if (info.characters) {
            const promises = [];
            for (let i = 0; i < info.characters.length; i++) {
                const data = info.characters[i];
                promises.push(
                    this.drawCharacter(data[0], data[1], x + i * 48, y)
                );
            }
            await Promise.all(promises);
        }
    }

    public async drawPlaytime(info, x, y, width) {
        if (info.playtime) {
            await this.drawText(info.playtime, x, y, width, undefined, "right");
        }
    }

    public playOkSound() {}
}
