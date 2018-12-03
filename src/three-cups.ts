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
    public hasNail = false;

    constructor(
        public name: string,
        public color: string,
        public nailReaction: string,
        public afterNail: string
    ) {
        super();
    }
}

const milk = new Cup(
    "milk",
    "white",
    "The nail is enveloped by the white liquid.",
    "You can't see the nail."
);
const water = new Cup(
    "water",
    "clear",
    "The nails sinks to the bottom quickly.",
    "The nail is sitting at the bottom."
);
const acid = new Cup(
    "acid",
    "clear",
    "The liquid begins to bubble violently.",
    "It's still fizzing. The nail appears to be dissolving."
);

const cupMoreDesc = (cup: Cup) => (cup.hasNail ? " " + cup.afterNail : "");

const cupActions = (cup: Cup, dir: string, num: string) => [
    new ExamineAction(
        `${dir} cup`,
        [`${dir} glass`, `${num} cup`, `${num} glass`],
        _game => {
            _game.output.writeNormal(
                `The ${dir} cup is clear, probably made of glass. It's halfway full of some ${
                    cup.color
                } liquid.${cupMoreDesc(cup)}`
            );
        }
    ),
    new PickupAction(
        `${dir} cup`,
        [`${dir} glass`, `${num} cup`, `${num} glass`],
        _game => {
            _game.output.writeNormal(`You pick up the ${dir} cup.`);
            _game.state.holding = `${dir} cup`;
        }
    )
];

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
                ...[
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
                            removeAction(_game, "put 'nails' -> 'cups'");
                        }
                    ),
                    new PutAction(
                        "nails",
                        ["3 nails", "2 nails"],
                        "cups",
                        ["glasses", "each cup", "each glass"],
                        _game => {
                            _game.output.writeNormal(
                                `You drop a nail in the left cup. ${
                                    room.cups[0].nailReaction
                                }`
                            );
                            _game.output.writeNormal(
                                `You drop a nail in the middle cup. ${
                                    room.cups[1].nailReaction
                                }`
                            );
                            _game.output.writeNormal(
                                `You drop a nail in the right cup. ${
                                    room.cups[2].nailReaction
                                }`
                            );

                            room.cups.forEach(cup => (cup.hasNail = true));

                            room.nailsInDrawer = Number.parseInt(
                                _game.state.holding.split(" ")[0],
                                10
                            ); // yikes

                            _game.state.holding = undefined;
                            removeAction(_game, "put 'nails' -> 'down'");
                            removeAction(_game, "put 'nails' -> 'cups'");
                            removeAction(_game, "pickup 'nails'");
                        }
                    )
                ]
            );
        }
        room.nailsInDrawer = 0;
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
                        `The left cup contains a ${
                            cups[0].color
                        } liquid.${cupMoreDesc(cups[0])}`,
                        `The middle cup contains a ${
                            cups[1].color
                        } liquid.${cupMoreDesc(cups[1])}`,
                        `The right cup contains a ${
                            cups[2].color
                        } liquid.${cupMoreDesc(cups[2])}`
                    );
                }),
                ...cupActions(cups[0], "left", "first"),
                ...cupActions(cups[1], "middle", "second"),
                ...cupActions(cups[2], "right", "third"),
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
