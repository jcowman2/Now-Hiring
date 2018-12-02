import { GameEventBuilder, on as _on } from "regal";
import { Abilities } from "./agents";

export interface State {
  abilities: Abilities;
}

export const on: GameEventBuilder<State> = _on;
