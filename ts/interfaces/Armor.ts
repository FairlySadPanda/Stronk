import Trait from "./Trait";

export default interface Armor {
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
