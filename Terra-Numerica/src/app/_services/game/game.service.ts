import { Injectable } from '@angular/core';
import { Cops } from 'src/app/models/Pawn/Cops/cops';
import { Thief } from 'src/app/models/Pawn/Thief/thief';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private cops: Cops[];
  private thiefs: Thief[];
  private thiefTurn = true;
  private turnCount = 0;
  private placingPawns = true;

  constructor() { }

  setThief(thiefs) {
    this.thiefs = thiefs;
  }

  setCops(cops) {
    this.cops = cops;
  }

  update() {
    if(this.placingPawns) {
      this.checkPlacement();
      if(!this.placingPawns) {
        this.startGame();
      }
    }
    else {
      this.updateStates();
    }
  }

  private checkPlacement() {
    let placing = false;
    for(let i=0; i<this.thiefs.length; i++) {
      placing = placing || this.thiefs[i].isWaitingPlacement();
    }
    for(let i=0; i<this.cops.length; i++) {
      placing = placing || this.cops[i].isWaitingPlacement();
    }
    this.placingPawns = placing;
  }

  private startGame() {
    console.log('GAME IS STARTING')
    for(let i=0; i<this.thiefs.length; i++) {
      this.thiefs[i].state = environment.onTurnState
    }
  }

  private updateStates() {
    if(this.thiefTurn) {
      
    } else {

    }
  }

}
