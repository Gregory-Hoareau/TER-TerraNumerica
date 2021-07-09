import { Adventure } from "./adventure"
import { AdventureLevel } from "./AdventureLevel/adventure-level"
import { Difficulty } from "./difficulty";
import { Mode } from "./mode";

/* const starterAdventure: Adventure = new Adventure('Aventure 1', Mode.CLASSIC, '', [
    new AdventureLevel('tree', [10, 2], 1, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('cycle', [10, -1], 2, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('grid', [5, 5], 2, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('petersen', [-1, -1], 3, 1, 'thief', Difficulty.NORMAL)
]);

const secondAdventure = new Adventure('Aventure 2', Mode.CLASSIC, '', [
    new AdventureLevel('cycle', [10, -1], 1, 1, 'cops', Difficulty.NORMAL),
    new AdventureLevel('tree', [10, 2], 1, 1, 'thief', Difficulty.EXTREME),
    new AdventureLevel('grid', [5, 5], 2, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('petersen', [-1, -1], 3, 1, 'thief', Difficulty.NORMAL)
]) */

// Grid Strategy Adventure
const grid: Adventure = new Adventure('Grilles (construction stratégies gagnantes)', Mode.CLASSIC, 'grid-strat', [
    new AdventureLevel('grid', [9, 9], 9, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 5, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 4, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 2, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('grid', [9, 9], 2, 2, 'cops', Difficulty.DIFFICILE),
], 'assets/menu/graph-img/grid.svg')

// Easy Intruder Adventure
/* const easyIntruder: Adventure = new Adventure('Intrus - Facile', Mode.INTRUDER, '', [
    new AdventureLevel('tree', [5, 1], 1, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('cycle', [10, -1], 2, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('grid', [3, 3], 1, 1, 'thief', Difficulty.EXTREME),
]) */

export const ADVENTURES: Adventure[] = [
    grid,
]
