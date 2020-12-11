import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.scss']
})
export class AdminBoardComponent implements OnInit {
  
  // const string of type that are available to be selected
  public ADD_GRAPH = 'add-graph';
  public DASHBOARD = 'dashboard';

  public type = this.ADD_GRAPH; // possible value are: 'dashboard', 'add-graph'

  constructor() { }

  ngOnInit(): void {
  }

  selectDisplay(type) {
    this.type = type;
  }

  isSelected(type) {
    return this.type === type ? 'selected' : '';
  }

}
