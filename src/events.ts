import { Abilities, Room } from "./agents";
import { on, simpleCap } from "./common";
import { threeCups } from "./rooms";

export const summarizeAbilities = on("SUM_ABILITIES", game => {
    const a = game.state.abilities;

    const abs = [
        a.vision,
        a.hearing,
        a.smell,
        a.taste,
        a.touch,
        a.mobility,
        a.cognition
    ];

    game.output.writeMajor("Current status of your abilities:");

    for (const ability of abs) {
        game.output.writeNormal(
            `${simpleCap(ability.name)}: ${ability.currentValue}/${
                ability.maxValue
            }`
        );
    }
});

export const promptSacrifice = on("PROMPT SACRIFICE", game => {
    game.output.writeNormal(
        "\nBefore you can solve this puzzle, you must sacrifice one of your ability points.",
        "You may also reallocate your abilities, if you wish."
    );
    game.output.writeMinor('Enter "sacrifice ABILITY_NAME" or "reallocate".');
});

export const enterRoom = (room: Room) =>
    on(`ENTER ROOM <${room.name}>`, game => {
        game.state.currentRoom = room;
        game.output.writeTitle(`Now Entering Chamber: ${room.name}`);
        return room.describeEvent.then(promptSacrifice);
    });

export const init = on("INIT", game => {
    game.state.abilities = new Abilities();
    game.output.writeMajor("Startup successful!");
    return summarizeAbilities.then(enterRoom(game.using(threeCups)));
});
