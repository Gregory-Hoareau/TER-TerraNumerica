import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Adventure } from 'src/app/models/Adventure/adventure';
import { ADVENTURES } from 'src/app/models/Adventure/adventures.mock';
import { AdventureService } from 'src/app/_services/Adventure/adventure.service';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';

@Component({
  selector: 'app-adventure-menu',
  templateUrl: './adventure-menu.component.html',
  styleUrls: ['./adventure-menu.component.scss']
})
export class AdventureMenuComponent implements OnInit {

  private adventures = this.adventureService.getAvailableAdventures();
  private selected_adventure: Adventure = this.adventures[0];

  constructor(private router: Router,
    private adventureService: AdventureService) { }

  ngOnInit(): void {
  }

  launchAdventure() {
    this.adventureService.launchAdventure(this.selected_adventure);
  }

}
