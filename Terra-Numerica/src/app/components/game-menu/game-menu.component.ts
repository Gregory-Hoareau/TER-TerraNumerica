import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { GameService } from 'src/app/_services/game/game.service';
import { GraphService } from 'src/app/_services/graph/graph.service';
import { RandomGraphService } from 'src/app/_services/random-graph/random-graph.service';
import { StatisticService } from 'src/app/_services/statistic/statistic.service';
import { TranslateService } from 'src/app/_services/translate/translate.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss']
})
export class GameMenuComponent implements OnInit {

  @ViewChild('param1Input', { static: false }) param1InputRef: ElementRef;
  @ViewChild('param2Input', { static: false }) param2InputRef: ElementRef;
  @ViewChild('copsNumberInput', { static: true }) copsNumberInputRef: ElementRef;

  public selectedGraphType = 'grid';
  public selectedOpponentType = 'ai';
  public availableGraphType = ['grid', 'tore', 'cycle', 'tree', 'copsAlwaysWin', 'petersen', 'dodecahedron'] //, 'random'];
  public availableOpponentType = ['ai', 'player'];
  public paramsBoundaries = {
    grid: {
      param1: 3,
      param2: 3
    },
    tore: {
      param1: 3,
      param2: 3
    },
    cycle: {
      param1: 5,
      param2: -1
    },
    tree: {
      param1: 5,
      param2: 2
    },
    copsAlwaysWin: {
      param1: 6,
      param2: -1
    },
    random: {
      param1: -1,
      param2: -1
    },
    petersen: {
      param1: -1,
      param2: -1
    },
    dodecahedron: {
      param1: -1,
      param2: -1
    },
    import: {
      param1: -1,
      param2: -1
    }
  }


  public selectedFileName = undefined;
  private inputGraphJSONFile: File = null;
  private graphGeneration: boolean = true;
  private graphImportation: boolean = false;
  public gameModeSelected = 'easy';
  public selectedAi = 'cops'

  public paramsNames;
  public graphParam1: number;
  public graphParam2: number;
  public cops: number = 1;
  public thiefSpeed: number = 1;

  constructor(private graphService: GraphService,
    private gameService: GameService,
    private router: Router,
    private randomGraph: RandomGraphService,
    public translator: TranslateService,
    private statisticService: StatisticService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getDataFromLocalStorage();
    this.selectGraphType(this.selectedGraphType);
    this.updateParamsName();
    this.randomGraph.loadGraphs();
    console.log('GameMenuComponent#ngOnInit')
  }

  private getDataFromLocalStorage() {
    if(localStorage.getItem('graphType')) {
      this.selectedGraphType = localStorage.getItem('graphType');
    }
    if(localStorage.getItem('graphParam1')) {
      this.graphParam1 = +localStorage.getItem('graphParam1')
    }
    if(localStorage.getItem('graphParam2')) {
      this.graphParam2 = +localStorage.getItem('graphParam2')
    }
    if(localStorage.getItem('opponentType')) {
      this.selectedOpponentType = localStorage.getItem('opponentType')
    }
    if(localStorage.getItem('selectedAi')) {
      this.selectedAi = localStorage.getItem('selectedAi')
    }
    if(localStorage.getItem('gameMode')) {
      this.gameModeSelected = localStorage.getItem('gameMode')
    }
    if(localStorage.getItem('speed')) {
      this.thiefSpeed = +localStorage.getItem('speed')
    }
    if(localStorage.getItem('copsNum')) {
      this.cops = +localStorage.getItem('copsNum')
    }
  }

  private setDataToLocalStorage() {
    localStorage.setItem('graphType', this.selectedGraphType)
    localStorage.setItem('graphParam1', `${this.graphParam1}`)
    localStorage.setItem('graphParam2', `${this.graphParam2}`)
    localStorage.setItem('opponentType', this.selectedOpponentType)
    localStorage.setItem('selectedAi', this.selectedAi)
    localStorage.setItem('gameMode', this.gameModeSelected)
    localStorage.setItem('speed', `${this.thiefSpeed}`)
    localStorage.setItem('copsNum', `${this.cops}`)
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges()
  }

  /* print(mes) {
    console.log(this.param1InputRef)
  } */

