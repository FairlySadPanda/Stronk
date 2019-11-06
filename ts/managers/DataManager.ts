import { Decrypter } from "../core/Decrypter";
import { JsonEx } from "../core/JsonEx";
import { ResourceHandler } from "../core/ResourceHandler";
import { Utils } from "../core/Utils";
import { Game_Actors } from "../objects/Game_Actors";
import { Game_Map } from "../objects/Game_Map";
import { Game_Message } from "../objects/Game_Message";
import { Game_Party } from "../objects/Game_Party";
import { Game_Player } from "../objects/Game_Player";
import { Game_Screen } from "../objects/Game_Screen";
import { Game_SelfSwitches } from "../objects/Game_SelfSwitches";
import { Game_Switches } from "../objects/Game_Switches";
import { Game_System } from "../objects/Game_System";
import { Game_Temp } from "../objects/Game_Temp";
import { Game_Timer } from "../objects/Game_Timer";
import { Game_Troop } from "../objects/Game_Troop";
import { Game_Variables } from "../objects/Game_Variables";
import { Scene_Boot } from "../scenes/Scene_Boot";
import { BattleManager } from "./BattleManager";
import { ImageManager } from "./ImageManager";
import { StorageManager } from "./StorageManager";
import { Yanfly } from "../plugins/Stronk_YEP_CoreEngine";

export abstract class DataManager {
    private static _windowId = "RPGMV";
    private static _lastAccessedId = 1;
    private static _errorUrl = null;
    private static _databaseFiles = [
        { name: "$dataActors", src: "Actors.json" },
        { name: "$dataClasses", src: "Classes.json" },
        { name: "$dataSkills", src: "Skills.json" },
        { name: "$dataItems", src: "Items.json" },
        { name: "$dataWeapons", src: "Weapons.json" },
        { name: "$dataArmors", src: "Armors.json" },
        { name: "$dataEnemies", src: "Enemies.json" },
        { name: "$dataTroops", src: "Troops.json" },
        { name: "$dataStates", src: "States.json" },
        { name: "$dataAnimations", src: "Animations.json" },
        { name: "$dataTilesets", src: "Tilesets.json" },
        { name: "$dataCommonEvents", src: "CommonEvents.json" },
        { name: "$dataSystem", src: "System.json" },
        { name: "$dataMapInfos", src: "MapInfos.json" }
    ];

    public static _autoSaveFileId: any;
    public static _mapLoader: (this: XMLHttpRequest) => void;
    public static loadDatabase = function() {
        const test = DataManager.isBattleTest() || DataManager.isEventTest();
        const prefix = test ? "Test_" : "";
        for (let i = 0; i < DataManager._databaseFiles.length; i++) {
            const name = DataManager._databaseFiles[i].name;
            const src = DataManager._databaseFiles[i].src;
            DataManager.loadDataFile(name, prefix + src);
        }
        if (DataManager.isEventTest()) {
            DataManager.loadDataFile("$testEvent", prefix + "Event.json");
        }
    };

