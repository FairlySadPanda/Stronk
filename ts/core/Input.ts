import * as gui from "nw";
import ResourceHandler from "./ResourceHandler";
import Utils from "./Utils";

export default class Input {

    public static get dir4(): number {
        return this._dir4;
    }

    public static get dir8(): number {
        return this._dir8;
    }

    public static get date(): number {
        return this._date;
    }

    public static keyRepeatWait = 24;
    public static keyRepeatInterval = 6;
    public static keyMapper = {
        "9": "tab",       // tab
        "13": "ok",       // enter
        "16": "shift",    // shift
        "17": "control",  // control
        "18": "control",  // alt
        "27": "escape",   // escape
        "32": "ok",       // space
        "33": "pageup",   // pageup
        "34": "pagedown", // pagedown
        "37": "left",     // left arrow
        "38": "up",       // up arrow
        "39": "right",    // right arrow
        "40": "down",     // down arrow
        "45": "escape",   // insert
        "81": "pageup",   // Q
        "87": "pagedown", // W
        "88": "escape",   // X
        "90": "ok",       // Z
        "96": "escape",   // numpad 0
        "98": "down",     // numpad 2
        "100": "left",    // numpad 4
        "102": "right",   // numpad 6
        "104": "up",      // numpad 8
        "120": "debug"    // F9
    };

    public static gamepadMapper = {
        "0": "ok",        // A
        "1": "cancel",    // B
        "2": "shift",     // X
        "3": "menu",      // Y
        "4": "pageup",    // LB
        "5": "pagedown",  // RB
        "12": "up",       // D-pad up
        "13": "down",     // D-pad down
        "14": "left",     // D-pad left
        "15": "right"    // D-pad right
    };

    public static initialize() {
        this.clear();
        this.wrapNwjsAlert();
        this.setupEventHandlers();
    }

    public static clear = function () {
        Input.currentState = [];
        Input.previousState = [];
        Input.gamepadStates = [];
        Input.latestButton = null;
        Input.pressedTime = 0;
        Input._dir4 = 0;
        Input._dir8 = 0;
        Input.preferredAxis = "";
        Input._date = 0;
    };

    public static update() {
        this.pollGamepads();
        if (this.currentState[this.latestButton]) {
            this.pressedTime++;
        } else {
            this.latestButton = null;
        }
        for (const name in this.currentState) {
            if (this.currentState.hasOwnProperty(name)) {
                if (this.currentState[name] && !this.previousState[name]) {
                    this.latestButton = name;
                    this.pressedTime = 0;
                    this._date = Date.now();
                }
                this.previousState[name] = this.currentState[name];
            }
        }
        this.updateDirection();
    }

    public static isPressed(keyName) {
        if (this.isEscapeCompatible(keyName) && this.isPressed("escape")) {
            return true;
        } else {
            return !!this.currentState[keyName];
        }
    }

    public static isTriggered(keyName) {
        if (this.isEscapeCompatible(keyName) && this.isTriggered("escape")) {
            return true;
        } else {
            return this.latestButton === keyName && this.pressedTime === 0;
        }
    }

    public static isRepeated(keyName) {
        if (this.isEscapeCompatible(keyName) && this.isRepeated("escape")) {
            return true;
        } else {
            return (this.latestButton === keyName &&
                    (this.pressedTime === 0 ||
                     (this.pressedTime >= this.keyRepeatWait &&
                      this.pressedTime % this.keyRepeatInterval === 0)));
        }
    }

    public static isLongPressed(keyName) {
        if (this.isEscapeCompatible(keyName) && this.isLongPressed("escape")) {
            return true;
        } else {
            return (this.latestButton === keyName &&
                    this.pressedTime >= this.keyRepeatWait);
        }
    }

    private static currentState: boolean[];
    private static previousState: boolean[];
    private static gamepadStates: any[];
    private static latestButton: string;
    private static pressedTime: number;
    private static _dir4: number;
    private static _dir8: number;
    private static preferredAxis: string;
    private static _date: number;

