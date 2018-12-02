import { Agent, TrackedEvent } from "regal";
import { State } from "./common";

export class Ability extends Agent {
    constructor(
        public name: string,
        public currentValue: number,
        public maxValue: number
    ) {
        super();
    }
}

export class Abilities extends Agent {
    public vision = new Ability("vision", 3, 4);
    public hearing = new Ability("hearing", 2, 3);
    public smell = new Ability("smell", 1, 2);
    public taste = new Ability("taste", 1, 2);
    public touch = new Ability("touch", 2, 3);
    public mobility = new Ability("mobility", 3, 4);
    public cognition = new Ability("cognition", 3, 4);
}

export const abilityList = (ab: Abilities) => [
    ab.vision,
    ab.hearing,
    ab.smell,
    ab.taste,
    ab.touch,
    ab.mobility,
    ab.cognition
];

export class Item extends Agent {
    constructor(public name: string) {
        super();
    }
}

export class Room extends Agent {
    constructor(
        public name: string,
        public roomItems: Item[],
        public describeEvent: TrackedEvent<State>
    ) {
        super();
    }
}
