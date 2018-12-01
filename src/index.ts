import { Game } from "regal";
import * as util from "util";

Game.init({
  name: "Ludum Dare 43",
  options: {}
});

util.log(Game.getMetadataCommand());