    private static wrapNwjsAlert() {
        if (Utils.isNwjs()) {
            const alert = window.alert;
            window.alert = function () {
                const win = gui.Window.get();
                alert.apply(this, arguments);
                win.focus();
                Input.clear();
            };
        }
    }

    private static setupEventHandlers() {
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));
        window.addEventListener("blur", this.onLostFocus.bind(this));
    }

    private static onKeyDown(event: KeyboardEvent) {
        if (this.shouldPreventDefault(event.keyCode)) {
            event.preventDefault();
        }
        if (event.keyCode === 144) {    // Numlock
            this.clear();
        }
        const buttonName = this.keyMapper[event.keyCode];
        if (ResourceHandler.exists() && buttonName === "ok") {
            ResourceHandler.retry();
        } else if (buttonName) {
            this.currentState[buttonName] = true;
        }
    }

    private static shouldPreventDefault(keycode: number): boolean {
        switch (keycode) {
            case 8:     // backspace
            case 33:    // pageup
            case 34:    // pagedown
            case 37:    // left arrow
            case 38:    // up arrow
            case 39:    // right arrow
            case 40:    // down arrow
                return true;
            }
            return false;
    }

    private static onKeyUp(event: KeyboardEvent) {
        const buttonName = this.keyMapper[event.keyCode];
        if (buttonName) {
            this.currentState[buttonName] = false;
        }
        if (event.keyCode === 0) {  // For QtWebEngine on OS X
            this.clear();
        }
    }

    private static onLostFocus() {
        this.clear();
    }

    private static pollGamepads() {
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads();
            if (gamepads) {
                for(const gamepad of gamepads) {
                    if (gamepad && gamepad.connected) {
                        this.updateGamepadState(gamepad);
                    }
                }
            }
        }
    }

    private static updateGamepadState(gamepad: Gamepad) {
        const lastState = this.gamepadStates[gamepad.index] || [];
        const newState = [];
        const buttons = gamepad.buttons;
        const axes = gamepad.axes;
        const threshold = 0.5;
        newState[12] = false;
        newState[13] = false;
        newState[14] = false;
        newState[15] = false;
        for (let i = 0; i < buttons.length; i++) {
            newState[i] = buttons[i].pressed;
        }
        if (axes[1] < -threshold) {
            newState[12] = true;    // up
        } else if (axes[1] > threshold) {
            newState[13] = true;    // down
        }
        if (axes[0] < -threshold) {
            newState[14] = true;    // left
        } else if (axes[0] > threshold) {
            newState[15] = true;    // right
        }
        for (let j = 0; j < newState.length; j++) {
            if (newState[j] !== lastState[j]) {
                const buttonName = this.gamepadMapper[j];
                if (buttonName) {
                    this.currentState[buttonName] = newState[j];
                }
            }
        }
        this.gamepadStates[gamepad.index] = newState;
    }

    private static updateDirection() {
        let x = this.signX();
        let y = this.signY();

        this._dir8 = this.makeNumpadDirection(x, y);

        if (x !== 0 && y !== 0) {
            if (this.preferredAxis === "x") {
                y = 0;
            } else {
                x = 0;
            }
        } else if (x !== 0) {
            this.preferredAxis = "y";
        } else if (y !== 0) {
            this.preferredAxis = "x";
        }

        this._dir4 = this.makeNumpadDirection(x, y);
    }

    private static signX(): number {
        let x = 0;

        if (this.isPressed("left")) {
            x--;
        }
        if (this.isPressed("right")) {
            x++;
        }
        return x;
    }

    private static signY(): number {
        let y = 0;

        if (this.isPressed("up")) {
            y--;
        }
        if (this.isPressed("down")) {
            y++;
        }
        return y;
    }

    private static makeNumpadDirection(x: number, y: number): number {
        if (x !== 0 || y !== 0) {
            return  5 - y * 3 + x;
        }
        return 0;
    }

    private static isEscapeCompatible(keyname: string) {
        return keyname === "cancel" || keyname === "menu";
    }
}
