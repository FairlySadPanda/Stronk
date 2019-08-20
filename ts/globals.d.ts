/**
 * Global variable declaration and global type modifications
 * Typescript does not allow for d.ts files that merge types to use ES6 imports!
 * Instead, use import("") syntax for type imports.
 */

declare let $plugins: any;
declare let $dataActors: any;
declare let $dataClasses: any;
declare let $dataSkills: any;
declare let $dataItems: any;
declare let $dataWeapons: any;
declare let $dataArmors: any;
declare let $dataEnemies: any;
declare let $dataTroops: any;
declare let $dataStates: any;
declare let $dataAnimations: any;
declare let $dataTilesets: any;
declare let $dataCommonEvents: any;
declare let $dataSystem: any;
declare let $dataMapInfos: any;
declare let $dataMap: any;
declare let $gameTemp: import("./objects/Game_Temp").default;
declare let $gameSystem: import("./objects/Game_System").default;
declare let $gameScreen: import("./objects/Game_Screen").default;
declare let $gameTimer: import("./objects/Game_Timer").default;
declare let $gameMessage: import("./objects/Game_Message").default;
declare let $gameSwitches: import("./objects/Game_Switches").default;
declare let $gameVariables: import("./objects/Game_Variables").default;
declare let $gameSelfSwitches: import("./objects/Game_SelfSwitches").default;
declare let $gameActors: import("./objects/Game_Actors").default;
declare let $gameParty: import("./objects/Game_Party").default;
declare let $gameTroop: import("./objects/Game_Troop").default;
declare let $gameMap: import("./objects/Game_Map").default;
declare let $gamePlayer: import("./objects/Game_Player").default;
declare let $testEvent: any;

interface Window {
    $dataActors: import("./interfaces/Actor").default[];
    $dataClasses: import("./interfaces/Class").default[];
    $dataSkills: import("./interfaces/Skill").default[];
    $dataItems: import("./interfaces/Item").default[];
    $dataWeapons: import("./interfaces/Weapon").default[];
    $dataArmors: import("./interfaces/Armor").default[];
    $dataEnemies: import("./interfaces/Enemy").default[];
    $dataTroops: import("./interfaces/Troop").default[];
    $dataStates: import("./interfaces/State").default[];
    $dataAnimations: import("./interfaces/Animation").default[];
    $dataTilesets: import("./interfaces/Tileset").default[];
    $dataCommonEvents: import("./interfaces/CommonEvent").default[];
    $dataSystem: import("./interfaces/System").default[];
    $dataMapInfos: import("./interfaces/MapInfo").default[];
    $dataMap: import("./interfaces/Map").default[];
    $gameTemp: import("./objects/Game_Temp").default;
    $gameSystem: import("./objects/Game_System").default;
    $gameScreen: import("./objects/Game_Screen").default;
    $gameTimer: import("./objects/Game_Timer").default;
    $gameMessage: import("./objects/Game_Message").default;
    $gameSwitches: import("./objects/Game_Switches").default;
    $gameVariables: import("./objects/Game_Variables").default;
    $gameSelfSwitches: import("./objects/Game_SelfSwitches").default;
    $gameActors: import("./objects/Game_Actors").default;
    $gameParty: import("./objects/Game_Party").default;
    $gameTroop: import("./objects/Game_Troop").default;
    $gameMap: import("./objects/Game_Map").default;
    $gamePlayer: import("./objects/Game_Player").default;
    $testEvent: any;
}
