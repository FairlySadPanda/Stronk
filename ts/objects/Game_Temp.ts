import Utils from "../core/Utils";

export default class Game_Temp {
    private _isPlaytest: boolean;
    private _commonEventId: number;
    private _destinationX: number;
    private _destinationY: number;

    public isPlaytest() {
        return this._isPlaytest;
    }
    public reserveCommonEvent(commonEventId) {
        this._commonEventId = commonEventId;
    }
    public clearCommonEvent() {
        this._commonEventId = 0;
    }
    public isCommonEventReserved() {
        return this._commonEventId > 0;
    }
    public reservedCommonEvent() {
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
}
