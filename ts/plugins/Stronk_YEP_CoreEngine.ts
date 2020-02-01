//= ============================================================================
// Stronk! Modified: Yanfly Engine Plugins - Core Engine
// YEP_CoreEngine.js
//= ============================================================================

/*:
 * @plugindesc v1.31 Needed for the majority of Yanfly Engine Scripts. Also
 * contains bug fixes found inherently in RPG Maker.
 * @author Yanfly Engine Plugins
 *
 * @param Open Console
 * @parent ---Screen---
 * @type boolean
 * @on Open
 * @off Don't Open
 * @desc For testing and debug purposes, this opens up the console.
 * Don't Open - false     Open - true
 * @default false
 *
 * @param Collection Clear
 * @parent ---Screen---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Clears stored objects within major scenes upon switching
 * scenes to free up memory. NO - false   YES - true
 * @default true
 *
 * @param ---Gold---
 * @desc
 *
 * @param Gold Max
 * @parent ---Gold---
 * @type number
 * @min 1
 * @desc The maximum amount of gold the player can have.
 * Default: 99999999
 * @default 99999999
 *
 * @param Gold Font Size
 * @parent ---Gold---
 * @type number
 * @min 1
 * @desc The font size used to display gold.
 * Default: 28
 * @default 20
 *
 * @param Gold Icon
 * @parent ---Gold---
 * @type number
 * @min 0
 * @desc This will be the icon used to represent gold in the gold
 * window. If left at 0, no icon will be displayed.
 * @default 313
 *
 * @param Gold Overlap
 * @parent ---Gold---
 * @desc This will be what's displayed when the gold number
 * exceeds the allocated area's content size.
 * @default A lotta
 *
 * @param ---Items---
 * @desc
 *
 * @param Default Max
 * @parent ---Items---
 * @type number
 * @min 1
 * @desc This is the maximum number of items a player can hold.
 * Default: 99
 * @default 99
 *
 * @param Quantity Text Size
 * @parent ---Items---
 * @type number
 * @min 1
 * @desc This is the text's font size used for the item quantity.
 * Default: 28
 * @default 20
 *
 * @param ---Parameters---
 * @default
 *
 * @param Max Level
 * @parent ---Parameters---
 * @type number
 * @min 1
 * @desc Adjusts the maximum level limit for actors.
 * Default: 99
 * @default 99
 *
 * @param Actor MaxHP
 * @parent ---Parameters---
 * @type number
 * @min 1
 * @desc Adjusts the maximum HP limit for actors.
 * Default: 9999
 * @default 9999
 *
 * @param Actor MaxMP
 * @parent ---Parameters---
 * @type number
 * @min 0
 * @desc Adjusts the maximum MP limit for actors.
 * Default: 9999
 * @default 9999
 *
 * @param Actor Parameter
 * @parent ---Parameters---
 * @type number
 * @min 1
 * @desc Adjusts the maximum parameter limit for actors.
 * Default: 999
 * @default 999
 *
 * @param Enemy MaxHP
 * @parent ---Parameters---
 * @type number
 * @min 1
 * @desc Adjusts the maximum HP limit for enemies.
 * Default: 999999
 * @default 999999
 *
 * @param Enemy MaxMP
 * @parent ---Parameters---
 * @type number
 * @min 0
 * @desc Adjusts the maximum MP limit for enemies.
 * Default: 9999
 * @default 9999
 *
 * @param Enemy Parameter
 * @parent ---Parameters---
 * @type number
 * @min 1
 * @desc Adjusts the maximum parameter limit for enemies.
 * Default: 999
 * @default 999
 *
 * @param ---Battle---
 * @desc
 *
 * @param Animation Rate
 * @parent ---Battle---
 * @type number
 * @min 1
 * @desc Adjusts the rate of battle animations. Lower for faster.
 * Default: 4
 * @default 4
 *
 * @param Flash Target
 * @parent ---Battle---
 * @type boolean
 * @on YES
 * @off NO
 * @desc If an enemy is targeted, it flashes or it can whiten.
 * OFF - false     ON - true
 * @default false
 *
 * @param Show Events Transition
 * @parent ---Battle---
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show events during the battle transition?
 * SHOW - true     HIDE - false     Default: false
 * @default true
 *
 * @param Show Events Snapshot
 * @parent ---Battle---
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show events for the battle background snapshot?
 * SHOW - true     HIDE - false     Default: false
 * @default true
 *
 * @param ---Map Optimization---
 * @desc
 *
 * @param Refresh Update HP
 * @parent ---Map Optimization---
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Do a full actor refresh when updating HP on map?
 * YES - true     NO - false     Default: true
 * @default true
 *
 * @param Refresh Update MP
 * @parent ---Map Optimization---
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Do a full actor refresh when updating MP on map?
 * YES - true     NO - false     Default: true
 * @default true
 *
 * @param Refresh Update TP
 * @parent ---Map Optimization---
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Do a full actor refresh when updating TP on map?
 * YES - true     NO - false     Default: true
 * @default false
 *
 * @param ---Font---
 * @desc
 *
 * @param Chinese Font
 * @parent ---Font---
 * @desc Default font(s) used for a Chinese RPG.
 * Default: SimHei, Heiti TC, sans-serif
 * @default SimHei, Heiti TC, sans-serif
 *
 * @param Korean Font
 * @parent ---Font---
 * @desc Default font(s) used for a Korean RPG.
 * Default: Dotum, AppleGothic, sans-serif
 * @default Dotum, AppleGothic, sans-serif
 *
 * @param Default Font
 * @parent ---Font---
 * @desc Default font(s) used for everything else.
 * Default: GameFont
 * @default GameFont, Verdana, Arial, Courier New
 *
 * @param Font Size
 * @parent ---Font---
 * @type number
 * @min 1
 * @desc Default font size used for windows.
 * Default: 28
 * @default 28
 *
 * @param Text Align
 * @parent ---Font---
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc How to align the text for command windows.
 * left     center     right
 * @default left
 *
 * @param ---Windows---
 * @default
 *
 * @param Digit Grouping
 * @parent ---Windows---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Groups together digits with a comma.
 * false - OFF     true - ON
 * @default true
 *
 * @param Line Height
 * @parent ---Windows---
 * @type number
 * @min 0
 * @desc Adjusts universal line height used in Windows.
 * Default: 36
 * @default 36
 *
 * @param Icon Width
 * @parent ---Windows---
 * @type number
 * @min 0
 * @desc Adjusts the width of your icons.
 * Default: 32
 * @default 32
 *
 * @param Icon Height
 * @parent ---Windows---
 * @type number
 * @min 0
 * @desc Adjusts the height of your icons.
 * Default: 32
 * @default 32
 *
 * @param Face Width
 * @parent ---Windows---
 * @type number
 * @min 0
 * @desc Adjusts the width of actors' faces.
 * Default: 144
 * @default 144
 *
 * @param Face Height
 * @parent ---Windows---
 * @type number
 * @min 0
 * @desc Adjusts the height of actors' faces.
 * Default: 144
 * @default 144
 *
 * @param Window Padding
 * @parent ---Windows---
 * @type number
 * @min 0
 * @desc Adjusts the padding for all standard windows.
 * Default: 18
 * @default 18
 *
 * @param Text Padding
 * @parent ---Windows---
 * @type number
 * @min 0
 * @desc Adjusts the padding for text inside of windows.
 * Default: 6
 * @default 6
 *
 * @param Window Opacity
 * @parent ---Windows---
 * @type number
 * @min 0
 * @desc Adjusts the background opacity for windows.
 * Default: 192
 * @default 192
 *
 * @param Gauge Outline
 * @parent ---Windows---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Enable outlines for gauges.
 * false - OFF     true - ON
 * @default true
 *
 * @param Gauge Height
 * @parent ---Windows---
 * @type number
 * @min 0
 * @desc Sets the height for gauges.
 * Default: 6
 * @default 18
 *
 * @param Menu TP Bar
 * @parent ---Windows---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Draws a TP bar in the menu status for actors.
 * false - OFF     true - ON
 * @default true
 *
 * @param ---Window Colors---
 * @default
 *
 * @param Color: Normal
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 0
 * @default 0
 *
 * @param Color: System
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 16
 * @default 16
 *
 * @param Color: Crisis
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 17
 * @default 17
 *
 * @param Color: Death
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 18
 * @default 18
 *
 * @param Color: Gauge Back
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 19
 * @default 19
 *
 * @param Color: HP Gauge 1
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 20
 * @default 20
 *
 * @param Color: HP Gauge 2
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 21
 * @default 21
 *
 * @param Color: MP Gauge 1
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 22
 * @default 22
 *
 * @param Color: MP Gauge 2
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 23
 * @default 23
 *
 * @param Color: MP Cost
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 23
 * @default 23
 *
 * @param Color: Power Up
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 24
 * @default 24
 *
 * @param Color: Power Down
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 25
 * @default 25
 *
 * @param Color: TP Gauge 1
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 28
 * @default 28
 *
 * @param Color: TP Gauge 2
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 29
 * @default 29
 *
 * @param Color: TP Cost Color
 * @parent ---Window Colors---
 * @type number
 * @min 0
 * @max 31
 * @desc Changes the text color for Windows.
 * Default: 29
 * @default 29
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 *
 * Yanfly Engine Plugins - Core Engine is made for RPG Maker MV. This plugin
 * functions primarily to fix bugs and to allow the user more control over RPG
 * Maker MV's various features, such as the screen resolution, font, window
 * colors, and more.
 *
 * Just place this on top of all the other Yanfly Engine Plugins.
 * Adjust any parameters as you see fit.
 * 
 * This plugin has been reduced to its paramemeter imports, with the code
 * changes incorporated into Stronk!.
 *
 * ============================================================================
 * Bug Fixes
 * ============================================================================
 *
 * This plugin fixes a few bugs found present within RPG Maker MV. Of them are
 * the following:
 *
 * Animation Overlay
 *   When a skill/item that targets multiple enemies at once using a fullscreen
 *   animation, it will overlay multiple times causing the image to look
 *   distorted by a series of overlayed effects. The plugin fixes this issue by
 *   having only one animation played over the group instead of every one.
 *
 * Audio Volume Stacking
 *   Sometimes when multiple sound effects are played in the same frame with
 *   the exact settings (usually due to animaitons), the volume stacks upon
 *   each other, causing them to not play the intended volume for the effect.
 *   This plugin fixes this issue by preventing sound effects of the same exact
     settings from playing during the same frame, allowing only the first to
     go through without stacking the volume higher.
 *
 * Event Movement Speed
 *   The movement speed of events are slightly slower than what they should be
 *   due a small error in the source code. The plugin fixes this issue and they
 *   move at the properly speed.
 *
 * Event Movement Queue
 *   If an event were to move through an event command, changing a condition
 *   that would set the event to change to a different page would cause that
 *   event's move route to halt in its tracks. The plugin fixes this issue and
 *   the event's move route will finish.
 *
 * Event Colliding
 *   Events cannot move over other events with a Below Player setting. This
 *   makes it difficult for certain types of puzzles or events to exist. This
 *   plugin fixes this issue by making the collision check only apply to events
 *   of "Same as Characters" priority. Any event that's above or below the
 *   characters will no longer collide with other events.
 *
 * Screen Tearing
 *   When moving slowly, the tiles on the screen tear. While it's not
 *   noticeable on all systems, slower computers will definitely show it. The
 *   plugin will fix this issue and synch the tiles to keep up to pace with
 *   the screen's camera movement properly.
 *
 * Sprite Distortion
 *   Because of JavaScript's strange mathematical behavior, sometimes values
 *   with decimal places cause spritesheets to end up looking distorted. The
 *   plugin will get rid of the decimal places and have sprite sheets take out
 *   frames properly by using integer values only.
 *
 * ============================================================================
 * Gold
 * ============================================================================
 *
 * You can use the plugin commands to add or remove gold more than the
 * editor's 9,999,999 limit. You can also place notetags into items, weapons,
 * and armors to over the 999,999 cost limit.
 *
 * Plugin Command:
 *   GainGold 1234567890       # Party gains 1234567890 gold.
 *   LoseGold 9876543210       # Party loses 9876543210 gold.
 *
 * Item, Weapon, Armor Notetags
 *   <Price: x>
 *   Changes the price of the item to x. This notetag allows you to bypass the
 *   editor's 999,999 gold cost limit.
 *
 * Enemy Notetag
 *   <Gold: x>
 *   Changes the gold drop value of enemies to x. This notetag allows you to
 *   bypass the editor's 9,999,999 gold drop limit.
 *
 * ============================================================================
 * Items
 * ============================================================================
 *
 * Change the parameters to reflect the maximum number of items a player can
 * hold per item. If you wish to make individual items have different max
 * values, use the following notetag:
 *
 * Item, Weapon, Armor Notetag:
 *   <Max Item: x>
 *   This changes the maximum amount of the item to x.
 *
 * ============================================================================
 * Stats
 * ============================================================================
 *
 * Even with the parameter limits raised, the editor is still confined to RPG
 * Maker MV's default limits. To break past them, use the following notetags
 * to allow further control over the individual aspects for the parameters.
 *
 * Actor Notetag
 *   <Initial Level: x>
 *   Changes the actor's initial level to x. This allows you to bypass the
 *   editor's level 99 limit.
 *
 *   <Max Level: x>
 *   Changes the actor's max level to x. This allows you to bypass the editor's
 *   level 99 limit.
 *
 * Class Skill Learn Notetag
 *   <Learn at Level: x>
 *   When placed inside a class's "Skills to Learn" notetag, this will cause
 *   the class to learn the skill at level x.
 *
 * Weapon and Armor Notetags
 *   <stat: +x>
 *   <stat: -x>
 *   Allows the piece of weapon or armor to gain or lose x amount of stat.
 *   Replace "stat" with "hp", "mp", "atk", "def", "mat", "mdf", "agi", or
 *   "luk" to alter that specific stat. This allows the piece of equipment
 *   to go past the editor's default limitation so long as the maximum value
 *   allows for it.
 *
 * Enemy Notetags
 *   <stat: x>
 *   This changes the enemy's stat to x amount. Replace "stat" with "hp",
 *   "mp", "atk", "def", "mat", "mdf", "agi", or "luk" to alter that
 *   specific stat. This allows the piece of equipment to go past the
 *   editor's default limitation.
 *
 *   <exp: x>
 *   This changes the enemy's exp given out to x amount. This allows the
 *   enemy give out more exp than the editor's default 9,999,999 limit.
 *
 * ============================================================================
 * Script Call Fail Safe
 * ============================================================================
 *
 * Irregular code in damage formulas, script calls, conditional branches, and
 * variable events will no longer crash the game. Instead, they will force open
 * the console window to display the error only during test play.
 *
 * If the player is not in test play, the game will continue as normal without
 * the error being shown. If the game is being played in a browser, opening up
 * the console window will still display the error.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version Stronk.1
 * - Incorporated the plugin into Stronk!. This plugin is a dependency for Stronk!
 * MV projects.
 *
 * Version 1.32:
 * - Reversed the disable for the screen jitter fix from version 1.24. Somehow
 * it came back and I don't know when, but now it needs to go. 
 *
 * Version 1.31:
 * - Added Fallen Angel Olivia's full error message display to the Core Engine
 * (with her permission of course).
 * - Bug fixed regarding blend modes and bush depth making sprites not blend
 * properly in-game.
 * - Tab key no longer requires you to press it twice before triggering Tab-key
 * related inputs.
 *
 * Version 1.30:
 * - Bug fixed for audio Sound Effect stacking.
 * - Optimization update.
 *
 * Version 1.29:
 * - Bypass the isDevToolsOpen() error when bad code is inserted into a script
 * call or custom Lunatic Mode code segment due to updating to MV 1.6.1.
 *
 * Version 1.28:
 * - Upon pressing F5 to reload your game, this will close the DevTools Debug
 * Console if it is opened before reloading. This is because reloading with it
 * closed ends up reloading the game faster.
 * - New plugin parameters added: Refresh Update HP, MP, and TP
 *   - Option to choose to do a full actor refresh upon changing HP, MP, or TP
 *   - This is to reduce overall map lagging.
 *
 * Version 1.27:
 * - Updated for RPG Maker MV version 1.6.0:
 *   - Fixing script call checks made with switches and self switches under
 *   conditional branches due to how ES6 handles === differently.
 *
 * Version 1.26:
 * - Updated for RPG Maker MV version 1.6.0:
 *   - Removal of the destructive code in Scene_Item.update function.
 *   - Open Console parameter now occurs after the map's been loaded or after
 *   the battle has started. This is because after the 1.6.0 changes, loading
 *   the console before anything else will lock up other aspects of RPG Maker
 *   from loading properly.
 *
 * Version 1.25:
 * - Updated for RPG Maker MV version 1.5.0.
 * - Updated Scale Title and Scale GameOver to work with 1.5.0.
 *
 * Version 1.24:
 * - Screen jittering prevention is now prevented for RPG Maker MV 1.3.4 and
 * above since Pixi4 handles that now.
 *
 * Version 1.23:
 * - For RPG Maker MV version 1.3.2 and above, the 'Scale Battlebacks' plugin
 * parameter will now recreate the battleback sprites in a different format.
 * This is because battleback scaling with Tiling Sprites is just too volatile.
 * Battleback sprites are now just regular sprites instead of tiling sprites.
 * This may or may not cause plugin incompatibilities with other plugins that
 * alter battlebacks.
 * - For RPG Maker MV version 1.3.4, Game_Actor.meetsUsableItemConditions is
 * now updated to return a check back to the original Game_BattlerBase version
 * to maintain compatibility with other plugins.
 *
 * Version 1.22:
 * - Added 'Show Events Transition' plugin parameter. Enabling this will make
 * events on the map no longer hide themselves while entering battle during the
 * transition.
 * - Added 'Show Events Snapshot' plugin parameter. Enabling this will keep
 * events shown as a part of the battle snapshot when entering battle.
 * - Irregular code in damage formulas, script calls, conditional branches, and
 * variable events will no longer crash the game. Instead, it will force open
 * the console window to display the error only during Test Play.
 *
 * Version 1.21:
 * - Fixed a bug with scaling battlebacks not working properly for Front View.
 * - Optimization update to keep garbage collection across all scenes.
 *
 * Version 1.20:
 * - Altered increasing resolution function.
 * - Added 'Update Real Scale' plugin parameter. This is best left alone for
 * now and to be used if a later update meshes with rendered scaling.
 * - Added memory clear functionality for versions under 1.3.2 to free up more
 * memory upon leaving the map scene.
 * - Added 'Collection Clear' plugin parameter. This option, if left on, will
 * clear the attached children to Scene_Map and Scene_Battle upon switching to
 * a different scene. This will potentially free up memory from various objects
 * added to those scenes from other plugins (depending on how they're added)
 * and serve as a means of reducing memory bloat.
 *
 * Version 1.19:
 * - Updated for RPG Maker MV version 1.3.2.
 * - Fixed 'LearnSkill' function for actors to not be bypassed if a piece of
 * equipment has temporarily added a skill.
 *
 * Version 1.18:
 * - Fixed a bug with scaling battlebacks not working properly for Front View.
 *
 * Version 1.17:
 * - Updated for RPG Maker MV version 1.3.0.
 *
 * Version 1.16:
 * - Fixed a bug with RPG Maker MV's inherent 'drawTextEx' function. By default
 * it calculates the text height and then resets the font settings before
 * drawing the text, which makes the text height inconsistent if it were to
 * match the calculated height settings.
 *
 * Version 1.15:
 * - Window's are now set to have only widths and heights of whole numbers. No
 * longer is it possible for them to have decimal values. This is to reduce any
 * and all clipping issues caused by non-whole numbers.
 *
 * Version 1.14:
 * - Optimization update for RPG Maker MV itself by replacing more memory
 * intensive loops in commonly used functions with more efficient loops.
 *
 * Version 1.13:
 * - Updated for RPG Maker MV version 1.1.0.
 *
 * Version 1.12:
 * - Fixed a bug with a notetag: <Learn at Level: x>. Now, the notetag works
 * with both <Learn at Level: x> and <Learn Level: x>
 *
 * Version 1.11:
 * - Made fixes to the MV Source Code where FaceWidth was using a hard-coded
 * 144 value regardless of what was changed for the Face Width parameter.
 * - Fixed a notetag that wasn't working with the enemy EXP values.
 * - Updated battler repositioning to no longer clash when entering-exiting the
 * scene with Row Formation.
 *
 * Version 1.10:
 * - Removed an MV bugfix that was applied through MV's newes tupdate.
 *
 * Version 1.09:
 * - Changed minimum display width for status drawing to accomodate Party
 * Formation defaults.
 *
 * Version 1.08:
 * - Fixed a bug within the MV Source with changing classes and maintaining
 * levels, even though the feature to maintain the levels has been removed.
 *
 * Version 1.07:
 * - Fixed an issue with the gauges drawing outlines thicker than normal at odd
 * intervals when windows are scaled irregularly.
 *
 * Version 1.06:
 * - Removed event frequency bug fix since it's now included in the source.
 *
 * Version 1.05:
 * - Added 'Scale Game Over' parameter to plugin settings.
 *
 * Version 1.04:
 * - Reworked math for calculating scaled battleback locations.
 * - Fixed a bug where if the party failed to escape from battle, states that
 * would be removed by battle still get removed. *Fixed by Emjenoeg*
 *
 * Version 1.03:
 * - Fixed a strange bug that made scaled battlebacks shift after one battle.
 *
 * Version 1.02:
 * - Fixed a bug that made screen fading on mobile devices work incorrectly.
 * - Added 'Scale Battlebacks' and 'Scale Title' parameters.
 *
 * Version 1.01:
 * - Fixed a bug that where if button sprites had different anchors, they would
 * not be properly clickable. *Fixed by Zalerinian*
 *
 * Version 1.00:
 * - Finished plugin!
 */

