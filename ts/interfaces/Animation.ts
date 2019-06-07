import Audio from "./Audio";

export default interface Animation {
    id: number;
    animation1Hue: number;
    animation1Name: string;
    animation2Hue: number;
    animation2Name: string;
    frames: number[][];
    name: string;
    position: number;
    timings: Timing[];
}

interface Timing {
    flashColor: number[];
    flashDuration: number;
    flashScope: number;
    frame: number;
    se: Audio;
}
