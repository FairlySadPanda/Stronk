import { Trait } from "./Trait";

export interface Class extends YanflyBaseParams {
    reflectAnimationId: number;
    spriteCannotMove: any;
    anchorX: any;
    anchorY: any;
    plusParams: any;
    rateParams: any;
    flatParams: any;
    maxParams: any;
    minParams: any;
    id: number;
    expParams: number[];
    traits: Trait[];
    learnings: Learning[];
    note: string;
    name: string;
    params: number[][];
}

interface Learning {
    level: number;
    note: string;
    skillId: number;
}
