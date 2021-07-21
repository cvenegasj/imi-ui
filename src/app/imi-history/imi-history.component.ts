import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { DimensionsType } from '../models/types';
import * as d3 from "d3";
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-imi-history',
  templateUrl: './imi-history.component.html',
  styleUrls: ['./imi-history.component.css']
})
export class ImiHistoryComponent implements OnInit {

  @ViewChild('chartContainer', {static: true}) 
  chartContainer!: ElementRef;

  dimensions: DimensionsType;
  wrapper: any;
  bounds: any;
  lines: any;

  data: any[] = [];
  slices: any[] = [];

  constructor(
    private renderer: Renderer2,
    private sharedService: SharedService,
  ) {
    this.dimensions = {
      marginTop: 50,
      marginRight: 50,
      marginBottom: 50,
      marginLeft: 50,
      height: 300,
      width: 760,
    }
    this.dimensions = {
      ...this.dimensions, 
      boundedHeight: Math.max(this.dimensions.height - this.dimensions.marginTop - this.dimensions.marginBottom, 0),
      boundedWidth: Math.max(this.dimensions.width - this.dimensions.marginLeft - this.dimensions.marginRight, 0),
    }
  }

  ngOnInit(): void {
    this.sharedService.appUser$
      .subscribe(appUser => {
        //console.log(appUser);
        this.data = appUser.imis;
        this.slices = this.processData(appUser.imis);
        //console.log(this.slices);
        this.cleanAndCreateChart();
      });

      //let result: any[] = [
        //{dateTime: new Date('2020-10-01'), vars: new Map([[1, 3], [2, 2], [3, 4], [4, 4], [5, 2], [6, 1] ,[7, 5], [8, 4], [9, 4], [10, 3], [11, 4], [12, 5], [13, 2], [14, 3], [15, 2]])},
        //{dateTime: new Date('2020-11-01'), vars: new Map([[1, 1], [2, 1], [3, 1], [4, 2], [5, 2], [6, 2] ,[7, 3], [8, 3], [9, 3], [10, 1], [11, 3], [12, 5], [13, 5], [14, 4], [15, 5]])},
        //{dateTime: new Date('2020-12-01'), vars: new Map([[1, 2], [2, 3], [3, 2], [4, 4], [5, 5], [6, 4] ,[7, 1], [8, 2], [9, 2], [10, 3], [11, 3], [12, 3], [13, 5], [14, 4], [15, 5]])},  
        //{dateTime: new Date('2021-01-01'), vars: new Map([[1, 2], [2, 2], [3, 3], [4, 3], [5, 2], [6, 4] ,[7, 4], [8, 4], [9, 5], [10, 5], [11, 2], [12, 3], [13, 4], [14, 1], [15, 1]])},
        //{dateTime: new Date('2021-02-01'), vars: new Map([[1, 3], [2, 3], [3, 3], [4, 5], [5, 4], [6, 4] ,[7, 5], [8, 5], [9, 5], [10, 2], [11, 3], [12, 2], [13, 1], [14, 3], [15, 2]])},
        //{dateTime: new Date('2021-03-01'), vars: new Map([[1, 5], [2, 5], [3, 5], [4, 4], [5, 4], [6, 4] ,[7, 4], [8, 3], [9, 3], [10, 4], [11, 5], [12, 4], [13, 2], [14, 2], [15, 1]])},
        //{dateTime: new Date('2021-04-01'), vars: new Map([[1, 1], [2, 1], [3, 1], [4, 3], [5, 4], [6, 2] ,[7, 2], [8, 2], [9, 1], [10, 4], [11, 3], [12, 3], [13, 2], [14, 3], [15, 2]])},
        //{dateTime: new Date('2021-05-01'), vars: new Map([[1, 4], [2, 5], [3, 4], [4, 5], [5, 5], [6, 5] ,[7, 3], [8, 2], [9, 3], [10, 1], [11, 1], [12, 2], [13, 2], [14, 3], [15, 2]])},
        //{dateTime: new Date('2021-06-01'), vars: new Map([[1, 2], [2, 2], [3, 2], [4, 1], [5, 1], [6, 3] ,[7, 2], [8, 4], [9, 3], [10, 1], [11, 5], [12, 2], [13, 3], [14, 2], [15, 2]])},
        //{dateTime: new Date('2021-07-01'), vars: new Map([[1, 5], [2, 5], [3, 5], [4, 4], [5, 5], [6, 4] ,[7, 5], [8, 5], [9, 5], [10, 3], [11, 3], [12, 2], [13, 4], [14, 3], [15, 4]])},
      //];
      //this.data = this.processData(result);
      //this.slices = this.processData(result);

  }

