import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { RandomGraphService } from 'src/app/_services/random-graph/random-graph.service';
import { TranslateService } from 'src/app/_services/translate/translate.service';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss']
})
export class GameMenuComponent implements OnInit {

  private selectedGraphType = 'grid';
  public selectedOpponentType = 'player';
  public availableGraphType = ['grid', 'tore', 'cycle', 'tree', 'copsAlwaysWin', 'random'];
  public availableOpponentType = ['ai', 'player'];

  private inputGraphJSONFile: File = null;
  private graphGeneration: boolean = true;
  private graphImportation: boolean = false;
  public gameModeSelected = 'easy';
  public selectedAi = 'cops'

  public paramsNames;
  public graphParam1: number = 1;
  public graphParam2: number = 1;
  public cops: number = 1;

  constructor(private graphService: GraphService,
              private gameService: GameService,
              private router: Router,
              private randomGraph: RandomGraphService,
              public translator: TranslateService) { }

  ngOnInit(): void {
    this.updateParamsName();
    this.randomGraph.loadGraphs();
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
      case 'tore':
        this.paramsNames = ['Largeur :', 'Longueur :'];
        break;
      case 'cycle':
        this.paramsNames = ['Nombre de noeuds :']
        break;
      case 'tree':
        this.paramsNames = ['Nombre de noeuds :', 'Arité de l\'arbre :']
        break;
      case 'copsAlwaysWin':
        this.paramsNames = ['Nombre de noeuds :']
        break;
      case 'random':
        this.paramsNames = []
        break;
      default:
        break;
    }
  }

  selectPlayer(opponent) {
    this.selectedOpponentType = opponent;
  }

  validateParams() {
    if (this.paramSafetyCheck()) {
      if (this.graphGeneration) {
        this.graphService.generateGraph(this.selectedGraphType, [this.graphParam1, this.graphParam2])
      }
      // else if (this.graphImportation) {
      //   this.graphService.loadGraphFromFile(this.inputGraphJSONFile);
      // }
      switch(this.gameModeSelected){
        case "easy":
          break;
        case "medium":
          break;
        case "hard":
          break;
      }
      const extras: NavigationExtras = {
        queryParams: {
          // copsNum: this.cops,
          // graphType: this.selectedGraphType,
          // oppenent: this.selectedOpponentType,
          // graphParams: [this.graphParam1, this.graphParam2],
          gameMode: this.gameModeSelected
        }
      }
      this.gameService.setOpponentType(this.selectedOpponentType);
      this.gameService.setCopsNumber(this.cops);
      if (this.selectedOpponentType === 'ai') {
        this.gameService.setAiSide(this.selectedAi);
      } else {
        this.gameService.setAiSide(undefined);
      }
      this.router.navigate(['/board'], extras);
    }
  }

  private paramSafetyCheck() {
    if (this.inputGraphJSONFile && this.graphImportation) {
      return true;
    }
    if (this.graphGeneration) {
      if(!this.graphParam1) this.graphParam1 = 0;
      if(!this.graphParam2) this.graphParam2 = 0;
      return true
    }
    return false;
  }

  setSelectedAi(side: string){
    this.selectedAi = side;
  }

  isSelectedOponent(type) {
    return type === this.selectedOpponentType ? 'selected' : ''
  }

  isSelectedGraphType(typology) {
    return typology === this.selectedGraphType ? 'selected' : ''
  }

  selectGraphGeneration() {
    this.graphGeneration = true;
    this.graphImportation = false;
  }

  selectGraphImportation() {
    this.graphGeneration = false;
    this.graphImportation = true;
  }

  isSeletectedGraphGeneration() {
    return this.graphGeneration ? 'selected' : '';
  }

  isSeletectedGraphImportation() {
    return this.graphImportation ? 'selected' : '';
  }

  isSelectedEasy() {
    return this.gameModeSelected === 'easy' ? 'selected' : '';
  }

  isSelectedMedium() {
    return this.gameModeSelected === 'medium' ? 'selected' : '';
  }

  isSelectedHard() {
    return this.gameModeSelected === 'hard' ? 'selected' : '';
  }

  isSelectedCopsAi() {
    return this.selectedAi === 'cops' ? 'selected' : '';
  }

  isSelectedThiefAi() {
    return this.selectedAi === 'thief' ? 'selected' : '';
  }

  onFileChange(file) {
    if (file.type === "application/json") {
      this.inputGraphJSONFile = file;
      this.graphService.loadGraphFromFile(file);
    } 
  }

}
