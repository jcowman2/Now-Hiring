import { Agent, GameInstance, TrackedEvent } from "regal";
import { on, State } from "./common";

const simpleMatch = (
    action: Action,
    command: string,
    game: GameInstance<State>
) => {
    const cmdLower = command.toLocaleLowerCase();

    const checkMatch = (alias: string) =>
        alias.toLocaleLowerCase() === cmdLower;

    if (checkMatch(action.name)) {
        return true;
    }

    for (const alias of action.aliases) {
        if (checkMatch(alias)) {
            return true;
        }
    }

    return false;
};

const matchBeginning = (
    action: Action,
    command: string,
    game: GameInstance<State>
) => {
    const cmdLower = command.toLocaleLowerCase();

    const checkMatch = (alias: string) =>
        cmdLower.startsWith(alias.toLocaleLowerCase());

    if (checkMatch(action.name)) {
        return true;
    }

    for (const alias of action.aliases) {
        if (checkMatch(alias)) {
            return true;
        }
    }

    return false;
};

export class Action extends Agent {
    constructor(
        public name: string,
        public effect: TrackedEvent,
        public aliases: string[] = [],
        public isMatch = simpleMatch
    ) {
        super();
    }
}

export class ExamineAction extends Action {
    constructor(effect: TrackedEvent) {
        super("examine", effect, ["look"]);
    }
}

export const sacrificeAbilityAction = new Action(
    "sacrifice",
    on("SACRIFICE ABILITY", game => {
        const arr = // TODO
    }),
    [],
    matchBeginning
);
