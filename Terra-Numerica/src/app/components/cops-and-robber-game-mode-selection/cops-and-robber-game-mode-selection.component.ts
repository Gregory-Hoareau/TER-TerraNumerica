import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/_services/game/game.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cops-and-robber-game-mode-selection',
  templateUrl: './cops-and-robber-game-mode-selection.component.html',
  styleUrls: ['./cops-and-robber-game-mode-selection.component.scss']
})
export class CopsAndRobberGameModeSelectionComponent implements OnInit {

  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit(): void {
  }

  configureFreeGame() {
    this.router.navigate(['/menu'])
  }

  configureAdventure() {
    this.router.navigate(['/adventure-menu'])
  }

  displayRules() {
    Swal.fire({
      title: 'Règles',
      icon: 'info',
      html: this.gameService.rulesHtml()
    })
  }
}
