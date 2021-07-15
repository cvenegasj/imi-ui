import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { DimensionsType, Imi } from '../models/types';
import * as d3 from "d3";
import { SharedService } from '../services/shared.service';
import { ProviderService } from '../services/provider.service';
import { Util } from '../utils/util';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-imi-vars',
  templateUrl: './imi-vars.component.html',
  styleUrls: ['./imi-vars.component.css']
})
export class ImiVarsComponent implements OnInit, AfterViewInit {

  @Output() onImiRecalculated = new EventEmitter<number>();

  appUser: any;

  disabledSliders: boolean = true;
  sliderValues = {value1: 0, value2: 0, value3: 0, value4: 0, value5: 0, value6: 0, value7: 0, value8: 0,
                  value9:0, value10:0, value11: 0, value12: 0, value13: 0, value14: 0, value15: 0};

  data: any[] = [];
  lastImi?: Imi;

  /*data = [
    [ 
      {axis: "Product", value: 3},
      {axis: "Resources", value: 2},
      {axis: "Information", value: 2},
      {axis: "Organization", value: 5},
      {axis: "Innovation", value: 1}			
    ],[
      {axis: "Product", value: 4},
      {axis: "Resources", value: 1},
      {axis: "Information", value: 1},
      {axis: "Organization", value: 2},
      {axis: "Innovation", value: 3}	
    ],[
      {axis: "Product", value: 1},
      {axis: "Resources", value: 2},
      {axis: "Information", value: 2},
      {axis: "Organization", value: 2},
      {axis: "Innovation", value: 3}	
    ]
  ];*/

  @ViewChild('chartContainer', {static: true}) 
  chartContainer!: ElementRef;
  dimensions: DimensionsType;
  wrapper: any;
  bounds: any;

  constructor(
    private renderer: Renderer2,
    private sharedService: SharedService,
    private providerService: ProviderService,
    private clientService: ClientService,
  ) {
    this.dimensions = {
      marginTop: 50,
      marginRight: 50,
      marginBottom: 50,
      marginLeft: 50,
      height: 450,
      width: 450,
    }
    this.dimensions = {
      ...this.dimensions, 
      boundedHeight: Math.max(this.dimensions.height - this.dimensions.marginTop - this.dimensions.marginBottom - 40, 0),
      boundedWidth: Math.max(this.dimensions.width - this.dimensions.marginLeft - this.dimensions.marginRight, 0),
    }
  }

  ngOnInit(): void {
    this.sharedService.appUser$
      .subscribe(appUser => {
        console.log(appUser);
        this.appUser = appUser;
        const imiScore = this.updateVarsAndData();
        this.onImiRecalculated.emit(imiScore); // pass imi score to parent component
        this.createChart();
      });
  }

  ngAfterViewInit(): void {
    
  }

