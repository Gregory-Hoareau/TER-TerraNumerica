import { GameAction } from '../GameAction/game-action';

export class GameActionStack {
    private stack: GameAction[];

    constructor() {
        this.stack = [];
    }

    //Stack function
    push(el: GameAction) {
        this.stack.push(el);
    }

    pop(): GameAction {
        return this.stack.pop();
    }

    peek(): GameAction {
        return this.stack[this.stack.length-1];
    }

    isEmpty(): boolean {
        return this.stack.length === 0;
    }

    count(): number {
        return this.stack.length;
    }

    clear() {
        this.stack = [];
    }

    //Utils function
    cancelAction(): boolean {
        if(this.isEmpty()) return false;
        const action = this.pop();
        action.cancelAction();
        return true;
    }

}
