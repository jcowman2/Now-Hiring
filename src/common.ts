import { GameEventBuilder, on as _on } from "regal";
import { inspect } from "util";
import { Action } from "./actions";
import { Abilities, Room } from "./agents";

export const log = o => console.log(inspect(o, { depth: Infinity }));

export interface State {
    abilities: Abilities;
    currentRoom: Room;
    availableActions: Array<Action<any>>;
}

export const on: GameEventBuilder<State> = _on;

export const simpleCap = (str: string) => str[0].toUpperCase() + str.substr(1);
