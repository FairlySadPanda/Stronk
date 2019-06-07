import Actor from "./interfaces/Actor";
import Armor from "./interfaces/Armor";
import Class from "./interfaces/Class";
import CommonEvent from "./interfaces/CommonEvent";
import Enemy from "./interfaces/Enemy";
import Item from "./interfaces/Item";
import Map from "./interfaces/Map";
import MapInfo from "./interfaces/MapInfo";
import Skill from "./interfaces/Skill";
import State from "./interfaces/State";
import System from "./interfaces/System";
import Tileset from "./interfaces/Tileset";
import Troop from "./interfaces/Troop";
import Weapon from "./interfaces/Weapon";

interface Window {
    $dataActors: Actor[];
    $dataClasses: Class[];
    $dataSkills: Skill[];
    $dataItems: Item[];
    $dataWeapons: Weapon[];
    $dataArmors: Armor[];
    $dataEnemies: Enemy[];
    $dataTroops: Troop[];
    $dataStates: State[];
    $dataAnimations: Animation[];
    $dataTilesets: Tileset[];
    $dataCommonEvents: CommonEvent[];
    $dataSystem: System[];
    $dataMapInfos: MapInfo[];
    $dataMap: Map[];
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
