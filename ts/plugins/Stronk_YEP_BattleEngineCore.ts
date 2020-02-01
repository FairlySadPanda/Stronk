import { PluginManager } from "../managers/PluginManager";
import { Yanfly } from "./Stronk_YEP_CoreEngine";

//=============================================================================
// Yanfly Engine Plugins - Battle Engine Core
// YEP_BattleEngineCore.js
//=============================================================================

declare module "./Stronk_YEP_CoreEngine" {
    interface YEP {
        BEC: {
            version: number;
            DefaultActionSetup: any[];
            DefaultActionWhole: any[];
            DefaultActionTarget: any[];
            DefaultActionFollow: any[];
            DefaultActionFinish: any[];
            SeqType: string;
        };
        _loaded_YEP_BattleEngineCore: boolean;
        DisableWebGLMask: boolean;
    }

    interface YanflyParams {
        BECSystem: string;
        BECEscRatio: string;
        BECEscFail: string;
        CastCertHit: number;
        CastPhysical: number;
        CastMagical: number;
        EnemyAtkAni: number;
        BECOptSpeed: any;
        BECEmergeText: string;
        BECPreEmpText: string;
        BECSurpText: any;
        BECPopupOverlap: any;
        BECNewPopBottom: any;
        BECStartActCmd: any;
        BECCurMax: string;
        BECSelectHelp: any;
        BECHelpUserTx: string;
        BECHelpAllyTx: string;
        BECHelpAlliesTx: string;
        BECHelpEnemyTx: string;
        BECHelpEnemiesTx: string;
        BECHelpAllTx: string;
        BECHelpRandTx: string;
        BECFrontPosX: string;
        BECFrontPosY: string;
        BECFrontSprite: any;
        BECFrSpPrio: string;
        BECHomePosX: string;
        BECHomePosY: string;
        BECSideSpPrio: string;
        BECAnchorX: number;
        BECAnchorY: number;
        BECStepDist: number;
        BECFlinchDist: number;
        BECShowShadows: any;
        BECPopupDur: number;
        BECCritPopup: string;
        BECCritDur: number;
        BECActionSpeed: any;
        BECReflectAni: number;
        BECMotionWait: any;
        BECTimeStates: any;
        BECTimeBuffs: any;
        BECTurnTime: number;
        BECAISelfTurn: any;
        BECLowerWindows: any;
        BECSelectMouseOver: any;
        BECEnemySelect: any;
        BECActorSelect: any;
        BECWindowRows: number;
        BECEnemyFontSize: number;
        BECShowEnemyName: any;
        BECShowSelectBox: any;
        BECEnemyAutoSel: any;
        BECCommandAlign: CanvasTextAlign;
        BECCommandRows: any;
        BECAniBaseDel: number;
        BECAniNextDel: number;
        BECFullActText: any;
        BECShowCntText: any;
        BECShowRflText: any;
        BECShowSubText: any;
        BECShowFailText: any;
        BECShowCritText: any;
        BECShowMissText: any;
        BECShowEvaText: any;
        BECShowHpText: any;
        BECShowMpText: any;
        BECShowTpText: any;
        BECShowStateText: any;
        BECShowBuffText: any;
    }

    interface YanflyUtils {
        getRange(n, m): any[];
        onlyUnique(value, index, self): boolean;
    }
}

Yanfly.BEC = {
    version: 1.5,
    DefaultActionSetup: [],
    DefaultActionWhole: [],
    DefaultActionTarget: [],
    DefaultActionFollow: [],
    DefaultActionFinish: [],
    SeqType: " "
};

Yanfly._loaded_YEP_BattleEngineCore = false;

Yanfly.Util.getRange = function(n, m) {
    let result = [];
    for (let i = n; i <= m; ++i) result.push(i);
    return result;
};

Yanfly.Util.onlyUnique = function(value, index, self) {
    return self.indexOf(value) === index;
};