import * as gui from "nw";
import { Utils } from "../core/Utils";
import { PluginManager } from "../managers/PluginManager";

export interface YanflyCore {}

export interface YanflyParams {
    OpenConsole: string;
    ReposBattlers: string;
    GameFontTimer: number;
    CollectionClear: string;
    MaxGold: string;
    GoldFontSize: number;
    GoldOverlap: string;
    MaxItem: number;
    ItemQuantitySize: number;
    MaxLevel: number;
    EnemyMaxHp: number;
    EnemyMaxMp: number;
    EnemyParam: number;
    ActorMaxHp: number;
    ActorMaxMp: number;
    ActorParam: number;
    AnimationRate: number;
    FlashTarget: any;
    ShowEvTrans: string;
    ShowEvSnap: string;
    RefreshUpdateHp: string;
    RefreshUpdateMp: string;
    RefreshUpdateTp: string;
    ChineseFont: string;
    KoreanFont: string;
    DefaultFont: string;
    FontSize: number;
    TextAlign: CanvasTextAlign;
    DigitGroup: any;
    LineHeight: number;
    IconWidth: number;
    IconHeight: number;
    FaceWidth: number;
    FaceHeight: number;
    WindowPadding: number;
    TextPadding: number;
    WindowOpacity: number;
    GaugeOutline: any;
    GaugeHeight: number;
    MenuTpGauge: any;
    ColorNormal: number;
    ColorSystem: number;
    ColorCrisis: number;
    ColorDeath: number;
    ColorGaugeBack: number;
    ColorHpGauge1: number;
    ColorHpGauge2: number;
    ColorMpGauge1: number;
    ColorMpGauge2: number;
    ColorMpCost: number;
    ColorPowerUp: number;
    ColorPowerDown: number;
    ColorTpGauge1: number;
    ColorTpGauge2: number;
    ColorTpCost: number;
}

