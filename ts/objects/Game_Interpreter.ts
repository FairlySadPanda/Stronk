import { Graphics } from "../core/Graphics";
import { Input } from "../core/Input";
import { Utils } from "../core/Utils";
import { AudioManager } from "../managers/AudioManager";
import { BattleManager } from "../managers/BattleManager";
import { ImageManager } from "../managers/ImageManager";
import { SceneManager } from "../managers/SceneManager";
import { Scene_Battle } from "../scenes/Scene_Battle";
import { Scene_Gameover } from "../scenes/Scene_Gameover";
import { Scene_Menu } from "../scenes/Scene_Menu";
import { Scene_Name } from "../scenes/Scene_Name";
import { Scene_Save } from "../scenes/Scene_Save";
import { Scene_Shop } from "../scenes/Scene_Shop";
import { Scene_Title } from "../scenes/Scene_Title";
import { Window_MenuCommand } from "../windows/Window_MenuCommand";
import { Game_Character } from "./Game_Character";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

export interface Game_Interpreter_OnLoad {
    _depth: any;
    _branch: {};
    _params: number | string[];
    _indent: number;
    _frameCount: number;
    _freezeChecker: number;
    _mapId: number;
    _eventId: number;
    _list: any;
    _index: number;
    _waitCount: number;
    _waitMode: string;
    _comments: any;
    _character: any;
    _childInterpreter: Game_Interpreter_OnLoad;
    _imageReservationId: any;
}

export class Game_Interpreter {
    public static requestImages(list, commonList?) {
        if (!list) {
            return;
        }

        list.forEach(function(command) {
            const params = command.parameters;
            switch (command.code) {
                // Show Text
                case 101:
                    ImageManager.requestFace(params[0]);
                    break;

                // Common Event
                case 117:
                    const commonEvent = $dataCommonEvents[params[0]];
                    if (commonEvent) {
                        if (!commonList) {
                            commonList = [];
                        }
                        if (!(commonList.indexOf(params[0]) > -1)) {
                            commonList.push(params[0]);
                            Game_Interpreter.requestImages(
                                commonEvent.list,
                                commonList
                            );
                        }
                    }
                    break;

                // Change Party Member
                case 129:
                    const actor = $gameActors.actor(params[0]);
                    if (actor && params[1] === 0) {
                        const name = actor.characterName();
                        ImageManager.requestCharacter(name);
                    }
                    break;

                // Set Movement Route
                case 205:
                    if (params[1]) {
                        params[1].list.forEach(function(command) {
                            const params = command.parameters;
                            if (
                                command.code ===
                                Game_Character.ROUTE_CHANGE_IMAGE
                            ) {
                                ImageManager.requestCharacter(params[0]);
                            }
                        });
                    }
                    break;

                // Show Animation, Show Battle Animation
                case 212:
                case 337:
                    if (params[1]) {
                        const animation = $dataAnimations[params[1]];
                        const name1 = animation.animation1Name;
                        const name2 = animation.animation2Name;
                        const hue1 = animation.animation1Hue;
                        const hue2 = animation.animation2Hue;
                        ImageManager.requestAnimation(name1, hue1);
                        ImageManager.requestAnimation(name2, hue2);
                    }
                    break;

                // Change Player Followers
                case 216:
                    if (params[0] === 0) {
                        $gamePlayer.followers().forEach(function(follower) {
                            ImageManager.requestCharacter(
                                follower.characterName()
                            );
                        }, this);
                    }
                    break;

                // Show Picture
                case 231:
                    ImageManager.requestPicture(params[1]);
                    break;

                // Change Tileset
                case 282:
                    const tileset = $dataTilesets[params[0]];
                    tileset.tilesetNames.forEach(function(tilesetName) {
                        ImageManager.requestTileset(tilesetName);
                    });
                    break;

                // Change Battle Back
                case 283:
                    if ($gameParty.inBattle()) {
                        ImageManager.requestBattleback1(params[0]);
                        ImageManager.requestBattleback2(params[1]);
                    }
                    break;

                // Change Parallax
                case 284:
                    if (!$gameParty.inBattle()) {
                        ImageManager.requestParallax(params[0]);
                    }
                    break;

                // Change Actor Images
                case 322:
                    ImageManager.requestCharacter(params[1]);
                    ImageManager.requestFace(params[3]);
                    ImageManager.requestSvActor(params[5]);
                    break;

                // Change Vehicle Image
                case 323:
                    const vehicle = $gameMap.vehicle(params[0]);
                    if (vehicle) {
                        ImageManager.requestCharacter(params[1]);
                    }
                    break;

                // Enemy Transform
                case 336:
                    const enemy = $dataEnemies[params[1]];
                    const name = enemy.battlerName;
                    const hue = enemy.battlerHue;
                    if ($gameSystem.isSideView()) {
                        ImageManager.requestSvEnemy(name, hue);
                    } else {
                        ImageManager.requestEnemy(name, hue);
                    }
                    break;
            }
        });
    }

    private _depth: any;
    private _branch: {};
    private _params: number | string[];
    private _indent: number;
    private _frameCount: number;
    private _freezeChecker: number;
    private _mapId: number;
    private _eventId: number;
    private _list: any;
    private _index: number;
    private _waitCount: number;
    private _waitMode: string;
    private _comments: any;
    private _character: any;
    private _childInterpreter: Game_Interpreter;
    private _imageReservationId: any;

    public constructor(depth?, gameLoadInput?: Game_Interpreter_OnLoad) {
        this._depth = depth || 0;
        this.checkOverflow();
        this.clear();
        this._branch = {};
        this._params = [];
        this._indent = 0;
        this._frameCount = 0;
        this._freezeChecker = 0;

        if (gameLoadInput) {
            this._depth = gameLoadInput._depth;
            this._branch = gameLoadInput._branch;
            this._params = gameLoadInput._params;
            this._indent = gameLoadInput._indent;
            this._frameCount = gameLoadInput._frameCount;
            this._freezeChecker = gameLoadInput._freezeChecker;
            this._mapId = gameLoadInput._mapId;
            this._eventId = gameLoadInput._eventId;
            this._list = gameLoadInput._list;
            this._index = gameLoadInput._index;
            this._waitCount = gameLoadInput._waitCount;
            this._waitMode = gameLoadInput._waitMode;
            this._comments = gameLoadInput._comments;
            this._character = gameLoadInput._character;
            this._childInterpreter = new Game_Interpreter(
                undefined,
                gameLoadInput._childInterpreter
            );
            this._imageReservationId = gameLoadInput._imageReservationId;
        }
    }

