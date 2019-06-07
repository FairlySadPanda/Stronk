import Trait from "./Trait";

export default interface Class {
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
