import CommonEvent from "./interfaces/CommonEvent";
import Class from "./interfaces/Class";
import Skill from "./interfaces/Skill";
import Item from "./interfaces/Actor";
import Weapon from "./interfaces/Weapon";
import Armor from "./interfaces/Armor";
import Enemy from "./interfaces/Enemy";
import Troop from "./interfaces/Troop";
import State from "./interfaces/State";
import Tileset from "./interfaces/Tileset";
import System from "./interfaces/System";
import MapInfo from "./interfaces/MapInfo";
import Actor from "./interfaces/Actor";
import Map from "./interfaces/Map";

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
