import { Trait } from "./Trait";

export interface Armor extends YanflyBaseParams {
    id: number;
    atypeId: number;
    description: string;
    etypeid: number;
    traits: Trait[];
    iconIndex: number;
    name: string;
    note: string;
    params: number[];
    price: number;
}
