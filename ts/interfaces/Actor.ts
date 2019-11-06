import { Trait } from "./Trait";

export interface Actor extends YanflyBaseParams {
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
    battlerName: string;
    characterIndex: 0;
    characterName: string;
    classId: number;
    equips: number[];
    faceIndex: 0;
    faceName: string;
    traits: Trait[];
    initialLevel: number;
    maxLevel: number;
    name: string;
    nickname: string;
    note: string;
    profile: string;
}
