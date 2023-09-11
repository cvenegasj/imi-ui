import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DimensionsType } from '../models/types';
import * as d3 from "d3";
import { ClientService } from '../services/client.service';
import { GeoGeometryObjects } from 'd3';
import { Util } from '../utils/util';
import { forkJoin, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import { invalid } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-imi-map-plot',
  templateUrl: './imi-map-plot.component.html',
  styleUrls: ['./imi-map-plot.component.css']
})
export class ImiMapPlotComponent implements OnInit {

  showLoader: boolean = true;

  @ViewChild('chartContainer', {static: true}) 
  chartContainer!: ElementRef;

  dimensions: DimensionsType;
  wrapper: any;
  bounds: any;
  lines: any;

  countryShapes: any;
  data: any = {};

  @ViewChild('industryInput')
  industryInput!: ElementRef<HTMLInputElement>;

  myControl1 = new FormControl();

  selectedImiDimension = 0;
  selectedIndustries: string[] = [];

  // industries
  industries: string[] = Util.INDUSTRY_LIST;
  filteredIndustries: Observable<string[]>;

  constructor(
    private clientService: ClientService,
  ) {
    this.dimensions = {
      marginTop: 20,
      marginRight: 10,
      marginBottom: 20,
      marginLeft: 10,
      height: 300,
      width: 780,
    }
    this.dimensions = {
      ...this.dimensions, 
      boundedHeight: Math.max(this.dimensions.height - this.dimensions.marginTop - this.dimensions.marginBottom, 0),
      boundedWidth: Math.max(this.dimensions.width - this.dimensions.marginLeft - this.dimensions.marginRight, 0),
    }

    // filters for autocomplete controls
    this.filteredIndustries = this.myControl1.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter1(value))
      );
  }

  ngOnInit(): void {
    // Promise.all([
    //   d3.json('./assets/world-geojson.json'), 
    //   d3.csv('./assets/data-bank-data.csv')
    // ])
    //   .then(res => {
    //     this.countryShapes = res[0];
    //     console.log(res[0]);
        
    //     // create map with country code as key, and population growth % as value  
    //     let metricDataByCountry: any = {};
    //     res[1].forEach((d: any) => {
    //       metricDataByCountry[d["Country Code"]] = +d["2021 [YR2021]"] || 0;
    //     });

    //     console.log(metricDataByCountry);
    //     this.data = metricDataByCountry;
        
    //     this.cleanAndCreateChart();
    //   });

      forkJoin({
        geoData: d3.json('./assets/world-geojson.json'),
        imiData: this.clientService.getAllCountriesImiForDisplay(),
      })
      .subscribe(res => {
        this.showLoader = false;

        this.countryShapes = res.geoData;
        this.data = res.imiData;

        this.cleanAndCreateChart();
    });
  }

  cleanAndCreateChart(): void {
    const sphere: GeoGeometryObjects = ({type: "Sphere"});
    const projection = d3.geoNaturalEarth1().fitWidth(this.dimensions.boundedWidth!, sphere);

    // get height of map plot
    const pathGenerator = d3.geoPath(projection);
    const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere);
    this.dimensions.boundedHeight = y1;
    this.dimensions.height = this.dimensions.boundedHeight
        + this.dimensions.marginTop + this.dimensions.marginBottom;

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

    const countryNameAccessor = (d: any) => d.properties["NAME"];
    //const countryIdAccessor = (d: any) => d.properties["COUNTRY ADM0_A3_IS"];
    const countryIdAccessor = (d: any) => d.properties["ADM0_ISO"];

    // Color scales
    //const metricValues: any = Object.values(this.data);
    //const metricValueExtent: any = d3.extent(metricValues);
    //const maxChange = d3.max([-metricValueExtent[0], metricValueExtent[1]]);

    const colorRange: any = ["white", "#00b34a"];
    const colorScale = d3.scaleLinear().domain([0, 5]) // imi range
                                        .range(colorRange);

    // earth + graticule
    const earth = this.bounds.append("path")
                              .attr("class", "earth")
                              .attr("d", pathGenerator(sphere));
    const graticuleJson = d3.geoGraticule10();
    const graticule = this.bounds.append("path")
                              .attr("class", "graticule")
                              .attr("d", pathGenerator(graticuleJson));

    // countries
    const countries = this.bounds.selectAll(".country")
                                  .data(this.countryShapes.features)
                                  .enter()
                                  .append("path")
                                    .attr("class", "country")
                                    .attr("d", pathGenerator)
                                    .attr("fill", (d: any) => {
                                      let metricValue = 0;
                                      //console.log(this.data[countryIdAccessor(d)]);

                                      if (typeof this.data[countryIdAccessor(d)] == "undefined") {
                                        //console.log(`Country key not found in IMI: ${countryIdAccessor(d)}`);
                                        return "#e2e6e9";
                                      }

                                      switch (this.selectedImiDimension) {
                                        case 0:
                                          metricValue = this.data[countryIdAccessor(d)][0].value;
                                          break;
                                        case 1:
                                          metricValue = this.data[countryIdAccessor(d)][1].value;
                                          break;
                                        case 2:
                                          metricValue = this.data[countryIdAccessor(d)][2].value;
                                          break;
                                        case 3:
                                          metricValue = this.data[countryIdAccessor(d)][3].value;
                                          break;
                                        case 4:
                                          metricValue = this.data[countryIdAccessor(d)][4].value;
                                          break;
                                        case 5:
                                          metricValue = this.data[countryIdAccessor(d)][5].value;
                                          break;
                                        default:
                                          break;
                                      }
                                      
                                      //if (typeof metricValue == "undefined") return "#e2e6e9";

                                      return colorScale(metricValue);
                                    });

    // legend with gradient
    const legendGroup = this.wrapper.append("g")
                                      .attr("transform", `translate(${ 100 }, ${ this.dimensions.width < 700 ? 
                                          this.dimensions.boundedHeight - 30 : this.dimensions.boundedHeight * 0.7 })`);
    const legendTitle = legendGroup.append("text")
                                      .attr("y", -10)
                                      .attr("class", "legend-title")
                                      .text("IMI score");
    const defs = this.wrapper.append("defs");
    const legendGradientId = "legend-gradient";
    const gradient = defs.append("linearGradient")
                            .attr("id", legendGradientId)
                            .selectAll("stop")
                            .data(colorScale.range())
                            .enter()
                            .append("stop")
                            .attr("stop-color", (d: any) => d)
                            .attr("offset", (d: any, i: any) => `${ i * 100 }%`);
    const legendWidth = 120;
    const legendHeight = 16;
    const legendGradient = legendGroup.append("rect")
                            .attr("x", -legendWidth / 2)
                            .attr("height", legendHeight)
                            .attr("width", legendWidth)
                            .style("fill", `url(#${legendGradientId})`);
    const legendValueRight = legendGroup.append("text")
                            .attr("class", "legend-value")
                            .attr("x", legendWidth / 2 + 10)
                            .attr("y", legendHeight / 2)
                            .text(5);
    const legendValueLeft = legendGroup.append("text")
                            .attr("class", "legend-value")
                            .attr("x", -legendWidth / 2 - 10)
                            .attr("y", legendHeight / 2) .text(0)
                            .style("text-anchor", "end");

    // mouse interactions
    const tooltip = d3.select("#tooltip");

    countries.on('mouseenter', (d: any) => {
          //console.log(d);
        
          if (typeof this.data[countryIdAccessor(d.toElement.__data__)] == "undefined") {
            return;
          }

          tooltip.style("opacity", 1);

          let count = this.data[countryIdAccessor(d.toElement.__data__)][6].count;
          let metricValue = 0;
          
          switch (this.selectedImiDimension) {
            case 0:
              metricValue = this.data[countryIdAccessor(d.toElement.__data__)][0].value;
              break;
            case 1:
              metricValue = this.data[countryIdAccessor(d.toElement.__data__)][1].value;
              break;
            case 2:
              metricValue = this.data[countryIdAccessor(d.toElement.__data__)][2].value;
              break;
            case 3:
              metricValue = this.data[countryIdAccessor(d.toElement.__data__)][3].value;
              break;
            case 4:
              metricValue = this.data[countryIdAccessor(d.toElement.__data__)][4].value;
              break;
            case 5:
              metricValue = this.data[countryIdAccessor(d.toElement.__data__)][5].value;
              break;
            default:
              break;
          }

          tooltip.select("#country").text(countryNameAccessor(d.toElement.__data__));
          tooltip.select("#value1").text(`${d3.format(",.2f")(metricValue || 0)}`);
          tooltip.select("#value2").text(`${count}`);

          const [centerX, centerY] = pathGenerator.centroid(d.toElement.__data__);
          const x = centerX + this.dimensions.marginLeft;
          const y = centerY + this.dimensions.marginTop;
          tooltip.style("transform", `translate(calc( -50% + ${x}px), calc(-100% + ${y}px - 12px))`);
        })
         .on('mouseleave', (d: any) => {
          tooltip.style("opacity", 0);
         });
  }

  selectImiDimension(selectedValue: number): void {
    this.selectedImiDimension = selectedValue;
    this.cleanAndCreateChart();
  }

  selectIndustry(event: MatAutocompleteSelectedEvent): void {
    this.selectedIndustries = [event.option.viewValue];
    this.industryInput.nativeElement.value = '';
    this.myControl1.setValue('');

    // // get imi data of industry by country
    // this.clientService.getIndustryImiForDisplay(this.selectedIndustries[0])
    //   .subscribe(res => {
    //       //console.log(res);
    //       this.data[2] = res; //TODO
    //       this.cleanAndCreateChart();      
    //   });
  }

  removeIndustry() {
    this.selectedIndustries = [];
    // remove radar chart blot of country
    this.data[2] = [];
    this.cleanAndCreateChart();
  }

  private _filter1(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.industries.filter(option => option.toLowerCase().includes(filterValue));
  }
}