export interface YanflyIcons {
    Gold: number;
}

export interface YanflyUtils {
    toGroup(inVal: any): string;
    displayError(e: Error, code: string, message: string): void;
}

export interface YEP {
    _openedConsole: boolean;
    _loaded_YEP_CoreEngine: boolean;
    version: string;
    Core: Partial<YanflyCore>;
    Parameters: any;
    Param: Partial<YanflyParams>;
    Icon: Partial<YanflyIcons>;
    Util: Partial<YanflyUtils>;
    openConsole(): void;
    focusWindow(win: any): void;
}

const Yanfly: Partial<YEP> = {
    _loaded_YEP_CoreEngine: false,
    _openedConsole: false,
    version: "Stronk.1",
    Core: {} as Partial<YanflyCore>,
    Parameters: PluginManager.parameters("Stronk_YEP_CoreEngine"),
    Param: {} as Partial<YanflyParams>,
    Icon: {} as Partial<YanflyIcons>,
    Util: {
        toGroup(inVal) {
            if (typeof inVal === "string") return inVal;
            if (!Yanfly.Param.DigitGroup) return inVal;
            return inVal.toLocaleString("en");
            // return inVal.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
            //     return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
            // });
        },

        displayError(e, code, message) {
            console.log(message);
            console.log(code || "NON-EXISTENT");
            console.error(e);
            if (Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION >= "1.6.0")
                return;
            if (Utils.isNwjs() && Utils.isOptionValid("test")) {
                if (!gui.Window.get().isDevToolsOpen()) {
                    gui.Window.get().showDevTools();
                }
            }
        }
    } as Partial<YanflyUtils>,
    openConsole() {
        Yanfly._openedConsole = true;
        if (!Yanfly.Param.OpenConsole) return;
        if (Utils.isNwjs() && Utils.isOptionValid("test")) {
            const win = gui.Window.get();
            win.showDevTools();
            setTimeout(this.focusWindow.bind(this, win), 500);
        }
    },
    focusWindow(win) {
        win.focus();
    }
};

