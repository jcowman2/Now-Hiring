import * as readline from "readline-sync";
import { Game, GameResponse, OutputLineType } from "regal";
import { inspect } from "util";

const log = o => console.log(inspect(o, { depth: Infinity }));

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

import(".").then(() => {
    let r = Game.postStartCommand();
    writeOut(r);
    let cmd: string;

    while (cmd !== "quit") {
        cmd = interact ? readline.question("\n> ") : commands.shift();
        r = Game.postPlayerCommand(r.instance, cmd);
        writeOut(r);
    }
});
