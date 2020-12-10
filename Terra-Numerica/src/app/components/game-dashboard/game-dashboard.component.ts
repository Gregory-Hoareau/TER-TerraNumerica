import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { StatisticService } from 'src/app/_services/statistic/statistic.service';


@Component({
  selector: 'app-game-dashboard',
  templateUrl: './game-dashboard.component.html',
  styleUrls: ['./game-dashboard.component.scss']
})
export class GameDashboardComponent implements OnInit {
  private statistics;
  private quote = '';
  private averageStats;
  private margin = {top: 20, right: 20, bottom: 90, left: 120};
  private width = 800 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  public abcisse
  public ordonne
  public x
  public y
  public xData
  public yData

  constructor(private stat: StatisticService) {
    this.x = d3.scaleBand()
      .range([this.width, 0])
      .padding(0.1);

    this.y = d3.scaleLinear()
        .range([this.height, 0]);
  }

  async ngOnInit(): Promise<void> {
    this.statistics = await this.stat.getStatistics()
  }

  refreshGraph(){
    const svg = d3.select("#chart").append("svg")
    .attr("id", "svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    switch (this.abcisse){
      case 'Nombre de Policier':
        this.xData = 'copsNumber'
        break;  
      case 'Type de Graph':
        this.quote = '"';
        this.xData = 'graphType'
        break;  
      case 'Mode de Jeu':
        this.quote = '"';
        this.xData = 'gameMode'
        break;  
    }
    switch (this.ordonne){
      case 'Nombre de Tour':
        this.yData = 'turnCount'
        break;  
      case 'Durée de la Partie':
        this.yData = 'timer'
        break;  
    }

    let xAxis = d3.axisBottom(this.x)
    .ticks(6);
    
    let yAxis = d3.axisLeft(this.y)
    .ticks(5);

    this.averageStats = this.statistics.map(s => {
      const xDat = this.xData
      const yDat = this.yData
      return {xDat: s[this.xData], yDat: s[this.yData]}
    })

    const tmp = this.averageStats.reduce((acc, cur) => {
      if(cur.xDat in acc){
        acc[cur.xDat].push(cur.yDat)
      }else{
        acc[cur.xDat] = [cur.yDat]
      }
      return acc;
    }, {}) 

    for(const key in tmp){
      const length = tmp[key].length
      tmp[key] = tmp[key].reduce((acc, cur) => {
        return acc + cur;
      }, 0)
      tmp[key] = tmp[key]/length
    }
    this.averageStats = tmp;

    this.x.domain(Object.keys(this.averageStats))

    this.y.domain([0,d3.max(Object.values(this.averageStats))])
    let data = [];
    for( const d in this.averageStats){
      data.push(JSON.parse("{\"" + this.xData + "\":" + this.quote + d + this.quote + ",\"" + this.yData + "\":" + this.averageStats[d] + "}"))
    }

    svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(xAxis)
        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
    svg.append("g")
        .call(yAxis)
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => this.x(d[this.xData]))
        .attr("width", this.x.bandwidth())
        .attr("y", d => this.y(d[this.yData]))
        .attr("height", d => this.height - this.y(d[this.yData]))

  }


}