//= ======= =====================================================================
// Parameter Variables
//= ======= =====================================================================

Yanfly.Param.OpenConsole = String(Yanfly.Parameters["Open Console"]);
Yanfly.Param.OpenConsole = eval(Yanfly.Param.OpenConsole);
Yanfly.Param.ReposBattlers = String(Yanfly.Parameters["Reposition Battlers"]);
Yanfly.Param.ReposBattlers = eval(Yanfly.Param.ReposBattlers);
Yanfly.Param.GameFontTimer = Number(Yanfly.Parameters["GameFont Load Timer"]);
Yanfly.Param.CollectionClear = String(Yanfly.Parameters["Collection Clear"]);
Yanfly.Param.CollectionClear = eval(Yanfly.Param.CollectionClear);

Yanfly.Param.MaxGold = String(Yanfly.Parameters["Gold Max"]);
Yanfly.Param.GoldFontSize = Number(Yanfly.Parameters["Gold Font Size"]);
Yanfly.Icon.Gold = Number(Yanfly.Parameters["Gold Icon"]);
Yanfly.Param.GoldOverlap = String(Yanfly.Parameters["Gold Overlap"]);

Yanfly.Param.MaxItem = Number(Yanfly.Parameters["Default Max"]);
Yanfly.Param.ItemQuantitySize = Number(Yanfly.Parameters["Quantity Text Size"]);