  updateVarsAndData(): number {
    if (!this.appUser.imis || this.appUser.imis.length === 0) { 
      return 0; 
    }

    // create imis vars as map
    /*for (let i = 0; i < appUser.imis.length; i++) {
      let tempMap = new Map();
      for (let [key, value] of Object.entries(appUser.imis[i].vars)) {
        tempMap.set(+key, value);
      }
      appUser.imis[i].vars = tempMap;
    } */

    this.lastImi = this.appUser.imis[this.appUser.imis.length - 1];
    this.sliderValues.value1 = this.lastImi!.vars.get(1)!;
    this.sliderValues.value2 = this.lastImi!.vars.get(2)!;
    this.sliderValues.value3 = this.lastImi!.vars.get(3)!;
    this.sliderValues.value4 = this.lastImi!.vars.get(4)!;
    this.sliderValues.value5 = this.lastImi!.vars.get(5)!;
    this.sliderValues.value6 = this.lastImi!.vars.get(6)!;
    this.sliderValues.value7 = this.lastImi!.vars.get(7)!;
    this.sliderValues.value8 = this.lastImi!.vars.get(8)!;
    this.sliderValues.value9 = this.lastImi!.vars.get(9)!;
    this.sliderValues.value10 = this.lastImi!.vars.get(10)!;
    this.sliderValues.value11 = this.lastImi!.vars.get(11)!;
    this.sliderValues.value12 = this.lastImi!.vars.get(12)!;
    this.sliderValues.value13 = this.lastImi!.vars.get(13)!;
    this.sliderValues.value14 = this.lastImi!.vars.get(14)!;
    this.sliderValues.value15 = this.lastImi!.vars.get(15)!;

    // array of axes for last imi
    const big5Graph = [
      {axis: Util.INTEGER_TO_NAME_MAP.get(1), value: (this.lastImi!.vars.get(1)! + this.lastImi!.vars.get(2)! + this.lastImi!.vars.get(3)!) / 3},
      {axis: Util.INTEGER_TO_NAME_MAP.get(2), value: (this.lastImi!.vars.get(4)! + this.lastImi!.vars.get(5)! + this.lastImi!.vars.get(6)!) / 3},
      {axis: Util.INTEGER_TO_NAME_MAP.get(3), value: (this.lastImi!.vars.get(7)! + this.lastImi!.vars.get(8)! + this.lastImi!.vars.get(9)!) / 3},
      {axis: Util.INTEGER_TO_NAME_MAP.get(4), value: (this.lastImi!.vars.get(10)! + this.lastImi!.vars.get(11)! + this.lastImi!.vars.get(12)!) / 3},
      {axis: Util.INTEGER_TO_NAME_MAP.get(5), value: (this.lastImi!.vars.get(13)! + this.lastImi!.vars.get(14)! + this.lastImi!.vars.get(15)!) / 3}
    ];
    this.data = [big5Graph];

    //compute imi score
    let score = 0;
    for (let obj of big5Graph) {
      score += obj.value;
    }
    return score / 5;
  }

  saveChanges(): void {
    let mapVars = new Map([
      [1, this.sliderValues.value1],
      [2, this.sliderValues.value2],
      [3, this.sliderValues.value3],
      [4, this.sliderValues.value4],
      [5, this.sliderValues.value5],
      [6, this.sliderValues.value6],
      [7, this.sliderValues.value7],
      [8, this.sliderValues.value8],
      [9, this.sliderValues.value9],
      [10, this.sliderValues.value10],
      [11, this.sliderValues.value11],
      [12, this.sliderValues.value12],
      [13, this.sliderValues.value13],
      [14, this.sliderValues.value14],
      [15, this.sliderValues.value15]
    ]);

    this.appUser.imis[this.appUser.imis.length - 1].vars = mapVars;

    if (this.appUser.services) { // is provider
      this.providerService.updateImi(this.appUser.id, mapVars)
        .subscribe(appUser => {
          const imiScore = this.updateVarsAndData();
          this.onImiRecalculated.emit(imiScore); // pass imi score to parent component
          this.createChart(); // redraw radar chart
          console.log("Updated!");
        });

    } else { // is client
      this.clientService.updateImi(this.appUser.id, mapVars)
        .subscribe(appUser => {
          const imiScore = this.updateVarsAndData();
          this.onImiRecalculated.emit(imiScore); // pass imi score to parent component
          this.createChart(); // redraw radar chart
          console.log("Updated!");
        });
    }
    
    this.disabledSliders = true;
  }

  createChart(): void {
    if (this.data.length === 0) {
      this.renderer.setProperty(this.chartContainer.nativeElement, 'innerHTML', '<p class="gray-700 centered" style="width: 370px; margin-top: 100px;">No data to show.</p>');
      return;
    }

    // remove any pre-existing chart
    d3.select(this.chartContainer.nativeElement)
      .selectChild('svg')
      .remove();

    const color = d3.scaleOrdinal()
				.range(["#EDC951","#CC333F","#00A0B0"]);
				
		let radarChartOptions = {
			  w: this.dimensions.boundedWidth,
			  h: this.dimensions.boundedHeight,
			  maxValue: 5,
			  levels: 5,
			  roundStrokes: true,
			  color: color,
        labelFactor: 1.25, 	// How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		// The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, 	// The opacity of the area of the blob
        dotRadius: 4, 			// The size of the colored circles of each blob
        opacityCircles: 0.1, 	// The opacity of the circles of each blob
        strokeWidth: 2 		// The width of the stroke around each blob
			};
			// Call function to draw the Radar chart
			this.drawCustomRadarChart(this.data, radarChartOptions);
  }

