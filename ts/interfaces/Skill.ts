export interface Skill extends YanflyBaseParams {
    id: number;
    animationId: number;
    damage: Damage;
    description: string;
    effects: Effect[];
    hitType: number;
    iconIndex: number;
    message1: string;
    message2: string;
    mpCost: number;
    name: string;
    note: string;
    occasion: number;
    repeats: number;
    requiredWtypeId1: number;
    requiredWtypeId2: number;
    scope: number;
    speed: number;
    stypeId: number;
    successRate: number;
    tpCost: number;
    tpGain: number;
    params: any[];
}

interface Effect {
    code: number;
    dataId: number;
    value1: number;
    value2: number;
}

interface Damage {
    critical: boolean;
    elementId: number;
    formula: string;
    type: number;
    variance: number;
}
