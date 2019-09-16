export interface CommonEvent {
    id: number;
    list: CommonEventList[];
    name: string;
    switchId: number;
    trigger: number;
}

interface CommonEventList {
    code: number;
    indent: number;
    parameters: any[];
}