  selectGraphType(type: string) {
    this.selectedGraphType = type;
    /* console.log('HERE WE ARE') */
    if(type !== 'import') {
      this.graphImportation = false;
      this.graphGeneration = true;
    }
    this.updateParamsName();
    this.updateGraphParams();
    this.paramSafetyCheck();
  }

  updateGraphParams() {
    this.graphParam1 = this.paramsBoundaries[this.selectedGraphType].param1;
    this.graphParam2 = this.paramsBoundaries[this.selectedGraphType].param2;
  }

  updateParamsName() {
    switch (this.selectedGraphType) {
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
        this.paramsNames = []
        break;
    }
  }

  selectPlayer(opponent) {
    this.selectedOpponentType = opponent;
  }

  async validateParams() {
    if (this.paramSafetyCheck()) {

      if (this.graphGeneration) {
        await this.graphService.generateGraph(this.selectedGraphType, [this.graphParam1, this.graphParam2])
      }
      // else if (this.graphImportation) {
      //   this.graphService.loadGraphFromFile(this.inputGraphJSONFile);
      // }
      
      switch (this.gameModeSelected) {
        case "easy":
          break;
        case "medium":
          break;
        case "hard":
          break;
        case "extreme":
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
      this.gameService.setThiefSpeed(this.thiefSpeed);
      if (this.selectedOpponentType === 'ai') {
        this.gameService.setAiSide(this.selectedAi);
      } else {
        this.gameService.setAiSide(undefined);
      }
      this.setDataToLocalStorage();
      this.router.navigate(['/board'], extras);
    }
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  private paramSafetyCheck() {
    if (this.inputGraphJSONFile && this.graphImportation) {
      console.log('GRAPHE IMPORTATION')
      return true;
    }
    if (this.graphGeneration) {
      console.log('GRAPHE GENERATION')
      if (!this.graphParam1) this.graphParam1 = 0;
      if (!this.graphParam2) this.graphParam2 = 0;
      return true
    }
    return false;
  }

  setSelectedAi(side: string) {
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
    /* this.selectedGraphType = 'grid' */
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

  isSelectedExtreme() {
    return this.gameModeSelected === 'extreme' ? 'selected' : '';
  }

  isSelectedCopsAi() {
    return this.selectedAi === 'cops' ? 'selected' : '';
  }

  isSelectedThiefAi() {
    return this.selectedAi === 'thief' ? 'selected' : '';
  }

  onFileChange(file) {
    if (file) {
      this.inputGraphJSONFile = file;
      this.selectedFileName = this.inputGraphJSONFile.name;
      this.graphService.loadGraphFromFile(file);
      this.graphGeneration = false;
      this.graphImportation = true;
    } else {
      this.selectedFileName = undefined
    }
  }

  onBlur(event) {
    if (+event.target.min > +event.target.value) {
      event.target.value = event.target.min
    }

    if (event.target.max !== '') {
      if (+event.target.max < +event.target.value) {
        event.target.value = event.target.max
      }
    }
  }

  checkGraphParamIssues() {
    let paramValidity = this.copsNumberInputRef.nativeElement.validity.valid;

    if (this.param1InputRef && this.paramsNames.length > 0) {
      paramValidity = paramValidity && this.param1InputRef.nativeElement.validity.valid && this.param1InputRef.nativeElement.value !== ''
      if (this.param2InputRef && this.paramsNames.length > 1) {
        paramValidity = paramValidity && this.param2InputRef.nativeElement.validity.valid && this.param2InputRef.nativeElement.value !== ''
      }

    }

    return !paramValidity;
  }

  getMaxCopsNumber() {
    switch (this.selectedGraphType) {
      case 'grid':
      case 'tore':
        return (this.graphParam1 * this.graphParam2) - 1
      case 'cycle':
      case 'tree':
      case 'copsAlwaysWin':
        return this.graphParam1 - 1;
      case 'random':
      default:
        return 5;
    }
  }

  displayRules() {
    /* Swal.fire('Règles',
      this.gameService.rules(),
      'info') */
    Swal.fire({
      title: 'Règles',
      icon: 'info',
      html: this.gameService.rulesHtml()
    })
  }

}
