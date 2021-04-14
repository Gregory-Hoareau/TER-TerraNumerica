import { Adventure } from "./adventure"
import { AdventureLevel } from "./AdventureLevel/adventure-level"

const firstAdventure: Adventure = new Adventure([
    new AdventureLevel('tree', [5, 2], 1, 1, 'thief', 'easy')
]);

export const ADVENTURES: Adventure[] = [
    firstAdventure
]
