import { Trait } from "./Trait";

export interface Enemy extends YanflyBaseParams {
    attackAnimationId: any;
    reflectAnimationId: number;
    spriteCannotMove: any;
    id: number;
    actions: EnemyAction[];
    battlerHue: number;
    battlerName: string;
    dropItems: DropItem[];
    exp: number;
    traits: Trait[];
    gold: number;
    name: string;
    note: string;
    params: number[];
}

interface EnemyAction {
    conditionParam1: number;
    conditionParam2: number;
    conditionType: number;
    rating: number;
    skillId: number;
}

interface DropItem {
    dataId: number;
    denominator: number;
    kind: number;
}
