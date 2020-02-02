import * as PIXI from "pixi.js";
import "source-map-support/register";
import { PluginManager } from "./managers/PluginManager";
import { SceneManager } from "./managers/SceneManager";

PluginManager.setup($plugins);

// =============================================================================
// main.js
// =============================================================================

window.PIXI = PIXI;
window.$dataActors = null;
window.$dataClasses = null;
window.$dataSkills = null;
window.$dataItems = null;
window.$dataWeapons = null;
window.$dataArmors = null;
window.$dataEnemies = null;
window.$dataTroops = null;
window.$dataStates = null;
window.$dataAnimations = null;
window.$dataTilesets = null;
window.$dataCommonEvents = null;
window.$dataSystem = null;
window.$dataMapInfos = null;
window.$dataMap = null;
window.$gameTemp = null;
window.$gameSystem = null;
window.$gameScreen = null;
window.$gameTimer = null;
window.$gameMessage = null;
window.$gameSwitches = null;
window.$gameVariables = null;
window.$gameSelfSwitches = null;
window.$gameActors = null;
window.$gameParty = null;
window.$gameTroop = null;
window.$gameMap = null;
window.$gamePlayer = null;
window.$testEvent = null;

window.onload = function() {
    SceneManager.run(require("./scenes/Scene_Boot").Scene_Boot);
};