/*:
 * @plugindesc v1.50 Have more control over the flow of the battle system
 * with this plugin and alter various aspects to your liking.
 * @author Yanfly Engine Plugins
 *
 * @param ---General---
 * @default
 *
 * @param Action Speed
 * @parent ---General---
 * @desc This is the formula used for an action's base speed.
 * Default: agi + Math.randomInt(Math.floor(5 + agi / 4))
 * @default agi
 *
 * @param Default System
 * @parent ---General---
 * @type select
 * @option Default Turn Battle
 * @value dtb
 * @option Active Turn Battle (plugin required)
 * @value atb
 * @option Charge Turn Battle (plugin required)
 * @value ctb
 * @option Standard Turn Battle (plugin required)
 * @value stb
 * @desc This is the default battle system your game uses.
 * Default: dtb
 * @default dtb
 *
 * @param ---Escape---
 * @default
 *
 * @param Escape Ratio
 * @parent ---Escape---
 * @desc This is the formula used to determine escape success.
 * Default: 0.5 * $gameParty.agility() / $gameTroop.agility()
 * @default 0.5 * $gameParty.agility() / $gameTroop.agility()
 *
 * @param Fail Escape Boost
 * @parent ---Escape---
 * @type number
 * @decimals 2
 * @desc Each time the player fails escape, increase the success
 * rate by this much. Default: 0.10
 * @default 0.10
 *
 * @param ---Animation---
 * @default
 *
 * @param Animation Base Delay
 * @parent ---Animation---
 * @type number
 * @min 0
 * @desc This sets the base delay in between animations.
 * Default: 8
 * @default 0
 *
 * @param Animation Next Delay
 * @parent ---Animation---
 * @type number
 * @min 0
 * @desc This sets the sequential delay in between animations.
 * Default: 12
 * @default 0
 *
 * @param Certain Hit Animation
 * @parent ---Animation---
 * @type number
 * @min 0
 * @desc Default animation to play for certain hit skills.
 * Use 0 if you wish for no animation.
 * @default 0
 *
 * @param Physical Animation
 * @parent ---Animation---
 * @type number
 * @min 0
 * @desc Default animation to play for physical skills.
 * Use 0 if you wish for no animation.
 * @default 52
 *
 * @param Magical Animation
 * @parent ---Animation---
 * @type number
 * @min 0
 * @desc Default animation to play for magical skills.
 * Use 0 if you wish for no animation.
 * @default 51
 *
 * @param Enemy Attack Animation
 * @parent ---Animation---
 * @type number
 * @min 0
 * @desc This is the default attack animation played by enemies.
 * Default: 0
 * @default 39
 *
 * @param Reflect Animation
 * @parent ---Animation---
 * @type number
 * @min 0
 * @desc The animation used when magic attacks are reflected.
 * @default 42
 *
 * @param Motion Waiting
 * @parent ---Animation---
 * @type boolean
 * @on After
 * @off During
 * @desc Play animations after performing an action or during?
 * During - false     After - true     Default: false
 * @default false
 *
 * @param ---Frontview---
 * @default
 *
 * @param Front Position X
 * @parent ---Frontview---
 * @desc This formula determines the actor's home X position.
 * Default: 0
 * @default Graphics.boxWidth / 8 + Graphics.boxWidth / 4 * index
 *
 * @param Front Position Y
 * @parent ---Frontview---
 * @desc This formula determines the actor's home Y position.
 * Default: 0
 * @default Graphics.boxHeight - 180
 *
 * @param Front Actor Sprite
 * @parent ---Frontview---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Show the actor battle sprite in frontview?
 * NO - false     YES - true     Default - false
 * @default false
 *
 * @param Front Sprite Priority
 * @parent ---Frontview---
 * @type select
 * @option Normal
 * @value 0
 * @option Actors on Top
 * @value 1
 * @option Enemies on Top
 * @value 2
 * @desc Give actor sprites the priority of always being on top?
 * 0 - Normal   1 - Actors on Top   2 - Enemies on Top
 * @default 1
 *
 * @param ---Sideview---
 * @default
 *
 * @param Home Position X
 * @parent ---Sideview---
 * @desc This formula determines the actor's home X position.
 * Default: 600 + index * 32
 * @default screenWidth - 16 - (maxSize + 2) * 32 + index * 32
 *
 * @param Home Position Y
 * @parent ---Sideview---
 * @desc This formula determines the actor's home Y position.
 * Default: 280 + index * 48
 * @default screenHeight - statusHeight - maxSize * 48 + (index+1) * 48 - 32
 *
 * @param Side Sprite Priority
 * @parent ---Sideview---
 * @type select
 * @option Normal
 * @value 0
 * @option Actors on Top
 * @value 1
 * @option Enemies on Top
 * @value 2
 * @desc Give actor sprites the priority of always being on top?
 * 0 - Normal   1 - Actors on Top   2 - Enemies on Top
 * @default 1
 *
 * @param ---Sprites---
 * @default
 *
 * @param Default X Anchor
 * @parent ---Sprites---
 * @type number
 * @decimals 2
 * @desc Default value used for your sprites's X Anchor.
 * Default: 0.50
 * @default 0.50
 *
 * @param Default Y Anchor
 * @parent ---Sprites---
 * @type number
 * @decimals 2
 * @desc Default value used for your sprites's Y Anchor.
 * Default: 1.00
 * @default 1.00
 *
 * @param Step Distance
 * @parent ---Sprites---
 * @type number
 * @desc This is the distance a unit steps forward for actions.
 * Default: 48
 * @default 48
 *
 * @param Flinch Distance
 * @parent ---Sprites---
 * @type number
 * @desc In sideview, when a unit takes damage or dodges, it will
 * flinch a certain distance in pixels.
 * @default 12
 *
 * @param Show Shadows
 * @parent ---Sprites---
 * @type boolean
 * @on Show Shadows
 * @off Hide Shadows
 * @desc Do you wish to have shadows appear under actors?
 * NO - false     YES - true
 * @default true
 *
 * @param ---Damage Popups---
 * @default
 *
 * @param Popup Duration
 * @parent ---Damage Popups---
 * @type number
 * @min 1
 * @desc Adjusts how many frames a popup will stay visible for.
 * Default: 90
 * @default 128
 *
 * @param Newest Popup Bottom
 * @parent ---Damage Popups---
 * @type boolean
 * @on Newest at bottom
 * @off Newest at top
 * @desc Places the newest popup at the bottom of a group.
 * NO - false     YES - true
 * @default true
 *
 * @param Popup Overlap Rate
 * @parent ---Damage Popups---
 * @type number
 * @decimals 1
 * @desc When multiple damage popups appear, they cover each other.
 * Use this to change the buffer rate amount for each sprite.
 * @default 0.9
 *
 * @param Critical Popup
 * @parent ---Damage Popups---
 * @desc Adjusts the popup's flashing color for critical hits.
 * Default: 255, 0, 0, 160
 * @default 255, 0, 0, 160
 *
 * @param Critical Duration
 * @parent ---Damage Popups---
 * @type number
 * @min 1
 * @desc How many frames the flashing will remain for a critical.
 * Default: 60
 * @default 60
 *
 * @param ---Tick-Settings---
 * @default
 *
 * @param Timed States
 * @parent ---Tick-Settings---
 * @type boolean
 * @on Time-Based States
 * @off Turn-Based States
 * @desc If the battle system is Tick-based, use time instead of
 * turns for states? NO - false   YES - true
 * @default false
 *
 * @param Timed Buffs
 * @parent ---Tick-Settings---
 * @type boolean
 * @on Time-Based Buffs
 * @off Turn-Based Buffs
 * @desc If the battle system is Tick-based, use time instead of
 * turns for buffs? NO - false   YES - true
 * @default false
 *
 * @param Turn Time
 * @parent ---Tick-Settings---
 * @type number
 * @min 1
 * @desc How many ticks must past to equal 1 turn?
 * @default 100
 *
 * @param AI Self Turns
 * @parent ---Tick-Settings---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Set AI to be based on their own individual turns?
 * NO - false     YES - true
 * @default true
 *
 * @param ---Window Settings---
 * @default
 *
 * @param Lower Windows
 * @parent ---Window Settings---
 * @type boolean
 * @on Bottom Layout
 * @off Default Layout
 * @desc Places the skill and item windows at the screen's bottom.
 * OFF - false     ON - true
 * @default true
 *
 * @param Window Rows
 * @parent ---Window Settings---
 * @number
 * @min 1
 * @desc For lower windows, how many rows of items do you wish for
 * the windows to display?
 * @default 4
 *
 * @param Command Window Rows
 * @parent ---Window Settings---
 * @type number
 * @min 1
 * @desc Sets the number of rows for each command window to display.
 * Default: 4
 * @default 4
 *
 * @param Command Alignment
 * @parent ---Window Settings---
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Sets the text alignment for the Party/Actor Commands.
 * Default: left
 * @default center
 *
 * @param Start Actor Command
 * @parent ---Window Settings---
 * @type boolean
 * @on Actor Command Window
 * @off Party Command Window
 * @desc Starts turn with the Actor Command Window instead of Party.
 * OFF - false     ON - true
 * @default true
 *
 * @param Current Max
 * @parent ---Window Settings---
 * @type boolean
 * @on Current / Max
 * @off Just Current
 * @desc Display the entire current / max value of HP/MP?
 * NO - false     YES - true     Default: true
 * @default false
 *
 * @param ---Selection Help---
 * @default
 *
 * @param Mouse Over
 * @parent ---Selection Help---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Allows you to mouse over the enemies to auto-select them.
 * OFF - false     ON - true
 * @default true
 *
 * @param Select Help Window
 * @parent ---Selection Help---
 * @type boolean
 * @on YES
 * @off NO
 * @desc When selecting actors and enemies, show the help window?
 * NO - false     YES - true
 * @default true
 *
 * @param User Help Text
 * @parent ---Selection Help---
 * @desc The singular form of 'User' used in a help window.
 * @default User
 *
 * @param Ally Help Text
 * @parent ---Selection Help---
 * @desc The singular form of 'Ally' used in a help window.
 * @default Ally
 *
 * @param Allies Help Text
 * @parent ---Selection Help---
 * @desc The plural form of 'Allies' used in a help window.
 * @default Allies
 *
 * @param Enemy Help Text
 * @parent ---Selection Help---
 * @desc The singular form of 'Enemy' used in a help window.
 * @default Enemy
 *
 * @param Enemies Help Text
 * @parent ---Selection Help---
 * @desc The plural form of 'Enemy' used in a help window.
 * @default Enemies
 *
 * @param All Help Text
 * @parent ---Selection Help---
 * @desc When selecting a entire group of targets.
 * %1 - Target Group (Allies or Enemies)
 * @default All %1
 *
 * @param Random Help Text
 * @parent ---Selection Help---
 * @desc When selecting a random selection of targets.
 * %1 - Target Group (Allies or Enemies)     %2 - Number
 * @default %2 Random %1
 *
 * @param ---Enemy Select---
 * @default
 *
 * @param Visual Enemy Select
 * @parent ---Enemy Select---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Replaces the enemy selection screen with a more visual one.
 * OFF - false     ON - true
 * @default true
 *
 * @param Show Enemy Name
 * @parent ---Enemy Select---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Show enemy names with Visual Enemy Select.
 * OFF - false     ON - true
 * @default true
 *
 * @param Show Select Box
 * @parent ---Enemy Select---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Show a selection box when selecting enemies.
 * OFF - false     ON - true
 * @default false
 *
 * @param Enemy Font Size
 * @parent ---Enemy Select---
 * @type number
 * @min 1
 * @desc Changes the font size used to display enemy names.
 * Default: 28
 * @default 20
 *
 * @param Enemy Auto Select
 * @parent ---Enemy Select---
 * @desc Changes what enemy is automatically selected at first.
 * LEFT - 0     RIGHT - this.furthestRight()
 * @default this.furthestRight()
 *
 * @param ---Actor Select---
 * @default
 *
 * @param Visual Actor Select
 * @parent ---Actor Select---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Allows you to click the actor on screen to select it.
 * OFF - false     ON - true
 * @default true
 *
 * @param ---Battle Log---
 * @default
 *
 * @param Show Emerge Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows the battle start text for enemies appearing.
 * OFF - false     ON - true
 * @default false
 *
 * @param Show Pre-Emptive Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows the text for getting a pre-emptive attack.
 * OFF - false     ON - true
 * @default true
 *
 * @param Show Surprise Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows the text for getting a surprise attack.
 * OFF - false     ON - true
 * @default true
 *
 * @param Optimize Speed
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Cuts log base line process to optimize the battle speed.
 * OFF - false     ON - true
 * @default true
 *
 * @param Show Action Text
 * @parent ---Battle Log---
 * @type boolean
 * @on Full
 * @off Simple
 * @desc Displays full action text or a simplified version of it.
 * SIMPLE - false     FULL - true
 * @default false
 *
 * @param Show State Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows all text regarding states.
 * OFF - false     ON - true
 * @default false
 *
 * @param Show Buff Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows all text regarding buffs.
 * OFF - false     ON - true
 * @default false
 *
 * @param Show Counter Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows text regarding counter attacks.
 * OFF - false     ON - true
 * @default true
 *
 * @param Show Reflect Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows text regarding reflected spells.
 * OFF - false     ON - true
 * @default true
 *
 * @param Show Substitute Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows text regarding substituted damage.
 * OFF - false     ON - true
 * @default true
 *
 * @param Show Fail Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows text regarding failed attacks.
 * OFF - false     ON - true
 * @default false
 *
 * @param Show Critical Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows text regarding critical hits.
 * OFF - false     ON - true
 * @default false
 *
 * @param Show Miss Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows text regarding missed attacks.
 * OFF - false     ON - true
 * @default false
 *
 * @param Show Evasion Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows text regarding evaded attacks.
 * OFF - false     ON - true
 * @default false
 *
 * @param Show HP Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows text regarding HP damage or heals.
 * OFF - false     ON - true
 * @default false
 *
 * @param Show MP Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows text regarding MP damage or heals.
 * OFF - false     ON - true
 * @default false
 *
 * @param Show TP Text
 * @parent ---Battle Log---
 * @type boolean
 * @on YES
 * @off NO
 * @desc Shows text regarding TP damage or heals.
 * OFF - false     ON - true
 * @default false
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin alters the various aspects of the default battle system,
 * allowing it to be more streamlined like most modern RPG's and less clunky
 * like older RPG's. This ranges from choosing what text will appear in the
 * battle log window at the top and how it will be displayed.
 *
 * ============================================================================
 * Battle Messages
 * ============================================================================
 *
 * When changing "Terms" and the "Messages" that appear in battle, inserting
 * the following tag anywhere in the message will cause the message to center
 * itself in the battle log.
 *
 *   <CENTER>
 *   This tag must be all caps in order for the battle log window to recognize
 *   it as an instruction to center the displayed battle text message.
 *
 * There are a couple of notetags you can use to change the way certain skills
 * and items will show up incase you don't want a name like 'Harold's Attack'
 * to appear in the name.
 *
 * Skill and Item Notetags:
 *
 *   <Display Text: x>
 *   This will change the text displayed to x.
 *
 *   <Display Icon: x>
 *   This will change the icon displayed to x.
 *
 * ============================================================================
 * Battle Windows
 * ============================================================================
 *
 * There's various options to adjust the window settings found in the battle
 * system to make navigating the battle system more intuitive. Such options
 * include starting the turns with the Actor Command Window instead of the
 * Party Command Window (the Fight/Escape Window). The Party Command Window is
 * still accessible but only by pressing cancel on the first actor's window.
 *
 * ============================================================================
 * Battle Order
 * ============================================================================
 *
 * The battle turn order is also fixed, too. This way, any battlers that Have
 * their AGI value changed over the course of battle will reflect those changes
 * during the current turn rather than the following turn. The action speed
 * calculation can also be adjusted and finetuned to have the random factor of
 * its speed calculation formula removed, too, making AGI actually worthwhile
 * as a tactical parameter.
 *
 * Skill and Item Notetag:
 *   <speed: +x>
 *   <speed: -x>
 *   This lets you break past the editor's limit of -2000 and 2000 allowing you
 *   to set the speed of your actions with more control.
 *
 * ============================================================================
 * Multiple Hits
 * ============================================================================
 *
 * Multi-hit action will no longer end prematurely if the target dies midway
 * through the action. This is done through toggling immortal states. To make
 * use of feature, make sure your database has an Immortal State somewhere. If
 * you do not wish to use this feature, set the Parameter for Immortal State ID
 * to 0 instead.
 *
 * ============================================================================
 * Popup Revamp
 * ============================================================================
 *
 * Although the damage popups may still look the same as the default ones from
 * MV, the process in which they're created is now different to streamline the
 * damage popup process. Before, popups would only appear one a time with a
 * frame's different at minimum in order for them to show. Now, any actions
 * that occur at the same frame will now all show popups at the same frame,
 * making for smoother and less clunky damage popups.
 *
 * ============================================================================
 * Common Events
 * ============================================================================
 *
 * Common Events will now occur at the end of each action regardless of whether
 * or not the enemy party is still alive. With proper placing of the action
 * sequence tags, you can make the skill's common event occur in the middle of
 * an action, too. However, keep in mind if you force an action in the middle
 * of another action, the remainder of the former action's sequence list will
 * become null and void in favor of the new forced action.
 *
 * ============================================================================
 * Casting Animations
 * ============================================================================
 *
 * Casting Animations help provide visual hints for players either by letting
 * them know which battler is going to perform an action or what type of skill
 * that action will be. This plugin enables skills to have casting animations
 * that can be modified universally or customized for each individual skill.
 *
 * Skill Notetag:
 *   <Cast Animation: x>
 *   Sets the skill's cast animation to animation ID x. Setting x to zero will
 *   cause the skill to not have any animaton at all.
 *
 * ============================================================================
 * Changing Battle Systems
 * ============================================================================
 *
 * While the player is not in battle, you can change the battle system using a
 * Plugin Command. With only this plugin, there is only one battle system
 * included: the default battle system.
 *
 * Plugin Command:
 *   setBattleSys DTB      Sets battle system to Default Turn Battle.
 *
 * Other future plugins may include other battle systems that may utilize the
 * Battle Engine Core.
 *
 * ============================================================================
 * Sideview Actions
 * ============================================================================
 *
 * In RPG Maker MV's default battle system, both the sideview and the frontview
 * settings do not display counterattacks, reflected magic attacks, nor any
 * case of substituting for battle members. The Battle Engine Core provides
 * games that are using the sideview settings small amounts of animations to
 * relay information to the player in a more visual sense.
 *
 * Magic Reflection will also display a reflection animation to indicate the
 * battler has reflection properties. This animation can be changed in the
 * parameters, but certain actors, classes, enemies, weapons, armors, and
 * states can display a unique kind of animation for reflection if desired.
 *
 * Actor, Class, Enemy, Weapon, Armor, and State Notetag:
 *   <Reflect Animation ID: x>
 *   Changes the user's reflect animation to x. This will take priority in the
 *   following order: Actor, Class, Enemy, Weapon, Armor, State, Default.
 *
 * Sometimes, you don't want your enemies to be able to move. Or you don't want
 * certain actors to be able to move. They're just stationary for whatever
 * reason. To accomplish that, you can use this notetag to forbid the battler
 * from moving.
 *
 * Actor, Class, Enemy, Weapon, Armor, and State Notetag:
 *   <Sprite Cannot Move>
 *   Prevents the battler's sprite from moving. This will take priority in the
 *   following order: Actor, Class, Enemy, Weapon, Armor, and State. If an
 *   enemy is unable to move when it performs an action, it will flash white as
 *   if it normally does in front view.
 *
 * ============================================================================
 * Custom Sideview Battler Anchor
 * ============================================================================
 *
 * Sideview battlers are generally centered horizontally, and grounded at their
 * feet. However, not all sideview battler spritesheets work this way. In the
 * event you have a sideview battler that doesn't conform to those standards,
 * you can 'anchor' them a different way.
 *
 * Actor, Class, Weapon, Armor, State Notetags:
 *   <Anchor X: y.z>
 *   <Anchor Y: y.z>
 *   This sets the anchor location for the actor's sideview battler at y.z.
 *   By default, the X anchor is 0.5 while the Y anchor is 1.0. If you want
 *   the X anchor to be a bit more to the left, make it less than 0.5. Make it
 *   more than 0.5 to make the X anchor more towards the right. To raise the
 *   Y anchor, set the number value to less than 1.0. Keep adjusting until you
 *   find that perfect anchor setting.
 *
 * If an anchor has multiple traits that yield different anchors, it will be
 * used in a priority list akin to this order:
 *
 *   States
 *   Weapons
 *   Armors
 *   Class
 *   Actor
 *   Default
 *
 * The higher it is on the priority list, the higher its priority.
 *
 * ============================================================================
 * Enemy Attack Animation
 * ============================================================================
 *
 * To give your enemies unique attack animations, you can use this notetag:
 *
 * Enemy Notetag:
 *   <Attack Animation: x>
 *   Replace x with the ID of the battle animation you wish to set as the
 *   enemy's default attack animation.
 *
 * ============================================================================
 * Automatic State Removal Conditions
 * ============================================================================
 *
 * By default, RPG Maker MV's battle system has automatic state removal under
 * three different conditions: none, action end, turn end.
 *
 * None and Turn End are working as intended. However, Action End, however, had
 * the states removed at the start of the battler's action rather than the end.
 * This is changed and updated to occur only at the end of a battler's action.
 *
 * Two more automatic conditions are now added: Action Start and Turn Start.
 * These can be added and implemented using the following notetags:
 *
 * State Notetags:
 *   <Action Start: x>
 *   <Action Start: x to y>
 *   This will cause this state to update its turns remaining at the start of
 *   an action. x is the number of turns it will last. If you use x to y, upon
 *   applying the state, the state will be removed a random number of turns
 *   from x to y.
 *
 *   <Turn Start: x>
 *   <Turn Start: x to y>
 *   This will cause the state to update its turns remaining at the start of a
 *   battle turn. x is the number of turns it will last. If you use x to y,
 *   upon applying the state, the state will be removed a random number of
 *   turns from x to y.
 *
 * States with Action End have a unique trait to them where if the caster of
 * the state is the current active battler (subject) and if the state is then
 * applied on the user itself, they will gain a 'free turn'. The 'free turn' is
 * to mitigate the user from losing 1 duration of the turn since with an Action
 * End timing, they would lose the benefit of being under the state for that
 * turn's timing.
 *
 * ============================================================================
 * Action Sequences
 * ============================================================================
 *
 * The Yanfly Engine Plugins - Battle Engine Core includes the capability of
 * using custom action sequences. Action sequences are basic instructions for
 * the game to creating a customized skill both visually and mechanically.
 * The Battle Engine Core, however, will only include the most basic of action
 * sequences so the instructions on how to create a custom action sequence will
 * be included in the Help file on future extension plugins for this plugin.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.50:
 * - Action sequences allow for unlimited arguments now.
 *
 * Version 1.49:
 * - Added failsafe for 'furthestRight()' errors.
 *
 * Version 1.48:
 * - Optimization update.
 *
 * Version 1.47:
 * - Bypass the isDevToolsOpen() error when bad code is inserted into a script
 * call or custom Lunatic Mode code segment due to updating to MV 1.6.1.
 *
 * Version 1.46:
 * - Updated for RPG Maker MV version 1.6.1.
 *
 * Version 1.45:
 * - Updated for RPG Maker MV version 1.5.0.
 *
 * Version 1.44:
 * - Fixed a bug where the enemy name windows disappear if you change scenes
 * mid-way through battle and return to it.
 *
 * Version 1.43b:
 * - Bug fixed to prevent crash if non-existent actions are used.
 * - Optimization update.
 *
 * Version 1.42:
 * - Optimization update.
 *
 * Version 1.41:
 * - Fixed a bug that allowed certain sprites to remain in the active pool
 * while party members were removed midway through battle.
 *
 * Version 1.40:
 * - Updated for RPG Maker MV version 1.3.2.
 *
 * Version 1.39c:
 * - Fixed a bug that caused dead actors to not be a part of action sequence
 * targeting for "Not Focus".
 * - Optimization update.
 * - Updated "queueForceAction" to utilize both numbers and actual targets.
 *
 * Version 1.38a:
 * - Optimization update.
 * - Compatibility update for Selection Control v1.08.
 * - Bug fixed for mirrored animations on enemies.
 *
 * Version 1.37:
 * - Fixed a bug where if the enemy's size is too small, the enemy's name
 * during selection will be cut off.
 *
 * Version 1.36d:
 * - Made an update for the battle background image snaps when there is no
 * battleback being used. This will prevent the player party and enemy troop
 * from appearing in the background snapshot when entering menus mid-battle.
 * - 'Death Break' action sequence now only triggers upon dead status and not
 * an 'or 0 HP' condition.
 * - Updated Forced Action sequencing for more efficiency.
 * - 'Action Times+' traits now work properly for DTB again.
 * - Optimized message displaying for battle log.
 * - Optimized z sorting algorithm for sprites.
 *
 * Verison 1.35d:
 * - Scopes that target a dead ally will automatically target the first dead
 * ally now. Scopes that target all dead allies will lock onto the first dead
 * ally. This will hopefully provide less confusion amongst playing.
 * - Added anti-crash measure for sprite bitmaps.
 * - Added anti-crash measure for faux actions.
 * - Added anti-crash measure to prevent non-existant animations from playing.
 * - Added a check that prevents hidden battlers from appearing when using
 * certain action sequences.
 *
 * Version 1.34a:
 * - Fixed a bug where 'NOT FOCUS' targets were not including dead members.
 * - Fixed a bug where using NOT FOCUS would cause dead targets to be visible.
 *
 * Version 1.33:
 * - Updated for RPG Maker MV version 1.1.0.
 *
 * Version 1.32d:
 * - Fixed a bug that caused a crash when an actor died.
 * - Added a motion engine to be used for future plugins.
 * - Preparation for a future plugin.
 * - <Anchor X: y.z> and <Anchor Y: y.z> notetags for actors are now extended
 * to actors, classes, weapons, armors, and states.
 * - Added <Display Text: x> and <Display Icon: x> notetags for skills and
 * items. These notetags will alter the display name shown and icon shown
 * respectively while performing a skill.
 * - Switched Magic Reflect checking order with Counterattack checking order.
 * This is to give priority to reflected actions over countered actions.
 *
 * Version 1.31b:
 * - States with Action End now have a unique trait to them where if the caster
 * of the state is the current active battler (subject) and if the state is
 * then applied on the user itself, they will gain a 'free turn'. The 'free
 * turn' is to mitigate the user from losing 1 duration of the turn since with
 * an Action End timing, they would lose the benefit of being under the state
 * for that turn's timing.
 * - Added failsafes for Free Turns in case other plugins have overwritten the
 * on battle start functions.
 * - Added a compatibility update to Animated SV Enemies for dead motion.
 *
 * Version 1.30:
 * - Optimization update.
 * - Fixed a bug that prevented added state effects be unable to apply if they
 * are an added Death state.
 * - Battlelog lines are now able to display text codes.
 *
 * Version 1.29:
 * - Fixed a bug with the 'else if' action sequences not working in the right
 * order of sequence conditions.
 *
 * Version 1.28d:
 * - Fixed a bug if instant casting a skill that would make an opponent battler
 * to force an action to end incorrectly. Thanks to DoubleX for the fix.
 * - Fixed a bug with mouse over not working properly.
 * - Fixed a bug regarding forced actions that will cause the battle to freeze
 * if the forced action causes the main active subject to leave the battle.
 * - Fixed a bug with timed states not updating their turns properly.
 * - Changed priority of IF action sequences to higher to no longer interfere
 * other action sequences.
 *
 * Version 1.27:
 * - Mechanic change. This will only affect those using turn-based state timing
 * mechanics. Turn End state updates are now shifted from Turn End to occur at
 * Regeneration timing to have a more synchronized aspect. The timings are very
 * close so there's next to no notice in difference. Buff turn updates are also
 * moved to the regeneration timing, too.
 *
 * Version 1.26:
 * - Added 'Mouse Over' parameter to Selection Help. This parameter enables
 * mouse users to simply hover over the enemy to select them rather than having
 * to click an enemy twice to select them.
 *
 * Version 1.25f:
 * - Added failsafes for Forced Action queues.
 * - Added 'Show Select Box' parameter when selecting enemies.
 * - Fixed a bug that caused End Turn events to not function properly.
 * - Battle animations, by default, are positioned relative to the base bitmap
 * for its target sprite. However, actor sprites do not have a base bitmap and
 * therefore, battle animations, regardless of position, will always target the
 * actor sprite's feet. This update now gives actor sprites a base bitmap.
 * - Readjusted sprite width and sprite height calculations.
 * - Added a failsafe for when no sideview actor graphics are used.
 *
 * Version 1.24:
 * - Implemented a Forced Action queue list. This means if a Forced Action
 * takes place in the middle of an action, the action will resume after the
 * forced action finishes rather than cancels it out like MV does.
 *
 * Version 1.23:
 * - Fixed a bug that didn't regenerate HP/MP/TP properly for tick-based.
 *
 * Version 1.22:
 * - Fixed a bug within MV that caused Forced Actions at Turn End to prompt and
 * trigger all turn-end related activities (such as regeneration and state turn
 * updating).
 * - Made a mechanic change so that Action Start and Action End state turns do
 * not update their turns through forced actions.
 *
 * Version 1.21:
 * - Fixed a bug where states Action End weren't going down properly with DTB.
 *
 * Version 1.20:
 * - Fixed a bug where revived actors using instant cast aren't properly set to
 * use actions immediately.
 *
 * Version 1.19:
 * - Added <Attack Animation: x> notetag for enemies.
 * - Added 'AI Self Turns' for Tick-Based Battles. Enemies can now have their
 * A.I. revolve around their own individual turns rather than the battle's.
 * - Mechanic change for states. Following suit with the change to Action End
 * removal, there are now two more conditions added: Action Start, Turn Start.
 * - Added <Action Start: x>, <Action Start: x to y>, <Turn Start: x>, and
 * <Turn Start: x to y> notetags for automatic state removal.
 *
 * Version 1.18:
 * - Fixed a bug with irregular targeting scopes.
 * - Fixed an MV-related bug with Recover All event not refreshing battlers.
 *
 * Version 1.17b:
 * - Fixed a bug with action end states to remove multiple at once.
 * - Fixed a visual error with flinching sprites.
 * - Added 'Current Max' parameter to change HP current/max display in battle.
 * - Mechanic change for states that update on Action End to end at the end of
 * a battler's turn instead of at the start.
 * - Began preparations for another battle system.
 *
 * Version 1.16:
 * - Fixed an issue with mirrored enemies having mirrored state icons.
 *
 * Version 1.15a:
 * - Fixed a bug revolving the status window not updating.
 * - Updated default home position formula to better fit other party sizes.
 * New Home Position X:
 *   screenWidth - 16 - (maxSize + 2) * 32 + index * 32
 * New Home Position Y:
 *   screenHeight - statusHeight - maxSize * 48 + (index+1) * 48 - 16
 *
 * Version 1.14:
 * - Fixed a bug with Forced Actions locking out the battle.
 * - New mechanic: For tick-based battle systems, states with action-end will
 * go down in turns based on how many actions took place for the actor instead.
 * Previously, they were indistinguishable from states with Turn End removal.
 * - New mechanic: Using Instant Skills/Items from YEP_InstantCast.js will also
 * cause states with action-end to go down in turns upon using actions.
 *
 * Version 1.13a:
 * - Fixed a bug that made battlebacks disappear.
 * - Reworked visual enemy selection.
 * - Victory phase doesn't immediately display level up changes in battle
 * status window.
 * - Fixed a bug with the visual enemy select showing dead enemy names.
 *
 * Version 1.12b:
 * - If the Battle HUD has been hidden for whatever reason during the victory
 * sequence, it will be returned.
 * - Added <speed: +x> and <speed: -x> notetags to break past editor limits.
 * - Added new conditions where the battle won't end until all action sequences
 * have been fulfilled.
 *
 * Version 1.11:
 * - Fixed a bug that didn't show HP/MP Regeneration.
 *
 * Version 1.10:
 * - Removed immortal state dependancy. Immortality is now its own setting.
 * - Added more abbreviated variables for action speed calculation.
 * - Fixed a bug where all-scope attacks would reveal Appear-Halfway enemies.
 * - Fixed a bug where the battle wouldn't end if the final enemy was killed
 * by state damage.
 *
 * Version 1.09:
 * - Fixed a undefined actor bug for refreshing the status window.
 * - Added 'Show Shadows' parameter to the plugin settings.
 * - Reworked the default action sequences so that forced actions do not appear
 * on top of each other and party-heal animations occur simultaneously.
 *
 * Version 1.08:
 * - Fixed a bug where battlers gaining HP/MP in the damage formula for
 * themselves wouldn't trigger popups.
 * - Fixed a bug where if the party failed to escape from battle, states that
 * would be removed by battle still get removed. *Fixed by Emjenoeg*
 * - Fixed a bug where instant death skills didn't work.
 * - Changed Sprite Priority settings to decide whether actors, enemies, or
 * neither would always be on top.
 *
 * Version 1.07:
 * - Optimized status window to refresh at a minimum.
 * - Set up frame work for future plugins:
 * - Added 'Escape Ratio' and 'Fail Escape Boost' to parameters to allow users
 * to set the escape ratio they want.
 * - Added 'Front Sprite Priority' and 'Side Sprite Priority' to parameters to
 * dictate if actor sprites are always on top.
 * - Added 'Tick-Settings' category for tick-based battle systems.
 *
 * Version 1.06:
 * - Fixed a bug that causes dead actors at the start of battle to not spawn.
 * - Fixed a bug where the help window on an empty slot would show the
 * previous skill's message.
 *
 * Version 1.05:
 * - Added new target typing: Character X, which allows you to select
 * specifically the actor with an actor ID of X if he/she/it is in the party.
 * - Fixed a bug that prevented Miss and Evade popups from showing.
 *
 * Version 1.04:
 * - Fixed a bug where popups didn't show under certain animation types.
 * - Fixed certain battler motions from not refreshing correctly.
 * - Actions with no scope will not trigger the confirmation selection window.
 *
 * Version 1.03:
 * - Added 'Wait for Effect' action sequence.
 * - Actions now wait for effects (such as collapsing) to be done before
 * continuing on with battle or to end battle.
 *
 * Version 1.02:
 * - Fixed a bug where the help window would retain descriptions on no skills.
 * - Synched up weapons with actor sprites so they would occur simultaneously.
 * - Fixed an issue where requesting certain motions from enemies that don't
 * exist would cause them to crash.
 *
 * Version 1.01:
 * - Skills and items that affect both HP and MP will now show popups for both.
 *
 * Version 1.00:
 * - Finished plugin!
 */

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters("Stronk_YEP_BattleEngineCore");
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.BECSystem = String(Yanfly.Parameters["Default System"]);
Yanfly.Param.BECEscRatio = String(Yanfly.Parameters["Escape Ratio"]);
Yanfly.Param.BECEscFail = String(Yanfly.Parameters["Fail Escape Boost"]);
Yanfly.Param.CastCertHit = Number(Yanfly.Parameters["Certain Hit Animation"]);
Yanfly.Param.CastPhysical = Number(Yanfly.Parameters["Physical Animation"]);
Yanfly.Param.CastMagical = Number(Yanfly.Parameters["Magical Animation"]);
Yanfly.Param.EnemyAtkAni = Number(Yanfly.Parameters["Enemy Attack Animation"]);
Yanfly.Param.BECOptSpeed = String(Yanfly.Parameters["Optimize Speed"]);
Yanfly.Param.BECOptSpeed = eval(Yanfly.Param.BECOptSpeed);
Yanfly.Param.BECEmergeText = String(Yanfly.Parameters["Show Emerge Text"]);
Yanfly.Param.BECEmergeText = eval(Yanfly.Param.BECEmergeText);
Yanfly.Param.BECPreEmpText = String(Yanfly.Parameters["Show Pre-Emptive Text"]);
Yanfly.Param.BECPreEmpText = eval(Yanfly.Param.BECPreEmpText);
Yanfly.Param.BECSurpText = String(Yanfly.Parameters["Show Surprise Text"]);
Yanfly.Param.BECSurpText = eval(Yanfly.Param.BECSurpText);
Yanfly.Param.BECPopupOverlap = String(Yanfly.Parameters["Popup Overlap Rate"]);
Yanfly.Param.BECPopupOverlap = eval(Yanfly.Param.BECPopupOverlap);
Yanfly.Param.BECNewPopBottom = String(Yanfly.Parameters["Newest Popup Bottom"]);
Yanfly.Param.BECNewPopBottom = eval(Yanfly.Param.BECNewPopBottom);
Yanfly.Param.BECStartActCmd = String(Yanfly.Parameters["Start Actor Command"]);
Yanfly.Param.BECStartActCmd = eval(Yanfly.Param.BECStartActCmd);
Yanfly.Param.BECCurMax = eval(String(Yanfly.Parameters["Current Max"]));
Yanfly.Param.BECSelectHelp = String(Yanfly.Parameters["Select Help Window"]);
Yanfly.Param.BECSelectHelp = eval(Yanfly.Param.BECSelectHelp);
Yanfly.Param.BECHelpUserTx = String(Yanfly.Parameters["User Help Text"]);
Yanfly.Param.BECHelpAllyTx = String(Yanfly.Parameters["Ally Help Text"]);
Yanfly.Param.BECHelpAlliesTx = String(Yanfly.Parameters["Allies Help Text"]);
Yanfly.Param.BECHelpEnemyTx = String(Yanfly.Parameters["Enemy Help Text"]);
Yanfly.Param.BECHelpEnemiesTx = String(Yanfly.Parameters["Enemies Help Text"]);
Yanfly.Param.BECHelpAllTx = String(Yanfly.Parameters["All Help Text"]);
Yanfly.Param.BECHelpRandTx = String(Yanfly.Parameters["Random Help Text"]);
Yanfly.Param.BECFrontPosX = String(Yanfly.Parameters["Front Position X"]);
Yanfly.Param.BECFrontPosY = String(Yanfly.Parameters["Front Position Y"]);
Yanfly.Param.BECFrontSprite = String(Yanfly.Parameters["Front Actor Sprite"]);
Yanfly.Param.BECFrontSprite = eval(Yanfly.Param.BECFrontSprite);
Yanfly.Param.BECFrSpPrio = String(Yanfly.Parameters["Front Sprite Priority"]);
Yanfly.Param.BECHomePosX = String(Yanfly.Parameters["Home Position X"]);
Yanfly.Param.BECHomePosY = String(Yanfly.Parameters["Home Position Y"]);
Yanfly.Param.BECSideSpPrio = String(Yanfly.Parameters["Side Sprite Priority"]);
Yanfly.Param.BECSideSpPrio = eval(Yanfly.Param.BECSideSpPrio);
Yanfly.Param.BECAnchorX = Number(Yanfly.Parameters["Default X Anchor"]);
Yanfly.Param.BECAnchorY = Number(Yanfly.Parameters["Default Y Anchor"]);
Yanfly.Param.BECStepDist = Number(Yanfly.Parameters["Step Distance"]);
Yanfly.Param.BECFlinchDist = Number(Yanfly.Parameters["Flinch Distance"]);
Yanfly.Param.BECShowShadows = String(Yanfly.Parameters["Show Shadows"]);
Yanfly.Param.BECShowShadows = eval(Yanfly.Param.BECShowShadows);
Yanfly.Param.BECPopupDur = Number(Yanfly.Parameters["Popup Duration"]);
Yanfly.Param.BECCritPopup = String(Yanfly.Parameters["Critical Popup"]);
Yanfly.Param.BECCritDur = Number(Yanfly.Parameters["Critical Duration"]);
Yanfly.Param.BECActionSpeed = String(Yanfly.Parameters["Action Speed"]);
Yanfly.Param.BECReflectAni = Number(Yanfly.Parameters["Reflect Animation"]);
Yanfly.Param.BECMotionWait = String(Yanfly.Parameters["Motion Waiting"]);
Yanfly.Param.BECMotionWait = eval(Yanfly.Param.BECMotionWait);
Yanfly.Param.BECTimeStates = String(Yanfly.Parameters["Timed States"]);
Yanfly.Param.BECTimeStates = eval(Yanfly.Param.BECTimeStates);
Yanfly.Param.BECTimeBuffs = String(Yanfly.Parameters["Timed Buffs"]);
Yanfly.Param.BECTimeBuffs = eval(Yanfly.Param.BECTimeBuffs);
Yanfly.Param.BECTurnTime = Number(Yanfly.Parameters["Turn Time"]);
Yanfly.Param.BECAISelfTurn = eval(String(Yanfly.Parameters["AI Self Turns"]));
Yanfly.Param.BECLowerWindows = String(Yanfly.Parameters["Lower Windows"]);
Yanfly.Param.BECLowerWindows = eval(Yanfly.Param.BECLowerWindows);
Yanfly.Param.BECSelectMouseOver = eval(String(Yanfly.Parameters["Mouse Over"]));
Yanfly.Param.BECEnemySelect = String(Yanfly.Parameters["Visual Enemy Select"]);
Yanfly.Param.BECEnemySelect = eval(Yanfly.Param.BECEnemySelect);
Yanfly.Param.BECActorSelect = String(Yanfly.Parameters["Visual Actor Select"]);
Yanfly.Param.BECActorSelect = eval(Yanfly.Param.BECActorSelect);
Yanfly.Param.BECWindowRows = Number(Yanfly.Parameters["Window Rows"]);
Yanfly.Param.BECEnemyFontSize = Number(Yanfly.Parameters["Enemy Font Size"]);
Yanfly.Param.BECShowEnemyName = String(Yanfly.Parameters["Show Enemy Name"]);
Yanfly.Param.BECShowEnemyName = eval(Yanfly.Param.BECShowEnemyName);
Yanfly.Param.BECShowSelectBox = String(Yanfly.Parameters["Show Select Box"]);
Yanfly.Param.BECShowSelectBox = eval(Yanfly.Param.BECShowSelectBox);
Yanfly.Param.BECEnemyAutoSel = String(Yanfly.Parameters["Enemy Auto Select"]);
Yanfly.Param.BECEnemyAutoSel = Yanfly.Param.BECEnemyAutoSel;
Yanfly.Param.BECCommandAlign = String(
    Yanfly.Parameters["Command Alignment"]
) as CanvasTextAlign;
Yanfly.Param.BECCommandRows = Number(Yanfly.Parameters["Command Window Rows"]);
Yanfly.Param.BECAniBaseDel = Number(Yanfly.Parameters["Animation Base Delay"]);
Yanfly.Param.BECAniNextDel = Number(Yanfly.Parameters["Animation Next Delay"]);

