import { Game, GameResponse, onStartCommand, OutputLineType } from "regal";
import { inspect } from "util";
import { init } from "./events";

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

Game.init({
  author: "Joe Cowman",
  name: "Ludum Dare 43",
  options: {}
});

onStartCommand(init);

writeOut(Game.postStartCommand());
