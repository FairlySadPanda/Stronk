export interface Troop {
    id: number;
    members: Member[];
    name: string;
    pages: Page[];
}

interface Page {
    conditions: Conditions;
    list: List[];
    span: number;
}

interface List {
    code: number;
    indent: number;
    parameters: any[];
}

interface Conditions {
    actorHp: number;
    actorId: number;
    actorValid: boolean;
    enemyHp: number;
    enemyIndex: number;
    enemyValid: boolean;
    switchId: number;
    switchValid: boolean;
    turnA: number;
    turnB: number;
    turnEnding: boolean;
    turnValid: boolean;
}

interface Member {
    enemyId: number;
    x: number;
    y: number;
    hidden: boolean;
}
