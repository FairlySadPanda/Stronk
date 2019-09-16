import { Trait } from "./Trait";

export interface Actor {
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
