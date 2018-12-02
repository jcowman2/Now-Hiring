import { GameEventBuilder, on as _on } from "regal";
import { Action } from "./actions";
import { Abilities, Room } from "./agents";

export interface State {
    abilities: Abilities;
    currentRoom: Room;
    availableActions: Action[];
}

export const on: GameEventBuilder<State> = _on;

export const simpleCap = (str: string) => str[0].toUpperCase() + str.substr(1);
