import { AdventureLevel } from "./AdventureLevel/adventure-level";

export class Adventure {
    private levels: AdventureLevel[];
    private level_index: number = 0;

    constructor(levels: AdventureLevel[] = []) {
        this.levels = levels;
    }

    addLevel(level: AdventureLevel) { this.levels.push(level); }

    getCurrentLevel(): AdventureLevel { return this.levels[this.level_index]; }

    goToNextLevel(): void {
        if(this.level_index + 1 < this.levels.length) this.level_index++;
        else {
            this.level_index = 0;
            this.displayEndMessage()
        }
    }

    private displayEndMessage() {
        console.log('THIS IS THE END OF THE ADVENTURE');
    }
}
