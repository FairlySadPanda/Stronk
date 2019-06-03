import Graphics from "../core/Graphics";
import Input from "../core/Input";
import TouchInput from "../core/TouchInput";
import Utils from "../core/Utils";

import ImageManager from "../managers/ImageManager";
import Window_Base from "./Window_Base";
import Window_ChoiceList from "./Window_ChoiceList";
import Window_EventItem from "./Window_EventItem";
import Window_Gold from "./Window_Gold";
import Window_NumberInput from "./Window_NumberInput";

//-----------------------------------------------------------------------------
// Window_Message
//
// The window for displaying text messages.

export default class Window_Message extends Window_Base {
    public openness: number;
    private _imageReservationId: number;
    private _background: number;
    private _positionType: number;
    private _waitCount: number;
    private _faceBitmap: any;
    private _textState: object;
    private _goldWindow: any;
    private _choiceWindow: any;
    private _numberWindow: any;
    private _itemWindow: any;
    private _showFast: boolean;
    private _lineShowFast: boolean;
    private _pauseSkip: boolean;
    private _textSpeed: number;
    private _textSpeedCount: number;

    public constructor() {
        const width = Window_Message.prototype.windowWidth();
        const height = Window_Message.prototype.windowHeight();
        const x = (Graphics.boxWidth - width) / 2;
        super(x, 0, width, height);
        this.openness = 0;
        this.initMembers();
        this.createSubWindows();
        this.updatePlacement();
    }

    public initMembers() {
        this._imageReservationId = Utils.generateRuntimeId();
        this._background = 0;
        this._positionType = 2;
        this._waitCount = 0;
        this._faceBitmap = null;
        this._textState = null;
        this.clearFlags();
    }

    public subWindows() {
        return [this._goldWindow, this._choiceWindow,
                this._numberWindow, this._itemWindow];
    }

    public createSubWindows() {
        this._goldWindow = new Window_Gold(0, 0);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this._goldWindow.openness = 0;
        this._choiceWindow = new Window_ChoiceList(this);
        this._numberWindow = new Window_NumberInput(this);
        this._itemWindow = new Window_EventItem(this);
    }

    public windowWidth() {
        return Graphics.boxWidth;
    }

    public windowHeight() {
        return this.fittingHeight(this.numVisibleRows());
    }

    public clearFlags() {
        this._showFast = false;
        this._lineShowFast = false;
        this._pauseSkip = false;
        this._textSpeed = 0;
        this._textSpeedCount = 0;
    }

    public numVisibleRows() {
        return 4;
    }

    public update() {
        this.checkToNotClose();
        super.update();
        while (!this.isOpening() && !this.isClosing()) {
            if (this.updateWait()) {
                return;
            } else if (this.updateLoading()) {
                return;
            } else if (this.updateInput()) {
                return;
            } else if (this.updateMessage()) {
                return;
            } else if (this.canStart()) {
                this.startMessage();
            } else {
                this.startInput();
                return;
            }
        }
    }

    public checkToNotClose() {
        if (this.isClosing() && this.isOpen()) {
            if (this.doesContinue()) {
                this.open();
            }
        }
    }

    public canStart() {
        return $gameMessage.hasText() && !$gameMessage.scrollMode();
    }

    public startMessage() {
        this._textState = {
            "index": 0,
            "text": this.convertEscapeCharacters($gameMessage.allText())
        };
        this.newPage(this._textState);
        this.updatePlacement();
        this.updateBackground();
        this.open();
    }

    public updatePlacement() {
        this._positionType = $gameMessage.positionType();
        this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
        this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
    }

    public updateBackground() {
        this._background = $gameMessage.background();
        this.setBackgroundType(this._background);
    }

    public terminateMessage() {
        this.close();
        this._goldWindow.close();
        $gameMessage.clear();
    }

