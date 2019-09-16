import { Audio } from "./Audio";

export interface Map {
    autoplayBgm: boolean;
    autoplayBgs: boolean;
    battleback1Name: string;
    battleback2Name: string;
    bgm: Audio;
    bgs: Audio;
    disableDashing: boolean;
    displayName: string;
    encounterList: any[];
    encounterStep: number;
    height: number;
    note: string;
    parallaxLoopX: boolean;
    parallaxLoopY: boolean;
    parallaxName: string;
    parallaxShow: boolean;
    parallaxSx: number;
    parallaxSy: number;
    scrollType: number;
    specifyBattleback: boolean;
    tilesetId: number;
    width: number;
    data: number[];
    events: Event[];
}

interface Event {
    id: number;
    name: string;
    note: string;
    pages: Page[];
    x: number;
    y: number;
}

interface Page {
    conditions: Conditions;
    directionFix: boolean;
    image: Image;
    list: PageList[];
    moveFrequency: number;
    moveRoute: MoveRoute;
    moveSpeed: number;
    moveType: number;
    priorityType: number;
    stepAnime: boolean;
    through: boolean;
    trigger: number;
    walkAnime: boolean;
}

interface MoveRoute {
    list: MoveRouteList[];
    repeat: boolean;
    skippable: boolean;
    wait: boolean;
}

interface MoveRouteList {
    code: number;
    parameters: any[];
}

interface PageList {
    code: number;
    indent: number;
    parameters: string[];
}

interface Image {
    tileId: number;
    characterName: string;
    direction: number;
    pattern: number;
    characterIndex: number;
}

interface Conditions {
    actorId: number;
    actorValid: boolean;
    itemId: number;
    itemValid: boolean;
    selfSwitchCh: string;
    selfSwitchValid: boolean;
    switch1Id: number;
    switch1Valid: boolean;
    switch2Id: number;
    switch2Valid: boolean;
    variableId: number;
    variableValid: boolean;
    variableValue: number;
}