Yanfly.Param.MaxLevel = Number(Yanfly.Parameters["Max Level"]);
Yanfly.Param.EnemyMaxHp = Number(Yanfly.Parameters["Enemy MaxHP"]);
Yanfly.Param.EnemyMaxMp = Number(Yanfly.Parameters["Enemy MaxMP"]);
Yanfly.Param.EnemyParam = Number(Yanfly.Parameters["Enemy Parameter"]);
Yanfly.Param.ActorMaxHp = Number(Yanfly.Parameters["Actor MaxHP"]);
Yanfly.Param.ActorMaxMp = Number(Yanfly.Parameters["Actor MaxMP"]);
Yanfly.Param.ActorParam = Number(Yanfly.Parameters["Actor Parameter"]);

Yanfly.Param.AnimationRate = Number(Yanfly.Parameters["Animation Rate"]);
Yanfly.Param.FlashTarget = eval(String(Yanfly.Parameters["Flash Target"]));
Yanfly.Param.ShowEvTrans = String(Yanfly.Parameters["Show Events Transition"]);
Yanfly.Param.ShowEvTrans = eval(Yanfly.Param.ShowEvTrans);
Yanfly.Param.ShowEvSnap = String(Yanfly.Parameters["Show Events Snapshot"]);
Yanfly.Param.ShowEvSnap = eval(Yanfly.Param.ShowEvSnap);