    public updateWait() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        } else {
            return false;
        }
    }

    public updateLoading() {
        if (this._faceBitmap) {
            if (this._faceBitmap.isReady()) {
                this.drawMessageFace();
                this._faceBitmap = null;
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    public updateInput() {
        if (this.isAnySubWindowActive()) {
            return true;
        }
        if (this.pause) {
            if (this.isTriggered()) {
                Input.update();
                this.pause = false;
                if (!this._textState) {
                    this.terminateMessage();
                }
            }
            return true;
        }
        return false;
    }

    public isAnySubWindowActive() {
        return (this._choiceWindow.active ||
                this._numberWindow.active ||
                this._itemWindow.active);
    }

    public updateMessage() {
        if (this._textState) {
            while (!this.isEndOfText(this._textState)) {
                if (this.needsNewPage(this._textState)) {
                    this.newPage(this._textState);
                }
                this.updateShowFast();
                if (!this._showFast && !this._lineShowFast && this._textSpeedCount < this._textSpeed) {
                    this._textSpeedCount++;
                    break;
                }
                this._textSpeedCount = 0;
                this.processCharacter(this._textState);
                if (!this._showFast && !this._lineShowFast && this._textSpeed !== -1) {
                    break;
                }
                if (this.pause || this._waitCount > 0) {
                    break;
                }
            }
            if (this.isEndOfText(this._textState)) {
                this.onEndOfText();
            }
            return true;
        } else {
            return false;
        }
    }

    public onEndOfText() {
        if (!this.startInput()) {
            if (!this._pauseSkip) {
                this.startPause();
            } else {
                this.terminateMessage();
            }
        }
        this._textState = null;
    }

    public startInput() {
        if ($gameMessage.isChoice()) {
            this._choiceWindow.start();
            return true;
        } else if ($gameMessage.isNumberInput()) {
            this._numberWindow.start();
            return true;
        } else if ($gameMessage.isItemChoice()) {
            this._itemWindow.start();
            return true;
        } else {
            return false;
        }
    }

    public isTriggered() {
        return (Input.isRepeated("ok") || Input.isRepeated("cancel") ||
                TouchInput.isRepeated());
    }

    public doesContinue() {
        return ($gameMessage.hasText() && !$gameMessage.scrollMode() &&
                !this.areSettingsChanged());
    }

    public areSettingsChanged() {
        return (this._background !== $gameMessage.background() ||
                this._positionType !== $gameMessage.positionType());
    }

    public updateShowFast() {
        if (this.isTriggered()) {
            this._showFast = true;
        }
    }

    public newPage(textState) {
        this.contents.clear();
        this.resetFontSettings();
        this.clearFlags();
        this.loadMessageFace();
        textState.x = this.newLineX();
        textState.y = 0;
        textState.left = this.newLineX();
        textState.height = this.calcTextHeight(textState, false);
    }

    public loadMessageFace() {
        this._faceBitmap = ImageManager.reserveFace($gameMessage.faceName(), 0, this._imageReservationId);
    }

    public drawMessageFace() {
        this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, 0);
        ImageManager.releaseReservation(this._imageReservationId);
    }

    public newLineX() {
        return $gameMessage.faceName() === "" ? 0 : 168;
    }

    public processNewLine(textState) {
        this._lineShowFast = false;
        super.processNewLine(textState);
        if (this.needsNewPage(textState)) {
            this.startPause();
        }
    }

    public processNewPage(textState) {
        super.processNewPage(textState);
        if (textState.text[textState.index] === "\n") {
            textState.index++;
        }
        textState.y = this.contents.height;
        this.startPause();
    }

    public isEndOfText(textState) {
        return textState.index >= textState.text.length;
    }

    public needsNewPage(textState) {
        return (!this.isEndOfText(textState) &&
                textState.y + textState.height > this.contents.height);
    }

    public processEscapeCharacter(code, textState) {
        switch (code) {
        case "$":
            this._goldWindow.open();
            break;
        case ".":
            this.startWait(15);
            break;
        case "|":
            this.startWait(60);
            break;
        case "!":
            this.startPause();
            break;
        case ">":
            this._lineShowFast = true;
            break;
        case "<":
            this._lineShowFast = false;
            break;
        case "^":
            this._pauseSkip = true;
            break;
        case "S":
            this._textSpeed = this.obtainEscapeParam(textState) - 1;
            break;
        default:
            super.processEscapeCharacter(code, textState);
            break;
        }
    }

    public startWait(count) {
        this._waitCount = count;
    }

    public startPause() {
        this.startWait(10);
        this.pause = true;
    }

}
