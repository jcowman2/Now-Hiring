import {
    Agent,
    EventFunction,
    GameInstance,
    noop,
    RegalError,
    TrackedEvent
} from "regal";
import { abilityList } from "./agents";
import { on, simpleCap, State } from "./common";
import { promptSacrifice } from "./events";

interface MatchResult<T> {
    match: boolean;
    result?: T;
}

type MatchCheck<T, ActionType = Action> = (
    action: ActionType,
    command: string,
    game?: GameInstance<State>
) => MatchResult<T>;

const checkAliases = <T>(
    matchCheck: MatchCheck<T, string>
): MatchCheck<T, Action> => {
    return (action, command, game) => {
        let mr = matchCheck(action.name, command, game);

        if (mr.match) {
            return mr;
        }

        for (const alias of action.aliases) {
            mr = matchCheck(alias, command, game);
            if (mr.match) {
                return mr;
            }
        }

        return { match: false };
    };
};

const strMatch: MatchCheck<void, string> = (action, command, game) => {
    const cmdLower = command.toLocaleLowerCase();
    return {
        match: action.toLocaleLowerCase() === cmdLower
    };
};

const matchBeginning: MatchCheck<void, string> = (action, command, game) => {
    const cmdLower = command.toLocaleLowerCase();
    return {
        match: cmdLower.startsWith(action.toLocaleLowerCase())
    };
};

export const removeAction = (
    game: GameInstance<State>,
    actionName: string,
    allowFail: boolean = false
) => {
    const idx = game.state.availableActions.findIndex(
        a => a.name === actionName
    );

    if (idx === -1 && !allowFail) {
        throw new RegalError("Action doesn't exist.");
    }

    game.state.availableActions.splice(idx, 1);
};

export class Action<T = void> extends Agent {
    constructor(
        public name: string,
        public aliases: string[],
        public matchCheck: MatchCheck<T, Action>,
        public effect: (result: T) => TrackedEvent<State>
    ) {
        super();
    }
}

export class SimpleAction extends Action {
    constructor(
        actionName: string,
        actionAliases: string[],
        targetName: string,
        targetAliases: string[],
        effect: EventFunction<State>
    ) {
        const allNames = [targetName]
            .concat(targetAliases)
            .map(str => str.toLocaleLowerCase());

        super(
            `${actionName} '${targetName}'`,
            [actionName].concat(actionAliases),
            checkAliases((action, command, game) => {
                if (matchBeginning(action, command).match) {
                    const cmdLower = command.toLocaleLowerCase();

                    for (const name of allNames) {
                        if (cmdLower.includes(name)) {
                            return { match: true };
                        }
                    }
                }

                return { match: false };
            }),
            () =>
                on(
                    `${actionName.toLocaleUpperCase()} <${targetName.toLocaleUpperCase()}>`,
                    effect
                )
        );
    }
}

export class SubjectObjectAction extends Action {
    constructor(
        actionName: string,
        actionAliases: string[],
        subjectName: string,
        subjectAliases: string[],
        objectName: string,
        objectAliases: string[],
        requireHolding: boolean,
        effect: EventFunction<State>
    ) {
        const subjectNames = [subjectName]
            .concat(subjectAliases)
            .map(s => s.toLocaleLowerCase());
        const objectNames = [objectName]
            .concat(objectAliases)
            .map(s => s.toLocaleLowerCase());

        super(
            `${actionName} '${subjectName}' -> '${objectName}'`,
            [actionName].concat(actionAliases),
            checkAliases((action, command, game) => {
                if (matchBeginning(action, command).match) {
                    const cmdLower = command.toLocaleLowerCase();

                    for (const subject of subjectNames) {
                        const idx = cmdLower.indexOf(subject);

                        if (idx > -1) {
                            for (const object of objectNames) {
                                if (cmdLower.indexOf(object) > idx) {
                                    return { match: true };
                                }
                            }
                        }
                    }
                }
                return { match: false };
            }),
            () =>
                on(
                    `${actionName.toLocaleUpperCase()} <${subjectName.toLocaleUpperCase()}> -> <${objectName.toLocaleUpperCase()}>`,
                    game => {
                        if (
                            requireHolding &&
                            !subjectNames.includes(game.state.holding)
                        ) {
                            game.output.writeNormal(
                                `You have to be holding '${subjectName}' before you can do that.`
                            );
                        }

                        return on("ef", effect);
                    }
                )
        );
    }
}

export class ExamineAction extends SimpleAction {
    constructor(
        targetName: string,
        targetAliases: string[],
        effect: EventFunction<State>
    ) {
        super(
            "examine",
            ["look", "check", "observe"],
            targetName,
            targetAliases,
            effect
        );
    }
}

export class OpenAction extends SimpleAction {
    constructor(
        targetName: string,
        targetAliases: string[],
        effect: EventFunction<State>
    ) {
        super("open", ["pull"], targetName, targetAliases, effect);
    }
}

export class PickupAction extends SimpleAction {
    constructor(
        targetName: string,
        targetAliases: string[],
        effect: EventFunction<State>
    ) {
        const targetNames = [targetName].concat(targetAliases);
        super(
            "pickup",
            ["take", "grab", "pick up", "lift", "hold"],
            targetName,
            targetAliases,
            game => {
                if (game.state.holding !== undefined) {
                    if (targetNames.includes(game.state.holding)) {
                        game.output.writeNormal("You're already holding that!");
                    } else {
                        game.output.writeNormal(
                            `You can't pick that up until you set the ${
                                game.state.holding
                            } down.`
                        );
                    }

                    return noop;
                } else {
                    return on(
                        `PICKUP EFFECT <${targetName.toLocaleUpperCase()}>`,
                        effect
                    );
                }
            }
        );
    }
}

export const sacrificeAbilityAction = new Action<string>(
    "sacrifice",
    [],
    checkAliases((action, command, game) => {
        if (!matchBeginning(action, command).match) {
            return { match: false };
        }

        const arr = command.split(" ");
        if (arr.length !== 2) {
            game.output.writeMajor(
                "Illegal use of 'sacrifice' command. Usage: 'sacrifice <ABILITY_NAME>'"
            );
            return { match: false };
        }

        return {
            match: true,
            result: arr[1].toLocaleLowerCase()
        };
    }),
    ability =>
        on("SACRIFICE ABILITY", game => {
            for (const ab of abilityList(game.state.abilities)) {
                if (ability === ab.name) {
                    if (ab.currentValue > 0) {
                        game.output.writeNormal(
                            `${simpleCap(ab.name)} decreased from ${
                                ab.currentValue
                            } to ${--ab.currentValue}.`
                        );
                        removeAction(game, "sacrifice");
                        return game.state.currentRoom.onBegin;
                    } else {
                        game.output.writeNormal(
                            "That ability is already depleted. It can't go any lower!"
                        );
                        return promptSacrifice;
                    }
                }
            }
            game.output.writeNormal(`The ability '${ability}' does not exist!`);
            return promptSacrifice;
        })
);

export class PutAction extends SubjectObjectAction {
    constructor(
        targetName: string,
        targetAliases: string[],
        objectName: string,
        objectAliases: string[],
        effect: EventFunction<State>
    ) {
        super(
            "put",
            ["drop", "place", "set"],
            targetName,
            targetAliases,
            objectName,
            objectAliases,
            true,
            effect
        );
    }
}
