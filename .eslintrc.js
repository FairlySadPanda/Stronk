module.exports = {
    env: {
        browser: true,
        es6: true
    },
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        $plugins: true,
        $dataActors: true,
        $dataClasses: true,
        $dataSkills: true,
        $dataItems: true,
        $dataWeapons: true,
        $dataArmors: true,
        $dataEnemies: true,
        $dataTroops: true,
        $dataStates: true,
        $dataAnimations: true,
        $dataTilesets: true,
        $dataCommonEvents: true,
        $dataSystem: true,
        $dataMapInfos: true,
        $dataMap: true,
        $gameTemp: true,
        $gameSystem: true,
        $gameScreen: true,
        $gameTimer: true,
        $gameMessage: true,
        $gameSwitches: true,
        $gameVariables: true,
        $gameSelfSwitches: true,
        $gameActors: true,
        $gameParty: true,
        $gameTroop: true,
        $gameMap: true,
        $gamePlayer: true,
        $testEvent: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
    },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier"],
    extends: ["standard", "plugin:@typescript-eslint/recommended", "prettier"],
    rules: {
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/class-name-casing": "off",
        "prettier/prettier": "error",
        "@typescript-eslint/interface-name-prefix": ["off", "never"],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "no-control-regex": "off",
        "no-eval": "off",
        "no-unused-expressions": "off"
    }
};
