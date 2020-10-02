import { Yanfly } from "./Stronk_YEP_CoreEngine";
import { PluginManager } from "../managers/PluginManager";

//=============================================================================
// Yanfly Engine Plugins - Base Parameter Control
// YEP_BaseParamControl.js
//=============================================================================

declare module "./Stronk_YEP_CoreEngine" {
    interface YEP {
        BPC: { version: number };
        _loaded_YEP_BaseParamControl: boolean;
    }

    interface YanflyParams {
        BPCFormula: string[];
        BPCMaximum: string[];
        BPCMinimum: string[];
        BPCLukEffectRate: string;
    }
}

Yanfly.BPC = { version: 1.04 };
Yanfly._loaded_YEP_BaseParamControl = false;

/*:
 * @plugindesc v1.04 Gain control over the method of calculation for base
 * parameters: MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK.
 * @author Yanfly Engine Plugins
 *
 * @param ---MaxHP---
 * @default
 *
 * @param MHP Formula
 * @parent ---MaxHP---
 * @desc The formula used to determine MHP: MaxHP
 * This is a formula.
 * @default (base + plus) * paramRate * buffRate + flat
 *
 * @param MHP Maximum
 * @parent ---MaxHP---
 * @desc This is the highest value for MHP.
 * This is a formula.
 * @default customMax || (user.isActor() ? 9999 : 999999)
 *
 * @param MHP Minimum
 * @parent ---MaxHP---
 * @desc This is the lowest value for MHP.
 * This is a formula.
 * @default customMin || 1
 *
 * @param ---MaxMP---
 * @default
 *
 * @param MMP Formula
 * @parent ---MaxMP---
 * @desc The formula used to determine MMP: MaxMP
 * This is a formula.
 * @default (base + plus) * paramRate * buffRate + flat
 *
 * @param MMP Maximum
 * @parent ---MaxMP---
 * @desc This is the highest value for MMP.
 * This is a formula.
 * @default customMax || (user.isActor() ? 9999 : 9999)
 *
 * @param MMP Minimum
 * @parent ---MaxMP---
 * @desc This is the lowest value for MMP.
 * This is a formula.
 * @default customMin || 0
 *
 * @param ---Attack---
 * @default
 *
 * @param ATK Formula
 * @parent ---Attack---
 * @desc The formula used to determine ATK: Attack
 * This is a formula.
 * @default (base + plus) * paramRate * buffRate + flat
 *
 * @param ATK Maximum
 * @parent ---Attack---
 * @desc This is the highest value for ATK.
 * This is a formula.
 * @default customMax || (user.isActor() ? 999 : 999)
 *
 * @param ATK Minimum
 * @parent ---Attack---
 * @desc This is the lowest value for ATK.
 * This is a formula.
 * @default customMin || 1
 *
 * @param ---Defense---
 * @default
 *
 * @param DEF Formula
 * @parent ---Defense---
 * @desc The formula used to determine DEF: Defense
 * This is a formula.
 * @default (base + plus) * paramRate * buffRate + flat
 *
 * @param DEF Maximum
 * @parent ---Defense---
 * @desc This is the highest value for DEF.
 * This is a formula.
 * @default customMax || (user.isActor() ? 999 : 999)
 *
 * @param DEF Minimum
 * @parent ---Defense---
 * @desc This is the lowest value for DEF.
 * This is a formula.
 * @default customMin || 1
 *
 * @param ---M.Attack---
 * @default
 *
 * @param MAT Formula
 * @parent ---M.Attack---
 * @desc The formula used to determine MAT: M.Attack
 * This is a formula.
 * @default (base + plus) * paramRate * buffRate + flat
 *
 * @param MAT Maximum
 * @parent ---M.Attack---
 * @desc This is the highest value for MAT.
 * This is a formula.
 * @default customMax || (user.isActor() ? 999 : 999)
 *
 * @param MAT Minimum
 * @parent ---M.Attack---
 * @desc This is the lowest value for MAT.
 * This is a formula.
 * @default customMin || 1
 *
 * @param ---M.Defense---
 * @default
 *
 * @param MDF Formula
 * @parent ---M.Defense---
 * @desc The formula used to determine MDF: M.Defense
 * This is a formula.
 * @default (base + plus) * paramRate * buffRate + flat
 *
 * @param MDF Maximum
 * @parent ---M.Defense---
 * @desc This is the highest value for MDF.
 * This is a formula.
 * @default customMax || (user.isActor() ? 999 : 999)
 *
 * @param MDF Minimum
 * @parent ---M.Defense---
 * @desc This is the lowest value for MDF.
 * This is a formula.
 * @default customMin || 1
 *
 * @param ---Agility---
 * @default
 *
 * @param AGI Formula
 * @parent ---Agility---
 * @desc The formula used to determine AGI: Agility
 * This is a formula.
 * @default (base + plus) * paramRate * buffRate + flat
 *
 * @param AGI Maximum
 * @parent ---Agility---
 * @desc This is the highest value for AGI.
 * This is a formula.
 * @default customMax || (user.isActor() ? 999 : 999)
 *
 * @param AGI Minimum
 * @parent ---Agility---
 * @desc This is the lowest value for AGI.
 * This is a formula.
 * @default customMin || 1
 *
 * @param ---Luck---
 * @default
 *
 * @param LUK Formula
 * @parent ---Luck---
 * @desc The formula used to determine LUK: Luck
 * This is a formula.
 * @default (base + plus) * paramRate * buffRate + flat
 *
 * @param LUK Maximum
 * @parent ---Luck---
 * @desc This is the highest value for LUK.
 * This is a formula.
 * @default customMax || (user.isActor() ? 999 : 999)
 *
 * @param LUK Minimum
 * @parent ---Luck---
 * @desc This is the lowest value for LUK.
 * This is a formula.
 * @default customMin || 1
 *
 * @param LUK Effect
 * @parent ---Luck---
 * @desc The formula used to influence state success rates.
 * This is a formula
 * @default Math.max(1.0 + (user.luk - target.luk) * 0.001, 0.0)
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The base parameters, MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, and LUK all play
 * a very important part of battle, yet, so very little control is given to the
 * developer in regards to these important stats. This plugin will give more
 * control over how the stats are handled and more.
 *
 * Note: If you are using the Core Engine and have modified the settings there
 * for higher parameter caps, this plugin will override those settings if this
 * plugin is placed beneath the Core Engine (recommended).
 *
 * ============================================================================
 * Instructions - Base Parameter Explanation
 * ============================================================================
 *
 * For those who do not understand what the base parameters are used for in RPG
 * Maker MV, this section will provide a brief summary of their most important
 * roles of what the base parameters do.
 *
 * ---
 *
 * MHP - MaxHP
 * - This is the maximum health points value. The amount of health points (HP)
 * a battler has determines whether or not the battler is in a living state or
 * a dead state. If the HP value is above 0, then the battler is living. If it
 * is 0 or below, the battler is in a dead state unless the battler has a way
 * to counteract death (usually through immortality). When the battler takes
 * damage, it is usually dealt to the HP value and reduces it. If the battler
 * is healed, then the HP value is increased. The MaxHP value determines what's
 * the maximum amount the HP value can be held at, meaning the battler cannot
 * be healed past that point.
 *
 * ---
 *
 * MMP - MaxMP
 * - This is the maximum magic points value. Magic points (MP) are typically
 * used for the cost of skills and spells in battle. If the battler has enough
 * MP to fit the cost of the said skill, the battler is able to use the said
 * skill provided that all of the skill's other conditions are met. If not, the
 * battler is then unable to use the skill. Upon using a skill that costs MP,
 * the battler's MP is reduced. However, the battler's MP can be recovered and
 * results in a gain of MP. The MaxMP value determines what is the maximum
 * amount the MP value can be held at, meaning the battler cannot recover MP
 * past the MaxMP value.
 *
 * ---
 *
 * ATK - Attack
 * - This is the attack value of the battler. By default, this stat is used for
 * the purpose of damage calculations only, and is typically used to represent
 * the battler's physical attack power. Given normal damage formulas, higher
 * values mean higher damage output for physical attacks.
 *
 * ---
 *
 * DEF - Defense
 * - This is the defense value of the battler. By default, this stat is used
 * for the purpose of damage calculations only, and is typically used to
 * represent the battler's physical defense. Given normal damage formulas,
 * higher values mean less damage received from physical attacks.
 *
 * ---
 *
 * MAT - Magic Attack
 * - This is the magic attack value of the battler. By default, this stat is
 * used for the purpose of damage calculations only, and is typically used to
 * represent the battler's magical attack power. Given normal damage formulas,
 * higher values mean higher damage output for magical attacks.
 *
 * ---
 *
 * MDF - Magic Defense
 * - This is the magic defense value of the battler. By default, this stat is
 * used for the purpose of damage calculations only, and is typically used to
 * represent the battler's magical defense. Given normal damage formulas,
 * higher values mean less damage received from magical attacks.
 *
 * ---
 *
 * AGI - Agility
 * - This is the agility value of the battler. By default, this stat is used to
 * determine battler's position in the battle turn's order. Given a normal turn
 * calculation formula, the higher the value, the faster the battler is, and
 * the more likely the battler will have its turn earlier in a turn.
 *
 * ---
 *
 * LUK - Luck
 * - This is the luck value of the battler. By default, this stat is used to
 * affect the success rate of states, buffs, and debuffs applied by the battler
 * and received by the battler. If the user has a higher LUK value, the state,
 * buff, or debuff is more likely to succeed. If the target has a higher LUK
 * value, then the state, buff, or debuff is less likely to succeed.
 *
 * ---
 *
 * ============================================================================
 * Instructions - Custom Formulas
 * ============================================================================
 *
 * The values calculated by the formulas in the plugin parameters are to come
 * out as integer values. If the result is a float, it will be rounded up and
 * then clamped based around the maximum and minimum values the parameter can
 * be (also calculated by the plugin parameters).
 *
 * By default, the formula looks as such:
 *
 * ---
 *
 *      (base + plus) * paramRate * buffRate + flat
 *
 * ---
 *
 * Below is an explanation of each of the parts of the formula.
 *
 * BASE
 * - This value is determined in multiple ways. If the battler is an actor, the
 * base value is the base parameter value calculated by the position based on
 * the battler's level on the parameter curve for the battler's current class.
 * If the battler is an enemy, the base parameter value, by default, is equal
 * to the value inserted on the enemy's database entry for that parameter.
 *
 * PLUS
 * - This value is determined in multiple ways. For both actors and enemies,
 * this value is a flat value given to the battler through events or script
 * calls that manually increase the battler's parameter value. If the battler
 * is an actor, this value is also increased by any equipment the battler has
 * equipped. This value can be influenced by notetags provided by this plugin.
 *
 * PARAMRATE
 * - This value is determined the same way for both actors and enemies. This is
 * a percentile rate that is calculated by the multiplicative product of all
 * of the parameter spread across the battler's traits, independent of the
 * battler's buff rate. This value can be influenced by notetags provided by
 * this plugin.
 *
 * BUFFRATE
 * - This value is determined by the number of buff stacks (or debuff stacks)
 * on a battler, regardless of whether or not the battler is an actor or enemy.
 * The percentile modifier is calculated relative to the number of stacks in
 * regards to that particular parameter for the battler. This value is NOT
 * influenced by notetags provided by this plugin.
 *
 * FLAT
 * - This is a new variable added by this plugin. Its purpose is to provide a
 * final additive modifier to the total value of the parameter. This additive
 * value is determined by the various database objects through notetags and can
 * only be affected by those notetags.
 *
 * ---
 *
 * The parameter Maximum and Minimum values also have formulas. They will work
 * something along the lines of this by default:
 *
 *      customMax || (user.isActor() ? 9999 : 999999)
 *      customMin || 1
 *
 * For those wondering about the 'customMax' and 'customMin' values, they are
 * new variables added by this plugin.
 *
 * CUSTOMMAX
 * - This is the custom maximum limit provided by this plugin through either a
 * script call or notetags. The custom max will look through the battler's
 * individual noteboxes. If the battler is an actor, it will look through the
 * actor, class, each of the noteboxes of the equipment worn by the actor, and
 * the noteboxes of each of the states affecting the actor. If the battler is
 * an enemy, it wil look through the enemy notebox and each of the noteboxes of
 * the states affecting the enemy. The highest custom maximum value becomes the
 * newest 'customMax' value for the battler and will take priority over the
 * default maximum value. If there is no 'customMax' value, then the value
 * becomes the default maximum value written in the formula.
 *
 * CUSTOMMIN
 * - This is the custom minimum limit provided by this plugin through either a
 * script call or notetags. The custom min will look through the battler's
 * individual noteboxes. If the battler is an actor, it will look through the
 * actor, class, each of the noteboxes of the equipment worn by the actor, and
 * the noteboxes of each of the states affecting the actor. If the battler is
 * an enemy, it wil look through the enemy notebox and each of the noteboxes of
 * the states affecting the enemy. The highest custom minimum value becomes the
 * newest 'customMin' value for the battler and will take priority over the
 * default minimum value. If there is no 'customMin' value, then the value
 * becomes the default minimum value written in the formula.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * You can use the following notetags to alter the various aspects that modify
 * the base parameter values:
 *
 * Actor, Class, Enemy, Weapon, Armor, and State Notetags:
 *
 *   <stat Plus: +x>
 *   <stat Plus: -x>
 *   Replace 'stat' with 'maxhp', 'maxmp', 'atk', 'def', 'mat', 'mdf', 'agi',
 *   or 'luk'. This is the value added to the base parameter before the rate
 *   and flat values contribute to the total parameter value assuming the
 *   plugin's default formula is utilized.
 *
 *   <stat Rate: x%>
 *   <stat Rate: x.y>
 *   Replace 'stat' with 'maxhp', 'maxmp', 'atk', 'def', 'mat', 'mdf', 'agi',
 *   or 'luk'. This is the value multiplied to the sum of the base and plus of
 *   the parameter before affected by the buffRate and flat value assuming the
 *   plugin's default formula is utilized.
 *
 *   <stat Flat: +x>
 *   <stat Flat: -x>
 *   Replace 'stat' with 'maxhp', 'maxmp', 'atk', 'def', 'mat', 'mdf', 'agi',
 *   or 'luk'. This is the value added at the end after the sum of the base and
 *   plus parameters have been added and multiplied by the rate values assuming
 *   the plugin's default formula is utilized.
 *
 *   <stat Max: x>
 *   <stat Min: x>
 *   Replace 'stat' with 'maxhp', 'maxmp', 'atk', 'def', 'mat', 'mdf', 'agi',
 *   or 'luk'. This sets the maximum or minimum cap of the the stat parameter
 *   to x. If a battler is affected by multiple of these notetags, then the
 *   value used will be the largest value of the notetag used.
 *
 * ============================================================================
 * Lunatic Mode - New JavaScript Functions
 * ============================================================================
 *
 * You can use the following JavaScript functions to alter the base parameter
 * values of the battlers. In these listed functions, the 'battler' variable
 * is to be referenced by an actor:
 *
 * ie. battler = $gameActors.actor(3);
 *     - or -
 *     battler = $gameTroop.members()[2];
 *
 * Function:
 *
 *   battler.clearParamPlus()
 *   - This will clear all 'plus' variable modifiers for all base parameters.
 *
 *   battler.setMaxHp(x)
 *   battler.setMaxMp(x)
 *   battler.setAtk(x)
 *   battler.setDef(x)
 *   battler.setMat(x)
 *   battler.setMdf(x)
 *   battler.setAgi(x)
 *   battler.setLuk(x)
 *   - Sets the battler's respective base parameter value to x. This will alter
 *   the 'plus' variable to fit this setting as best as possible without taking
 *   into consideration the rates and flats.
 *
 *   battler.setMaxHpPlus(x)
 *   battler.setMaxMpPlus(x)
 *   battler.setAtkPlus(x)
 *   battler.setDefPlus(x)
 *   battler.setMatPlus(x)
 *   battler.setMdfPlus(x)
 *   battler.setAgiPlus(x)
 *   battler.setLukPlus(x)
 *   - Sets the battler's respective base parameter plus value to x.
 *
 *   battler.addMaxHp(x)
 *   battler.addMaxMp(x)
 *   battler.addAtk(x)
 *   battler.addDef(x)
 *   battler.addMat(x)
 *   battler.addMdf(x)
 *   battler.addAgi(x)
 *   battler.addLuk(x)
 *   - Adds x value to battler's respective base parameter plus value.
 *
 *   battler.minusMaxHp(x)
 *   battler.minusMaxMp(x)
 *   battler.minusAtk(x)
 *   battler.minusDef(x)
 *   battler.minusMat(x)
 *   battler.minusMdf(x)
 *   battler.minusAgi(x)
 *   battler.minusLuk(x)
 *   - Subtracts x value to battler's respective base parameter plus value.
 *
 *   battler.clearCustomParamLimits();
 *   - Clears any custom parameter limits placed upon the battler through a
 *   script call. This does not remove the custom parameter limits applied to
 *   a battler through notetags.
 *
 *   battler.setCustomMaxHpMax(x)
 *   battler.setCustomMaxMpMax(x)
 *   battler.setCustomAtkMax(x)
 *   battler.setCustomDefMax(x)
 *   battler.setCustomMatMax(x)
 *   battler.setCustomMdfMax(x)
 *   battler.setCustomAgiMax(x)
 *   battler.setCustomLukMax(x)
 *   - Sets the maximum parameter limit of the respective base parameter to x.
 *   This value is calculated against any <stat Max: x> notetags that the
 *   battler may have. If there are multiple max values, the larges value is
 *   used as the parameter maximum.
 *
 *   battler.setCustomMaxHpMin(x)
 *   battler.setCustomMaxMpMin(x)
 *   battler.setCustomAtkMin(x)
 *   battler.setCustomDefMin(x)
 *   battler.setCustomMatMin(x)
 *   battler.setCustomMdfMin(x)
 *   battler.setCustomAgiMin(x)
 *   battler.setCustomLukMin(x)
 *   - Sets the minimum parameter limit of the respective base parameter to x.
 *   This value is calculated against any <stat Min: x> notetags that the
 *   battler may have. If there are multiple min values, the larges value is
 *   used as the parameter minimum.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.04:
 * - Bypass the isDevToolsOpen() error when bad code is inserted into a script
 * call or custom Lunatic Mode code segment due to updating to MV 1.6.1.
 * - Fixed a typo in the documentation for script calls regarding LUK.
 *
 * Version 1.03:
 * - Updated for RPG Maker MV version 1.5.0.
 *
 * Version 1.02:
 * - Lunatic Mode fail safes added.
 *
 * Version 1.01:
 * - Fixed an issue with the battler.setParam functions that made them take the
 * wrong value due caching issues.
 */

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters("Stronk_YEP_BaseParamControl");
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.BPCFormula = [];
Yanfly.Param.BPCFormula.push(String(Yanfly.Parameters["MHP Formula"]));
Yanfly.Param.BPCFormula.push(String(Yanfly.Parameters["MMP Formula"]));
Yanfly.Param.BPCFormula.push(String(Yanfly.Parameters["ATK Formula"]));
Yanfly.Param.BPCFormula.push(String(Yanfly.Parameters["DEF Formula"]));
Yanfly.Param.BPCFormula.push(String(Yanfly.Parameters["MAT Formula"]));
Yanfly.Param.BPCFormula.push(String(Yanfly.Parameters["MDF Formula"]));
Yanfly.Param.BPCFormula.push(String(Yanfly.Parameters["AGI Formula"]));
Yanfly.Param.BPCFormula.push(String(Yanfly.Parameters["LUK Formula"]));