Yanfly.Param.RefreshUpdateHp = String(Yanfly.Parameters["Refresh Update HP"]);
Yanfly.Param.RefreshUpdateHp = eval(Yanfly.Param.RefreshUpdateHp);
Yanfly.Param.RefreshUpdateMp = String(Yanfly.Parameters["Refresh Update MP"]);
Yanfly.Param.RefreshUpdateMp = eval(Yanfly.Param.RefreshUpdateMp);
Yanfly.Param.RefreshUpdateTp = String(Yanfly.Parameters["Refresh Update TP"]);
Yanfly.Param.RefreshUpdateTp = eval(Yanfly.Param.RefreshUpdateTp);

Yanfly.Param.ChineseFont = String(Yanfly.Parameters["Chinese Font"]);
Yanfly.Param.KoreanFont = String(Yanfly.Parameters["Korean Font"]);
Yanfly.Param.DefaultFont = String(Yanfly.Parameters["Default Font"]);
Yanfly.Param.FontSize = Number(Yanfly.Parameters["Font Size"]);
Yanfly.Param.TextAlign = String(
    Yanfly.Parameters["Text Align"]
) as CanvasTextAlign;

Yanfly.Param.DigitGroup = eval(String(Yanfly.Parameters["Digit Grouping"]));
Yanfly.Param.LineHeight = Number(Yanfly.Parameters["Line Height"]);
Yanfly.Param.IconWidth = Number(Yanfly.Parameters["Icon Width"] || 32);
Yanfly.Param.IconHeight = Number(Yanfly.Parameters["Icon Height"] || 32);
Yanfly.Param.FaceWidth = Number(Yanfly.Parameters["Face Width"] || 144);
Yanfly.Param.FaceHeight = Number(Yanfly.Parameters["Face Height"] || 144);
Yanfly.Param.WindowPadding = Number(Yanfly.Parameters["Window Padding"]);
Yanfly.Param.TextPadding = Number(Yanfly.Parameters["Text Padding"]);
Yanfly.Param.WindowOpacity = Number(Yanfly.Parameters["Window Opacity"]);
Yanfly.Param.GaugeOutline = eval(String(Yanfly.Parameters["Gauge Outline"]));
Yanfly.Param.GaugeHeight = Number(Yanfly.Parameters["Gauge Height"]);
Yanfly.Param.MenuTpGauge = eval(String(Yanfly.Parameters["Menu TP Bar"]));

