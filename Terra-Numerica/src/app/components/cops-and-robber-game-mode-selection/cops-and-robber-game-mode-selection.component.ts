import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cops-and-robber-game-mode-selection',
  templateUrl: './cops-and-robber-game-mode-selection.component.html',
  styleUrls: ['./cops-and-robber-game-mode-selection.component.scss']
})
export class CopsAndRobberGameModeSelectionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  configureFreeGame() {
    this.router.navigate(['/menu'])
  }

  configureAdventure() {
    this.router.navigate(['/adventure-menu'])
  }
}
