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

const cmds = [
    "sacrifice vision",
    "examine cups",
    "examine counter",
    "examine cups",
    "look at the left cup",
    "examine right cup",
    "check middle cup"
];

let r = Game.postStartCommand();
writeOut(r);

while (cmds.length > 0) {
    const cmd = cmds.shift();
    console.log(`\n> ${cmd}\n`);
    r = Game.postPlayerCommand(r.instance, cmd);
    writeOut(r);
}
