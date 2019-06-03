export interface Game_Unit_OnLoad {
    _inBattle: boolean;
}

export default class Game_Unit {
    private _inBattle: boolean;

    public constructor(gameLoadInput?: Game_Unit_OnLoad) {
        this._inBattle = false;

        if (gameLoadInput) {
            this._inBattle = gameLoadInput._inBattle;
        }
    }

    public inBattle() {
        return this._inBattle;
    }

    public members() {
        return [];
    }

    public aliveMembers() {
        return this.members().filter(function (member) {
            return member.isAlive();
        });
    }

    public deadMembers() {
        return this.members().filter(function (member) {
            return member.isDead();
        });
    }

    public movableMembers() {
        return this.members().filter(function (member) {
            return member.canMove();
        });
    }

    public clearActions() {
        return this.members().forEach(function (member) {
            return member.clearActions();
        });
    }

    public agility() {
        const members = this.members();
        if (members.length === 0) {
            return 1;
        }
        const sum = members.reduce(function (r, member) {
            return r + member.agi;
        }, 0);
        return sum / members.length;
    }

    public tgrSum() {
        return this.aliveMembers().reduce(function (r, member) {
            return r + member.tgr;
        }, 0);
    }

    public randomTarget() {
        let tgrRand = Math.random() * this.tgrSum();
        let target = null;
        this.aliveMembers().forEach(function (member) {
            tgrRand -= member.tgr;
            if (tgrRand <= 0 && !target) {
                target = member;
            }
        });
        return target;
    }

    public randomDeadTarget() {
        const members = this.deadMembers();
        if (members.length === 0) {
            return null;
        }
        return members[Math.floor(Math.random() * members.length)];
    }

    public smoothTarget(index) {
        if (index < 0) {
            index = 0;
        }
        const member = this.members()[index];
        return (member && member.isAlive()) ? member : this.aliveMembers()[0];
    }

    public smoothDeadTarget(index) {
        if (index < 0) {
            index = 0;
        }
        const member = this.members()[index];
        return (member && member.isDead()) ? member : this.deadMembers()[0];
    }

    public clearResults() {
        this.members().forEach(function (member) {
            member.clearResult();
        });
    }

    public onBattleStart() {
        this.members().forEach(function (member) {
            member.onBattleStart();
        });
        this._inBattle = true;
    }

    public onBattleEnd() {
        this._inBattle = false;
        this.members().forEach(function (member) {
            member.onBattleEnd();
        });
    }

    public makeActions() {
        this.members().forEach(function (member) {
            member.makeActions();
        });
    }

    public select(activeMember) {
        this.members().forEach(function (member) {
            if (member === activeMember) {
                member.select();
            } else {
                member.deselect();
            }
        });
    }

    public isAllDead() {
        return this.aliveMembers().length === 0;
    }

    public substituteBattler() {
        const members = this.members();
        for (let i = 0; i < members.length; i++) {
            if (members[i].isSubstitute()) {
                return members[i];
            }
        }
    }

}