    public checkOverflow() {
        if (this._depth >= 100) {
            throw new Error("Common event calls exceeded the limit");
        }
    }

    public clear() {
        this._mapId = 0;
        this._eventId = 0;
        this._list = null;
        this._index = 0;
        this._waitCount = 0;
        this._waitMode = "";
        this._comments = "";
        this._character = null;
        this._childInterpreter = null;
    }

    public setup(list, eventId?: number) {
        this.clear();
        this._mapId = $gameMap.mapId();
        this._eventId = eventId || 0;
        this._list = list;
        Game_Interpreter.requestImages(list);
    }

    public eventId() {
        return this._eventId;
    }

    public isOnCurrentMap() {
        return this._mapId === $gameMap.mapId();
    }

    public setupReservedCommonEvent() {
        if ($gameTemp.isCommonEventReserved()) {
            this.setup($gameTemp.reservedCommonEvent().list);
            $gameTemp.clearCommonEvent();
            return true;
        } else {
            return false;
        }
    }

    public isRunning() {
        return !!this._list;
    }

    public update() {
        while (this.isRunning()) {
            if (this.updateChild() || this.updateWait()) {
                break;
            }
            if (SceneManager.isSceneChanging()) {
                break;
            }
            if (!this.executeCommand()) {
                break;
            }
            if (this.checkFreeze()) {
                break;
            }
        }
    }

    public updateChild() {
        if (this._childInterpreter) {
            this._childInterpreter.update();
            if (this._childInterpreter.isRunning()) {
                return true;
            } else {
                this._childInterpreter = null;
            }
        }
        return false;
    }

    public updateWait() {
        return this.updateWaitCount() || this.updateWaitMode();
    }

