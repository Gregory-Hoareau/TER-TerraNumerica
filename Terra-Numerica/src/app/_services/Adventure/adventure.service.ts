import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Adventure } from 'src/app/models/Adventure/adventure';
import { ADVENTURES } from 'src/app/models/Adventure/adventures.mock';
import Swal from 'sweetalert2';
import { GameService } from '../game/game.service';
import { GraphService } from '../graph/graph.service';

@Injectable({
  providedIn: 'root'
})
export class AdventureService {

  private adventures: Adventure[] = ADVENTURES;
  private currentAdventure: Adventure = null;

  constructor(private router: Router,
    private gameService: GameService,
    private graphService: GraphService) { }

  getAvailableAdventures() { return this.adventures; }

  launchAdventure(adventure: Adventure) {
    this.currentAdventure = adventure;
    this.currentAdventure.reset();
    this.gameService.setEndLevelCallback(this.launchNextLevel.bind(this));
    this.launchNextLevel();
  }

  async launchNextLevel() {
    const extras = await this.configureAdventureNextLevel(this.currentAdventure)
    this.currentAdventure.goToNextLevel();
    if(extras) {
      Swal.fire({
        text: `Dans ce niveau vous jouerez le role du camp ${this.getLevelPlayerRole()}`
      })
      this.router.navigate(['/board'], extras);
      return false;
    } else {
      this.router.navigate(['/adventure-menu']);
      return true;
    }
  }

  private async configureAdventureNextLevel(adventure: Adventure): Promise<NavigationExtras> {
    const level = this.currentAdventure.getCurrentLevel();
    let extras: NavigationExtras = undefined;
    if(level !== undefined) {
      await this.graphService.generateGraph(level.getGraphType(), level.getGraphParams());
      this.gameService.setOpponentType('ai');
      this.gameService.setCopsNumber(level.getCopsNumber());
      this.gameService.setThiefSpeed(level.getThiefSpeed());
      this.gameService.setAiSide(level.getAiSide());
      extras = {
        queryParams: {
          gameMode: level.getDifficulty(),
          adventure: true
        }
      }
      return extras;
    }
  }

  getLevelPlayerRole() {
    return this.currentAdventure.getCurrentLevel().getPlayerRoleName()
  }
}
