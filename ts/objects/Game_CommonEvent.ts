import Game_Interpreter, { Game_Interpreter_OnLoad } from "./Game_Interpreter";

export interface Game_CommonEvent_OnLoad {
    _commonEventId: number;
    _interpreter: Game_Interpreter_OnLoad;
}

export default class Game_CommonEvent {
    private _commonEventId: number;
    private _interpreter: Game_Interpreter;

    public constructor(
        commonEventId: number,
        gameLoadInput?: Game_CommonEvent_OnLoad
    ) {
        this._commonEventId = commonEventId;
        this.refresh();

        if (gameLoadInput) {
            this._commonEventId = gameLoadInput._commonEventId;
            this._interpreter = new Game_Interpreter(
                gameLoadInput._interpreter
            );
        }
    }

    public event() {
        return $dataCommonEvents[this._commonEventId];
    }

    public list() {
        return this.event().list;
    }

    public refresh() {
        if (this.isActive()) {
            if (!this._interpreter) {
                this._interpreter = new Game_Interpreter();
            }
        } else {
            this._interpreter = null;
        }
    }

    public isActive() {
        const event = this.event();
        return event.trigger === 2 && $gameSwitches.value(event.switchId);
    }

    public update() {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter.setup(this.list());
            }
            this._interpreter.update();
        }
    }
}
