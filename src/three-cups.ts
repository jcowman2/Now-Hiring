import { Agent, Game } from "regal";
import {
    Action,
    ExamineAction,
    OpenAction,
    PickupAction,
    PutAction,
    removeAction
} from "./actions";
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

const nailActions = (room: ThreeCups) => [
    new ExamineAction("nails", ["nail"], game => {
        game.output.writeNormal(
            "Each nail is a dull metal, with slight discolorations of rust."
        );
    }),
    new PickupAction("nails", ["3 nails", "2 nails"], game => {
        if (room.nailsInDrawer === 1) {
            game.output.writeNormal("You pick up the nail.");
            game.state.holding = "nail";
        } else {
            game.output.writeNormal("You pick up the nails.");
            game.state.holding = `${room.nailsInDrawer} nails`;

            game.state.availableActions.push(
                new PutAction(
                    "nails",
                    ["3 nails", "2 nails"],
                    "down",
                    ["back"],
                    _game => {
                        _game.output.writeNormal(
                            "You put the nails back in the drawer."
                        );

                        room.nailsInDrawer = Number.parseInt(
                            _game.state.holding.split(" ")[0],
                            10
                        ); // yikes

                        _game.state.holding = undefined;
                        removeAction(_game, "put 'nails' -> 'down'");
                    }
                )
            );
        }
        room.nailsInDrawer = 0;

        // removeAction(game, "pickup 'nails'");
        // game.state.availableActions.push(
        //     new PickupAction("nails", [], _game =>
        //         _game.output.writeNormal("You're already holding that.")
        //     )
        // );
    })
];

const cookieActions = (room: ThreeCups) => [
    new ExamineAction("cookie", [], game => {
        game.output.writeNormal("Seems like chocolate chip.");
    }),
    new PickupAction("cookie", [], game => {
        game.output.writeNormal("You pick up the cookie.");
        room.cookieInDrawer = false;
    })
];

const describeDrawer = (room: ThreeCups) => {
    let contentStr: string;

    if (!room.cookieInDrawer && room.nailsInDrawer === 0) {
        contentStr = "There's nothing left inside.";
    } else {
        if (room.nailsInDrawer > 0) {
            if (room.nailsInDrawer > 1) {
                contentStr = `There are ${room.nailsInDrawer} nails`;
            } else {
                contentStr = "There is one nail";
            }

            if (room.cookieInDrawer) {
                contentStr += " and a cookie inside.";
            } else {
                contentStr += " inside.";
            }
        } else {
            contentStr = "There is a cookie inside.";
        }
    }

    return contentStr;
};

const openDrawer = (room: ThreeCups) =>
    new OpenAction("drawer", ["knob"], game => {
        room.drawerIsOpen = true;

        const newActions = nailActions(room).concat(cookieActions(room));

        game.output.writeNormal(`You open the drawer.`);
        game.output.writeNormal(describeDrawer(room));

        const actions = game.state.availableActions;
        removeAction(game, "open 'drawer'");
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

        game.state.availableActions.push(
            ...[
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
                new ExamineAction(
                    "left cup",
                    ["left glass", "first cup", "first glass"],
                    _game => {
                        _game.output.writeNormal(
                            `The left cup is clear, probably made of glass. It's halfway full of some ${
                                cups[0].color
                            } liquid.`
                        );
                    }
                ),
                new ExamineAction(
                    "middle cup",
                    ["middle glass", "second cup", "second glass"],
                    _game => {
                        _game.output.writeNormal(
                            `The middle cup is clear, probably made of glass. It's halfway full of some ${
                                cups[1].color
                            } liquid.`
                        );
                    }
                ),
                new ExamineAction(
                    "right cup",
                    ["right glass", "third cup", "third glass"],
                    _game => {
                        _game.output.writeNormal(
                            `The right cup is clear, probably made of glass. It's halfway full of some ${
                                cups[2].color
                            } liquid.`
                        );
                    }
                ),
                new ExamineAction("cup", ["glass"], _game =>
                    _game.output.writeNormal("Which cup?")
                ),
                new ExamineAction("drawer", [], _game => {
                    if (room.drawerIsOpen) {
                        const drawerStr = describeDrawer(room);
                        _game.output.writeNormal(
                            `There drawer is open. ${drawerStr}`
                        );
                    } else {
                        _game.output.writeNormal(
                            "There's a small drawer in the front of the counter. It has a wooden knob."
                        );
                    }
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
            ]
        );

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
