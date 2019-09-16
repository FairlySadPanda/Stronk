import { Game_Actor, Game_Actor_OnLoad } from "./Game_Actor";

export interface Game_Actors_OnLoad {
    _data: Game_Actor_OnLoad[];
}

export class Game_Actors {
    private _data: Game_Actor[];
    public constructor(gameLoadInput?: Game_Actors_OnLoad) {
        this._data = [];

        if (gameLoadInput) {
            for (let i = 0; i < gameLoadInput._data.length; i++) {
                gameLoadInput._data[i]
                    ? this._data.push(
                          new Game_Actor(i, gameLoadInput._data[i] || undefined)
                      )
                    : this._data.push(null);
            }
        }
    }

    public actor(actorId) {
        if ($dataActors[actorId]) {
            if (!this._data[actorId]) {
                this._data[actorId] = new Game_Actor(actorId);
            }
            return this._data[actorId];
        }
        return null;
    }
}
