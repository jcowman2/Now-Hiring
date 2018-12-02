import { Abilities } from "./agents";
import { on } from "./common";

export const init = on("INIT", game => {
  game.state.abilities = new Abilities();
  game.output.writeMajor("Startup successful!");
});
