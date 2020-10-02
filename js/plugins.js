// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins = [
    {
        name: "Community_Basic",
        status: false,
        description: "Basic plugin for manipulating important parameters.",
        parameters: {
            cacheLimit: "20",
            screenWidth: "816",
            screenHeight: "624",
            changeWindowWidthTo: "",
            changeWindowHeightTo: "",
            renderingMode: "auto",
            alwaysDash: "off"
        }
    },
    {
        name: "MadeWithMv",
        status: false,
        description:
            'Show a Splash Screen "Made with MV" and/or a Custom Splash Screen before going to main screen.',
        parameters: {
            "Show Made With MV": "true",
            "Made with MV Image": "MadeWithMv",
            "Show Custom Splash": "false",
            "Custom Image": "",
            "Fade Out Time": "120",
            "Fade In Time": "120",
            "Wait Time": "160"
        }
    },
    {
        name: "Stronk_YEP_CoreEngine",
        status: true,
        description:
            "v1.31 Needed for the majority of Yanfly Engine Scripts. Also\r\ncontains bug fixes found inherently in RPG Maker.",
        parameters: {
            "Open Console": "false",
            "Collection Clear": "true",
            "---Gold---": "",
            "Gold Max": "99999999",
            "Gold Font Size": "20",
            "Gold Icon": "313",
            "Gold Overlap": "A lotta",
            "---Items---": "",
            "Default Max": "99",
            "Quantity Text Size": "20",
            "---Parameters---": "",
            "Max Level": "99",
            "Actor MaxHP": "9999",
            "Actor MaxMP": "9999",
            "Actor Parameter": "999",
            "Enemy MaxHP": "999999",
            "Enemy MaxMP": "9999",
            "Enemy Parameter": "999",
            "---Battle---": "",
            "Animation Rate": "4",
            "Flash Target": "false",
            "Show Events Transition": "true",
            "Show Events Snapshot": "true",
            "---Map Optimization---": "",
            "Refresh Update HP": "true",
            "Refresh Update MP": "true",
            "Refresh Update TP": "false",
            "---Font---": "",
            "Chinese Font": "SimHei, Heiti TC, sans-serif",
            "Korean Font": "Dotum, AppleGothic, sans-serif",
            "Default Font": "GameFont, Verdana, Arial, Courier New",
            "Font Size": "28",
            "Text Align": "left",
            "---Windows---": "",
            "Digit Grouping": "true",
            "Line Height": "36",
            "Icon Width": "32",
            "Icon Height": "32",
            "Face Width": "144",
            "Face Height": "144",
            "Window Padding": "18",
            "Text Padding": "6",
            "Window Opacity": "192",
            "Gauge Outline": "true",
            "Gauge Height": "18",
            "Menu TP Bar": "true",
            "---Window Colors---": "",
            "Color: Normal": "0",
            "Color: System": "16",
            "Color: Crisis": "17",
            "Color: Death": "18",
            "Color: Gauge Back": "19",
            "Color: HP Gauge 1": "20",
            "Color: HP Gauge 2": "21",
            "Color: MP Gauge 1": "22",
            "Color: MP Gauge 2": "23",
            "Color: MP Cost": "23",
            "Color: Power Up": "24",
            "Color: Power Down": "25",
            "Color: TP Gauge 1": "28",
            "Color: TP Gauge 2": "29",
            "Color: TP Cost Color": "29"
        }
    },
    {
        name: "Stronk_YEP_BattleEngineCore",
        status: true,
        description:
            "v1.50 Have more control over the flow of the battle system\r\nwith this plugin and alter various aspects to your liking.",
        parameters: {
            "---General---": "",
            "Action Speed": "agi",
            "Default System": "dtb",
            "---Escape---": "",
            "Escape Ratio": "0.5 * $gameParty.agility() / $gameTroop.agility()",
            "Fail Escape Boost": "0.10",
            "---Animation---": "",
            "Animation Base Delay": "0",
            "Animation Next Delay": "0",
            "Certain Hit Animation": "0",
            "Physical Animation": "52",
            "Magical Animation": "51",
            "Enemy Attack Animation": "39",
            "Reflect Animation": "42",
            "Motion Waiting": "false",
            "---Frontview---": "",
            "Front Position X":
                "Graphics.boxWidth / 8 + Graphics.boxWidth / 4 * index",
            "Front Position Y": "Graphics.boxHeight - 180",
            "Front Actor Sprite": "false",
            "Front Sprite Priority": "1",
            "---Sideview---": "",
            "Home Position X":
                "screenWidth - 16 - (maxSize + 2) * 32 + index * 32",
            "Home Position Y":
                "screenHeight - statusHeight - maxSize * 48 + (index+1) * 48 - 32",
            "Side Sprite Priority": "1",
            "---Sprites---": "",
            "Default X Anchor": "0.50",
            "Default Y Anchor": "1.00",
            "Step Distance": "48",
            "Flinch Distance": "12",
            "Show Shadows": "true",
            "---Damage Popups---": "",
            "Popup Duration": "128",
            "Newest Popup Bottom": "true",
            "Popup Overlap Rate": "0.9",
            "Critical Popup": "255, 0, 0, 160",
            "Critical Duration": "60",
            "---Tick-Settings---": "",
            "Timed States": "false",
            "Timed Buffs": "false",
            "Turn Time": "100",
            "AI Self Turns": "true",
            "---Window Settings---": "",
            "Lower Windows": "true",
            "Window Rows": "4",
            "Command Window Rows": "4",
            "Command Alignment": "center",
            "Start Actor Command": "true",
            "Current Max": "false",
            "---Selection Help---": "",
            "Mouse Over": "true",
            "Select Help Window": "true",
            "User Help Text": "User",
            "Ally Help Text": "Ally",
            "Allies Help Text": "Allies",
            "Enemy Help Text": "Enemy",
            "Enemies Help Text": "Enemies",
            "All Help Text": "All %1",
            "Random Help Text": "%2 Random %1",
            "---Enemy Select---": "",
            "Visual Enemy Select": "true",
            "Show Enemy Name": "true",
            "Show Select Box": "false",
            "Enemy Font Size": "20",
            "Enemy Auto Select": "this.furthestRight()",
            "---Actor Select---": "",
            "Visual Actor Select": "true",
            "---Battle Log---": "",
            "Show Emerge Text": "false",
            "Show Pre-Emptive Text": "true",
            "Show Surprise Text": "true",
            "Optimize Speed": "true",
            "Show Action Text": "false",
            "Show State Text": "false",
            "Show Buff Text": "false",
            "Show Counter Text": "true",
            "Show Reflect Text": "true",
            "Show Substitute Text": "true",
            "Show Fail Text": "false",
            "Show Critical Text": "false",
            "Show Miss Text": "false",
            "Show Evasion Text": "false",
            "Show HP Text": "false",
            "Show MP Text": "false",
            "Show TP Text": "false"
        }
    },
    {
        name: "Stronk_YEP_BaseParamControl",
        status: true,
        description:
            "v1.04 Gain control over the method of calculation for base\r\nparameters: MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK.",
        parameters: {
            "---MaxHP---": "",
            "MHP Formula": "(base + plus) * paramRate * buffRate + flat",
            "MHP Maximum": "customMax || (user.isActor() ? 9999 : 999999)",
            "MHP Minimum": "customMin || 1",
            "---MaxMP---": "",
            "MMP Formula": "(base + plus) * paramRate * buffRate + flat",
            "MMP Maximum": "customMax || (user.isActor() ? 9999 : 9999)",
            "MMP Minimum": "customMin || 0",
            "---Attack---": "",
            "ATK Formula": "(base + plus) * paramRate * buffRate + flat",
            "ATK Maximum": "customMax || (user.isActor() ? 999 : 999)",
            "ATK Minimum": "customMin || 1",
            "---Defense---": "",
            "DEF Formula": "(base + plus) * paramRate * buffRate + flat",
            "DEF Maximum": "customMax || (user.isActor() ? 999 : 999)",
            "DEF Minimum": "customMin || 1",
            "---M.Attack---": "",
            "MAT Formula": "(base + plus) * paramRate * buffRate + flat",
            "MAT Maximum": "customMax || (user.isActor() ? 999 : 999)",
            "MAT Minimum": "customMin || 1",
            "---M.Defense---": "",
            "MDF Formula": "(base + plus) * paramRate * buffRate + flat",
            "MDF Maximum": "customMax || (user.isActor() ? 999 : 999)",
            "MDF Minimum": "customMin || 1",
            "---Agility---": "",
            "AGI Formula": "(base + plus) * paramRate * buffRate + flat",
            "AGI Maximum": "customMax || (user.isActor() ? 999 : 999)",
            "AGI Minimum": "customMin || 1",
            "---Luck---": "",
            "LUK Formula": "(base + plus) * paramRate * buffRate + flat",
            "LUK Maximum": "customMax || (user.isActor() ? 999 : 999)",
            "LUK Minimum": "customMin || 1",
            "LUK Effect": "Math.max(1.0 + (user.luk - target.luk) * 0.001, 0.0)"
        }
    },
    {
        name: "Stronk_YEP_ExtraParamFormula",
        status: true,
        description:
            "v1.04 Control the formulas of the extra parameters for\r\nHIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, and TRG.",
        parameters: {
            "HIT Formula": "(base + plus) * rate + flat",
            "EVA Formula": "(base + plus) * rate + flat",
            "CRI Formula": "(base + plus) * rate + flat",
            "CEV Formula": "(base + plus) * rate + flat",
            "MEV Formula": "(base + plus) * rate + flat",
            "MRF Formula": "(base + plus) * rate + flat",
            "CNT Formula": "(base + plus) * rate + flat",
            "HRG Formula": "(base + plus) * rate + flat",
            "MRG Formula": "(base + plus) * rate + flat",
            "TRG Formula": "(base + plus) * rate + flat"
        }
    },
    {
        name: "Stronk_YEP_LoadCustomFonts",
        status: true,
        description:
            "v1.01 Load custom fonts from the /fonts/ folder. This will\r\nallow you to use custom fonts without installing them.",
        parameters: {
            "Font Filenames": "cc-wild-words.ttf, ds-pixel-cyr.ttf",
            "Font Families": "CC Wild Words, DS Pixel Cyr"
        }
    }
];
