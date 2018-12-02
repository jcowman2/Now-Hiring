import { ExamineAction } from "./actions";
import { Room } from "./agents";
import { on, safeShuffle } from "./common";

interface Cup {
    name: string;
    color: string;
}

const milk: Cup = {
    name: "milk",
    color: "white"
};

const water: Cup = {
    name: "water",
    color: "clear"
};

const acid: Cup = {
    name: "acid",
    color: "clear"
};

export const threeCups = new Room(
    "Three Cups",
    on("DESCRIBE ROOM <Three Cups>", game => {
        game.output.writeNormal(
            "The room is small and sterile, with a waist-high counter in the center.",
            "On it are three unlabeled glass cups. They appear to be filled with liquid.",
            "The counter has a drawer underneath.",
            "On the opposite wall, there is a padlocked door."
        );
    }),
    on("BEGIN ROOM <Three Cups>", game => {
        const cups = safeShuffle([milk, water, acid], game);

        game.state.availableActions = [
            new ExamineAction(
                "counter",
                ["table"],
                on("EXAMINE <COUNTER>", _game => {
                    _game.output.writeNormal(
                        "The countertop is dark and matte.",
                        "It has three glass cups sitting on top of it, and a small drawer at waist height."
                    );
                })
            ),
            new ExamineAction(
                "cups",
                ["glasses"],
                on("EXAMINE <CUPS>", _game => {
                    _game.output.writeNormal(
                        "Three glass cups sit in a row on the countertop. Each is about halfway full of some liquid.",
                        `The left cup contains a ${cups[0].color} liquid.`,
                        `The middle cup contains a ${cups[1].color} liquid.`,
                        `The right cup contains a ${cups[2].color} liquid.`
                    );
                })
            ),
            new ExamineAction(
                "left cup",
                ["left glass"],
                on("EXAMINE <LEFT CUP>", _game => {
                    _game.output.writeNormal(
                        `The left cup is clear, probably made of glass. It's halfway full of some ${
                            cups[0].color
                        } liquid.`
                    );
                })
            ),
            new ExamineAction(
                "middle cup",
                ["middle glass"],
                on("EXAMINE <MIDDLE CUP>", _game => {
                    _game.output.writeNormal(
                        `The middle cup is clear, probably made of glass. It's halfway full of some ${
                            cups[1].color
                        } liquid.`
                    );
                })
            ),
            new ExamineAction(
                "right cup",
                ["right glass"],
                on("EXAMINE <RIGHT CUP>", _game => {
                    _game.output.writeNormal(
                        `The right cup is clear, probably made of glass. It's halfway full of some ${
                            cups[2].color
                        } liquid.`
                    );
                })
            )
        ];
    })
);