Yanfly.Param.ColorNormal = Number(Yanfly.Parameters["Color: Normal"]);
Yanfly.Param.ColorSystem = Number(Yanfly.Parameters["Color: System"]);
Yanfly.Param.ColorCrisis = Number(Yanfly.Parameters["Color: Crisis"]);
Yanfly.Param.ColorDeath = Number(Yanfly.Parameters["Color: Death"]);
Yanfly.Param.ColorGaugeBack = Number(Yanfly.Parameters["Color: Gauge Back"]);
Yanfly.Param.ColorHpGauge1 = Number(Yanfly.Parameters["Color: HP Gauge 1"]);
Yanfly.Param.ColorHpGauge2 = Number(Yanfly.Parameters["Color: HP Gauge 2"]);
Yanfly.Param.ColorMpGauge1 = Number(Yanfly.Parameters["Color: MP Gauge 1"]);
Yanfly.Param.ColorMpGauge2 = Number(Yanfly.Parameters["Color: MP Gauge 2"]);
Yanfly.Param.ColorMpCost = Number(Yanfly.Parameters["Color: MP Cost"]);
Yanfly.Param.ColorPowerUp = Number(Yanfly.Parameters["Color: Power Up"]);
Yanfly.Param.ColorPowerDown = Number(Yanfly.Parameters["Color: Power Down"]);
Yanfly.Param.ColorTpGauge1 = Number(Yanfly.Parameters["Color: TP Gauge 1"]);
Yanfly.Param.ColorTpGauge2 = Number(Yanfly.Parameters["Color: TP Gauge 2"]);
Yanfly.Param.ColorTpCost = Number(Yanfly.Parameters["Color: TP Cost Color"]);

export { Yanfly };
