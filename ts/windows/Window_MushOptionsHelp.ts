import { Window_Base } from "./Window_Base";
import { ConfigManager } from "../managers/ConfigManager";

export class Window_MushOptionsHelp extends Window_Base {
    _action: number;
    _index: number;
    _section: any;
    _symbolParam: string;

    public constructor(x, y, width, height) {
        super(x, y, width, height);
        this._action = 0;
        this._index = 0;
        this._section = "";
        this._symbolParam = "";
        this.refresh();
    }

    public refresh() {
        this.contents.clear();
        if (this._section === 0) {
            this.drawCosmetics();
        } else if (this._section === 1) {
            this.drawGraphics();
        } else if (this._section === 2) {
            this.drawAudio();
        } else if (this._section === 3) {
            this.drawOther();
        }
    }

    public drawCosmetics() {
        const cos = [
            ConfigManager.cosmeticsOptions.wRed.name,
            ConfigManager.cosmeticsOptions.wGreen.name,
            ConfigManager.cosmeticsOptions.wBlue.name,
            ConfigManager.cosmeticsOptions.wOpacity.name,
            ConfigManager.cosmeticsOptions.wSkin.name,
            ConfigManager.cosmeticsOptions.menuBack.name
        ];
        for (let i = 0; i < cos.length; i++) {
            const rect = { x: 6, y: 36 * i, width: this.width / 2 };
            this.drawText(cos[i], rect.x, rect.y, rect.width);
        }
    }

    public drawGraphics() {
        const cos = [
            ConfigManager.graphicsOptions.screenResolution.name,
            ConfigManager.graphicsOptions.vSync.name,
            ConfigManager.graphicsOptions.fullScreen.name,
            ConfigManager.graphicsOptions.fpsMeter.name
        ];
        for (let i = 0; i < cos.length; i++) {
            const rect = { x: 6, y: 36 * i, width: this.width / 2 };
            this.drawText(cos[i], rect.x, rect.y, rect.width);
        }
    }

    public drawAudio() {
        const cos = [
            ConfigManager.AudioSoundOptions.bgm.name,
            ConfigManager.AudioSoundOptions.bgs.name,
            ConfigManager.AudioSoundOptions.me.name,
            ConfigManager.AudioSoundOptions.se.name
        ];
        for (let i = 0; i < cos.length; i++) {
            const rect = { x: 6, y: 36 * i, width: this.width / 2 };
            this.drawText(cos[i], rect.x, rect.y, rect.width);
        }
    }

    public drawOther() {
        const cos = [
            ConfigManager.OtherOptions.alwaysDash.name,
            ConfigManager.OtherOptions.commandRemember.name
        ];
        for (let i = 0; i < cos.length; i++) {
            const rect = { x: 6, y: 36 * i, width: this.width / 2 };
            this.drawText(cos[i], rect.x, rect.y, rect.width);
        }
    }
}
