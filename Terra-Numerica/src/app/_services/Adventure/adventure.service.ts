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

  async launchAdventure(adventure: Adventure) {
    this.currentAdventure = adventure;
    const extras = await this.configureAdventureNextLevel(adventure);
    this.router.navigate(['board'], extras);
  }

  private async configureAdventureNextLevel(adventure: Adventure): Promise<NavigationExtras> {
    const level = this.currentAdventure.getCurrentLevel();
    /* console.log('LEVEL',level) */
    await this.graphService.generateGraph(level.getGraphType(), level.getGraphParams())
    const extras: NavigationExtras = {
      queryParams: {
        gameMode: level.getDifficulty(),
        adventure: true
      }
    }
    this.gameService.setOpponentType('ai');
    this.gameService.setCopsNumber(level.getCopsNumber());
    this.gameService.setThiefSpeed(level.getThiefSpeed());
    this.gameService.setAiSide(level.getAiSide());
    return extras;
  }
}