    public static loadDataFile = function(name, src) {
        const xhr = new XMLHttpRequest();
        const url = "data/" + src;
        xhr.open("GET", url);
        xhr.overrideMimeType("application/json");
        xhr.onload = function() {
            if (xhr.status < 400) {
                window[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad(window[name]);
            }
        };
        xhr.onerror =
            DataManager._mapLoader ||
            function() {
                DataManager._errorUrl = DataManager._errorUrl || url;
            };
        window[name] = null;
        xhr.send();
    };

    public static isDatabaseLoaded() {
        DataManager.checkError();
        for (let i = 0; i < DataManager._databaseFiles.length; i++) {
            if (!window[DataManager._databaseFiles[i].name]) {
                return false;
            }
        }
        if (!Yanfly._loaded_YEP_CoreEngine) {
            this.processCORENotetags1($dataItems);
            this.processCORENotetags1($dataWeapons);
            this.processCORENotetags1($dataArmors);
            this.processCORENotetags2($dataEnemies);
            this.processCORENotetags3($dataActors);
            this.processCORENotetags4($dataClasses);
            Yanfly._loaded_YEP_CoreEngine = true;
        }

        if (!Yanfly._loaded_YEP_BaseParamControl) {
            this.processBPCNotetags1($dataActors);
            this.processBPCNotetags1($dataClasses);
            this.processBPCNotetags1($dataEnemies);
            this.processBPCNotetags1($dataWeapons);
            this.processBPCNotetags1($dataArmors);
            this.processBPCNotetags1($dataStates);
            Yanfly._loaded_YEP_BaseParamControl = true;
        }

        if (!Yanfly._loaded_YEP_ExtraParamFormula) {
            this.processXParamNotetags($dataActors);
            this.processXParamNotetags($dataClasses);
            this.processXParamNotetags($dataEnemies);
            this.processXParamNotetags($dataWeapons);
            this.processXParamNotetags($dataArmors);
            this.processXParamNotetags($dataStates);
            Yanfly._loaded_YEP_ExtraParamFormula = true;
        }

        if (!Yanfly._loaded_YEP_BattleEngineCore) {
            this.processMELODYNotetags($dataSkills);
            this.processMELODYNotetags($dataItems);
            this.processBECNotetags1($dataSkills);
            this.processBECNotetags2($dataSkills);
            this.processBECNotetags2($dataItems);
            this.processBECNotetags3($dataEnemies);
            this.processBECNotetags4($dataActors);
            this.processBECNotetags4($dataClasses);
            this.processBECNotetags4($dataWeapons);
            this.processBECNotetags4($dataArmors);
            this.processBECNotetags4($dataEnemies);
            this.processBECNotetags4($dataStates);
            this.processBECNotetags5($dataActors, true);
            this.processBECNotetags5($dataClasses, false);
            this.processBECNotetags5($dataWeapons, false);
            this.processBECNotetags5($dataArmors, false);
            this.processBECNotetags5($dataStates, false);
            this.processBECNotetags6($dataStates);
            Yanfly._loaded_YEP_BattleEngineCore = true;
        }

        return true;
    }

    public static processCORENotetags1(group) {
        for (let n = 1; n < group.length; n++) {
            const obj = group[n];
            const notedata = obj.note.split(/[\r\n]+/);

            obj.maxItem = Yanfly.Param.MaxItem;

            for (let i = 0; i < notedata.length; i++) {
                const line = notedata[i];
                if (line.match(/<(?:PRICE):[ ](\d+)>/i)) {
                    obj.price = parseInt(RegExp.$1);
                } else if (line.match(/<(?:MAX ITEM):[ ](\d+)>/i)) {
                    obj.maxItem = Math.max(1, parseInt(RegExp.$1));
                } else if (line.match(/<(.*):[ ]([\+\-]\d+)>/i)) {
                    const stat = String(RegExp.$1).toUpperCase();
                    const value = parseInt(RegExp.$2);
                    switch (stat) {
                        case "HP":
                        case "MAXHP":
                        case "MAX HP":
                            obj.params[0] = value;
                            break;
                        case "MP":
                        case "MAXMP":
                        case "MAX MP":
                        case "SP":
                        case "MAXSP":
                        case "MAX SP":
                            obj.params[1] = value;
                            break;
                        case "ATK":
                        case "STR":
                            obj.params[2] = value;
                            break;
                        case "DEF":
                            obj.params[3] = value;
                            break;
                        case "MAT":
                        case "INT" || "SPI":
                            obj.params[4] = value;
                            break;
                        case "MDF":
                        case "RES":
                            obj.params[5] = value;
                            break;
                        case "AGI":
                        case "SPD":
                            obj.params[6] = value;
                            break;
                        case "LUK":
                            obj.params[7] = value;
                            break;
                        case "EXP":
                        case "XP":
                            obj.exp = value;
                            break;
                    }
                }
            }
        }
    }

    public static processCORENotetags2(group) {
        for (let n = 1; n < group.length; n++) {
            const obj = group[n];
            const notedata = obj.note.split(/[\r\n]+/);

            for (let i = 0; i < notedata.length; i++) {
                const line = notedata[i];
                if (line.match(/<(?:GOLD):[ ](\d+)>/i)) {
                    obj.gold = parseInt(RegExp.$1);
                } else if (line.match(/<(.*):[ ](\d+)>/i)) {
                    const stat = String(RegExp.$1).toUpperCase();
                    const value = parseInt(RegExp.$2);
                    switch (stat) {
                        case "HP":
                        case "MAXHP":
                        case "MAX HP":
                            obj.params[0] = value;
                            break;
                        case "MP":
                        case "MAXMP":
                        case "MAX MP":
                        case "SP":
                        case "MAXSP":
                        case "MAX SP":
                            obj.params[1] = value;
                            break;
                        case "ATK":
                        case "STR":
                            obj.params[2] = value;
                            break;
                        case "DEF":
                            obj.params[3] = value;
                            break;
                        case "MAT":
                        case "INT":
                        case "SPI":
                            obj.params[4] = value;
                            break;
                        case "MDF":
                        case "RES":
                            obj.params[5] = value;
                            break;
                        case "AGI":
                        case "SPD":
                            obj.params[6] = value;
                            break;
                        case "LUK":
                            obj.params[7] = value;
                            break;
                        case "EXP":
                        case "XP":
                            obj.exp = value;
                            break;
                    }
                }
            }
        }
    }

    public static processCORENotetags3(group) {
        for (let n = 1; n < group.length; n++) {
            const obj = group[n];
            const notedata = obj.note.split(/[\r\n]+/);

            obj.maxLevel = Yanfly.Param.MaxLevel;

            for (let i = 0; i < notedata.length; i++) {
                const line = notedata[i];
                if (line.match(/<(?:MAX LEVEL):[ ](\d+)>/i)) {
                    obj.maxLevel = parseInt(RegExp.$1);
                    if (obj.maxLevel < 1) obj.maxLevel = 1;
                } else if (line.match(/<(?:INITIAL LEVEL):[ ](\d+)>/i)) {
                    obj.initialLevel = parseInt(RegExp.$1);
                    if (obj.initialLevel < 1) obj.initialLevel = 1;
                }
            }
        }
    }

    public static processCORENotetags4(group) {
        for (let n = 1; n < group.length; n++) {
            const obj = group[n];
            const notedata = obj.note.split(/[\r\n]+/);

            obj.learnings.forEach(function(learning) {
                if (
                    learning.note.match(
                        /<(?:LEARN LEVEL|LEARN AT LEVEL):[ ](\d+)>/i
                    )
                ) {
                    learning.level = parseInt(RegExp.$1);
                    if (learning.level < 1) obj.maxLevel = 1;
                }
            }, this);
        }
    }

    public static processBPCNotetags1(group) {
        for (let n = 1; n < group.length; n++) {
            const obj = group[n];
            const notedata = obj.note.split(/[\r\n]+/);

            obj.plusParams = [0, 0, 0, 0, 0, 0, 0, 0];
            obj.rateParams = [1, 1, 1, 1, 1, 1, 1, 1];
            obj.flatParams = [0, 0, 0, 0, 0, 0, 0, 0];
            obj.maxParams = [];
            obj.minParams = [];

            for (let i = 0; i < notedata.length; i++) {
                const line = notedata[i];
                if (line.match(/<(.*) PLUS:[ ]([\+\-]\d+)>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const value = parseInt(RegExp.$2);
                    const id = this.getParamId(text);
                    if (id !== null) obj.plusParams[id] = value;
                } else if (line.match(/<(.*) RATE:[ ](\d+)([%ï¼…])>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const rate = parseFloat(RegExp.$2) * 0.01;
                    const id = this.getParamId(text);
                    if (id !== null) obj.rateParams[id] = rate;
                } else if (line.match(/<(.*) RATE:[ ](\d+).(\d+)>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const rate = parseFloat(
                        String(RegExp.$2) + "." + String(RegExp.$3)
                    );
                    const id = this.getParamId(text);
                    if (id !== null) obj.rateParams[id] = rate;
                } else if (line.match(/<(.*) FLAT:[ ]([\+\-]\d+)>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const value = parseInt(RegExp.$2);
                    const id = this.getParamId(text);
                    if (id !== null) obj.flatParams[id] = value;
                } else if (line.match(/<(.*) MAX:[ ](\d+)>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const value = parseInt(RegExp.$2);
                    const id = this.getParamId(text);
                    if (id !== null) obj.maxParams[id] = value;
                } else if (line.match(/<(.*) MIN:[ ](\d+)>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const value = parseInt(RegExp.$2);
                    const id = this.getParamId(text);
                    if (id !== null) obj.minParams[id] = value;
                }
            }
        }
    }

    public static processXParamNotetags(group) {
        for (let n = 1; n < group.length; n++) {
            const obj = group[n];
            const notedata = obj.note.split(/[\r\n]+/);

            obj.plusXParams = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            obj.rateXParams = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            obj.flatXParams = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            for (let i = 0; i < notedata.length; i++) {
                const line = notedata[i];
                if (line.match(/<(.*) PLUS:[ ]([\+\-]\d+)([%ï¼…])>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const rate = parseFloat(RegExp.$2) * 0.01;
                    const id = this.getXParamId(text);
                    if (id !== null) obj.plusXParams[id] = rate;
                } else if (line.match(/<(.*) PLUS:[ ]([\+\-]\d+).(\d+)>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const rate = parseFloat(
                        String(RegExp.$2) + "." + String(RegExp.$3)
                    );
                    const id = this.getXParamId(text);
                    if (id !== null) obj.plusXParams[id] = rate;
                } else if (line.match(/<(.*) RATE:[ ](\d+)([%ï¼…])>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const rate = parseFloat(RegExp.$2) * 0.01;
                    const id = this.getXParamId(text);
                    if (id !== null) obj.rateXParams[id] = rate;
                } else if (line.match(/<(.*) RATE:[ ](\d+).(\d+)>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const rate = parseFloat(
                        String(RegExp.$2) + "." + String(RegExp.$3)
                    );
                    const id = this.getXParamId(text);
                    if (id !== null) obj.rateXParams[id] = rate;
                } else if (line.match(/<(.*) FLAT:[ ]([\+\-]\d+)([%ï¼…])>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const rate = parseFloat(RegExp.$2) * 0.01;
                    const id = this.getXParamId(text);
                    if (id !== null) obj.flatXParams[id] = rate;
                } else if (line.match(/<(.*) FLAT:[ ]([\+\-]\d+).(\d+)>/i)) {
                    const text = String(RegExp.$1).toUpperCase();
                    const rate = parseFloat(
                        String(RegExp.$2) + "." + String(RegExp.$3)
                    );
                    const id = this.getXParamId(text);
                    if (id !== null) obj.flatXParams[id] = rate;
                }
            }
        }
    }

    public static processMELODYNotetags(group) {
        for (let n = 1; n < group.length; n++) {
            const obj = group[n];
            if (obj.actionsMade) {
                continue;
            }
            obj.actionsMade = true;
            const notedata = obj.note.split(/[\r\n]+/);

            var actionType = 0;
            this.setDefaultActions(obj);

            for (let i = 0; i < notedata.length; i++) {
                const line = notedata[i];
                if (line.match(/<(?:SETUP ACTION|setup)>/i)) {
                    actionType = 1;
                    obj.setupActions = [];
                } else if (line.match(/<\/(?:SETUP ACTION|setup)>/i)) {
                    actionType = 0;
                } else if (line.match(/<(?:WHOLE ACTION|whole)>/i)) {
                    actionType = 2;
                    obj.wholeActions = [];
                } else if (line.match(/<\/(?:WHOLE ACTION|whole)>/i)) {
                    actionType = 0;
                } else if (line.match(/<(?:TARGET ACTION|target)>/i)) {
                    actionType = 3;
                    obj.targetActions = [];
                } else if (line.match(/<\/(?:TARGET ACTION|target)>/i)) {
                    actionType = 0;
                } else if (line.match(/<(?:FOLLOW ACTION|follow)>/i)) {
                    actionType = 4;
                    obj.followActions = [];
                } else if (line.match(/<\/(?:FOLLOW ACTION|follow)>/i)) {
                    actionType = 0;
                } else if (line.match(/<(?:FINISH ACTION|finish)>/i)) {
                    actionType = 5;
                    obj.finishActions = [];
                } else if (line.match(/<\/(?:FINISH ACTION|finish)>/i)) {
                    actionType = 0;
                } else {
                    this.convertSequenceLine(obj, line, actionType);
                }
            }
        }
    }

    public static getParamId(string: string) {
        if (["MHP", , "MAXHP", "MAX HP", "HP"].includes(string)) {
            return 0;
        } else if (["MMP", , "MAXMP", "MAX MP", "MP"].includes(string)) {
            return 1;
        } else if (["ATK", "ATTACK"].includes(string)) {
            return 2;
        } else if (["DEF", "DEFENSE"].includes(string)) {
            return 3;
        } else if (
            ["MAT", "MAGIC ATTACK", "M.ATTACK", "INT"].includes(string)
        ) {
            return 4;
        } else if (
            ["MDF", "MAGIC DEFENSE", "M.DEFENSE", "RES"].includes(string)
        ) {
            return 5;
        } else if (["AGI", "AGILITY", "SPD"].includes(string)) {
            return 6;
        } else if (["LUK", "LUK"].includes(string)) {
            return 7;
        } else {
            return null;
        }
    }

    public static getXParamId(string) {
        if (["HIT", "HIT RATE"].includes(string)) {
            return 0;
        } else if (["EVA", "EVADE", "EVASION"].includes(string)) {
            return 1;
        } else if (["CRI", "CRITICAL", "CRITICAL HIT"].includes(string)) {
            return 2;
        } else if (
            ["CEV", "CRITICAL EVADE", "CRITICAL EVASION"].includes(string)
        ) {
            return 3;
        } else if (["MEV", "MAGIC EVADE", "MAGIC EVASION"].includes(string)) {
            return 4;
        } else if (
            ["MRF", "MAGIC REFLECT", "MAGIC REFLECTION"].includes(string)
        ) {
            return 5;
        } else if (["CNT", "COUNTER", "COUNTERATTACK"].includes(string)) {
            return 6;
        } else if (["HRG", "HP REGEN", "HP REGENERATION"].includes(string)) {
            return 7;
        } else if (["MRG", "MP REGEN", "MP REGENERATION"].includes(string)) {
            return 8;
        } else if (["TRG", "TP REGEN", "TP REGENERATION"].includes(string)) {
            return 9;
        } else {
            return null;
        }
    }

    public static setDefaultActions(obj) {
        obj.setupActions = Yanfly.BEC.DefaultActionSetup.slice();
        if (this.isWholeAction(obj)) {
            obj.wholeActions = Yanfly.BEC.DefaultActionWhole.slice();
            this.addActionEffects(obj, obj.wholeActions);
            obj.targetActions = [];
        } else {
            obj.wholeActions = [];
            obj.targetActions = Yanfly.BEC.DefaultActionTarget.slice();
            this.addActionEffects(obj, obj.targetActions);
        }
        obj.followActions = Yanfly.BEC.DefaultActionFollow.slice();
        obj.finishActions = Yanfly.BEC.DefaultActionFinish.slice();
    }

    public static isWholeAction(obj) {
        if (obj.animationId > 0 && $dataAnimations[obj.animationId]) {
            let animation = $dataAnimations[obj.animationId];
            if (animation.position === 3) return true;
            if (animation.position !== 3 && [2, 8, 10].includes(obj.scope))
                return true;
        }
        return false;
    }

    public static addActionEffects(obj, array) {
        for (;;) {
            array[array.length] = ["ACTION EFFECT"];
            array[array.length] = ["DEATH BREAK"];
            obj.repeats -= 1;
            if (obj.repeats <= 0) break;
            array[array.length] = ["WAIT", [8]];
        }
        obj.repeats = 1;
    }

    public static convertSequenceLine(obj, line, actionType) {
        if (actionType <= 0 || actionType > 5) return;
        let seqArgs;
        if (line.match(/[ ]*(.*):[ ](.*)/i)) {
            Yanfly.BEC.SeqType = RegExp.$1.trim();
            seqArgs = RegExp.$2.split(",");
            let length = seqArgs.length;
            for (let i = 0; i < length; ++i) {
                seqArgs[i] = seqArgs[i].trim();
            }
        } else {
            Yanfly.BEC.SeqType = line.trim();
            seqArgs = [];
        }
        let array = [Yanfly.BEC.SeqType, seqArgs];
        if (actionType === 1) obj.setupActions[obj.setupActions.length] = array;
        if (actionType === 2) obj.wholeActions[obj.wholeActions.length] = array;
        if (actionType === 3)
            obj.targetActions[obj.targetActions.length] = array;
        if (actionType === 4)
            obj.followActions[obj.followActions.length] = array;
        if (actionType === 5)
            obj.finishActions[obj.finishActions.length] = array;
    }

    public static processBECNotetags1(group) {
        let note1 = /<(?:CAST ANIMATION|cast ani):[ ](\d+)>/i;
        for (let n = 1; n < group.length; n++) {
            let obj = group[n];
            let notedata = obj.note.split(/[\r\n]+/);

            obj.castAnimation = 0;
            if (obj.hitType === 0) obj.castAnimation = Yanfly.Param.CastCertHit;
            if (obj.hitType === 1)
                obj.castAnimation = Yanfly.Param.CastPhysical;
            if (obj.hitType === 2) obj.castAnimation = Yanfly.Param.CastMagical;

            for (let i = 0; i < notedata.length; i++) {
                let line = notedata[i];
                if (line.match(note1)) {
                    obj.castAnimation = parseInt(RegExp.$1);
                }
            }
        }
    }

    public static processBECNotetags2(group) {
        let note1 = /<(?:ACTION COPY):[ ](.*):[ ]*(\d+)>/i;
        let note2 = /<(?:SPEED):[ ]([\+\-]\d+)>/i;
        let note3 = /<(?:DISPLAY NAME|DISPLAY TEXT):[ ](.*)>/i;
        let note4 = /<(?:DISPLAY ICON):[ ](\d+)>/i;
        for (let n = 1; n < group.length; n++) {
            let obj = group[n];
            let notedata = obj.note.split(/[\r\n]+/);

            obj.battleDisplayText = obj.name;
            obj.battleDisplayIcon = obj.iconIndex;

            for (let i = 0; i < notedata.length; i++) {
                let line = notedata[i];
                if (line.match(note1)) {
                    let text = String(RegExp.$1).toUpperCase();
                    let target;
                    if (["I", "ITEM"].includes(text)) {
                        target = $dataItems[parseInt(RegExp.$2)];
                    } else if (["S", "SKILL"].includes(text)) {
                        target = $dataSkills[parseInt(RegExp.$2)];
                    }
                    if (target) {
                        obj.setupActions = target.setupActions.slice();
                        obj.wholeActions = target.wholeActions.slice();
                        obj.targetActions = target.targetActions.slice();
                        obj.followActions = target.followActions.slice();
                        obj.finishActions = target.finishActions.slice();
                    }
                } else if (line.match(note2)) {
                    obj.speed = parseInt(RegExp.$1);
                } else if (line.match(note3)) {
                    obj.battleDisplayText = String(RegExp.$1);
                } else if (line.match(note4)) {
                    obj.battleDisplayIcon = parseInt(RegExp.$1);
                }
            }
        }
    }

    public static processBECNotetags3(group) {
        let note1 = /<(?:ATTACK ANIMATION|attack ani):[ ](\d+)>/i;
        for (let n = 1; n < group.length; n++) {
            let obj = group[n];
            let notedata = obj.note.split(/[\r\n]+/);

            obj.attackAnimationId = Yanfly.Param.EnemyAtkAni;

            for (let i = 0; i < notedata.length; i++) {
                let line = notedata[i];
                if (line.match(note1)) {
                    obj.attackAnimationId = parseInt(RegExp.$1);
                }
            }
        }
    }

    public static processBECNotetags4(group) {
        let note1 = /<(?:REFLECT ANIMATION|reflect ani):[ ](\d+)>/i;
        for (let n = 1; n < group.length; n++) {
            let obj = group[n];
            let notedata = obj.note.split(/[\r\n]+/);

            obj.reflectAnimationId = 0;
            obj.spriteCannotMove = false;

            for (let i = 0; i < notedata.length; i++) {
                let line = notedata[i];
                if (line.match(note1)) {
                    obj.reflectAnimationId = parseInt(RegExp.$1);
                } else if (line.match(/<(?:SPRITE CANNOT MOVE)>/i)) {
                    obj.spriteCannotMove = true;
                }
            }
        }
    }

    public static processBECNotetags5(group, isActor) {
        for (let n = 1; n < group.length; n++) {
            let obj = group[n];
            let notedata = obj.note.split(/[\r\n]+/);

            if (isActor) {
                obj.anchorX = Yanfly.Param.BECAnchorX;
                obj.anchorY = Yanfly.Param.BECAnchorY;
            }

            for (let i = 0; i < notedata.length; i++) {
                let line = notedata[i];
                if (line.match(/<(?:ANCHOR X):[ ](\d+)[.](\d+)>/i)) {
                    obj.anchorX = eval(
                        String(RegExp.$1) + "." + String(RegExp.$2)
                    );
                } else if (line.match(/<(?:ANCHOR Y):[ ](\d+)[.](\d+)>/i)) {
                    obj.anchorY = eval(
                        String(RegExp.$1) + "." + String(RegExp.$2)
                    );
                }
            }
        }
    }

    public static processBECNotetags6(group) {
        let note1a = /<(?:ACTION START):[ ](\d+)>/i;
        let note1b = /<(?:ACTION START):[ ](\d+)[ ](?:THROUGH|to)[ ](\d+)>/i;
        let note2a = /<(?:TURN START):[ ](\d+)>/i;
        let note2b = /<(?:TURN START):[ ](\d+)[ ](?:THROUGH|to)[ ](\d+)>/i;
        for (let n = 1; n < group.length; n++) {
            let obj = group[n];
            let notedata = obj.note.split(/[\r\n]+/);

            for (let i = 0; i < notedata.length; i++) {
                let line = notedata[i];
                if (line.match(note1a)) {
                    let turns = parseInt(RegExp.$1);
                    obj.autoRemovalTiming = 3;
                    obj.maxTurns = turns;
                    obj.minTurns = turns;
                } else if (line.match(note1b)) {
                    let turns1 = parseInt(RegExp.$1);
                    let turns2 = parseInt(RegExp.$2);
                    obj.autoRemovalTiming = 3;
                    obj.maxTurns = turns1;
                    obj.minTurns = turns2;
                } else if (line.match(note2a)) {
                    let turns = parseInt(RegExp.$1);
                    obj.autoRemovalTiming = 4;
                    obj.maxTurns = turns;
                    obj.minTurns = turns;
                } else if (line.match(note2b)) {
                    let turns1 = parseInt(RegExp.$1);
                    let turns2 = parseInt(RegExp.$2);
                    obj.autoRemovalTiming = 4;
                    obj.maxTurns = turns1;
                    obj.minTurns = turns2;
                }
            }
        }
    }

    public static loadMapData = function(mapId) {
        if (mapId > 0) {
            const filename = Utils.format(
                "Map%1.json",
                Utils.padZero(mapId, 3)
            );
            DataManager._mapLoader = ResourceHandler.createLoader(
                "data/" + filename,
                DataManager.loadDataFile.bind(this, "$dataMap", filename)
            );
            DataManager.loadDataFile("$dataMap", filename);
        } else {
            DataManager.makeEmptyMap();
        }
    };

    public static makeEmptyMap = function() {
        //@ts-ignore
        $dataMap = {
            data: [],
            events: [],
            width: 100,
            height: 100,
            scrollType: 3
        };
    };

    public static isMapLoaded = function() {
        DataManager.checkError();
        return !!$dataMap;
    };

    public static onLoad = function(object) {
        let array;
        if (object === $dataMap) {
            DataManager.extractMetadata(object);
            array = object.events;
        } else {
            array = object;
        }
        if (Array.isArray(array)) {
            for (let i = 0; i < array.length; i++) {
                const data = array[i];
                if (data && data.note !== undefined) {
                    DataManager.extractMetadata(data);
                }
            }
        }
        if (object === $dataSystem) {
            Decrypter.hasEncryptedImages = !!object.hasEncryptedImages;
            Decrypter.hasEncryptedAudio = !!object.hasEncryptedAudio;
            Scene_Boot.loadSystemImages();
        }
    };

    public static extractMetadata = function(data) {
        const re = /<([^<>:]+)(:?)([^>]*)>/g;
        data.meta = {};
        while (true) {
            const match = re.exec(data.note);
            if (match) {
                if (match[2] === ":") {
                    data.meta[match[1]] = match[3];
                } else {
                    data.meta[match[1]] = true;
                }
            } else {
                break;
            }
        }
    };

    public static checkError = function() {
        if (DataManager._errorUrl) {
            throw new Error("Failed to load: " + DataManager._errorUrl);
        }
    };

    public static isBattleTest = function() {
        return Utils.isOptionValid("btest");
    };

    public static isEventTest = function() {
        return Utils.isOptionValid("etest");
    };

    public static isSkill = function(item) {
        return item && $dataSkills.indexOf(item) > -1;
    };

    public static isItem = function(item) {
        return item && $dataItems.indexOf(item) > -1;
    };

    public static isWeapon = function(item) {
        return item && $dataWeapons.indexOf(item) > -1;
    };

    public static isArmor = function(item) {
        return item && $dataArmors.indexOf(item) > -1;
    };

    public static createGameObjects = function() {
        $gameTemp = new Game_Temp();
        $gameSystem = new Game_System();
        $gameScreen = new Game_Screen();
        $gameTimer = new Game_Timer();
        $gameMessage = new Game_Message();
        $gameSwitches = new Game_Switches();
        $gameVariables = new Game_Variables();
        $gameSelfSwitches = new Game_SelfSwitches();
        $gameActors = new Game_Actors();
        $gameParty = new Game_Party();
        $gameTroop = new Game_Troop();
        $gameMap = new Game_Map();
        $gamePlayer = new Game_Player();
    };

    public static setupNewGame = function() {
        DataManager.createGameObjects();
        DataManager.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.reserveTransfer(
            $dataSystem.startMapId,
            $dataSystem.startX,
            $dataSystem.startY
        );
    };

    public static setupBattleTest = function() {
        DataManager.createGameObjects();
        $gameParty.setupBattleTest();
        BattleManager.setup($dataSystem.testTroopId, true, false);
        BattleManager.setBattleTest(true);
        BattleManager.playBattleBgm();
    };

    public static setupEventTest = function() {
        DataManager.createGameObjects();
        DataManager.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.reserveTransfer(-1, 8, 6);
        $gamePlayer.setTransparent(false);
    };

    public static loadwindowInfo = function() {
        let json;
        try {
            json = StorageManager.load(0);
        } catch (e) {
            console.error(e);
            return [];
        }
        if (json) {
            const windowInfo = JSON.parse(json);
            for (let i = 1; i <= DataManager.maxSavefiles(); i++) {
                if (!StorageManager.exists(i)) {
                    delete windowInfo[i];
                }
            }
            return windowInfo;
        } else {
            return [];
        }
    };

    public static savewindowInfo = function(info) {
        StorageManager.save(0, JSON.stringify(info));
    };

    public static isThisGameFile = function(savefileId) {
        const windowInfo = DataManager.loadwindowInfo();
        if (windowInfo && windowInfo[savefileId]) {
            if (StorageManager.isLocalMode()) {
                return true;
            } else {
                const savefile = windowInfo[savefileId];
                return (
                    savefile.windowId === DataManager._windowId &&
                    savefile.title === $dataSystem.gameTitle
                );
            }
        } else {
            return false;
        }
    };

    public static isAnySavefileExists = function() {
        const windowInfo = DataManager.loadwindowInfo();
        if (windowInfo) {
            for (let i = 1; i < windowInfo.length; i++) {
                if (DataManager.isThisGameFile(i)) {
                    return true;
                }
            }
        }
        return false;
    };

    public static latestSavefileId = function() {
        const windowInfo = DataManager.loadwindowInfo();
        let savefileId = 1;
        let timestamp = 0;
        if (windowInfo) {
            for (let i = 1; i < windowInfo.length; i++) {
                if (
                    DataManager.isThisGameFile(i) &&
                    windowInfo[i].timestamp > timestamp
                ) {
                    timestamp = windowInfo[i].timestamp;
                    savefileId = i;
                }
            }
        }
        return savefileId;
    };

    public static loadAllSavefileImages = function() {
        const windowInfo = DataManager.loadwindowInfo();
        if (windowInfo) {
            for (let i = 1; i < windowInfo.length; i++) {
                if (DataManager.isThisGameFile(i)) {
                    const info = windowInfo[i];
                    DataManager.loadSavefileImages(info);
                }
            }
        }
    };

    public static loadSavefileImages = function(info) {
        if (info.characters) {
            for (let i = 0; i < info.characters.length; i++) {
                ImageManager.reserveCharacter(info.characters[i][0]);
            }
        }
        if (info.faces) {
            for (let j = 0; j < info.faces.length; j++) {
                ImageManager.reserveFace(info.faces[j][0]);
            }
        }
    };

    public static maxSavefiles = function() {
        return 20;
    };

    public static saveGame = function(savefileId) {
        try {
            StorageManager.backup(savefileId);
            return DataManager.saveGameWithoutRescue(savefileId);
        } catch (e) {
            console.error(e);
            try {
                StorageManager.remove(savefileId);
                StorageManager.restoreBackup(savefileId);
            } catch (e2) {}
            return false;
        }
    };

    public static loadGame = function(savefileId) {
        try {
            return DataManager.loadGameWithoutRescue(savefileId);
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    public static loadSavefileInfo = function(savefileId) {
        const windowInfo = DataManager.loadwindowInfo();
        return windowInfo && windowInfo[savefileId]
            ? windowInfo[savefileId]
            : null;
    };

    public static lastAccessedSavefileId = function() {
        return DataManager._lastAccessedId;
    };

    public static saveGameWithoutRescue = function(savefileId) {
        const json = JsonEx.stringify(DataManager.makeSaveContents());
        if (json.length >= 200000) {
            console.warn("Save data too big!");
        }
        StorageManager.save(savefileId, json);
        DataManager._lastAccessedId = savefileId;
        const windowInfo = DataManager.loadwindowInfo() || [];
        windowInfo[savefileId] = DataManager.makeSavefileInfo();
        DataManager.savewindowInfo(windowInfo);
        return true;
    };

    public static loadGameWithoutRescue = function(savefileId) {
        const windowInfo = DataManager.loadwindowInfo();
        if (DataManager.isThisGameFile(savefileId)) {
            const json = StorageManager.load(savefileId);
            DataManager.createGameObjects();
            DataManager.extractSaveContents(JsonEx.parse(json));
            DataManager._lastAccessedId = savefileId;
            return true;
        } else {
            return false;
        }
    };

    public static selectSavefileForNewGame = function() {
        const windowInfo = DataManager.loadwindowInfo();
        DataManager._lastAccessedId = 1;
        if (windowInfo) {
            const numSavefiles = Math.max(0, windowInfo.length - 1);
            if (numSavefiles < DataManager.maxSavefiles()) {
                DataManager._lastAccessedId = numSavefiles + 1;
            } else {
                let timestamp = Number.MAX_VALUE;
                for (let i = 1; i < windowInfo.length; i++) {
                    if (!windowInfo[i]) {
                        DataManager._lastAccessedId = i;
                        break;
                    }
                    if (windowInfo[i].timestamp < timestamp) {
                        timestamp = windowInfo[i].timestamp;
                        DataManager._lastAccessedId = i;
                    }
                }
            }
        }
    };

    public static makeSavefileInfo = function() {
        const info = {
            windowId: DataManager._windowId,
            title: $dataSystem.gameTitle,
            characters: $gameParty.charactersForSavefile(),
            faces: $gameParty.facesForSavefile(),
            playtime: "0", // $gameParty.playtimeText
            timestamp: Date.now()
        };

        return info;
    };

    public static makeSaveContents = function() {
        return {
            system: $gameSystem,
            screen: $gameScreen,
            timer: $gameTimer,
            switches: $gameSwitches,
            variables: $gameVariables,
            selfSwitches: $gameSelfSwitches,
            actors: $gameActors,
            party: $gameParty,
            map: $gameMap,
            player: $gamePlayer
        };
    };

    public static extractSaveContents = function(contents) {
        $gameSystem = new Game_System(contents.system);
        $gameScreen = new Game_Screen(contents.screen);
        $gameTimer = new Game_Timer(contents.timer);
        $gameSwitches = new Game_Switches(contents.switches);
        $gameVariables = new Game_Variables(contents.variables);
        $gameSelfSwitches = new Game_SelfSwitches(contents.selfSwitches);
        $gameActors = new Game_Actors(contents.actors);
        $gameParty = new Game_Party(contents.party);
        $gameMap = new Game_Map(contents.map);
        $gamePlayer = new Game_Player(contents.player);
    };

    public static setAutoSaveFileId = function(autoSaveFileId) {
        DataManager._autoSaveFileId = autoSaveFileId;
    };

    public static isAutoSaveFileId = function(saveFileId) {
        return (
            DataManager._autoSaveFileId !== 0 &&
            DataManager._autoSaveFileId === saveFileId
        );
    };

    public static autoSaveGame = function() {
        if (
            DataManager._autoSaveFileId !== 0 &&
            !DataManager.isEventTest() &&
            $gameSystem.isSaveEnabled()
        ) {
            $gameSystem.onBeforeSave();
            if (DataManager.saveGame(DataManager._autoSaveFileId)) {
                StorageManager.cleanBackup(DataManager._autoSaveFileId);
            }
        }
    };
}
