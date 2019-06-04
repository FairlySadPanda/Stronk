export default abstract class TextManager {
    public static basic(basicId: number) {
        return $dataSystem.terms.basic[basicId] || "";
    }

    public static param(paramId: number) {
        return $dataSystem.terms.params[paramId] || "";
    }

    public static command(commandId: number) {
        return $dataSystem.terms.commands[commandId] || "";
    }

    public static message(messageId: string) {
        return $dataSystem.terms.messages[messageId] || "";
    }

    public static get currencyUnit() {
        return $dataSystem.currencyUnit;
    }

    public static get level() {
        return this.basic(0);
    }

    public static get levelA() {
        return this.basic(1);
    }

    public static get hp() {
        return this.basic(2);
    }

    public static get hpA() {
        return this.basic(3);
    }

    public static get mp() {
        return this.basic(4);
    }

    public static get mpA() {
        return this.basic(5);
    }

    public static get tp() {
        return this.basic(6);
    }

    public static get tpA() {
        return this.basic(7);
    }

    public static get exp() {
        return this.basic(8);
    }

    public static get expA() {
        return this.basic(9);
    }

    public static get fight() {
        return this.command(0);
    }

    public static get escape() {
        return this.command(1);
    }

    public static get attack() {
        return this.command(2);
    }

    public static get guard() {
        return this.command(3);
    }

    public static get item() {
        return this.command(4);
    }

    public static get skill() {
        return this.command(5);
    }

    public static get equip() {
        return this.command(6);
    }

    public static get status() {
        return this.command(7);
    }

    public static get formation() {
        return this.command(8);
    }

    public static get save() {
        return this.command(9);
    }

    public static get gameEnd() {
        return this.command(10);
    }

    public static get options() {
        return this.command(11);
    }

    public static get weapon() {
        return this.command(12);
    }

    public static get armor() {
        return this.command(13);
    }

    public static get keyItem() {
        return this.command(14);
    }

    public static get equip2() {
        return this.command(15);
    }

    public static get optimize() {
        return this.command(16);
    }

    public static get clear() {
        return this.command(17);
    }

    public static get newGame() {
        return this.command(18);
    }

    public static get continue_() {
        return this.command(19);
    }

    public static get toTitle() {
        return this.command(21);
    }

    public static get cancel() {
        return this.command(22);
    }

    public static get buy() {
        return this.command(24);
    }

    public static get sell() {
        return this.command(25);
    }

    public static get alwaysDash() {
        return this.message("alwaysDash");
    }

    public static get commandRemember() {
        return this.message("commandRemember");
    }

    public static get bgmVolume() {
        return this.message("bgmVolume");
    }

    public static get bgsVolume() {
        return this.message("bgsVolume");
    }

    public static get meVolume() {
        return this.message("meVolume");
    }

    public static get seVolume() {
        return this.message("seVolume");
    }

    public static get possession() {
        return this.message("possession");
    }

    public static get expTotal() {
        return this.message("expTotal");
    }

    public static get expNext() {
        return this.message("expNext");
    }

    public static get saveMessage() {
        return this.message("saveMessage");
    }

    public static get loadMessage() {
        return this.message("loadMessage");
    }

    public static get file() {
        return this.message("file");
    }

    public static get partyName() {
        return this.message("partyName");
    }

    public static get emerge() {
        return this.message("emerge");
    }

    public static get preemptive() {
        return this.message("preemptive");
    }

    public static get surprise() {
        return this.message("surprise");
    }

    public static get escapeStart() {
        return this.message("escapeStart");
    }

    public static get escapeFailure() {
        return this.message("escapeFailure");
    }

    public static get victory() {
        return this.message("victory");
    }

    public static get defeat() {
        return this.message("defeat");
    }

    public static get obtainExp() {
        return this.message("obtainExp");
    }

    public static get obtainGold() {
        return this.message("obtainGold");
    }

    public static get obtainItem() {
        return this.message("obtainItem");
    }

    public static get levelUp() {
        return this.message("levelUp");
    }

    public static get obtainSkill() {
        return this.message("obtainSkill");
    }

    public static get useItem() {
        return this.message("useItem");
    }

    public static get criticalToEnemy() {
        return this.message("criticalToEnemy");
    }

    public static get criticalToActor() {
        return this.message("criticalToActor");
    }

    public static get actorDamage() {
        return this.message("actorDamage");
    }

    public static get actorRecovery() {
        return this.message("actoRrecovery");
    }

    public static get actorGain() {
        return this.message("actorGain");
    }

    public static get actorLoss() {
        return this.message("actorLoss");
    }

    public static get actorDrain() {
        return this.message("actorDrain");
    }

    public static get actorNoDamage() {
        return this.message("actorNoDamage");
    }

    public static get actorNoHit() {
        return this.message("actorNoHit");
    }

    public static get enemyDamage() {
        return this.message("enemyDamage");
    }

    public static get enemyRecovery() {
        return this.message("enemyRecovery");
    }

    public static get enemyGain() {
        return this.message("enemyGain");
    }

    public static get enemyLoss() {
        return this.message("enemyLoss");
    }

    public static get enemyDrain() {
        return this.message("enemyDrain");
    }

    public static get enemyNoDamage() {
        return this.message("enemyNoDamage");
    }

    public static get enemyNoHit() {
        return this.message("enemyNoHit");
    }

    public static get evasion() {
        return this.message("evasion");
    }

    public static get magicEvasion() {
        return this.message("magicEvasion");
    }

    public static get magicReflection() {
        return this.message("magicReflection");
    }

    public static get counterAttack() {
        return this.message("counterAttack");
    }

    public static get substitute() {
        return this.message("substitute");
    }

    public static get buffAdd() {
        return this.message("buffAdd");
    }

    public static get debuffAdd() {
        return this.message("debuffAdd");
    }

    public static get buffRemove() {
        return this.message("buffRemove");
    }

    public static get actionFailure() {
        return this.message("actionFailure");
    }
}
