import AudioManager from "./AudioManager";

export default abstract class SoundManager {
    public static preloadImportantSounds() {
        this.loadSystemSound(0);
        this.loadSystemSound(1);
        this.loadSystemSound(2);
        this.loadSystemSound(3);
    }

    public static loadSystemSound(n) {
        if ($dataSystem) {
            AudioManager.loadStaticSe($dataSystem.sounds[n]);
        }
    }

    public static playSystemSound(n) {
        if ($dataSystem) {
            AudioManager.playStaticSe($dataSystem.sounds[n]);
        }
    }

    public static playCursor() {
        this.playSystemSound(0);
    }

    public static playOk() {
        this.playSystemSound(1);
    }

    public static playCancel() {
        this.playSystemSound(2);
    }

    public static playBuzzer() {
        this.playSystemSound(3);
    }

    public static playEquip() {
        this.playSystemSound(4);
    }

    public static playSave() {
        this.playSystemSound(5);
    }

    public static playLoad() {
        this.playSystemSound(6);
    }

    public static playBattleStart() {
        this.playSystemSound(7);
    }

    public static playEscape() {
        this.playSystemSound(8);
    }

    public static playEnemyAttack() {
        this.playSystemSound(9);
    }

    public static playEnemyDamage() {
        this.playSystemSound(10);
    }

    public static playEnemyCollapse() {
        this.playSystemSound(11);
    }

    public static playBossCollapse1() {
        this.playSystemSound(12);
    }

    public static playBossCollapse2() {
        this.playSystemSound(13);
    }

    public static playActorDamage() {
        this.playSystemSound(14);
    }

    public static playActorCollapse() {
        this.playSystemSound(15);
    }

    public static playRecovery() {
        this.playSystemSound(16);
    }

    public static playMiss() {
        this.playSystemSound(17);
    }

    public static playEvasion() {
        this.playSystemSound(18);
    }

    public static playMagicEvasion() {
        this.playSystemSound(19);
    }

    public static playReflection() {
        this.playSystemSound(20);
    }

    public static playShop() {
        this.playSystemSound(21);
    }

    public static playUseItem() {
        this.playSystemSound(22);
    }

    public static playUseSkill() {
        this.playSystemSound(23);
    }
}
