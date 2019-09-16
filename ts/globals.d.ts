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
declare let $gameTemp: import("./objects/Game_Temp").Game_Temp;
declare let $gameSystem: import("./objects/Game_System").Game_System;
declare let $gameScreen: import("./objects/Game_Screen").Game_Screen;
declare let $gameTimer: import("./objects/Game_Timer").Game_Timer;
declare let $gameMessage: import("./objects/Game_Message").Game_Message;
declare let $gameSwitches: import("./objects/Game_Switches").Game_Switches;
declare let $gameVariables: import("./objects/Game_Variables").Game_Variables;
declare let $gameSelfSwitches: import("./objects/Game_SelfSwitches").Game_SelfSwitches;
declare let $gameActors: import("./objects/Game_Actors").Game_Actors;
declare let $gameParty: import("./objects/Game_Party").Game_Party;
declare let $gameTroop: import("./objects/Game_Troop").Game_Troop;
declare let $gameMap: import("./objects/Game_Map").Game_Map;
declare let $gamePlayer: import("./objects/Game_Player").Game_Player;
declare let $testEvent: any;

interface Window {
    $dataActors: import("./interfaces/Actor").Actor[];
    $dataClasses: import("./interfaces/Class").Class[];
    $dataSkills: import("./interfaces/Skill").Skill[];
    $dataItems: import("./interfaces/Item").Item[];
    $dataWeapons: import("./interfaces/Weapon").Weapon[];
    $dataArmors: import("./interfaces/Armor").Armor[];
    $dataEnemies: import("./interfaces/Enemy").Enemy[];
    $dataTroops: import("./interfaces/Troop").Troop[];
    $dataStates: import("./interfaces/State").State[];
    $dataAnimations: import("./interfaces/Animation").Animation[];
    $dataTilesets: import("./interfaces/Tileset").Tileset[];
    $dataCommonEvents: import("./interfaces/CommonEvent").CommonEvent[];
    $dataSystem: import("./interfaces/System").System[];
    $dataMapInfos: import("./interfaces/MapInfo").MapInfo[];
    $dataMap: import("./interfaces/Map").Map[];
    $gameTemp: import("./objects/Game_Temp").Game_Temp;
    $gameSystem: import("./objects/Game_System").Game_System;
    $gameScreen: import("./objects/Game_Screen").Game_Screen;
    $gameTimer: import("./objects/Game_Timer").Game_Timer;
    $gameMessage: import("./objects/Game_Message").Game_Message;
    $gameSwitches: import("./objects/Game_Switches").Game_Switches;
    $gameVariables: import("./objects/Game_Variables").Game_Variables;
    $gameSelfSwitches: import("./objects/Game_SelfSwitches").Game_SelfSwitches;
    $gameActors: import("./objects/Game_Actors").Game_Actors;
    $gameParty: import("./objects/Game_Party").Game_Party;
    $gameTroop: import("./objects/Game_Troop").Game_Troop;
    $gameMap: import("./objects/Game_Map").Game_Map;
    $gamePlayer: import("./objects/Game_Player").Game_Player;
    $testEvent: any;
}
