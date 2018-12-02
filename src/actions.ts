import { Agent, GameInstance, noop, RegalError, TrackedEvent } from "regal";
import { abilityList } from "./agents";
import { log, on, simpleCap, State } from "./common";
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

export class Action<T = void> extends Agent {
    constructor(
        public name: string,
        public aliases: string[],
        public matchCheck: MatchCheck<T, Action>,
        public effect: (result: T) => TrackedEvent
    ) {
        super();
    }
}

export class ExamineAction extends Action {
    constructor(
        targetName: string,
        targetAliases: string[],
        effect: TrackedEvent
    ) {
        const allNames = [targetName]
            .concat(targetAliases)
            .map(str => str.toLocaleLowerCase());

        super(
            `examine '${targetName}'`,
            ["examine", "look", "check"],
            checkAliases((action, command, game) => {
                if (matchBeginning(action, command).match) {
                    const cmdLower = command.toLocaleLowerCase();
                    // const arr = cmdLower.split(" ");

                    for (const name of allNames) {
                        if (cmdLower.includes(name)) {
                            return { match: true };
                        }
                    }
                }

                return { match: false };
            }),
            () => effect
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
