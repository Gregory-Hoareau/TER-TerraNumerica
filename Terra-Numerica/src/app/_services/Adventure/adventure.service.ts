import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Adventure } from 'src/app/models/Adventure/adventure';
import { ADVENTURES } from 'src/app/models/Adventure/adventures.mock';
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
    this.gameService.setEndLevelCallback(this.launchNextLevel.bind(this))
    this.launchNextLevel();
  }

  launchNextLevel() {
    this.configureAdventureNextLevel(this.currentAdventure).then(extras => {
      this.router.navigate(['/board'], extras);
    })
  }

  private async configureAdventureNextLevel(adventure: Adventure): Promise<NavigationExtras> {
    const level = this.currentAdventure.getCurrentLevel();
    console.log('LEVEL',level)
    await this.graphService.generateGraph(level.getGraphType(), level.getGraphParams())
    this.gameService.setOpponentType('ai');
    this.gameService.setCopsNumber(level.getCopsNumber());
    console.log('HERE WE ARE', this.gameService.getCopsNumber())
    this.gameService.setThiefSpeed(level.getThiefSpeed());
    this.gameService.setAiSide(level.getAiSide());
    this.currentAdventure.goToNextLevel();
    const extras: NavigationExtras = {
      queryParams: {
        gameMode: level.getDifficulty(),
        adventure: true
      }
    }
    return extras;
  }
}
