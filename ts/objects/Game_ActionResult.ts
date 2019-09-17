export interface Game_ActionResult_OnLoad {
    used: boolean;
    missed: boolean;
    evaded: boolean;
    physical: boolean;
    drain: boolean;
    critical: boolean;
    success: boolean;
    hpAffected: boolean;
    hpDamage: number;
    mpDamage: number;
    tpDamage: number;
    addedStates: any[];
    removedStates: any[];
    addedBuffs: any[];
    addedDebuffs: any[];
    removedBuffs: any[];
}

export class Game_ActionResult {
    public used: boolean;
    public missed: boolean;
    public evaded: boolean;
    public physical: boolean;
    public drain: boolean;
    public critical: boolean;
    public success: boolean;
    public hpAffected: boolean;
    public hpDamage: number;
    public mpDamage: number;
    public tpDamage: number;
    public addedStates: any[];
    public removedStates: any[];
    public addedBuffs: any[];
    public addedDebuffs: any[];
    public removedBuffs: any[];

    public constructor(gameLoadInput?: Game_ActionResult_OnLoad) {
        this.clear();

        if (gameLoadInput) {
            this.used = gameLoadInput.used;
            this.missed = gameLoadInput.missed;
            this.evaded = gameLoadInput.evaded;
            this.physical = gameLoadInput.physical;
            this.drain = gameLoadInput.drain;
            this.critical = gameLoadInput.critical;
            this.success = gameLoadInput.success;
            this.hpAffected = gameLoadInput.hpAffected;
            this.hpDamage = gameLoadInput.hpDamage;
            this.mpDamage = gameLoadInput.mpDamage;
            this.tpDamage = gameLoadInput.tpDamage;
            this.addedStates = gameLoadInput.addedStates;
            this.removedStates = gameLoadInput.removedStates;
            this.addedBuffs = gameLoadInput.addedBuffs;
            this.addedDebuffs = gameLoadInput.addedDebuffs;
            this.removedBuffs = gameLoadInput.removedBuffs;
        }
    }

    public clear() {
        this.used = false;
        this.missed = false;
        this.evaded = false;
        this.physical = false;
        this.drain = false;
        this.critical = false;
        this.success = false;
        this.hpAffected = false;
        this.hpDamage = 0;
        this.mpDamage = 0;
        this.tpDamage = 0;
        this.addedStates = [];
        this.removedStates = [];
        this.addedBuffs = [];
        this.addedDebuffs = [];
        this.removedBuffs = [];
    }

    public addedStateObjects() {
        return this.addedStates.map(function(id) {
            return $dataStates[id];
        });
    }

    public removedStateObjects() {
        return this.removedStates.map(function(id) {
            return $dataStates[id];
        });
    }

    public isStatusAffected() {
        return (
            this.addedStates.length > 0 ||
            this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 ||
            this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0
        );
    }

    public isHit() {
        return this.used && !this.missed && !this.evaded;
    }

    public isStateAdded(stateId) {
        return this.addedStates.indexOf(stateId) > -1;
    }

    public pushAddedState(stateId) {
        if (!this.isStateAdded(stateId)) {
            this.addedStates.push(stateId);
        }
    }

    public isStateRemoved(stateId) {
        return this.removedStates.indexOf(stateId) > -1;
    }

    public pushRemovedState(stateId) {
        if (!this.isStateRemoved(stateId)) {
            this.removedStates.push(stateId);
        }
    }

    public isBuffAdded(paramId) {
        return this.addedBuffs.indexOf(paramId) > -1;
    }

    public pushAddedBuff(paramId) {
        if (!this.isBuffAdded(paramId)) {
            this.addedBuffs.push(paramId);
        }
    }

    public isDebuffAdded(paramId) {
        return this.addedDebuffs.indexOf(paramId) > -1;
    }

    public pushAddedDebuff(paramId) {
        if (!this.isDebuffAdded(paramId)) {
            this.addedDebuffs.push(paramId);
        }
    }

    public isBuffRemoved(paramId) {
        return this.removedBuffs.indexOf(paramId) > -1;
    }

    public pushRemovedBuff(paramId) {
        if (!this.isBuffRemoved(paramId)) {
            this.removedBuffs.push(paramId);
        }
    }
}
