import "pixi.js";

import "pixi-picture";
import "pixi-tilemap";

import { PluginManager } from "./managers/PluginManager";
import { SceneManager } from "./managers/SceneManager";
import { Scene_Boot } from "./scenes/Scene_Boot";

declare const $plugins;

// =============================================================================
// main.js
// =============================================================================

PIXI.glCore.VertexArrayObject.FORCE_NATIVE = true;
PIXI.settings.GC_MODE = PIXI.GC_MODES.AUTO;
PIXI.tilemap.TileRenderer.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.tilemap.TileRenderer.DO_CLEAR = true;

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

PluginManager.setup($plugins);

window.onload = function() {
    SceneManager.run(Scene_Boot);
};
