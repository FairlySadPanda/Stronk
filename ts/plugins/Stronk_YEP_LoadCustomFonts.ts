import { Yanfly } from "./Stronk_YEP_CoreEngine";
import { PluginManager } from "../managers/PluginManager";
import { Graphics } from "../core/Graphics";

//=============================================================================
// Yanfly Engine Plugins - Load Custom Fonts
// YEP_LoadCustomFonts.js
//=============================================================================

declare module "./Stronk_YEP_CoreEngine" {
    interface YEP {
        LCF: { version: number };
        _loaded_YEP_ExtraParamFormula: boolean;
    }

    interface YanflyParams {
        LCFFontFilenames: string;
        LCFFontFamilies: string;
    }

    interface YanflyUtils {
        loadCustomFonts(): void;
    }
}

Yanfly.LCF = { version: 1.01 };

/*:
 * @plugindesc v1.01 Load custom fonts from the /fonts/ folder. This will
 * allow you to use custom fonts without installing them.
 * @author Yanfly Engine Plugins
 *
 * @param Font Filenames
 * @desc These are full filenames of the fonts to be loaded from the
 * /fonts/ folder of your project. Separate each with ,
 * @default cc-wild-words.ttf, ds-pixel-cyr.ttf
 *
 * @param Font Families
 * @desc The font family names of the fonts. Keep them in the same
 * order as the parameter above. Separate each with ,
 * @default CC Wild Words, DS Pixel Cyr
 *
 * @help
 * ============================================================================
 * Introduction & Instructions
 * ============================================================================
 *
 * For those using custom fonts, you may have noticed that not all fonts from
 * the /fonts/ directory are loaded at the time the game is loaded. This plugin
 * let's you place the fonts into the /fonts/ directory and then load them as
 * the game starts.
 *
 * To use this plugin, follow these instructions:
 *
 * The plugin parameters 'Font Filenames' and 'Font Families' have to be filled
 * out in correspondence to each other. The order of each font entry must match
 * each other's. For example:
 *
 *      Font Filenames: cc-wild-words.ttf, ds-pixel-cyr.ttf
 *
 *      Font Families: CC Wild Words, DS Pixel Cyr
 *
 * In the above example, 'cc-wild-words.ttf' will use 'CC Wild Words' as its
 * font family and 'ds-pixel-cyr.ttf' will use 'DS Pixel Cyr'. For the plugins
 * that use font names such as YEP's Message Core, you will be using the Font
 * Family name instead of the filename.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.01:
 * - Updated for RPG Maker MV version 1.5.0.
 *
 * Version 1.00:
 * - Finished Plugin!
 */

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters("Stronk_YEP_LoadCustomFonts");
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.LCFFontFilenames = String(Yanfly.Parameters["Font Filenames"]);
Yanfly.Param.LCFFontFamilies = String(Yanfly.Parameters["Font Families"]);

Yanfly.Util.loadCustomFonts = function() {
    var filenames = Yanfly.Param.LCFFontFilenames.split(",");
    var fontfamilies = Yanfly.Param.LCFFontFamilies.split(",");
    if (filenames.length !== fontfamilies.length) {
        if (filenames.length > fontfamilies.length) {
            console.log(
                "You are missing fonts in the Font Families parameter."
            );
        }
        if (filenames.length < fontfamilies.length) {
            console.log(
                "You are missing fonts in the Font Filenames parameter."
            );
        }
        console.log("Loading custom fonts aborted.");
        return;
    }
    var projectDirectory = window.location.pathname.substring(
        0,
        window.location.pathname.lastIndexOf("/")
    );
    var length = filenames.length;
    for (var i = 0; i < length; ++i) {
        var filename = filenames[i].trim();
        var fontfamily = fontfamilies[i].trim();
        Graphics.loadFont(fontfamily, projectDirectory + "/fonts/" + filename);
    }
};
Yanfly.Util.loadCustomFonts();
