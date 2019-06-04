import Utils from "../core/Utils";

export default class Game_Temp {
    public _isPlaytest: boolean;
    public _commonEventId: number;
    public _destinationX: any;
    public _destinationY: any;
    public isPlaytest: () => any;
    public reserveCommonEvent: (commonEventId: any) => void;
    public clearCommonEvent: () => void;
    public isCommonEventReserved: () => boolean;
    public reservedCommonEvent: () => any;
    public setDestination: (x: any, y: any) => void;
    public clearDestination: () => void;
    public isDestinationValid: () => boolean;
    public destinationX: () => any;
    public destinationY: () => any;
    public constructor() {
        this._isPlaytest = Utils.isOptionValid("test");
        this._commonEventId = 0;
        this._destinationX = null;
        this._destinationY = null;
    }
}

Game_Temp.prototype.isPlaytest = function() {
    return this._isPlaytest;
};

Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
    this._commonEventId = commonEventId;
};

Game_Temp.prototype.clearCommonEvent = function() {
    this._commonEventId = 0;
};

Game_Temp.prototype.isCommonEventReserved = function() {
    return this._commonEventId > 0;
};

Game_Temp.prototype.reservedCommonEvent = function() {
    return $dataCommonEvents[this._commonEventId];
};

Game_Temp.prototype.setDestination = function(x, y) {
    this._destinationX = x;
    this._destinationY = y;
};

Game_Temp.prototype.clearDestination = function() {
    this._destinationX = null;
    this._destinationY = null;
};

Game_Temp.prototype.isDestinationValid = function() {
    return this._destinationX !== null;
};

Game_Temp.prototype.destinationX = function() {
    return this._destinationX;
};

Game_Temp.prototype.destinationY = function() {
    return this._destinationY;
};
