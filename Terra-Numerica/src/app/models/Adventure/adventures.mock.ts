import { Adventure } from "./adventure"
import { AdventureLevel } from "./AdventureLevel/adventure-level"
import { Difficulty } from "./difficulty";

const starterAdventure: Adventure = new Adventure('Aventure 1' ,[
    new AdventureLevel('tree', [10, 2], 1, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('cycle', [10, -1], 2, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('grid', [5, 5], 2, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('petersen', [-1, -1], 3, 1, 'thief', Difficulty.NORMAL)
]);

const secondAdventure = new Adventure('Aventure 2', [
    new AdventureLevel('cycle', [10, -1], 1, 1, 'cops', Difficulty.NORMAL),
    new AdventureLevel('tree', [10, 2], 1, 1, 'thief', Difficulty.EXTREME),
    new AdventureLevel('grid', [5, 5], 2, 1, 'thief', Difficulty.NORMAL),
    new AdventureLevel('petersen', [-1, -1], 3, 1, 'thief', Difficulty.NORMAL)
])

export const ADVENTURES: Adventure[] = [
    starterAdventure,
    secondAdventure
]
