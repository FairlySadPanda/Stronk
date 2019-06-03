
import Window_BattleStatus from "./Window_BattleStatus";

//-----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.

export default class Window_BattleActor extends Window_BattleStatus {
    public x: any;
    public y: any;
    public openness: number;
    public show: () => void;
    public select: (index: any) => void;
    public actor: () => any;
    public constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.openness = 255;
        this.hide();
    }
}

Window_BattleActor.prototype.show = function () {
    this.select(0);
    Window_BattleStatus.prototype.show.call(this);
};

Window_BattleActor.prototype.hide = function () {
    Window_BattleStatus.prototype.hide.call(this);
    $gameParty.select(null);
};

Window_BattleActor.prototype.select = function (index) {
    Window_BattleStatus.prototype.select.call(this, index);
    $gameParty.select(this.actor());
};

Window_BattleActor.prototype.actor = function () {
    return $gameParty.members()[this.index()];
};
