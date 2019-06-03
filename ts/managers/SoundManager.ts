import AudioManager from "./AudioManager";

export default abstract class SoundManager {
    public static preloadImportantSounds: () => void;
    public static loadSystemSound: (n: any) => void;
    public static playSystemSound: (n: any) => void;
    public static playCursor: () => void;
    public static playOk: () => void;
    public static playCancel: () => void;
    public static playBuzzer: () => void;
    public static playEquip: () => void;
    public static playSave: () => void;
    public static playLoad: () => void;
    public static playBattleStart: () => void;
    public static playEscape: () => void;
    public static playEnemyAttack: () => void;
    public static playEnemyDamage: () => void;
    public static playEnemyCollapse: () => void;
    public static playBossCollapse1: () => void;
    public static playBossCollapse2: () => void;
    public static playActorDamage: () => void;
    public static playActorCollapse: () => void;
    public static playRecovery: () => void;
    public static playMiss: () => void;
    public static playEvasion: () => void;
    public static playMagicEvasion: () => void;
    public static playReflection: () => void;
    public static playShop: () => void;
    public static playUseItem: () => void;
    public static playUseSkill: () => void;
}

SoundManager.preloadImportantSounds = function () {
    this.loadSystemSound(0);
    this.loadSystemSound(1);
    this.loadSystemSound(2);
    this.loadSystemSound(3);
};

SoundManager.loadSystemSound = function (n) {
    if ($dataSystem) {
        AudioManager.loadStaticSe($dataSystem.sounds[n]);
    }
};

SoundManager.playSystemSound = function (n) {
    if ($dataSystem) {
        AudioManager.playStaticSe($dataSystem.sounds[n]);
    }
};

SoundManager.playCursor = function () {
    this.playSystemSound(0);
};

SoundManager.playOk = function () {
    this.playSystemSound(1);
};

SoundManager.playCancel = function () {
    this.playSystemSound(2);
};

SoundManager.playBuzzer = function () {
    this.playSystemSound(3);
};

SoundManager.playEquip = function () {
    this.playSystemSound(4);
};

SoundManager.playSave = function () {
    this.playSystemSound(5);
};

SoundManager.playLoad = function () {
    this.playSystemSound(6);
};

SoundManager.playBattleStart = function () {
    this.playSystemSound(7);
};

SoundManager.playEscape = function () {
    this.playSystemSound(8);
};

SoundManager.playEnemyAttack = function () {
    this.playSystemSound(9);
};

SoundManager.playEnemyDamage = function () {
    this.playSystemSound(10);
};

SoundManager.playEnemyCollapse = function () {
    this.playSystemSound(11);
};

SoundManager.playBossCollapse1 = function () {
    this.playSystemSound(12);
};

SoundManager.playBossCollapse2 = function () {
    this.playSystemSound(13);
};

SoundManager.playActorDamage = function () {
    this.playSystemSound(14);
};

SoundManager.playActorCollapse = function () {
    this.playSystemSound(15);
};

SoundManager.playRecovery = function () {
    this.playSystemSound(16);
};

SoundManager.playMiss = function () {
    this.playSystemSound(17);
};

SoundManager.playEvasion = function () {
    this.playSystemSound(18);
};

SoundManager.playMagicEvasion = function () {
    this.playSystemSound(19);
};

SoundManager.playReflection = function () {
    this.playSystemSound(20);
};

SoundManager.playShop = function () {
    this.playSystemSound(21);
};

SoundManager.playUseItem = function () {
    this.playSystemSound(22);
};

SoundManager.playUseSkill = function () {
    this.playSystemSound(23);
};
