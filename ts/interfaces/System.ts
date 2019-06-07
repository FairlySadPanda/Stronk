import Audio from "./Audio";

export default interface System {
    airship: Airship;
    armorTypes: string[];
    attackMotions: AttackMotion[];
    battleAudio: Audio;
    battleback1Name: string;
    battleback2Name: string;
    battlerHue: number;
    battlerName: string;
    boat: Airship;
    currencyUnit: string;
    defeatMe: Audio;
    editMapId: number;
    elements: string[];
    equipTypes: string[];
    gameTitle: string;
    gameoverMe: Audio;
    locale: string;
    magicSkills: number[];
    menuCommands: boolean[];
    optDisplayTp: boolean;
    optDrawTitle: boolean;
    optExtraExp: boolean;
    optFloorDeath: boolean;
    optFollowers: boolean;
    optSideView: boolean;
    optSlipDeath: boolean;
    optTransparent: boolean;
    partyMembers: number[];
    ship: Airship;
    skillTypes: string[];
    sounds: Audio[];
    startMapId: number;
    startX: number;
    startY: number;
    switches: string[];
    terms: Terms;
    testBattlers: TestBattler[];
    testTroopId: number;
    title1Name: string;
    title2Name: string;
    titleAudio: Audio;
    variables: string[];
    versionId: number;
    victoryMe: Audio;
    weaponTypes: string[];
    windowTone: number[];
}

interface TestBattler {
    actorId: number;
    equips: number[];
    level: number;
}

interface Terms {
    basic: string[];
    commands: string[];
    params: string[];
    messages: Messages;
}

interface Messages {
    actionFailure: string;
    actorDamage: string;
    actorDrain: string;
    actorGain: string;
    actorLoss: string;
    actorNoDamage: string;
    actorNoHit: string;
    actorRecovery: string;
    alwaysDash: string;
    AudioVolume: string;
    bgsVolume: string;
    buffAdd: string;
    buffRemove: string;
    commandRemember: string;
    counterAttack: string;
    criticalToActor: string;
    criticalToEnemy: string;
    debuffAdd: string;
    defeat: string;
    emerge: string;
    enemyDamage: string;
    enemyDrain: string;
    enemyGain: string;
    enemyLoss: string;
    enemyNoDamage: string;
    enemyNoHit: string;
    enemyRecovery: string;
    escapeFailure: string;
    escapeStart: string;
    evasion: string;
    expNext: string;
    expTotal: string;
    file: string;
    levelUp: string;
    loadMessage: string;
    magicEvasion: string;
    magicReflection: string;
    meVolume: string;
    obtainExp: string;
    obtainGold: string;
    obtainItem: string;
    obtainSkill: string;
    partyName: string;
    possession: string;
    preemptive: string;
    saveMessage: string;
    seVolume: string;
    substitute: string;
    surprise: string;
    useItem: string;
    victory: string;
}

interface AttackMotion {
    type: number;
    weaponImageId: number;
}

interface Airship {
    Audio: Audio;
    characterIndex: number;
    characterName: string;
    startMapId: number;
    startX: number;
    startY: number;
}
