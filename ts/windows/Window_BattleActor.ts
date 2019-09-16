import { Window_BattleStatus } from "./Window_BattleStatus";

// -----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.

export class Window_BattleActor extends Window_BattleStatus {
    public x: any;
    public y: any;
    public openness: number;

    public constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.openness = 255;
        this.hide();
    }

    public show() {
        this.select(0);
        super.show();
    }

    public hide() {
        super.hide();
        $gameParty.select(null);
    }

    public select(index) {
        super.select(index);
        $gameParty.select(this.actor());
    }

    public actor() {
        return $gameParty.members()[this.index()];
    }
}
