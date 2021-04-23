import { AdventureLevel } from "./AdventureLevel/adventure-level";
import Swal from 'sweetalert2';

export class Adventure {
    private name: string
    private levels: AdventureLevel[];
    private level_index: number = 0;

    constructor(name: string, levels: AdventureLevel[] = []) {
        this.levels = levels;
        this.name = name;
    }

    addLevel(level: AdventureLevel) { this.levels.push(level); }

    getCurrentLevel(): AdventureLevel {
        return this.levels[this.level_index];
    }

    goToNextLevel(): void {
        if(this.level_index < this.levels.length) {
            this.level_index++;
        } else {
            this.displayEndMessage();
            this.level_index = 0;
        }
    }

    private displayEndMessage() {
        /* alert('THIS IS THE END OF THE ADVENTURE'); */
        this.level_index = 0;
        Swal.fire({
            title: 'Fin de d\'aventure.',
            icon: 'success',
            text: `Félicitations vous avez terminée l\'aventure "${this.name}".`
        })
    }

    getName() {
        return this.name;
    }

    reset() {
        this.level_index = 0;
    }
}
