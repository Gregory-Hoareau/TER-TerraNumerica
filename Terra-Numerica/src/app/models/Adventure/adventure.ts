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
        console.log('INDEX LEVEL', this.level_index)
        if(this.level_index < this.levels.length) this.level_index++;
        else {
            this.displayEndMessage()
        }
    }

    private displayEndMessage() {
        alert('THIS IS THE END OF THE ADVENTURE');
        this.level_index = 0;
    }
}