Yanfly.Param.BECFullActText = String(Yanfly.Parameters["Show Action Text"]);
Yanfly.Param.BECFullActText = eval(Yanfly.Param.BECFullActText);
Yanfly.Param.BECShowCntText = String(Yanfly.Parameters["Show Counter Text"]);
Yanfly.Param.BECShowCntText = eval(Yanfly.Param.BECShowCntText);
Yanfly.Param.BECShowRflText = String(Yanfly.Parameters["Show Reflect Text"]);
Yanfly.Param.BECShowRflText = eval(Yanfly.Param.BECShowRflText);
Yanfly.Param.BECShowSubText = String(Yanfly.Parameters["Show Substitute Text"]);
Yanfly.Param.BECShowSubText = eval(Yanfly.Param.BECShowSubText);
Yanfly.Param.BECShowFailText = String(Yanfly.Parameters["Show Fail Text"]);
Yanfly.Param.BECShowFailText = eval(Yanfly.Param.BECShowFailText);
Yanfly.Param.BECShowCritText = String(Yanfly.Parameters["Show Critical Text"]);
Yanfly.Param.BECShowCritText = eval(Yanfly.Param.BECShowCritText);
Yanfly.Param.BECShowMissText = String(Yanfly.Parameters["Show Miss Text"]);
Yanfly.Param.BECShowMissText = eval(Yanfly.Param.BECShowMissText);
Yanfly.Param.BECShowEvaText = String(Yanfly.Parameters["Show Evasion Text"]);
Yanfly.Param.BECShowEvaText = eval(Yanfly.Param.BECShowEvaText);
Yanfly.Param.BECShowHpText = String(Yanfly.Parameters["Show HP Text"]);
Yanfly.Param.BECShowHpText = eval(Yanfly.Param.BECShowHpText);
Yanfly.Param.BECShowMpText = String(Yanfly.Parameters["Show MP Text"]);
Yanfly.Param.BECShowMpText = eval(Yanfly.Param.BECShowMpText);
Yanfly.Param.BECShowTpText = String(Yanfly.Parameters["Show TP Text"]);
Yanfly.Param.BECShowTpText = eval(Yanfly.Param.BECShowTpText);
Yanfly.Param.BECShowStateText = String(Yanfly.Parameters["Show State Text"]);
Yanfly.Param.BECShowStateText = eval(Yanfly.Param.BECShowStateText);
Yanfly.Param.BECShowBuffText = String(Yanfly.Parameters["Show Buff Text"]);
Yanfly.Param.BECShowBuffText = eval(Yanfly.Param.BECShowBuffText);

