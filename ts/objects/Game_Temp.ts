import { JsonEx } from "../core/JsonEx";
import { Utils } from "../core/Utils";

export class Game_Temp {
    private _isPlaytest: boolean;
    private _commonEventId: number;
    private _destinationX: number;
    private _destinationY: number;
    private _forceActionQueue: any;
    private _disableMouseOverSelect: boolean;
    private _moveCommand: any;

    public mouseOverSelectDisabled(): boolean {
        return this._disableMouseOverSelect;
    }

    public get moveCommand(): any {
        return this._moveCommand;
    }
    public set moveCommand(value: any) {
        this._moveCommand = value;
    }

    private _moveAllowPlayerCollision: boolean;

    public get moveAllowPlayerCollision(): boolean {
        return this._moveAllowPlayerCollision;
    }
    public set moveAllowPlayerCollision(value: boolean) {
        this._moveAllowPlayerCollision = value;
    }

    public isPlaytest() {
        return this._isPlaytest;
    }

    public reserveCommonEvent(commonEventId) {
        this._commonEventId = commonEventId;
    }

    public clearCommonEvent() {
        this._forceActionQueue = undefined;
        this._commonEventId = 0;
    }

    public isCommonEventReserved() {
        return this._commonEventId > 0;
    }

    public reservedCommonEvent() {
        if (this._forceActionQueue) {
            return this._forceActionQueue;
        }
        return $dataCommonEvents[this._commonEventId];
    }

    public setDestination(x, y) {
        this._destinationX = x;
        this._destinationY = y;
    }

    public clearDestination() {
        this._destinationX = null;
        this._destinationY = null;
    }

    public isDestinationValid() {
        return this._destinationX !== null;
    }

    public destinationX() {
        return this._destinationX;
    }

    public destinationY() {
        return this._destinationY;
    }

    public constructor() {
        this._isPlaytest = Utils.isOptionValid("test");
        this._commonEventId = 0;
        this._destinationX = null;
        this._destinationY = null;
    }

    public clearActionSequenceSettings() {}

    public forceActionQueue(command) {
        if (!this._forceActionQueue) {
            this._forceActionQueue = JsonEx.makeDeepCopy($dataCommonEvents[1]);
            this._forceActionQueue.list = [];
        }
        this._forceActionQueue.list.push(command);
    }
}
