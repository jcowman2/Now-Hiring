import { Game, onPlayerCommand, onStartCommand } from "regal";
import { command, init } from "./events";

Game.init({
    author: "Joe Cowman",
    name: "Ludum Dare 43",
    options: { debug: false }
});

onStartCommand(init);
onPlayerCommand(command);

export { Game };