    public updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }

    public updateWaitMode() {
        let waiting = false;
        switch (this._waitMode) {
            case "message":
                waiting = $gameMessage.isBusy();
                break;
            case "transfer":
                waiting = $gamePlayer.isTransferring();
                break;
            case "scroll":
                waiting = $gameMap.isScrolling();
                break;
            case "route":
                waiting = this._character.isMoveRouteForcing();
                break;
            case "animation":
                waiting = this._character.isAnimationPlaying();
                break;
            case "balloon":
                waiting = this._character.isBalloonPlaying();
                break;
            case "gather":
                waiting = $gamePlayer.areFollowersGathering();
                break;
            case "action":
                waiting = BattleManager.isActionForced();
                break;
            case "video":
                waiting = Graphics.isVideoPlaying();
                break;
            case "image":
                waiting = !ImageManager.isReady();
                break;
        }
        if (!waiting) {
            this._waitMode = "";
        }
        return waiting;
    }

    public setWaitMode(waitMode) {
        this._waitMode = waitMode;
    }

    public wait(duration) {
        this._waitCount = duration;
    }

    public fadeSpeed() {
        return 24;
    }

    public executeCommand() {
        const command = this.currentCommand();
        if (command) {
            this._params = command.parameters;
            this._indent = command.indent;
            const methodName = "command" + command.code;
            if (typeof this[methodName] === "function") {
                if (!this[methodName]()) {
                    return false;
                }
            }
            this._index++;
        } else {
            this.terminate();
        }
        return true;
    }

    public checkFreeze() {
        if (this._frameCount !== Graphics.frameCount) {
            this._frameCount = Graphics.frameCount;
            this._freezeChecker = 0;
        }
        if (this._freezeChecker++ >= 100000) {
            return true;
        } else {
            return false;
        }
    }

    public terminate() {
        this._list = null;
        this._comments = "";
    }

    public skipBranch() {
        while (this._list[this._index + 1].indent > this._indent) {
            this._index++;
        }
    }

    public currentCommand() {
        return this._list[this._index];
    }

    public nextEventCode() {
        const command = this._list[this._index + 1];
        if (command) {
            return command.code;
        } else {
            return 0;
        }
    }

    public iterateActorId(param, callback) {
        if (param === 0) {
            $gameParty.members().forEach(callback);
        } else {
            const actor = $gameActors.actor(param);
            if (actor) {
                callback(actor);
            }
        }
    }

    public iterateActorEx(param1, param2, callback) {
        if (param1 === 0) {
            this.iterateActorId(param2, callback);
        } else {
            this.iterateActorId($gameVariables.value(param2), callback);
        }
    }

    public iterateActorIndex(param, callback) {
        if (param < 0) {
            $gameParty.members().forEach(callback);
        } else {
            const actor = $gameParty.members()[param];
            if (actor) {
                callback(actor);
            }
        }
    }

    public iterateEnemyIndex(param, callback) {
        if (param < 0) {
            $gameTroop.members().forEach(callback);
        } else {
            const enemy = $gameTroop.members()[param];
            if (enemy) {
                callback(enemy);
            }
        }
    }

    public iterateBattler(param1, param2, callback) {
        if ($gameParty.inBattle()) {
            if (param1 === 0) {
                this.iterateEnemyIndex(param2, callback);
            } else {
                this.iterateActorId(param2, callback);
            }
        }
    }

    public character(param) {
        if ($gameParty.inBattle()) {
            return null;
        } else if (param < 0) {
            return $gamePlayer;
        } else if (this.isOnCurrentMap()) {
            return $gameMap.event(param > 0 ? param : this._eventId);
        } else {
            return null;
        }
    }

    public operateValue(operation, operandType, operand) {
        const value =
            operandType === 0 ? operand : $gameVariables.value(operand);
        return operation === 0 ? value : -value;
    }

    public changeHp(target, value, allowDeath) {
        if (target.isAlive()) {
            if (!allowDeath && target.hp <= -value) {
                value = 1 - target.hp;
            }
            target.gainHp(value);
            if (target.isDead()) {
                target.performCollapse();
            }
        }
    }

    // Show Text
    public command101() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setFaceImage(this._params[0], this._params[1]);
            $gameMessage.setBackground(this._params[2]);
            $gameMessage.setPositionType(this._params[3]);
            while (this.nextEventCode() === 401) {
                // Text data
                this._index++;
                $gameMessage.add(this.currentCommand().parameters[0]);
            }
            switch (this.nextEventCode()) {
                case 102: // Show Choices
                    this._index++;
                    this.setupChoices(this.currentCommand().parameters);
                    break;
                case 103: // Input Number
                    this._index++;
                    this.setupNumInput(this.currentCommand().parameters);
                    break;
                case 104: // Select Item
                    this._index++;
                    this.setupItemChoice(this.currentCommand().parameters);
                    break;
            }
            this._index++;
            this.setWaitMode("message");
        }
        return false;
    }

    // Show Choices
    public command102() {
        if (!$gameMessage.isBusy()) {
            this.setupChoices(this._params);
            this._index++;
            this.setWaitMode("message");
        }
        return false;
    }

    public setupChoices(params) {
        const choices = Utils.arrayClone(params[0]);
        let cancelType = params[1];
        const defaultType = params.length > 2 ? params[2] : 0;
        const positionType = params.length > 3 ? params[3] : 2;
        const background = params.length > 4 ? params[4] : 0;
        if (cancelType >= choices.length) {
            cancelType = -2;
        }
        $gameMessage.setChoices(choices, defaultType, cancelType);
        $gameMessage.setChoiceBackground(background);
        $gameMessage.setChoicePositionType(positionType);
        $gameMessage.setChoiceCallback(
            function(n) {
                this._branch[this._indent] = n;
            }.bind(this)
        );
    }

    // When [**]
    public command402() {
        if (this._branch[this._indent] !== this._params[0]) {
            this.skipBranch();
        }
        return true;
    }

    // When Cancel
    public command403() {
        if (this._branch[this._indent] >= 0) {
            this.skipBranch();
        }
        return true;
    }

    // Input Number
    public command103() {
        if (!$gameMessage.isBusy()) {
            this.setupNumInput(this._params);
            this._index++;
            this.setWaitMode("message");
        }
        return false;
    }

    public setupNumInput(params) {
        $gameMessage.setNumberInput(params[0], params[1]);
    }

    // Select Item
    public command104() {
        if (!$gameMessage.isBusy()) {
            this.setupItemChoice(this._params);
            this._index++;
            this.setWaitMode("message");
        }
        return false;
    }

    public setupItemChoice(params) {
        $gameMessage.setItemChoice(params[0], params[1] || 2);
    }

    // Show Scrolling Text
    public command105() {
        if (!$gameMessage.isBusy()) {
            $gameMessage.setScroll(this._params[0], this._params[1]);
            while (this.nextEventCode() === 405) {
                this._index++;
                $gameMessage.add(this.currentCommand().parameters[0]);
            }
            this._index++;
            this.setWaitMode("message");
        }
        return false;
    }

    // Comment
    public command108() {
        this._comments = [this._params[0]];
        while (this.nextEventCode() === 408) {
            this._index++;
            this._comments.push(this.currentCommand().parameters[0]);
        }
        return true;
    }

    // Conditional Branch
    public command111() {
        let result = false;
        switch (this._params[0]) {
            case 0: // Switch
                if (this._params[2] === 0) {
                    result = $gameSwitches.value(this._params[1]);
                } else {
                    result = !$gameSwitches.value(this._params[1]);
                }
                this._branch[this._indent] = result;
                if (this._branch[this._indent] === false) this.skipBranch();
                break;
            case 1: // Variable
                const value1 = $gameVariables.value(this._params[1]);
                let value2;
                if (this._params[2] === 0) {
                    value2 = this._params[3];
                } else {
                    value2 = $gameVariables.value(this._params[3]);
                }
                switch (this._params[4]) {
                    case 0: // Equal to
                        result = value1 === value2;
                        break;
                    case 1: // Greater than or Equal to
                        result = value1 >= value2;
                        break;
                    case 2: // Less than or Equal to
                        result = value1 <= value2;
                        break;
                    case 3: // Greater than
                        result = value1 > value2;
                        break;
                    case 4: // Less than
                        result = value1 < value2;
                        break;
                    case 5: // Not Equal to
                        result = value1 !== value2;
                        break;
                }
                break;
            case 2: // Self Switch
                if (this._eventId > 0) {
                    const key = [this._mapId, this._eventId, this._params[1]];
                    if (this._params[2] === 0) {
                        result = $gameSelfSwitches.value(key);
                    } else {
                        result = !$gameSelfSwitches.value(key);
                    }
                }
                this._branch[this._indent] = result;
                if (this._branch[this._indent] === false) this.skipBranch();
                break;
            case 3: // Timer
                if ($gameTimer.isWorking()) {
                    if (this._params[2] === 0) {
                        result = $gameTimer.seconds() >= this._params[1];
                    } else {
                        result = $gameTimer.seconds() <= this._params[1];
                    }
                }
                break;
            case 4: // Actor
                const actor = $gameActors.actor(this._params[1]);
                if (actor) {
                    const n = this._params[3];
                    switch (this._params[2]) {
                        case 0: // In the Party
                            result = $gameParty.members().indexOf(actor) > -1;
                            break;
                        case 1: // Name
                            result = actor.name() === n;
                            break;
                        case 2: // Class
                            result = actor.isClass($dataClasses[n]);
                            break;
                        case 3: // Skill
                            result = actor.hasSkill(n);
                            break;
                        case 4: // Weapon
                            result = actor.hasWeapon($dataWeapons[n]);
                            break;
                        case 5: // Armor
                            result = actor.hasArmor($dataArmors[n]);
                            break;
                        case 6: // State
                            result = actor.isStateAffected(n);
                            break;
                    }
                }
                break;
            case 5: // Enemy
                const enemy = $gameTroop.members()[this._params[1]];
                if (enemy) {
                    switch (this._params[2]) {
                        case 0: // Appeared
                            result = enemy.isAlive();
                            break;
                        case 1: // State
                            result = enemy.isStateAffected(this._params[3]);
                            break;
                    }
                }
                break;
            case 6: // Character
                const character = this.character(this._params[1]);
                if (character) {
                    result = character.direction() === this._params[2];
                }
                break;
            case 7: // Gold
                switch (this._params[2]) {
                    case 0: // Greater than or equal to
                        result = $gameParty.gold() >= this._params[1];
                        break;
                    case 1: // Less than or equal to
                        result = $gameParty.gold() <= this._params[1];
                        break;
                    case 2: // Less than
                        result = $gameParty.gold() < this._params[1];
                        break;
                }
                break;
            case 8: // Item
                result = $gameParty.hasItem($dataItems[this._params[1]]);
                break;
            case 9: // Weapon
                result = $gameParty.hasItem(
                    $dataWeapons[this._params[1]],
                    this._params[2]
                );
                break;
            case 10: // Armor
                result = $gameParty.hasItem(
                    $dataArmors[this._params[1]],
                    this._params[2]
                );
                break;
            case 11: // Button
                result = Input.isPressed(this._params[1]);
                break;
            case 12: // Script
                const code = this._params[1];
                try {
                    result = !!eval(code);
                } catch (e) {
                    result = false;
                    Yanfly.Util.displayError(
                        e,
                        code,
                        "CONDITIONAL BRANCH SCRIPT ERROR"
                    );
                }
                this._branch[this._indent] = result;
                if (this._branch[this._indent] === false) this.skipBranch();
                break;
            case 13: // Vehicle
                result =
                    $gamePlayer.vehicle() === $gameMap.vehicle(this._params[1]);
                break;
        }
        this._branch[this._indent] = result;
        if (this._branch[this._indent] === false) {
            this.skipBranch();
        }
        return true;
    }

    // Else
    public command411() {
        if (this._branch[this._indent] !== false) {
            this.skipBranch();
        }
        return true;
    }

    // Loop
    public command112() {
        return true;
    }

    // Repeat Above
    public command413() {
        do {
            this._index--;
        } while (this.currentCommand().indent !== this._indent);
        return true;
    }

    // Break Loop
    public command113() {
        let depth = 0;
        while (this._index < this._list.length - 1) {
            this._index++;
            const command = this.currentCommand();

            if (command.code === 112) {
                depth++;
            }

            if (command.code === 413) {
                if (depth > 0) {
                    depth--;
                } else {
                    break;
                }
            }
        }
        return true;
    }

    // Exit Event Processing
    public command115() {
        this._index = this._list.length;
        return true;
    }

    // Common Event
    public command117() {
        const commonEvent = $dataCommonEvents[this._params[0]];
        if (commonEvent) {
            const eventId = this.isOnCurrentMap() ? this._eventId : 0;
            this.setupChild(commonEvent.list, eventId);
        }
        return true;
    }

    public setupChild(list, eventId) {
        this._childInterpreter = new Game_Interpreter(this._depth + 1);
        this._childInterpreter.setup(list, eventId);
    }

    // Label
    public command118() {
        return true;
    }

    // Jump to Label
    public command119() {
        const labelName = this._params[0];
        for (let i = 0; i < this._list.length; i++) {
            const command = this._list[i];
            if (command.code === 118 && command.parameters[0] === labelName) {
                this.jumpTo(i);
                return;
            }
        }
        return true;
    }

    public jumpTo(index) {
        const lastIndex = this._index;
        const startIndex = Math.min(index, lastIndex);
        const endIndex = Math.max(index, lastIndex);
        let indent = this._indent;
        for (let i = startIndex; i <= endIndex; i++) {
            const newIndent = this._list[i].indent;
            if (newIndent !== indent) {
                this._branch[indent] = null;
                indent = newIndent;
            }
        }
        this._index = index;
    }

    // Control Switches
    public command121() {
        for (let i = this._params[0]; i <= this._params[1]; i++) {
            $gameSwitches.setValue(i, this._params[2] === 0);
        }
        return true;
    }

    // Control Variables
    public command122() {
        let value = 0;
        switch (
            this._params[3] // Operand
        ) {
            case 0: // Constant
                value = this._params[4];
                break;
            case 1: // Variable
                value = $gameVariables.value(this._params[4]);
                break;
            case 2: // Random
                value = this._params[5] - this._params[4] + 1;
                for (let i = this._params[0]; i <= this._params[1]; i++) {
                    this.operateVariable(
                        i,
                        this._params[2],
                        this._params[4] + Utils.randomInt(value)
                    );
                }
                return true;
            case 3: // Game Data
                value = this.gameDataOperand(
                    this._params[4],
                    this._params[5],
                    this._params[6]
                );
                break;
            case 4: // Script
                value = 0;
                var code = this._params[4];
                try {
                    value = eval(code);
                } catch (e) {
                    Yanfly.Util.displayError(
                        e,
                        code,
                        "CONTROL VARIABLE SCRIPT ERROR"
                    );
                }
                for (var i = this._params[0]; i <= this._params[1]; i++) {
                    this.operateVariable(i, this._params[2], value);
                }
                break;
        }
        for (let i = this._params[0]; i <= this._params[1]; i++) {
            this.operateVariable(i, this._params[2], value);
        }
        return true;
    }

    public gameDataOperand(type, param1, param2) {
        switch (type) {
            case 0: // Item
                return $gameParty.numItems($dataItems[param1]);
            case 1: // Weapon
                return $gameParty.numItems($dataWeapons[param1]);
            case 2: // Armor
                return $gameParty.numItems($dataArmors[param1]);
            case 3: // Actor
                let actor = $gameActors.actor(param1);
                if (actor) {
                    switch (param2) {
                        case 0: // Level
                            return actor.level;
                        case 1: // EXP
                            return actor.currentExp();
                        case 2: // HP
                            return actor.hp;
                        case 3: // MP
                            return actor.mp;
                        default:
                            // Parameter
                            if (param2 >= 4 && param2 <= 11) {
                                return actor.param(param2 - 4);
                            }
                    }
                }
                break;
            case 4: // Enemy
                const enemy = $gameTroop.members()[param1];
                if (enemy) {
                    switch (param2) {
                        case 0: // HP
                            return enemy.hp;
                        case 1: // MP
                            return enemy.mp;
                        default:
                            // Parameter
                            if (param2 >= 2 && param2 <= 9) {
                                return enemy.param(param2 - 2);
                            }
                    }
                }
                break;
            case 5: // Character
                const character = this.character(param1);
                if (character) {
                    switch (param2) {
                        case 0: // Map X
                            return character.x;
                        case 1: // Map Y
                            return character.y;
                        case 2: // Direction
                            return character.direction();
                        case 3: // Screen X
                            return character.screenX();
                        case 4: // Screen Y
                            return character.screenY();
                    }
                }
                break;
            case 6: // Party
                actor = $gameParty.members()[param1];
                return actor ? actor.actorId() : 0;
            case 7: // Other
                switch (param1) {
                    case 0: // Map ID
                        return $gameMap.mapId();
                    case 1: // Party Members
                        return $gameParty.size();
                    case 2: // Gold
                        return $gameParty.gold();
                    case 3: // Steps
                        return $gameParty.steps();
                    case 4: // Play Time
                        return 0; // $gameSystem.playtime
                    case 5: // Timer
                        return $gameTimer.seconds();
                    case 6: // Save Count
                        return $gameSystem.saveCount();
                    case 7: // Battle Count
                        return $gameSystem.battleCount();
                    case 8: // Win Count
                        return $gameSystem.winCount();
                    case 9: // Escape Count
                        return $gameSystem.escapeCount();
                }
                break;
        }
        return 0;
    }

    public operateVariable(variableId, operationType, value) {
        try {
            let oldValue = $gameVariables.value(variableId);
            switch (operationType) {
                case 0: // Set
                    $gameVariables.setValue(variableId, (oldValue = value));
                    break;
                case 1: // Add
                    $gameVariables.setValue(variableId, oldValue + value);
                    break;
                case 2: // Sub
                    $gameVariables.setValue(variableId, oldValue - value);
                    break;
                case 3: // Mul
                    $gameVariables.setValue(variableId, oldValue * value);
                    break;
                case 4: // Div
                    $gameVariables.setValue(variableId, oldValue / value);
                    break;
                case 5: // Mod
                    $gameVariables.setValue(variableId, oldValue % value);
                    break;
            }
        } catch (e) {
            $gameVariables.setValue(variableId, 0);
        }
    }

    // Control Self Switch
    public command123() {
        if (this._eventId > 0) {
            const key = [this._mapId, this._eventId, this._params[0]];
            $gameSelfSwitches.setValue(key, this._params[1] === 0);
        }
        return true;
    }

    // Control Timer
    public command124() {
        if (this._params[0] === 0) {
            // Start
            $gameTimer.start(this._params[1] * 60);
        } else {
            // Stop
            $gameTimer.stop();
        }
        return true;
    }

    // Change Gold
    public command125() {
        const value = this.operateValue(
            this._params[0],
            this._params[1],
            this._params[2]
        );
        $gameParty.gainGold(value);
        return true;
    }

    // Change Items
    public command126() {
        const value = this.operateValue(
            this._params[1],
            this._params[2],
            this._params[3]
        );
        $gameParty.gainItem($dataItems[this._params[0]], value);
        return true;
    }

    // Change Weapons
    public command127() {
        const value = this.operateValue(
            this._params[1],
            this._params[2],
            this._params[3]
        );
        $gameParty.gainItem(
            $dataWeapons[this._params[0]],
            value,
            this._params[4]
        );
        return true;
    }

    // Change Armors
    public command128() {
        const value = this.operateValue(
            this._params[1],
            this._params[2],
            this._params[3]
        );
        $gameParty.gainItem(
            $dataArmors[this._params[0]],
            value,
            this._params[4]
        );
        return true;
    }

    // Change Party Member
    public command129() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            if (this._params[1] === 0) {
                // Add
                if (this._params[2]) {
                    // Initialize
                    $gameActors.actor(this._params[0]).setup(this._params[0]);
                }
                $gameParty.addActor(this._params[0]);
            } else {
                // Remove
                $gameParty.removeActor(this._params[0]);
            }
        }
        return true;
    }

    // Change Battle BGM
    public command132() {
        $gameSystem.setBattleBgm(this._params[0]);
        return true;
    }

    // Change Victory ME
    public command133() {
        $gameSystem.setVictoryMe(this._params[0]);
        return true;
    }

    // Change Save Access
    public command134() {
        if (this._params[0] === 0) {
            $gameSystem.disableSave();
        } else {
            $gameSystem.enableSave();
        }
        return true;
    }

    // Change Menu Access
    public command135() {
        if (this._params[0] === 0) {
            $gameSystem.disableMenu();
        } else {
            $gameSystem.enableMenu();
        }
        return true;
    }

    // Change Encounter Disable
    public command136() {
        if (this._params[0] === 0) {
            $gameSystem.disableEncounter();
        } else {
            $gameSystem.enableEncounter();
        }
        $gamePlayer.makeEncounterCount();
        return true;
    }

    // Change Formation Access
    public command137() {
        if (this._params[0] === 0) {
            $gameSystem.disableFormation();
        } else {
            $gameSystem.enableFormation();
        }
        return true;
    }

    // Change Window Color
    public command138() {
        $gameSystem.setWindowTone(this._params[0]);
        return true;
    }

    // Change Defeat ME
    public command139() {
        $gameSystem.setDefeatMe(this._params[0]);
        return true;
    }

    // Change Vehicle BGM
    public command140() {
        const vehicle = $gameMap.vehicle(this._params[0]);
        if (vehicle) {
            vehicle.setBgm(this._params[1]);
        }
        return true;
    }

    // Transfer Player
    public command201() {
        if (!$gameParty.inBattle() && !$gameMessage.isBusy()) {
            let mapId, x, y;
            if (this._params[0] === 0) {
                // Direct designation
                mapId = this._params[1];
                x = this._params[2];
                y = this._params[3];
            } else {
                // Designation with variables
                mapId = $gameVariables.value(this._params[1]);
                x = $gameVariables.value(this._params[2]);
                y = $gameVariables.value(this._params[3]);
            }
            $gamePlayer.reserveTransfer(
                mapId,
                x,
                y,
                this._params[4],
                this._params[5]
            );
            this.setWaitMode("transfer");
            this._index++;
        }
        return false;
    }

    // Set Vehicle Location
    public command202() {
        let mapId, x, y;
        if (this._params[1] === 0) {
            // Direct designation
            mapId = this._params[2];
            x = this._params[3];
            y = this._params[4];
        } else {
            // Designation with variables
            mapId = $gameVariables.value(this._params[2]);
            x = $gameVariables.value(this._params[3]);
            y = $gameVariables.value(this._params[4]);
        }
        const vehicle = $gameMap.vehicle(this._params[0]);
        if (vehicle) {
            vehicle.setLocation(mapId, x, y);
        }
        return true;
    }

    // Set Event Location
    public command203() {
        const character = this.character(this._params[0]);
        if (character) {
            if (this._params[1] === 0) {
                // Direct designation
                character.locate(this._params[2], this._params[3]);
            } else if (this._params[1] === 1) {
                // Designation with variables
                const x = $gameVariables.value(this._params[2]);
                const y = $gameVariables.value(this._params[3]);
                character.locate(x, y);
            } else {
                // Exchange with another event
                const character2 = this.character(this._params[2]);
                if (character2) {
                    character.swap(character2);
                }
            }
            if (this._params[4] > 0) {
                character.setDirection(this._params[4]);
            }
        }
        return true;
    }

    // Scroll Map
    public command204() {
        if (!$gameParty.inBattle()) {
            if ($gameMap.isScrolling()) {
                this.setWaitMode("scroll");
                return false;
            }
            $gameMap.startScroll(
                this._params[0],
                this._params[1],
                this._params[2]
            );
        }
        return true;
    }

    // Set Movement Route
    public command205() {
        $gameMap.refreshIfNeeded();
        this._character = this.character(this._params[0]);
        if (this._character) {
            this._character.forceMoveRoute(this._params[1]);
            if (this._params[1].wait) {
                this.setWaitMode("route");
            }
        }
        return true;
    }

    // Getting On and Off Vehicles
    public command206() {
        $gamePlayer.getOnOffVehicle();
        return true;
    }

    // Change Transparency
    public command211() {
        $gamePlayer.setTransparent(this._params[0] === 0);
        return true;
    }

    // Show Animation
    public command212() {
        this._character = this.character(this._params[0]);
        if (this._character) {
            this._character.requestAnimation(this._params[1]);
            if (this._params[2]) {
                this.setWaitMode("animation");
            }
        }
        return true;
    }

    // Show Balloon Icon
    public command213() {
        this._character = this.character(this._params[0]);
        if (this._character) {
            this._character.requestBalloon(this._params[1]);
            if (this._params[2]) {
                this.setWaitMode("balloon");
            }
        }
        return true;
    }

    // Erase Event
    public command214() {
        if (this.isOnCurrentMap() && this._eventId > 0) {
            $gameMap.eraseEvent(this._eventId);
        }
        return true;
    }

    // Change Player Followers
    public command216() {
        if (this._params[0] === 0) {
            $gamePlayer.showFollowers();
        } else {
            $gamePlayer.hideFollowers();
        }
        $gamePlayer.refresh();
        return true;
    }

    // Gather Followers
    public command217() {
        if (!$gameParty.inBattle()) {
            $gamePlayer.gatherFollowers();
            this.setWaitMode("gather");
        }
        return true;
    }

    // Fadeout Screen
    public command221() {
        if (!$gameMessage.isBusy()) {
            $gameScreen.startFadeOut(this.fadeSpeed());
            this.wait(this.fadeSpeed());
            this._index++;
        }
        return false;
    }

    // Fadein Screen
    public command222() {
        if (!$gameMessage.isBusy()) {
            $gameScreen.startFadeIn(this.fadeSpeed());
            this.wait(this.fadeSpeed());
            this._index++;
        }
        return false;
    }

    // Tint Screen
    public command223() {
        $gameScreen.startTint(this._params[0], this._params[1]);
        if (this._params[2]) {
            this.wait(this._params[1]);
        }
        return true;
    }

    // Flash Screen
    public command224() {
        $gameScreen.startFlash(this._params[0], this._params[1]);
        if (this._params[2]) {
            this.wait(this._params[1]);
        }
        return true;
    }

    // Shake Screen
    public command225() {
        $gameScreen.startShake(
            this._params[0],
            this._params[1],
            this._params[2]
        );
        if (this._params[3]) {
            this.wait(this._params[2]);
        }
        return true;
    }

    // Wait
    public command230() {
        this.wait(this._params[0]);
        return true;
    }

    // Show Picture
    public command231() {
        let x, y;
        if (this._params[3] === 0) {
            // Direct designation
            x = this._params[4];
            y = this._params[5];
        } else {
            // Designation with variables
            x = $gameVariables.value(this._params[4]);
            y = $gameVariables.value(this._params[5]);
        }
        $gameScreen.showPicture(
            this._params[0],
            this._params[1],
            this._params[2],
            x,
            y,
            this._params[6],
            this._params[7],
            this._params[8],
            this._params[9]
        );
        return true;
    }

    // Move Picture
    public command232() {
        let x, y;
        if (this._params[3] === 0) {
            // Direct designation
            x = this._params[4];
            y = this._params[5];
        } else {
            // Designation with variables
            x = $gameVariables.value(this._params[4]);
            y = $gameVariables.value(this._params[5]);
        }
        $gameScreen.movePicture(
            this._params[0],
            this._params[2],
            x,
            y,
            this._params[6],
            this._params[7],
            this._params[8],
            this._params[9],
            this._params[10]
        );
        if (this._params[11]) {
            this.wait(this._params[10]);
        }
        return true;
    }

    // Rotate Picture
    public command233() {
        $gameScreen.rotatePicture(this._params[0], this._params[1]);
        return true;
    }

    // Tint Picture
    public command234() {
        $gameScreen.tintPicture(
            this._params[0],
            this._params[1],
            this._params[2]
        );
        if (this._params[3]) {
            this.wait(this._params[2]);
        }
        return true;
    }

    // Erase Picture
    public command235() {
        $gameScreen.erasePicture(this._params[0]);
        return true;
    }

    // Set Weather Effect
    public command236() {
        if (!$gameParty.inBattle()) {
            $gameScreen.changeWeather(
                this._params[0],
                this._params[1],
                this._params[2]
            );
            if (this._params[3]) {
                this.wait(this._params[2]);
            }
        }
        return true;
    }

    // Play BGM
    public command241() {
        AudioManager.playBgm(this._params[0]);
        return true;
    }

    // Fadeout BGM
    public command242() {
        AudioManager.fadeOutBgm(this._params[0]);
        return true;
    }

    // Save BGM
    public command243() {
        $gameSystem.saveBgm();
        return true;
    }

    // Resume BGM
    public command244() {
        $gameSystem.replayBgm();
        return true;
    }

    // Play BGS
    public command245() {
        AudioManager.playBgs(this._params[0]);
        return true;
    }

    // Fadeout BGS
    public command246() {
        AudioManager.fadeOutBgs(this._params[0]);
        return true;
    }

    // Play ME
    public command249() {
        AudioManager.playMe(this._params[0]);
        return true;
    }

    // Play SE
    public command250() {
        AudioManager.playSe(this._params[0]);
        return true;
    }

    // Stop SE
    public command251() {
        AudioManager.stopSe();
        return true;
    }

    // Play Movie
    public command261() {
        if (!$gameMessage.isBusy()) {
            const name = this._params[0];
            if (name.length > 0) {
                const ext = this.videoFileExt();
                Graphics.playVideo("movies/" + name + ext);
                this.setWaitMode("video");
            }
            this._index++;
        }
        return false;
    }

    public videoFileExt() {
        if (
            Graphics.canPlayVideoType("video/webm") &&
            !Utils.isMobileDevice()
        ) {
            return ".webm";
        } else {
            return ".mp4";
        }
    }

    // Change Map Name Display
    public command281() {
        if (this._params[0] === 0) {
            $gameMap.enableNameDisplay();
        } else {
            $gameMap.disableNameDisplay();
        }
        return true;
    }

    // Change Tileset
    public command282() {
        const tileset = $dataTilesets[this._params[0]];
        if (!this._imageReservationId) {
            this._imageReservationId = Utils.generateRuntimeId();
        }

        const allReady = tileset.tilesetNames
            .map(function(tilesetName) {
                return ImageManager.reserveTileset(
                    tilesetName,
                    0,
                    this._imageReservationId
                );
            }, this)
            .every(function(bitmap) {
                return bitmap.isReady();
            });

        if (allReady) {
            $gameMap.changeTileset(this._params[0]);
            ImageManager.releaseReservation(this._imageReservationId);
            this._imageReservationId = null;

            return true;
        } else {
            return false;
        }
    }

    // Change Battle Back
    public command283() {
        $gameMap.changeBattleback(this._params[0], this._params[1]);
        return true;
    }

    // Change Parallax
    public command284() {
        $gameMap.changeParallax(
            this._params[0],
            this._params[1],
            this._params[2],
            this._params[3],
            this._params[4]
        );
        return true;
    }

    // Get Location Info
    public command285() {
        let x, y, value;
        if (this._params[2] === 0) {
            // Direct designation
            x = this._params[3];
            y = this._params[4];
        } else {
            // Designation with variables
            x = $gameVariables.value(this._params[3]);
            y = $gameVariables.value(this._params[4]);
        }
        switch (this._params[1]) {
            case 0: // Terrain Tag
                value = $gameMap.terrainTag(x, y);
                break;
            case 1: // Event ID
                value = $gameMap.eventIdXy(x, y);
                break;
            case 2: // Tile ID (Layer 1)
            case 3: // Tile ID (Layer 2)
            case 4: // Tile ID (Layer 3)
            case 5: // Tile ID (Layer 4)
                value = $gameMap.tileId(x, y, this._params[1] - 2);
                break;
            default:
                // Region ID
                value = $gameMap.regionId(x, y);
                break;
        }
        $gameVariables.setValue(this._params[0], value);
        return true;
    }

    // Battle Processing
    public command301() {
        if (!$gameParty.inBattle()) {
            let troopId;
            if (this._params[0] === 0) {
                // Direct designation
                troopId = this._params[1];
            } else if (this._params[0] === 1) {
                // Designation with a variable
                troopId = $gameVariables.value(this._params[1]);
            } else {
                // Same as Random Encounter
                troopId = $gamePlayer.makeEncounterTroopId();
            }
            if ($dataTroops[troopId]) {
                BattleManager.setup(troopId, this._params[2], this._params[3]);
                BattleManager.setEventCallback(
                    function(n) {
                        this._branch[this._indent] = n;
                    }.bind(this)
                );
                $gamePlayer.makeEncounterCount();
                SceneManager.push(Scene_Battle);
            }
        }
        return true;
    }

    // If Win
    public command601() {
        if (this._branch[this._indent] !== 0) {
            this.skipBranch();
        }
        return true;
    }

    // If Escape
    public command602() {
        if (this._branch[this._indent] !== 1) {
            this.skipBranch();
        }
        return true;
    }

    // If Lose
    public command603() {
        if (this._branch[this._indent] !== 2) {
            this.skipBranch();
        }
        return true;
    }

    // Shop Processing
    public command302() {
        if (!$gameParty.inBattle()) {
            const goods = [this._params];
            while (this.nextEventCode() === 605) {
                this._index++;
                goods.push(this.currentCommand().parameters);
            }
            SceneManager.push(Scene_Shop);
            SceneManager.prepareNextScene(goods, this._params[4]);
        }
        return true;
    }

    // Name Input Processing
    public command303() {
        if (!$gameParty.inBattle()) {
            if ($dataActors[this._params[0]]) {
                SceneManager.push(Scene_Name);
                SceneManager.prepareNextScene(this._params[0], this._params[1]);
            }
        }
        return true;
    }

    // Change HP
    public command311() {
        const value = this.operateValue(
            this._params[2],
            this._params[3],
            this._params[4]
        );
        this.iterateActorEx(
            this._params[0],
            this._params[1],
            function(actor) {
                this.changeHp(actor, value, this._params[5]);
            }.bind(this)
        );
        return true;
    }

    // Change MP
    public command312() {
        const value = this.operateValue(
            this._params[2],
            this._params[3],
            this._params[4]
        );
        this.iterateActorEx(this._params[0], this._params[1], function(actor) {
            actor.gainMp(value);
        });
        return true;
    }

    // Change TP
    public command326() {
        const value = this.operateValue(
            this._params[2],
            this._params[3],
            this._params[4]
        );
        this.iterateActorEx(this._params[0], this._params[1], function(actor) {
            actor.gainTp(value);
        });
        return true;
    }

    // Change State
    public command313() {
        this.iterateActorEx(
            this._params[0],
            this._params[1],
            function(actor) {
                const alreadyDead = actor.isDead();
                if (this._params[2] === 0) {
                    actor.addState(this._params[3]);
                } else {
                    actor.removeState(this._params[3]);
                }
                if (actor.isDead() && !alreadyDead) {
                    actor.performCollapse();
                }
                actor.clearResult();
            }.bind(this)
        );
        return true;
    }

    // Recover All
    public command314() {
        this.iterateActorEx(this._params[0], this._params[1], function(actor) {
            actor.recoverAll();
        });
        return true;
    }

    // Change EXP
    public command315() {
        const value = this.operateValue(
            this._params[2],
            this._params[3],
            this._params[4]
        );
        this.iterateActorEx(
            this._params[0],
            this._params[1],
            function(actor) {
                actor.changeExp(actor.currentExp() + value, this._params[5]);
            }.bind(this)
        );
        return true;
    }

    // Change Level
    public command316() {
        const value = this.operateValue(
            this._params[2],
            this._params[3],
            this._params[4]
        );
        this.iterateActorEx(
            this._params[0],
            this._params[1],
            function(actor) {
                actor.changeLevel(actor.level + value, this._params[5]);
            }.bind(this)
        );
        return true;
    }

    // Change Parameter
    public command317() {
        const value = this.operateValue(
            this._params[3],
            this._params[4],
            this._params[5]
        );
        this.iterateActorEx(
            this._params[0],
            this._params[1],
            function(actor) {
                actor.addParam(this._params[2], value);
            }.bind(this)
        );
        return true;
    }

    // Change Skill
    public command318() {
        this.iterateActorEx(
            this._params[0],
            this._params[1],
            function(actor) {
                if (this._params[2] === 0) {
                    actor.learnSkill(this._params[3]);
                } else {
                    actor.forgetSkill(this._params[3]);
                }
            }.bind(this)
        );
        return true;
    }

    // Change Equipment
    public command319() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            actor.changeEquipById(this._params[1], this._params[2]);
        }
        return true;
    }

    // Change Name
    public command320() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            actor.setName(this._params[1]);
        }
        return true;
    }

    // Change Class
    public command321() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor && $dataClasses[this._params[1]]) {
            actor.changeClass(this._params[1], this._params[2]);
        }
        return true;
    }

    // Change Actor Images
    public command322() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            actor.setCharacterImage(this._params[1], this._params[2]);
            actor.setFaceImage(this._params[3], this._params[4]);
            actor.setBattlerImage(this._params[5]);
        }
        $gamePlayer.refresh();
        return true;
    }

    // Change Vehicle Image
    public command323() {
        const vehicle = $gameMap.vehicle(this._params[0]);
        if (vehicle) {
            vehicle.setImage(this._params[1], this._params[2]);
        }
        return true;
    }

    // Change Nickname
    public command324() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            actor.setNickname(this._params[1]);
        }
        return true;
    }

    // Change Profile
    public command325() {
        const actor = $gameActors.actor(this._params[0]);
        if (actor) {
            actor.setProfile(this._params[1]);
        }
        return true;
    }

    // Change Enemy HP
    public command331() {
        const value = this.operateValue(
            this._params[1],
            this._params[2],
            this._params[3]
        );
        this.iterateEnemyIndex(
            this._params[0],
            function(enemy) {
                this.changeHp(enemy, value, this._params[4]);
            }.bind(this)
        );
        return true;
    }

    // Change Enemy MP
    public command332() {
        const value = this.operateValue(
            this._params[1],
            this._params[2],
            this._params[3]
        );
        this.iterateEnemyIndex(this._params[0], function(enemy) {
            enemy.gainMp(value);
        });
        return true;
    }

    // Change Enemy TP
    public command342() {
        const value = this.operateValue(
            this._params[1],
            this._params[2],
            this._params[3]
        );
        this.iterateEnemyIndex(this._params[0], function(enemy) {
            enemy.gainTp(value);
        });
        return true;
    }

    // Change Enemy State
    public command333() {
        this.iterateEnemyIndex(
            this._params[0],
            function(enemy) {
                const alreadyDead = enemy.isDead();
                if (this._params[1] === 0) {
                    enemy.addState(this._params[2]);
                } else {
                    enemy.removeState(this._params[2]);
                }
                if (enemy.isDead() && !alreadyDead) {
                    enemy.performCollapse();
                }
                enemy.clearResult();
            }.bind(this)
        );
        return true;
    }

    // Enemy Recover All
    public command334() {
        this.iterateEnemyIndex(this._params[0], function(enemy) {
            enemy.recoverAll();
        });
        return true;
    }

    // Enemy Appear
    public command335() {
        this.iterateEnemyIndex(this._params[0], function(enemy) {
            enemy.appear();
            $gameTroop.makeUniqueNames();
        });
        return true;
    }

    // Enemy Transform
    public command336() {
        this.iterateEnemyIndex(
            this._params[0],
            function(enemy) {
                enemy.transform(this._params[1]);
                $gameTroop.makeUniqueNames();
            }.bind(this)
        );
        return true;
    }

    // Show Battle Animation
    public command337() {
        if (this._params[2] === true) {
            this.iterateEnemyIndex(
                -1,
                function(enemy) {
                    if (enemy.isAlive()) {
                        enemy.startAnimation(this._params[1], false, 0);
                    }
                }.bind(this)
            );
        } else {
            this.iterateEnemyIndex(
                this._params[0],
                function(enemy) {
                    if (enemy.isAlive()) {
                        enemy.startAnimation(this._params[1], false, 0);
                    }
                }.bind(this)
            );
        }
        return true;
    }

    // Force Action
    public command339() {
        this.iterateBattler(
            this._params[0],
            this._params[1],
            function(battler) {
                if (!battler.isDeathStateAffected()) {
                    battler.forceAction(this._params[2], this._params[3]);
                    BattleManager.forceAction(battler);
                    this.setWaitMode("action");
                }
            }.bind(this)
        );
        return true;
    }

    // Abort Battle
    public command340() {
        BattleManager.abort();
        return true;
    }

    // Open Menu Screen
    public command351() {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_Menu);
            Window_MenuCommand.initCommandPosition();
        }
        return true;
    }

    // Open Save Screen
    public command352() {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_Save);
        }
        return true;
    }

    // Game Over
    public command353() {
        SceneManager.goto(Scene_Gameover);
        return true;
    }

    // Return to Title Screen
    public command354() {
        SceneManager.goto(Scene_Title);
        return true;
    }

    // Script
    public command355() {
        let script = this.currentCommand().parameters[0] + "\n";
        while (this.nextEventCode() === 655) {
            this._index++;
            script += this.currentCommand().parameters[0] + "\n";
        }
        try {
            eval(script);
        } catch (e) {
            Yanfly.Util.displayError(e, script, "SCRIPT CALL ERROR");
        }
        return true;
    }

    // Plugin Command
    public command356() {
        const args = this._params[0].split(" ");
        const command = args.shift();
        this.pluginCommand(command, args);
        return true;
    }

    public pluginCommand(command, args) {
        if (command === "GainGold") {
            $gameParty.gainGold(parseInt(args[0]));
        }
        if (command === "LoseGold") {
            $gameParty.loseGold(parseInt(args[0]));
        }
        if (command === "RefreshMap") {
            if (!$gameParty.inBattle()) {
                $gameMap.requestRefresh($gameMap.mapId());
            }
        }
        if (command === "RefreshTroop") {
            if ($gameParty.inBattle()) {
                $gameTroop.setupBattleEvent();
            }
        }
        if (command === "setBattleSys" && !$gameParty.inBattle()) {
            this.setBattleSystem(args[0]);
        }
    }

    public setBattleSystem(value) {
        $gameSystem.setBattleSystem(value);
    }
}
