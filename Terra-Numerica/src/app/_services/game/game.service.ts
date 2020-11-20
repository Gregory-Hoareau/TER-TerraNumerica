import { Injectable } from '@angular/core';
import { Cops } from 'src/app/models/Pawn/Cops/cops';
import { Pawns } from 'src/app/models/Pawn/pawn';
import { PawnState } from 'src/app/models/Pawn/PawnState/pawn-state';
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
    this.setPlayersTurn(this.thiefs);
  }

  private updateStates() {
    if(this.thiefTurn) {
      let allThiefHasPlayed = true;
      for(let i=0; i< this.thiefs.length; i++) {
        allThiefHasPlayed = allThiefHasPlayed && !this.thiefs[i].onTurn();
      }
      this.thiefTurn = !allThiefHasPlayed;
      if(!this.thiefTurn) {
        this.setPlayersTurn(this.cops);
      }
    } else {
      let allCopsHasPlayed = true;
      for(let i=0; i< this.thiefs.length; i++) {
        allCopsHasPlayed = allCopsHasPlayed && !this.thiefs[i].onTurn();
      }
      this.thiefTurn = allCopsHasPlayed;
      if(this.thiefTurn) {
        this.setPlayersTurn(this.thiefs);
      }
    }
  }

  private setPlayersTurn(players: Pawns[]) {
    for(let i=0; i<players.length; i++) {
      players[i].state = environment.onTurnState;
    }
  }

}
