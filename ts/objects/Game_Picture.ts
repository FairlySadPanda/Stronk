import { Utils } from "../core/Utils";

export interface Game_Picture_OnLoad {
    _name: string;
    _origin: number;
    _x: number;
    _y: number;
    _scaleX: number;
    _scaleY: number;
    _opacity: number;
    _blendMode: number;
    _tone: number[];
    _angle: number;
    _targetX: number;
    _targetY: number;
    _targetScaleX: number;
    _targetScaleY: number;
    _targetOpacity: number;
    _duration: number;
    _toneTarget: number[];
    _toneDuration: number;
    _rotationSpeed: number;
}

export class Game_Picture {
    private _name: string;
    private _origin: number;
    private _x: number;
    private _y: number;
    private _scaleX: number;
    private _scaleY: number;
    private _opacity: number;
    private _blendMode: number;
    private _tone: number[];
    private _angle: number;
    private _targetX: number;
    private _targetY: number;
    private _targetScaleX: number;
    private _targetScaleY: number;
    private _targetOpacity: number;
    private _duration: number;
    private _toneTarget: number[];
    private _toneDuration: number;
    private _rotationSpeed: number;

    public constructor(gameLoadInput?: Game_Picture_OnLoad) {
        this.initBasic();
        this.initTarget();
        this.initTone();
        this.initRotation();

        if (gameLoadInput) {
            for (const key of Object.keys(gameLoadInput)) {
                if (this.hasOwnProperty(key)) {
                    this[key] = gameLoadInput[key];
                } else {
                    throw new TypeError(
                        `Game_Picture does not have a property called ${key}`
                    );
                }
            }
        }
    }

    public name() {
        return this._name;
    }

    public origin() {
        return this._origin;
    }

    public x() {
        return this._x;
    }

    public y() {
        return this._y;
    }

    public scaleX() {
        return this._scaleX;
    }

    public scaleY() {
        return this._scaleY;
    }

    public opacity() {
        return this._opacity;
    }

    public blendMode() {
        return this._blendMode;
    }

    public tone() {
        return this._tone;
    }

    public angle() {
        return this._angle;
    }

    public initBasic() {
        this._name = "";
        this._origin = 0;
        this._x = 0;
        this._y = 0;
        this._scaleX = 100;
        this._scaleY = 100;
        this._opacity = 255;
        this._blendMode = 0;
    }

    public initTarget() {
        this._targetX = this._x;
        this._targetY = this._y;
        this._targetScaleX = this._scaleX;
        this._targetScaleY = this._scaleY;
        this._targetOpacity = this._opacity;
        this._duration = 0;
    }

    public initTone() {
        this._tone = null;
        this._toneTarget = null;
        this._toneDuration = 0;
    }

    public initRotation() {
        this._angle = 0;
        this._rotationSpeed = 0;
    }

    public show(name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
        this._name = name;
        this._origin = origin;
        this._x = x;
        this._y = y;
        this._scaleX = scaleX;
        this._scaleY = scaleY;
        this._opacity = opacity;
        this._blendMode = blendMode;
        this.initTarget();
        this.initTone();
        this.initRotation();
    }

    public move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration) {
        this._origin = origin;
        this._targetX = x;
        this._targetY = y;
        this._targetScaleX = scaleX;
        this._targetScaleY = scaleY;
        this._targetOpacity = opacity;
        this._blendMode = blendMode;
        this._duration = duration;
    }

    public rotate(speed) {
        this._rotationSpeed = speed;
    }

    public tint(tone, duration) {
        if (!this._tone) {
            this._tone = [0, 0, 0, 0];
        }
        this._toneTarget = Utils.arrayClone(tone);
        this._toneDuration = duration;
        if (this._toneDuration === 0) {
            this._tone = Utils.arrayClone(this._toneTarget);
        }
    }

    public erase() {
        this._name = "";
        this._origin = 0;
        this.initTarget();
        this.initTone();
        this.initRotation();
    }

    public update() {
        this.updateMove();
        this.updateTone();
        this.updateRotation();
    }

    public updateMove() {
        if (this._duration > 0) {
            const d = this._duration;
            this._x = (this._x * (d - 1) + this._targetX) / d;
            this._y = (this._y * (d - 1) + this._targetY) / d;
            this._scaleX = (this._scaleX * (d - 1) + this._targetScaleX) / d;
            this._scaleY = (this._scaleY * (d - 1) + this._targetScaleY) / d;
            this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
            this._duration--;
        }
    }

    public updateTone() {
        if (this._toneDuration > 0) {
            const d = this._toneDuration;
            for (let i = 0; i < 4; i++) {
                this._tone[i] =
                    (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
            }
            this._toneDuration--;
        }
    }

    public updateRotation() {
        if (this._rotationSpeed !== 0) {
            this._angle += this._rotationSpeed / 2;
        }
    }
}
