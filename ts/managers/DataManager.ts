import Decrypter from "../core/Decrypter";
import JsonEx from "../core/JsonEx";
import ResourceHandler from "../core/ResourceHandler";
import Utils from "../core/Utils";
import Game_Actors from "../objects/Game_Actors";
import Game_Map from "../objects/Game_Map";
import Game_Message from "../objects/Game_Message";
import Game_Party from "../objects/Game_Party";
import Game_Player from "../objects/Game_Player";
import Game_Screen from "../objects/Game_Screen";
import Game_SelfSwitches from "../objects/Game_SelfSwitches";
import Game_Switches from "../objects/Game_Switches";
import Game_System from "../objects/Game_System";
import Game_Temp from "../objects/Game_Temp";
import Game_Timer from "../objects/Game_Timer";
import Game_Troop from "../objects/Game_Troop";
import Game_Variables from "../objects/Game_Variables";
import Scene_Boot from "../scenes/Scene_Boot";
import BattleManager from "./BattleManager";
import ImageManager from "./ImageManager";
import StorageManager from "./StorageManager";

export default abstract class DataManager {
    public static _windowId: string;
    public static _lastAccessedId: number;
    public static _errorUrl: any;
    public static _databaseFiles: { name: string; src: string }[];

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

    public static isDatabaseLoaded = function() {
        DataManager.checkError();
        for (let i = 0; i < DataManager._databaseFiles.length; i++) {
            if (!window[DataManager._databaseFiles[i].name]) {
                return false;
            }
        }
        return true;
    };

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
        $dataMap = {};
        $dataMap.data = [];
        $dataMap.events = [];
        $dataMap.width = 100;
        $dataMap.height = 100;
        $dataMap.scrollType = 3;
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
DataManager._windowId = "RPGMV";
DataManager._lastAccessedId = 1;
DataManager._errorUrl = null;

DataManager._databaseFiles = [
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
