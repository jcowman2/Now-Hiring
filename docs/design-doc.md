# Ludum Dare 43 Game (Name TBD) Design Document
**This document will have spoilers! Don't read it until after you're done playing the game.**

Ludum Dare 43 Theme: *Sacrifices Must be Made*

Updated for `v1.0.0`.

## Concept

Set in a dystopian near-future, a nefarious tech company preys on the poor by selling the rights to their senses and cognitive abilities. Those who wish to sell their abilities must participate in a mind-bending series of puzzles to prove their aptitude.

## Gameplay

The game consists of the player advancing through several puzzles to get to an end goal. Each puzzle is separate from one another, and have one or more objects with which the player may interact.

As this game is built as a proof-of-concept for the [Regal Framework](https://github.com/regal/regal), it is entirely text-based. Therefore, the player interacts with objects by typing commands into a terminal-like interface.

For example, the an interaction could look like this:
```
There is a box.

> look at box

The box is small and cardboard. It has flaps at the top, so you think you could open it quite easily.

> open box

You open the box...
```

### Ability Forfeiture

The tests are designed to evaluate how the player can solve puzzles while missing some of their abilities. These abilities include the five senses (**sight**, **smell**, **hearing**, **touch**, and **taste**), as well as **mobility** and **cognition**.

The player starts with fifteen ability points, which are spread across the abilities with the following distribution:

Ability | Points
--- | ---
Sight | 3
Hearing | 2
Smell | 1
Taste | 1
Touch | 2
Mobility | 3
Cognition | 3

At the beginning of each level, the player chooses one ability point to lose. When a point is subtracted from an ability, that ability's point total decrases by one (to a minimum of zero).

This choice happens after the initial level description is given to the player so they can try to make an informed decision. The description, however, can be intentionlly misleading.

When an ability has a lower point total, it does not behave properly. Depending on its score, the player may experience slight anomolies in that ability, or it could produce totally incorrect senses. See the tables below for detailed effects.

### Ability Reallocation

At any point, the player may choose to reallocate their ability points. This means they can subtract points from abilities and add them onto other abilities.

Reallocating ability points comes at a penalty of one point. For any ability, the minimum is still zero points, and the maximum is the initial number of points plus one.

If an extra point is allocated to an ability, that ability becomes more enhanced.

### Abilities

#### Vision

Level | Effect | Example
--- | --- | ---
4 | Enhanced vision. Can see properties of objects that would otherwise be invisible, such as temperature, intent, or association. | `The cup contains a clear liquid. Something about the aura of the liquid tells you it must be corrosive.`
**3** | Regular vision. Objects appear normal. | `The cup contains a clear liquid.`
2 | Some interference. Objects may appear blurry or discolored. Occasional visual artifacts appear in peripheral vision. | `The cup contains liquid. It appears clear, but then again, so are parts of the cup and table.`
1 | Major interference. Objects appear massively deformed. Convincing visual artifacts are common. | `There is a coconut on the table.`
0 | Total failure. Vision feed is hijacked by another entity. | `There is a palm tree with coconuts.`

#### Hearing

Level | Effect | Example
--- | --- | ---
3 | Enhanced hearing. Can hear things that would otherwise be inaudible. | `You can hear the sound of gears turning. It sounds like one is missing.`
**2** | Regular hearing. Things sound normal. | `You can hear the sound of gears turning.`
1 | Interference. Sounds are often distorted, and phantom sounds are common. | `You can hear the sound of rats scuttling.`
0 | Total failure. Hearing feed is hijacked by another entity. | `All is quiet, except for the sounds of water dripping and the occasional scurry of a rat.`

#### Smell

Level | Effect | Example
--- | --- | ---
2 | Enhanced smell. Can smell things that would otherwise by imperceptible. | `Humans were here once, you can smell them. Their scent leads you to the corner.`
**1** | Regular smell. Things smell normal. | `The place smells sterile, like a hospital`.
0 | Total failure. Smell feed is hijacked by another entity. | `You smell a freshly baked cake.`

#### Taste

Level | Effect | Example
--- | --- | ---
2 | Enhanced taste. Can taste things that would otherwise by imperceptible.
**1** | Regular taste. Things taste normal.
0 | Total failure. Taste feed is hijacked by another entity.

#### Touch

Level | Effect | Example
--- | --- | ---
3 | Enhanced touch. Can feel things that otherwise could not be felt.
**2** | Regular touch. Things feel normal.
1 | Interference. Things feel different than normal, and phantom feelings are common.
0 | Total failure. Touch feed is hijacked by another entity.

#### Mobility

Level | Effect | Example
--- | --- | ---
4 | Enhanced mobility. Can run, jump, and move more swiftly than normal.
**3** | Regular mobility. Can move as much as an average, healthy adult.
2 | Some interference. Motor control may be delayed or slightly inaccurate.
1 | Major interference. Movement is unpredictable.
0 | Total failure. Muscle control is hijacked by another entity. Usually fatal.

#### Cognition

Level | Effect | Example
--- | --- | ---
4 | Enhanced cognition. Bursts of inspiration provide information that would otherwise be unknown.
**3** | Regular cognition. Mental processes are normal.
2 | Some interference. Thoughts are often disjointed or interrupted by seemingly random ideas.
1 | Major interference. Cognition may be overridden by extended periods of phantom thoughts and "time skips," which are sudden losses in short-term memory.
0 | Total failure. Cognitive ability is hijacked by another entity. Fatal.

## Story

You are a potential hire for a Perception Host position at **The Pando Corporation**, a company that specializes in peer-to-peer human ability sharing. Hosts sell the rights to their senses (vision, hearing, taste, smell, and touch) and cognitive and motor abilities to be used by third parties.

In order to be hired at **The Pando Corporation**, you must pass a series of tests. These tests are designed to assess your ability to function while some of your senses are being used elsewhere.

## Tests

### Three Cups

#### Description

A small room with a waist-high counter in the center. On it are three unlabled cups. They contain: milk, hydrocholoric acid, and water. The counter has a drawer containing one cookie and three iron nails.

There is a door on the opposite wall, locked by an iron padlock.

#### Objective

Go through the door.

#### Solutions

The only solution for this puzzle is to pour the hydrochloric acid on the padlock. Doing so will corrode the padlock and make it so the player can break it off and go through the door.

The trick is identifying which of the cups contains the acid. The following skills can be used to discern the one with acid:

Skill | Command | Result
--- | --- | ---
Vision 2 | Examine the cups | You can tell that the cups have liquid, and what their colors are.
Vision 4 | Examine the cups | You can tell that the acid is acidic.
Smell 1 | Smell the cups | The acid smells very strong.
Touch 2 | Touch/taste the liquid | The acid burns your skin.
Cognition 4 | Examine the cups | You can tell that two of the cups are harmless, and one is dangerous.

As an alterative to trying to identify the acid through passive observation, the player can drop the nails from the drawer into the liquids. The nail will cause a reaction and start to corrode when dropped into the acid.

#### Hazards

Drinking the acid will result in death.

#### Easter Eggs

The player can eat the cookie in the drawer. Dunking it in the milk and then eating it is better. Dunking it in the milk and then eating it with an ability of `Taste 2` is even better.

### More TBD