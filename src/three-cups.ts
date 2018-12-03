import { Agent, Game } from "regal";
import { Action, ExamineAction, OpenAction } from "./actions";
import { Room } from "./agents";
import { on, safeShuffle } from "./common";

class Cup extends Agent {
    constructor(public name: string, public color: string) {
        super();
    }
}

const milk = new Cup("milk", "white");
const water = new Cup("water", "clear");
const acid = new Cup("acid", "clear");

const describeFunc = on("DESCRIBE ROOM <Three Cups>", game => {
    game.output.writeNormal(
        "The room is small and sterile, with a waist-high counter in the center.",
        "On it are three unlabeled glass cups. They appear to be filled with liquid.",
        "The counter has a drawer underneath.",
        "On the opposite wall, there is a padlocked door."
    );
});

const nailActions = () => [
    new ExamineAction("nails", ["nail"], game => {
        game.output.writeNormal(
            "Each nail is a dull metal, with slight discolorations of rust."
        );
    })
];

const cookieActions = () => [
    new ExamineAction("cookie", [], game => {
        game.output.writeNormal("Seems like chocolate chip.");
    })
];

const openDrawer = (room: ThreeCups) =>
    new OpenAction("drawer", ["knob"], game => {
        let contentStr: string;
        const newActions: Action[] = [];

        if (!room.cookieInDrawer && room.nailsInDrawer === 0) {
            contentStr = "There's nothing left inside.";
        } else {
            if (room.nailsInDrawer > 0) {
                newActions.push(...nailActions());

                if (room.nailsInDrawer > 1) {
                    contentStr = `There are ${room.nailsInDrawer} nails`;
                } else {
                    contentStr = "There is one nail";
                }

                if (room.cookieInDrawer) {
                    newActions.push(...cookieActions());
                    contentStr += " and a cookie inside.";
                } else {
                    contentStr += " inside.";
                }
            } else {
                newActions.push(...cookieActions());
                contentStr = "There is a cookie inside.";
            }
        }

        game.output.writeNormal(`You open the drawer. ${contentStr}`);

        const actions = game.state.availableActions;
        actions.splice(actions.findIndex(aa => aa.name === "open 'drawer'"), 1);
        actions.push(...newActions);
        actions.push(
            new OpenAction("drawer", ["knob"], _game => {
                _game.output.writeNormal("The drawer is already open.");
            })
        );
    });

const beginFunc = (_room: ThreeCups) =>
    on("BEGIN ROOM <Three Cups>", game => {
        const room = game.using(_room);
        const cups = safeShuffle(game.using([milk, water, acid]), game);
        room.cups = cups;

        game.state.availableActions = [
            new ExamineAction("counter", ["table"], _game => {
                _game.output.writeNormal(
                    "The countertop is dark and matte.",
                    "It has three glass cups sitting on top of it, and a small drawer at waist height."
                );
            }),
            new ExamineAction("cups", ["glasses"], _game => {
                _game.output.writeNormal(
                    "Three glass cups sit in a row on the countertop. Each is about halfway full of some liquid.",
                    `The left cup contains a ${cups[0].color} liquid.`,
                    `The middle cup contains a ${cups[1].color} liquid.`,
                    `The right cup contains a ${cups[2].color} liquid.`
                );
            }),
            new ExamineAction("left cup", ["left glass"], _game => {
                _game.output.writeNormal(
                    `The left cup is clear, probably made of glass. It's halfway full of some ${
                        cups[0].color
                    } liquid.`
                );
            }),
            new ExamineAction("middle cup", ["middle glass"], _game => {
                _game.output.writeNormal(
                    `The middle cup is clear, probably made of glass. It's halfway full of some ${
                        cups[1].color
                    } liquid.`
                );
            }),
            new ExamineAction("right cup", ["right glass"], _game => {
                _game.output.writeNormal(
                    `The right cup is clear, probably made of glass. It's halfway full of some ${
                        cups[2].color
                    } liquid.`
                );
            }),
            new ExamineAction("drawer", [], _game => {
                _game.output.writeNormal(
                    "There's a small drawer in the front of the counter. It has a wooden knob."
                );
            }),
            new ExamineAction("door", [], _game => {
                _game.output.writeNormal(
                    "The door at the back of the room looks heavy.",
                    "It's a shiny silver, likely stainless steel.",
                    "A large padlock holds the door shut."
                );
            }),
            new ExamineAction("padlock", ["lock"], _game => {
                _game.output.writeNormal(
                    "The padlock is about the size of your fist.",
                    "It's metal, but it looks much older than the door."
                );
            }),
            openDrawer(room)
        ];

        game.output.writeNormal("You may begin.");
    });

export class ThreeCups extends Room {
    public cups: Cup[];
    public drawerIsOpen = false;
    public nailsInDrawer = 3;
    public cookieInDrawer = true;

    constructor() {
        super("Three Cups", describeFunc, beginFunc);
    }
}
