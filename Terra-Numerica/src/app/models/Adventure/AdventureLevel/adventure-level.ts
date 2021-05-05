export class AdventureLevel {
    private graphType: string;
    private graphParams: any[];
    private copsNumber: number;
    private opponentType: string;
    private thiefSpeed: number;
    private aiSide: string;
    private difficulty: string;

    constructor(graphType, graphParams, copsNumber, speed, aiSide, difficulty) {
        this.graphType = graphType;
        this.graphParams = graphParams;
        this.copsNumber = copsNumber;
        this.thiefSpeed = speed;
        this.aiSide = aiSide;
        this.difficulty = difficulty;
    }

    getGraphType() { return this.graphType; }

    getGraphParams() { return this.graphParams; }

    getCopsNumber() { return this.copsNumber; }

    /* getOpponentType() { return this.opponentType; } */

    getThiefSpeed() { return this.thiefSpeed; }

    getAiSide() { return this.aiSide; }

    getDifficulty() { return this.difficulty;}

    getPlayerRoleName() {
        if(this.aiSide === 'thief') {
            return 'des Gendarmes';
        } else {
            return 'du Voleur';
        }
    }

}