  cleanAndCreateChart(): void {
    if (this.data.length === 0) {
      this.renderer.setProperty(this.chartContainer.nativeElement, 
        'innerHTML', 
        '<p class="gray-700 centered" style="width: 400px; margin-top: 100px;">No data to show.</p>');
      return;
    }

    // remove any pre-existing chart
    d3.select(this.chartContainer.nativeElement)
      .selectChild('svg')
      .remove();

    // SVG container
    this.wrapper = d3.select(this.chartContainer.nativeElement)
      .append("svg")
        .attr("width", this.dimensions.width)
        .attr("height", this.dimensions.height);

    // inner g
    this.bounds = this.wrapper
      .append("g")
        .attr("transform", `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);

    //const dateParser = d3.timeParse("%Y-%m-%d");
    //const xAccessor = (d: any) => dateParser(d.date); // d is datapoint object
    //const yAccessor = (d: any) => d.value;

    // scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.dateTime) as Date[])
      .range([0, this.dimensions.boundedWidth!]);

    const yScale = d3.scaleLinear()
      .domain([0, 5])
      .range([this.dimensions.boundedHeight!, 0]);

    // axes
    let xAxisGenerator = d3.axisBottom(xScale);
    let yAxisGenerator = d3.axisLeft(yScale).tickArguments([5, '~s']);

    // line
    const lineGenerator = d3.line()
      //.defined((d: any) => !isNaN(d.vars))
      .x((d: any) => xScale(d.dateTime))
      .y((d: any) => yScale(d.value));

    let id = 0;
    //let labelsId = 0;
    const ids = () => "line-"+id++;
    //const labels = () => "label-"+labelsId++;

    /*this.lines.append("text")
      .attr("class", labels)
      .datum((d: any) => {
          return {
              id: d.id,
              value: d.values[d.values.length - 1]}; 
          })
      .attr("transform", (d: any) => `translate(${(xScale(d.value.dateTime) + 10)}, ${(yScale(d.value.value) + 5)})`)
      .attr("x", 0)
      .text((d: any) => d.id);*/

    // grid
    // add the x gridlines
    this.bounds.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + this.dimensions.boundedHeight + ")")
      .call(xAxisGenerator
          .tickSize(-this.dimensions.boundedHeight!)
          .tickFormat(() => "")
      );

    // add the y gridlines
    this.bounds.append("g")			
      .attr("class", "grid")
      .call(yAxisGenerator
          .tickSize(-this.dimensions.boundedWidth!)
          .tickFormat(() => "")
      );

    // add the axes last
    // need to reinstantiate the generators
    xAxisGenerator = d3.axisBottom(xScale);
    yAxisGenerator = d3.axisLeft(yScale).tickArguments([5, '~s']);

    const xAxis = this.bounds
      .append("g")
        .attr("class", "axis")
        .call(xAxisGenerator)
        .style("transform", `translateY(${this.dimensions.boundedHeight}px)`);
  
    const yAxis = this.bounds
      .append("g")
        .attr("class", "axis")
        .call(yAxisGenerator);

    // draw lines at the end
    this.lines = this.bounds
      .selectAll("lines")
      .data(this.slices)
      .enter()
      .append("g");

    this.lines.append("path")
      .attr("class", ids)
      .attr("d", (d: any) => lineGenerator(d.values))
      .attr("fill", "none")
      //.attr("stroke", "#af9358")
      .attr("stroke-width", 1.8);
        //.attr("stroke-linejoin", "round")
        //.attr("stroke-linecap", "round");

    this.lines.selectAll(".line-1, .line-2, .line-3, .line-4, .line-5")
      .style("opacity", 0);
  }

  toggleLine(idLine: string, isVisible: boolean): void {
    this.lines.select(idLine)
      .transition().duration(200) 
      .style("opacity", isVisible ? 1 : 0);
  }

  processData(imis: any[]): any[] {
    let values0: any[] = [];
    let values1: any[] = [];
    let values2: any[] = [];
    let values3: any[] = [];
    let values4: any[] = [];
    let values5: any[] = [];

    for (let i = 0; i < imis.length; i++) {
      let avg1 = (imis[i].vars.get(1) + imis[i].vars.get(2) + imis[i].vars.get(3)) / 3;
      let avg2 = (imis[i].vars.get(4) + imis[i].vars.get(5) + imis[i].vars.get(6)) / 3;
      let avg3 = (imis[i].vars.get(7) + imis[i].vars.get(8) + imis[i].vars.get(9)) / 3;
      let avg4 = (imis[i].vars.get(10) + imis[i].vars.get(11) + imis[i].vars.get(12)) / 3;
      let avg5 = (imis[i].vars.get(13) + imis[i].vars.get(14) + imis[i].vars.get(15)) / 3;
      let avg = (avg1 + avg2 + avg3 + avg4 + avg5) / 5;
      
      values0.push({dateTime: imis[i].dateTime, value: avg});
      values1.push({dateTime: imis[i].dateTime, value: avg1});
      values2.push({dateTime: imis[i].dateTime, value: avg2});
      values3.push({dateTime: imis[i].dateTime, value: avg3});
      values4.push({dateTime: imis[i].dateTime, value: avg4});
      values5.push({dateTime: imis[i].dateTime, value: avg5});
    }

    let slices = [
      {id: "Average", values: values0},
      {id: "Product", values: values1},
      {id: "Resources", values: values2},
      {id: "Information", values: values3},
      {id: "Organization", values: values4},
      {id: "Innovation", values: values5}
    ];
    return slices;
  }

}