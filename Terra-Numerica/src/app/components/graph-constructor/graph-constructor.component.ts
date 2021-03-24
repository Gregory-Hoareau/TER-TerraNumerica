import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphConstructorService } from 'src/app/_services/graph-constructor/graph-constructor.service';
import { TranslateService } from 'src/app/_services/translate/translate.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import * as d3 from 'd3';

@Component({
  selector: 'app-graph-constructor',
  templateUrl: './graph-constructor.component.html',
  styleUrls: ['./graph-constructor.component.scss']
})
export class GraphConstructorComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  public selected_tool: string = 'add-node';
  public tools: string[] = [];
  public zoom_level: number = 0;
  private graphConstructorID = 'graphConstructorSvg';
  private graphConstructorSVG;

  private node_count = 0;
  private link_count = 0;
  private placing_link = false;

  constructor(private translator: TranslateService,
    private graphConstructorService: GraphConstructorService) { }

  ngOnInit(): void {
    this.tools = this.graphConstructorService.tools;
    this.selected_tool = this.tools[0];
    d3.select('#canvas')
      .append('svg')
      .attr('id', this.graphConstructorID)
      .attr('width', '100%')
      .attr('height', '100%')
      .on('click', this.toolAction.bind(this))
    this.graphConstructorSVG = d3.select(`#${this.graphConstructorID}`)
    console.log(this.graphConstructorSVG)
  }

  toolAction(event: MouseEvent) {
    console.log('click event on svg', event);
    const clickPosition = { x: event.clientX, y: event.clientY };
    switch (this.selected_tool) {
      case 'add-node':
        break;
      case 'add-link':
        break;
      case 'remove':
        break;
      default:
        break;
    }
    this.graphConstructorService.toolAction(this.selected_tool);
  }

  drawNode(position) {
    //TODO: Ajouter un nouveau cercle sur le canvas à la position du clique
  }

  drawLink(from, to) {

  }

  deleteElement(position) {

  }

  zoom(event: WheelEvent) {
    if (event.deltaY < 0) {
      if (this.zoom_level < 5) {
        this.zoom_level++;
      }
    } else {
      if (this.zoom_level > -5) {
        this.zoom_level--;
      }
    }
    const scale = 1 + (this.zoom_level / 10);
    this.canvas.nativeElement.children[0].style.transform = `scale(${scale})`;
  }

  isSelectedTool(tool: string) {
    return this.selected_tool === tool ? `${tool} selected` : `${tool}`;
  }

  selectTool(tool: string) {
    this.selected_tool = tool;
  }

  getToolName(tool: string) {
    return this.translator.graphConstructorToolsName(tool);
  }

  saveGraph() {
    Swal.fire({
      title: 'Sorry...',
      text: 'This function is not implemented yet.'
    })
  }

}