  drawCustomRadarChart(data: any, cfg: any): void {
    var maxValue = cfg.maxValue; 
		
    var allAxis = (data[0].map((i: any, j: any) => i.axis)),	//Names of each axis
      total = allAxis.length,					//The number of different axes
      radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
      //Format = d3.format('.0%'),			 	//Percentage formatting
      angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
    
    //Scale for the radius
    var rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    // SVG container
    this.wrapper = d3.select(this.chartContainer.nativeElement)
      .append("svg")
        .attr("width", this.dimensions.width)
        .attr("height", this.dimensions.height);
    // inner g
    this.bounds = this.wrapper.append("g")
        .attr("transform", 'translate(' + (cfg.w/2 + this.dimensions.marginLeft) + ', ' + (cfg.h/2 + this.dimensions.marginTop) + ')');


    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////
    
    //Filter for the outside glow
    var filter = this.bounds.append('defs').append('filter').attr('id','glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    // Wrapper for the grid & axes
	  var axisGrid = this.bounds.append("g").attr("class", "axisWrapper");

    // Draw the background circles
    axisGrid.selectAll(".levels")
      .data(d3.range(1,(cfg.levels + 1)).reverse())
      .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", (d: number, i: number) => radius/cfg.levels*d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", (d: number) => -d*radius/cfg.levels)
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text((d: number, i: any) => d);

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////
      
    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
    //Append the lines
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d: number, i: number) => rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
      .attr("y2", (d: number, i: number) => rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d: number, i: number) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2))
      .attr("y", (d: number, i: number) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2))
      .text((d: string) => d)
      .call(this.wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////
      
    //The radial line function
    var radarLine = d3.lineRadial()
      .curve(d3.curveLinearClosed)
      .radius((d: any) => rScale(d.value))
      .angle((d: any, i: number) => i * angleSlice);
      
    if (cfg.roundStrokes) {
      //radarLine.interpolate("cardinal-closed");
      radarLine.curve(d3.curveCardinalClosed);
    }
          
    //Create a wrapper for the blobs	
    var blobWrapper = this.bounds.selectAll(".radarWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarWrapper");
        
    //Append the backgrounds	
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", (d: any, i: any) => radarLine(d))
      .style("fill", (d: any, i: any) => cfg.color(i))
      .style("fill-opacity", cfg.opacityArea)
      .on('mouseover', (event: any, d: any) => {
        //Dim all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", 0.1); 
        //Bring back the hovered over blob
        d3.select(event.currentTarget)
          .transition().duration(200)
          .style("fill-opacity", 0.7);	
      })
      .on('mouseout', () => {
        //Bring back all blobs
        d3.selectAll(".radarArea")
          .transition().duration(200)
          .style("fill-opacity", cfg.opacityArea);
      });
      
    //Create the outlines	
    blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", (d: any, i: any) => radarLine(d))
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", (d: any, i: any) => cfg.color(i))
      .style("fill", "none")
      .style("filter" , "url(#glow)");		

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
      .data((d: any, i: any) => d)
      .enter().append("circle")
      .attr("class", "radarCircle")
      .attr("r", cfg.dotRadius)
      .attr("cx", (d: any, i: any) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
      .attr("cy", (d: any, i: any) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
      .style("fill", (d: any, i: any, j: any) => cfg.color(j))
      .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////
      
    //Wrapper for the invisible circles on top
    var blobCircleWrapper = this.bounds.selectAll(".radarCircleWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarCircleWrapper");
      
    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
      .data((d: any, i: any) => d)
      .enter()
      .append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", (d: any, i: any) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
        .attr("cy", (d: any, i: any) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", (event: any, d: any) => {
          let newX = parseFloat(d3.select(event.currentTarget).attr('cx')) - 10;
          let newY = parseFloat(d3.select(event.currentTarget).attr('cy')) - 10;
              
          tooltip
            .attr('x', newX)
            .attr('y', newY)
            .text(d.value)
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(200)
            .style("opacity", 0);
        });
      
    //Set up the small tooltip for when you hover over a circle
    var tooltip = this.bounds.append("text")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  /////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	wrap(text: any, width: any): void {
	  text.each((d: any, i: any, nodes: any) => {
      var text = d3.select(nodes[i]),
        words = text.text().split(/\s+/).reverse(),
        word,
        line: any[] = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node()!.getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
	  });
	}//wrap	

}
