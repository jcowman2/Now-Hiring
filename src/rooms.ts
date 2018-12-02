import { Room } from "./agents";
import { on } from "./common";

export const threeCups = new Room(
    "Three Cups",
    [],
    on("DESCRIBE ROOM <Three Cups>", game => {
        game.output.writeNormal(
            "The room is small and sterile, with a waist-high counter in the center.",
            "On it are three unlabeled glass beakers. They appear to be filled with liquid.",
            "The counter has a drawer underneath.",
            "On the opposite wall, there is a padlocked door."
        );
    })
);
