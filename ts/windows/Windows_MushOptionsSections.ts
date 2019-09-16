import { Window_Selectable } from "./Window_Selectable";
import { ConfigManager } from "../managers/ConfigManager";

export class Window_MushOptionsSections extends Window_Selectable {
    public sections: string[];

    public constructor(x, y, width, height) {
        Window_MushOptionsSections.prototype.createSections();
        super(x, y, width, height);
        this.refresh();
        this.select(0);
        this.activate();
    }

    public maxItems() {
        return 4;
    }

    public maxCols() {
        return 4;
    }

    public createSections() {
        this.sections = [
            ConfigManager.cosmeticsOptions.name,
            ConfigManager.graphicsOptions.name,
            ConfigManager.AudioSoundOptions.name,
            ConfigManager.OtherOptions.name
        ];
    }

    public async drawItem(index: any) {
        const rect = this.itemRectForText(index);
        await this.drawText(
            this.sections[index],
            rect.x,
            rect.y,
            rect.width,
            undefined,
            "center"
        );
    }
}
