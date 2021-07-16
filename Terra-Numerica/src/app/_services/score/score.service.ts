import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private base_score_folder = '/assets/score/'

  constructor() { }

  getScoreImage(winner_side: 'thief' | 'cops', ai_side: string, graph_typology: string, cops_number: number): string {
    const score = this.calculateScore(winner_side, ai_side, graph_typology, cops_number);
    return `${this.base_score_folder}${score}.svg`
  }

  private calculateScore(winner_side: 'thief' | 'cops', ai_side: string, graph_typology: string, cops_number: number) {
    let score = '3_stars';
    if(ai_side && (winner_side === ai_side)) { // AI win the game
      score = '0_star';
    } else {
      switch (graph_typology) {
        case 'grid':
          score = this.calculateGridScore(winner_side, ai_side, cops_number);
          break;
        case 'tore':
          break;
        case 'cycle':
          break;
        case 'tree':
          break;
        default:
          break;
      }
    }
    return score;
  }

  private calculateGridScore(winner_side: 'thief' | 'cops', ai_side: string, cops_number: number): string {
    let score = '3_stars';
    if(winner_side === 'cops') {
      if(cops_number <= 2) score = '3_stars';
      else if(cops_number <= 4) score = '2_stars';
      else score = '1_star';
    } else if(winner_side === 'thief') {
      if(cops_number <= 2) score = '1_star';
      else if(cops_number <= 4) score = '2_stars';
      else score = '3_score';
    }
    return score;
  }

  private calculateToreScore(winner_side: 'thief' | 'cops', player_side: string, cops_number: number) {
    let score;
    return score;
  }

  private calculateCycleScore(winner_side: 'thief' | 'cops', player_side: string, cops_number: number) {
    let score;
    return score;
  }

  private calculateTreeScore(winner_side: 'thief' | 'cops', player_side: string, cops_number: number) {
    let score;
    return score;
  }

  private calculateDefaultScore(winner_side: 'thief' | 'cops', player_side: string, cops_number: number) {
    let score;
    return score;
  }
}
