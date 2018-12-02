import { noop } from "regal";
import { sacrificeAbilityAction } from "./actions";
import { Abilities, abilityList, Room } from "./agents";
import { log, on, simpleCap } from "./common";
import { ThreeCups } from "./three-cups";

export const summarizeAbilities = on("SUM_ABILITIES", game => {
    game.output.writeMajor("Current status of your abilities:");

    for (const ability of abilityList(game.state.abilities)) {
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
    game.output.writeMinor("Enter 'sacrifice <ABILITY_NAME>' or 'reallocate'.");

    game.state.availableActions = [sacrificeAbilityAction];
});

export const enterRoom = (room: Room) =>
    on(`ENTER ROOM <${room.name}>`, game => {
        game.state.currentRoom = room;
        game.output.writeTitle(`Now Entering Chamber: ${room.name}`);
        return room.onDescribe.then(promptSacrifice);
    });

export const init = on("INIT", game => {
    game.state.abilities = new Abilities();
    game.state.availableActions = [];

    game.output.writeMajor("Startup successful!");
    return summarizeAbilities.then(enterRoom(game.using(new ThreeCups())));
});

export const command = (cmd: string) =>
    on("COMMAND", game => {
        game.output.writeDebug(
            `Available actions: ${game.state.availableActions
                .map(aa => aa.name)
                .join(", ")}`
        );

        for (const action of game.state.availableActions) {
            const rm = action.matchCheck(action, cmd, game);
            if (rm.match) {
                game.output.writeDebug(`Match: ${action.name}`);
                return action.effect(rm.result);
            }
        }
        game.output.writeNormal("Sorry, I didn't understand that.");
        return noop;
    });
