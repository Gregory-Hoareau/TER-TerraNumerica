import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss']
})
export class GameMenuComponent implements OnInit {

  private selectedGraphType = 'grid';
  private selectedOpponentType = 'player';
  public availableGraphType = ['grid', 'cycle', 'tree', 'random'];
  public availableOpponentType = ['ia', 'player'];

  public gameModeSelected = "facile";
  public paramsNames;
  public graphParam1 = 1;
  public graphParam2 = 1;
  public cops = 1;

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.updateParamsName();
  }

  selectGraphType(type: string) {
    this.selectedGraphType = type;
    this.updateParamsName();
    this.paramSafetyCheck();
  }

  updateParamsName() {
    switch(this.selectedGraphType) {
      case 'grid':
        this.paramsNames = ['Largeur :', 'Longueur :'];
        break;
      case 'cycle':
        this.paramsNames = ['Nombre de noeuds :']
        break;
      case 'tree':
        this.paramsNames = ['Nombre de noeuds :', 'Arité de l\'arbre :']
        break;
      case 'random':
        this.paramsNames = []
        break;
      default:
        break;
    }
  }

  selectPlayer(opponent) {
    if(opponent === 'ia') {
      alert('AI opponent is not implemented yet');
      return;
    }
    this.selectedOpponentType = opponent;
  }

  validateParams() {
    this.paramSafetyCheck();
    switch(this.gameModeSelected){
    case "facile":
      break;
    case "normal":
      break;
    case "difficile":
      break;
    }
    const extras: NavigationExtras = {
      queryParams: {
        copsNum: this.cops,
        graphType: this.selectedGraphType,
        oppenent: this.selectedOpponentType,
        graphParams: [this.graphParam1, this.graphParam2],
        gameMode: this.gameModeSelected
      }
    }
    this.router.navigate(['/test-d3js'], extras)
  }

  private paramSafetyCheck() {
    if(!this.graphParam1) this.graphParam1 = 0;
    if(!this.graphParam2) this.graphParam2 = 0;
  }

  isSelected(type) {
    if(type === this.selectedOpponentType || type === this.selectedGraphType) return 'selected'
    else return ''
  }

}
