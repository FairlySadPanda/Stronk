import { PluginManager } from "../managers/PluginManager";
import { DataManager } from "../managers/DataManager";
import { Game_BattlerBase } from "../objects/Game_BattlerBase";
import { Game_Battler } from "../objects/Game_Battler";
import { Game_Actor } from "../objects/Game_Actor";
import { Game_Enemy } from "../objects/Game_Enemy";
import { Utils } from "../core/Utils";
import { Yanfly } from "./Stronk_YEP_CoreEngine";

//=============================================================================
// Yanfly Engine Plugins - Extra Parameter Formula
// YEP_ExtraParamFormula.js
//=============================================================================

declare module "./Stronk_YEP_CoreEngine" {
    interface YEP {
        XParam: { version: number };
        _loaded_YEP_ExtraParamFormula: boolean;
    }

    interface YanflyParams {
        XParamFormula: string[];
    }
}

Yanfly.XParam = { version: 1.04 };
Yanfly._loaded_YEP_ExtraParamFormula = false;

/*:
 * @plugindesc v1.04 Control the formulas of the extra parameters for
 * HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, and TRG.
 * @author Yanfly Engine Plugins
 *
 * @param HIT Formula
 * @desc The formula used to determine HIT: Hit%
 * This is a formula.
 * @default (base + plus) * rate + flat
 *
 * @param EVA Formula
 * @desc The formula used to determine EVA: Evasion%
 * This is a formula.
 * @default (base + plus) * rate + flat
 *
 * @param CRI Formula
 * @desc The formula used to determine CRI: Critical Hit%
 * This is a formula.
 * @default (base + plus) * rate + flat
 *
 * @param CEV Formula
 * @desc The formula used to determine CEV: Critical Evasion%
 * This is a formula.
 * @default (base + plus) * rate + flat
 *
 * @param MEV Formula
 * @desc The formula used to determine MEV: Magic Evasion%
 * This is a formula.
 * @default (base + plus) * rate + flat
 *
 * @param MRF Formula
 * @desc The formula used to determine MRF: Magic Reflect%
 * This is a formula.
 * @default (base + plus) * rate + flat
 *
 * @param CNT Formula
 * @desc The formula used to determine CNT: Counter Attack%
 * This is a formula.
 * @default (base + plus) * rate + flat
 *
 * @param HRG Formula
 * @desc The formula used to determine HRG: HP% Regen
 * This is a formula.
 * @default (base + plus) * rate + flat
 *
 * @param MRG Formula
 * @desc The formula used to determine MRG: MP% Regen
 * This is a formula.
 * @default (base + plus) * rate + flat
 *
 * @param TRG Formula
 * @desc The formula used to determine TRG: Target Rate
 * This is a formula.
 * @default (base + plus) * rate + flat
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The values for the Extra Parameters: HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG,
 * MRG, and TRG, in RPG Maker MV are only able to be ever modified by traits by
 * the various database objects. While it is flexible, RPG Maker MV does not
 * enable you to utilize custom formulas to make things such as ATK and AGI
 * influence HIT rate or LUK influence CRItical hits. With this plugin, now you
 * can along with a few more goodies!
 *
 * ============================================================================
 * Instructions - Extra Parameter Explanation
 * ============================================================================
 *
 * For those who aren't familiar with what the Extra Parameters (xparams) do,
 * this is a list that will explain their standard functions in an RPG Maker MV
 * project.
 *
 * ---
 *
 * HIT - Hit Rate%
 * - This determines the physical hit success rate of the any physical action.
 * All physical attacks make a check through the HIT rate to see if the attack
 * will connect. If the HIT value passes the randomizer check, the attack will
 * connect. If the HIT value fails to pass the randomizer check, the attack
 * will be considered a MISS.
 *
 * ---
 *
 * EVA - Evasion Rate%
 * - This determines the physical evasion rate against any incoming physical
 * actions. If the HIT value passes, the action is then passed to the EVA check
 * through a randomizer check. If the randomizer check passes, the physical
 * attack is evaded and will fail to connect. If the randomizer check passes,
 * the attempt to evade the action will fail and the action connects.
 *
 * ---
 *
 * CRI - Critical Hit Rate%
 * - Any actions that enable Critical Hits will make a randomizer check with
 * this number. If the randomizer check passes, extra damage will be carried
 * out by the initiated action. If the randomizer check fails, no extra damage
 * will be added upon the action.
 *
 * ---
 *
 * CEV - Critical Evasion Rate%
 * - This value is put against the Critical Hit Rate% in a multiplicative rate.
 * If the Critical Hit Rate is 90% and the Critical Evasion Rate is
 * 20%, then the randomizer check will make a check against 72% as the values
 * are calculated by the source code as CRI * (1 - CEV), therefore, with values
 * as 0.90 * (1 - 0.20) === 0.72.
 *
 * ---
 *
 * MEV - Magic Evasion Rate%
 * - Where EVA is the evasion rate against physical actions, MEV is the evasion
 * rate against magical actions. As there is not magical version of HIT, the
 * MEV value will always be bit against when a magical action is initiated. If
 * the randomizer check passes for MEV, the magical action will not connect. If
 * the randomizer check fails for MEV, the magical action will connect.
 *
 * ---
 *
 * MRF - Magic Reflect Rate%
 * - If a magical action connects and passes, there is a chance the magical
 * action can be bounced back to the caster. That chance is the Magic Reflect
 * Rate. If the randomizer check for the Magic Reflect Rate passes, then the
 * magical action is bounced back to the caster, ignoring the caster's Magic
 * Evasion Rate. If the randomizer check for the Magic Reflect Rate fails, then
 * the magical action will connect with its target.
 *
 * ---
 *
 * CNT - Counter Attack Rate%
 * - If a physical action connects and passes, there is a chance the physical
 * action can be avoided and a counter attack made by the user will land on the
 * attacking unit. This is the Counter Attack Rate. If the randomizer check for
 * the Counter Attack Rate passes, the physical action is evaded and the target
 * will counter attack the user. If the randomizer check fails, the physical
 * action will connect to the target.
 *
 * ---
 *
 * HRG - HP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxHP as gained HP with a 100% success rate.
 *
 * ---
 *
 * MRG - MP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxMP as gained MP with a 100% success rate.
 *
 * ---
 *
 * TRG - TP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxTP as gained TP with a 100% success rate.
 *
 * ---
 *
 * ============================================================================
 * Instructions - Custom Formulas
 * ============================================================================
 *
 * The values calculated by the formulas in the plugin parameters are to come
 * out as float values. If the result value comes out as 0.1 for CRI, it will
 * be 10% CRI. Here is an example:
 *
 *   (base + plus) * rate + flat + user.luk / 1000
 *
 * The 'user.luk / 1000' is inserted at the end. Assuming everything else comes
 * out to be 10% and the user's LUK parameter is at 500, it will be 0.1 + 0.5
 * which means the total comes out to 0.6, hence a 60% CRItical hit rate.
 *
 * ============================================================================
 * Instructions - Understanding Formula Variables
 * ============================================================================
 *
 * So, what does the 'base', 'plus', 'rate', and 'flat' mean in the formulas?
 * This section will answer that in detail.
 *
 * Default plugin formula: (base + plus) * rate + flat
 *
 * BASE
 * - This value is determined by the default way RPG Maker MV determines the
 * value for that stat, and the way RPG Maker MV determines it is by adding up
 * the total trait values of that stat. If a battler would have a mixture of
 * +95%, -10%, and +5% HIT traits, then the base stat value would be +90%.
 *
 * PLUS
 * - This is a new variable added by this plugin. Its purpose is to function as
 * an addition to the base value. This addition can be done independently of
 * database items as you can do a user.addXParam to alter the base value of the
 * extra parameter. If using the default formula, this value is added to the
 * base before any rates are multiplied by it and any flats added to the total.
 *
 * RATE
 * - This is a new variable added by this plugin. Its purpose is to function as
 * a multiplicative modifier for the extra parameter value. This multiplicative
 * value is determined by various database objects through notetags. If using
 * the default formula, this value is multipled to the sum of the base and plus
 * values of the extra parameter before the flat is added to the total.
 *
 * FLAT
 * - This is a new variable added by this plugin. Its purpose is to function as
 * an additive modifier for the extra parameter value. This additive value is
 * determined by various database objects through notetags. If using the plugin
 * default formula, this value is added after the sum of the base and plus
 * values of the extra parameter stat are multiplied by the rate value.
 *
 * ============================================================================
 * Examples - Sample Formulas
 * ============================================================================
 *
 * The following are some sample formulas you can use to make extra parameters
 * a bit more dynamic:
 *
 * --- HIT ---
 * (base + plus) * rate + flat + ((user.atk + user.agi) / 2000)
 * - This will cause the HIT rate to gain bonus accuracy from ATK and AGI.
 *
 * --- EVA ---
 * (base + plus) * rate + flat + ((user.def + user.agi) / 2000)
 * - This will cause the EVA rate to gain bonus evasion from DEF and AGI.
 *
 * --- CRI ---
 * (base + plus) * rate + flat + (user.luk / 1000)
 * - This will cause the CRI rate to gain bonus success from LUK.
 *
 * --- CEV ---
 * (base + plus) * rate + flat + ((user.agi + user.luk) / 2000)
 * - This will cause the CEV rate to gain more critical evade from LUK and AGI.
 *
 * --- MEV ---
 * (base + plus) * rate + flat + ((user.mdf + user.agi) / 2000)
 * - This will cause the MEV rate to gain extra magic evasion from MDF and AGI.
 *
 * The above are some examples on how you can make your extra parameters to be
 * affected by the other stats from the user.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * You can use the following notetags to alter the various aspects that modify
 * the extra parameter values:
 *
 * Actor, Class, Enemy, Weapon, Armor, and State Notetags:
 *
 *   <stat Plus: +x%>
 *   <stat Plus: -x%>
 *   <stat Plus: +x.y>
 *   <stat Plus: -x.y>
 *   Replace 'stat' with 'hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt',
 *   'hrg', 'mrg', or 'trg'. This is the value added to the base parameter
 *   before the rate and flat values contribute to the total parameter value
 *   assuming the plugin's default formula is utilized.
 *
 *   <stat Rate: x%>
 *   <stat Rate: x.y>
 *   Replace 'stat' with 'hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt',
 *   'hrg', 'mrg', or 'trg'. This is the value multipled to the sum of the base
 *   and plus values of the parameter before added by the flat value assuming
 *   the plugin's default formula is utilized.
 *
 *   <stat Flat: +x%>
 *   <stat Flat: -x%>
 *   <stat Flat: +x.y>
 *   <stat Flat: -x.y>
 *   Replace 'stat' with 'hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt',
 *   'hrg', 'mrg', or 'trg'. This is the value added finally to the sum of the
 *   base and plus values after being multiplied by the rate value assuming the
 *   plugin's default formula is utilized.
 *
 * ============================================================================
 * Lunatic Mode - New JavaScript Functions
 * ============================================================================
 *
 * You can use the following JavaScript functions to alter the extra parameter
 * values of actors. In these listed functions, the 'actor' variable is to be
 * referenced by an actor:
 *
 * ie. actor = $gameActors.actor(3));
 *
 * Function:
 *
 *   actor.clearXParamPlus()
 *   - Clears all of the actor's extra parameter plus bonuses.
 *
 *   actor.setHit(x)
 *   actor.setEva(x)
 *   actor.setCri(x)
 *   actor.setCev(x)
 *   actor.setMev(x)
 *   actor.setMrf(x)
 *   actor.setCnt(x)
 *   actor.setHrg(x)
 *   actor.setMrg(x)
 *   actor.setTrg(x)
 *   - Sets the actor's respective extra parameter value to x. Keep in mind
 *   that 1 is equal to 100% and 0.1 would be equal to 10%. Negative values
 *   will apply here, too.
 *
 *   actor.setHitPlus(x)
 *   actor.setEvaPlus(x)
 *   actor.setCriPlus(x)
 *   actor.setCevPlus(x)
 *   actor.setMevPlus(x)
 *   actor.setMrfPlus(x)
 *   actor.setCntPlus(x)
 *   actor.setHrgPlus(x)
 *   actor.setMrgPlus(x)
 *   actor.setTrgPlus(x)
 *   - Sets the actor's respective extra parameter plus value to x. Keep in
 *   mind that 1 is equal to 100% and 0.1 would be equal to 10%. Negative
 *   values will apply here, too.
 *
 *   actor.addHit(x)
 *   actor.addEva(x)
 *   actor.addCri(x)
 *   actor.addCev(x)
 *   actor.addMev(x)
 *   actor.addMrf(x)
 *   actor.addCnt(x)
 *   actor.addHrg(x)
 *   actor.addMrg(x)
 *   actor.addTrg(x)
 *   - Adds x to the actor's respective extra parameter value. Keep in mind
 *   that 1 is equal to 100% and 0.1 would be equal to 10%. Negative values
 *   will decrease the extra parameter.
 *
 *   actor.minusHit(x)
 *   actor.minusEva(x)
 *   actor.minusCri(x)
 *   actor.minusCev(x)
 *   actor.minusMev(x)
 *   actor.minusMrf(x)
 *   actor.minusCnt(x)
 *   actor.minusHrg(x)
 *   actor.minusMrg(x)
 *   actor.minusTrg(x)
 *   - Subtracts x from the actor's respective extra parameter value. Keep in
 *   mind that 1 is equal to 100% and 0.1 would be equal to 10%. Negative
 *   values will add to the extra parameter.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.04:
 * - Updated for RPG Maker MV version 1.5.0.
 *
 * Version 1.03a:
 * - Lunatic Mode fail safe added.
 * - Documentation update to fix typos.
 *
 * Version 1.02:
 * - Fixed an issue with the battler.setXParam functions that made them take
 * the wrong value due caching issues.
 *
 * Version 1.01:
 * - Updated for RPG Maker MV version 1.1.0.
 *
 * Version 1.00:
 * - Finished Plugin!
 */

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters("Stronk_YEP_ExtraParamFormula");
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.XParamFormula = [];
Yanfly.Param.XParamFormula.push(String(Yanfly.Parameters["HIT Formula"]));
Yanfly.Param.XParamFormula.push(String(Yanfly.Parameters["EVA Formula"]));
Yanfly.Param.XParamFormula.push(String(Yanfly.Parameters["CRI Formula"]));
Yanfly.Param.XParamFormula.push(String(Yanfly.Parameters["CEV Formula"]));
Yanfly.Param.XParamFormula.push(String(Yanfly.Parameters["MEV Formula"]));
Yanfly.Param.XParamFormula.push(String(Yanfly.Parameters["MRF Formula"]));
Yanfly.Param.XParamFormula.push(String(Yanfly.Parameters["CNT Formula"]));
Yanfly.Param.XParamFormula.push(String(Yanfly.Parameters["HRG Formula"]));
Yanfly.Param.XParamFormula.push(String(Yanfly.Parameters["MRG Formula"]));
Yanfly.Param.XParamFormula.push(String(Yanfly.Parameters["TRG Formula"]));