Yanfly.Param.BPCMaximum = [];
Yanfly.Param.BPCMaximum.push(String(Yanfly.Parameters["MHP Maximum"]));
Yanfly.Param.BPCMaximum.push(String(Yanfly.Parameters["MMP Maximum"]));
Yanfly.Param.BPCMaximum.push(String(Yanfly.Parameters["ATK Maximum"]));
Yanfly.Param.BPCMaximum.push(String(Yanfly.Parameters["DEF Maximum"]));
Yanfly.Param.BPCMaximum.push(String(Yanfly.Parameters["MAT Maximum"]));
Yanfly.Param.BPCMaximum.push(String(Yanfly.Parameters["MDF Maximum"]));
Yanfly.Param.BPCMaximum.push(String(Yanfly.Parameters["AGI Maximum"]));
Yanfly.Param.BPCMaximum.push(String(Yanfly.Parameters["LUK Maximum"]));

Yanfly.Param.BPCMinimum = [];
Yanfly.Param.BPCMinimum.push(String(Yanfly.Parameters["MHP Minimum"]));
Yanfly.Param.BPCMinimum.push(String(Yanfly.Parameters["MMP Minimum"]));
Yanfly.Param.BPCMinimum.push(String(Yanfly.Parameters["ATK Minimum"]));
Yanfly.Param.BPCMinimum.push(String(Yanfly.Parameters["DEF Minimum"]));
Yanfly.Param.BPCMinimum.push(String(Yanfly.Parameters["MAT Minimum"]));
Yanfly.Param.BPCMinimum.push(String(Yanfly.Parameters["MDF Minimum"]));
Yanfly.Param.BPCMinimum.push(String(Yanfly.Parameters["AGI Minimum"]));
Yanfly.Param.BPCMinimum.push(String(Yanfly.Parameters["LUK Minimum"]));

Yanfly.Param.BPCLukEffectRate = String(Yanfly.Parameters["LUK Effect"]);
