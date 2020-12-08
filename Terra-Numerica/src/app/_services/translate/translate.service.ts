import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor() { }

  graphTypeName(type: string): string {
    switch(type) {
      case 'grid':
        return 'Grille';
      case 'cycle':
        return 'Cycle'
      case 'tree':
        return 'Arbre';
      case 'copsAlwaysWin':
        return '???'; // TODO : Changer le nom d'affichage de ce type de graph
      case 'random':
        return 'Aléatoire';
      default:
        return '';
    }
  }

  opponentTypeName(type: string): string {
    switch(type) {
      case 'ai':
        return 'Jouer contre un ordinateur';
      case 'player':
        return 'Jouer à 2 joueurs';
      default:
        return '';
    }
  }
}