//=============================================================================
// DataManager
//=============================================================================

Yanfly.BEC.DefaultActionSetup = [
    ["CLEAR BATTLE LOG"],
    ["DISPLAY ACTION"],
    ["IMMORTAL", ["TARGETS", "TRUE"]],
    ["PERFORM START"],
    ["WAIT FOR MOVEMENT"],
    ["CAST ANIMATION"],
    ["WAIT FOR ANIMATION"]
];
Yanfly.BEC.DefaultActionWhole = [["PERFORM ACTION"]];
Yanfly.BEC.DefaultActionTarget = [["PERFORM ACTION"]];
if (Yanfly.Param.BECMotionWait) {
    Yanfly.BEC.DefaultActionWhole.push(["MOTION WAIT", ["USER"]]);
    Yanfly.BEC.DefaultActionTarget.push(["MOTION WAIT", ["USER"]]);
} else {
    Yanfly.BEC.DefaultActionWhole.push(["WAIT", [10]]);
    Yanfly.BEC.DefaultActionTarget.push(["WAIT", [10]]);
}
Yanfly.BEC.DefaultActionWhole.push(["ACTION ANIMATION"]);
Yanfly.BEC.DefaultActionWhole.push(["WAIT FOR ANIMATION"]);
Yanfly.BEC.DefaultActionTarget.push(["ACTION ANIMATION"]);
Yanfly.BEC.DefaultActionTarget.push(["WAIT FOR ANIMATION"]);
Yanfly.BEC.DefaultActionFollow = [];
Yanfly.BEC.DefaultActionFinish = [
    ["IMMORTAL", ["TARGETS", "FALSE"]],
    ["WAIT FOR NEW LINE"],
    ["CLEAR BATTLE LOG"],
    ["PERFORM FINISH"],
    ["WAIT FOR MOVEMENT"],
    ["WAIT FOR EFFECT"],
    ["ACTION COMMON EVENT"]
];

Yanfly.DisableWebGLMask = false;
