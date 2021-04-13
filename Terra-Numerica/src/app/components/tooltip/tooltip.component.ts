import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  @Input()
  main_text: string;
  
  @Input()
  tooltip_text: string;

  constructor() { }

  ngOnInit(): void {
  }

}
