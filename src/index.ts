import * as readline from "readline-sync";
import {
    Game,
    GameResponse,
    onPlayerCommand,
    onStartCommand,
    OutputLineType
} from "regal";
import { log } from "./common";
import { command, init } from "./events";

const writeOut = (response: GameResponse) => {
    if (!response.output.wasSuccessful) {
        log(response);
        return;
    }

    for (const line of response.instance.output.lines) {
        switch (line.type) {
            case OutputLineType.SECTION_TITLE:
                console.log(`\n>> ${line.data} <<\n`);
                break;
            case OutputLineType.MAJOR:
                console.log(`\n* ${line.data} *\n`);
                break;
            case OutputLineType.NORMAL:
                console.log(line.data);
                break;
            case OutputLineType.MINOR:
                console.log(`  ${line.data}`);
                break;
            case OutputLineType.DEBUG:
                console.log(`(${line.data})`);
                break;
        }
    }
};

Game.init({
    author: "Joe Cowman",
    name: "Ludum Dare 43",
    options: { debug: false }
});

onStartCommand(init);
onPlayerCommand(command);

let r = Game.postStartCommand();
writeOut(r);

const interact = true;
const commands = [
    "sacrifice vision",
    "pickup middle cup",
    "pour middle cup on lock",
    "put middle cup down",
    "look cups",
    "open drawer",
    "pickup nails",
    "put nails in cups",
    "look cups",
    "pickup right cup",
    "pour cup on lock",
    "look cups",
    "quit"
];

let cmd: string;

while (cmd !== "quit") {
    cmd = interact ? readline.question("\n> ") : commands.shift();
    r = Game.postPlayerCommand(r.instance, cmd);
    writeOut(r);
}
