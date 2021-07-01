import { AdventureLevel } from "./AdventureLevel/adventure-level";
import Swal from 'sweetalert2';
import { Mode } from "./mode";
import { mediation } from '../../mediation/mediation'

export class Adventure {
    private name: string
    private levels: AdventureLevel[];
    private level_index: number = 0;
    private mode: Mode = Mode.CLASSIC;
    private mediation_key: string = undefined

    constructor(name: string, mode: Mode, key: string, levels: AdventureLevel[] = []) {
        this.levels = levels;
        this.name = name;
        this.mode = mode;
        this.mediation_key = key;
    }

    addLevel(level: AdventureLevel) { this.levels.push(level); }

    getCurrentLevel(): AdventureLevel {
        return this.levels[this.level_index];
    }

    getMediationInfo(): {text: string, img: string} {
        return mediation[this.mediation_key][`step${this.level_index + 1}`]
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

    getMode(): Mode {
        return this.mode;
    }

    reset() {
        this.level_index = 0;
    }
}
