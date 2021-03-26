import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GraphConstructorService } from 'src/app/_services/graph-constructor/graph-constructor.service';
import { TranslateService } from 'src/app/_services/translate/translate.service';
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

  private links = []
  private placing_link = false;
  private from = null;

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
    /* console.log('click event on svg', event); */
    const clickPosition = { x: event.clientX, y: event.clientY };
    switch (this.selected_tool) {
      case 'add-node':
        this.drawNode(clickPosition);
        break;
      default:
        break;
    }
  }

  drawNode(position) {
    this.graphConstructorService.toolAction(this.selected_tool, position)
    this.graphConstructorSVG.append('circle')
                              .attr('r', 20)
                              .attr('class', 'circle')
                              .style('fill', this.graphConstructorService.originalNodeColor)
                              .attr('cx', position.x)
                              .attr('cy', position.y)
                              .style('z-index', 1)
                              .on('click', (event: MouseEvent) => {
                                this.handleClickOnNode(event.target)
                              })
  }

  private handleClickOnNode(circle) {
    switch (this.selected_tool) {
      case 'add-link':
        if (!this.placing_link) {
          circle.style.fill = this.graphConstructorService.selectedNodeColor;
          this.from = circle 
        } else {
          if(this.from !== circle) {
            this.drawLink(this.from, circle);
          }
          this.from = null;
          this.resetNodeColor();
        }
        this.placing_link = !this.placing_link
        break;
      case 'remove':
        this.removeCircle(circle);
        break;
    }
  }

  private removeCircle(circle) {
    const toDelete = this.links.filter(link => link.source === circle || link.target === circle).map(link => link.line);
    for(const l of toDelete) {
      this.removeLine(l)
    }
    d3.select(circle).remove();
    this.graphConstructorService.toolAction(this.selected_tool, this.convertCircleToPosition(circle));
  }

  private removeLine(line) {
    let l = this.links.find(link => link.line === line);
    l = {source: this.convertCircleToPosition(l.source), target: this.convertCircleToPosition(l.target)}
    this.links = this.links.filter(link => link.line !== line);
    line.remove();
    this.graphConstructorService.toolAction(this.selected_tool, l.source, l.target)
  }

  private resetNodeColor() {
    d3.selectAll('circle').style('fill', this.graphConstructorService.originalNodeColor)
  }

  drawLink(from, to) {
    const fromPosition = this.convertCircleToPosition(from);
    const toPosition = this.convertCircleToPosition(to);
    this.graphConstructorService.toolAction(this.selected_tool, fromPosition, toPosition)
    const line = this.graphConstructorSVG.append('line')
                                          .attr('class', 'line')
                                          .attr('stroke', '#aaa')
                                          .attr('stroke-width', 3)
                                          .attr('x1', fromPosition.x)
                                          .attr('y1', fromPosition.y)
                                          .attr('x2', toPosition.x)
                                          .attr('y2', toPosition.y)
                                          .on('click', (event: MouseEvent) => {
                                            this.handleClickOnLink(event.target)
                                          })
    this.links.push({ source: from, target: to, line: line._groups[0][0] })
  }

  private convertCircleToPosition(circle) {
    return {x: circle.cx.baseVal.value, y: circle.cy.baseVal.value}
  }

  private handleClickOnLink(line) {
    if(this.selected_tool === 'remove') {
      this.removeLine(line);
    }
  }

  /* zoom(event: WheelEvent) {
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
  } */

  isSelectedTool(tool: string) {
    return this.selected_tool === tool ? `${tool} selected` : `${tool}`;
  }

  selectTool(tool: string) {
    if (this.selected_tool === tool) return;
    this.resetNodeColor();
    this.placing_link = false;
    this.selected_tool = tool;
  }

  getToolName(tool: string) {
    return this.translator.graphConstructorToolsName(tool);
  }

  saveGraph() {
    this.graphConstructorService.selectGraphType()
  }

}