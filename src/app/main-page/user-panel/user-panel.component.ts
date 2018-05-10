import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
var Highcharts = require('highcharts');
require('highcharts-draggable-points')(Highcharts);

@Component({
  selector: 'user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements AfterViewInit {

    public prod_name :string = "";
    public prod_cnp :string = "";
    public prod_address :string = "";
    private production: Array<number>=[];


  constructor() { }

  private consumerChart=null;
  private producerChart=null;
  

  ngAfterViewInit()  {
   
    this.producerChart = new Highcharts.Chart({
      
          chart: {
              renderTo: 'producerContainer',
              animation: false,
              height: 200,
              backgroundColor: 'lightblue'
              //margin: [0, 0, 0, 0]
          },
          legend: {
            enabled: false
         },
         credits: {
            enabled: false
        },
          
          title: {
              text: 'Estimated Production During the day'
          },
          yAxis: {
            allowDecimals: false,
            title: {
                text: 'KWh'
            }
          },
      
          xAxis: {
            title: {
                text: 'Hour'
            },
              categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23']
          },
      
          plotOptions: {
              series: {
                  dragMaxY:500,
                  dragMinY:0,
                  dragPrecisionY:1,
                  color: 'green',
                  point: {
                      events: {
      
                          drag: function (e) {
                          },
                          drop: function () {
                            //console.log(chart.series[0].data[0].y);
                            }
                      }
                  },
                  stickyTracking: false
              },
              line: {
                  cursor: 'ns-resize'
              }
          },
      
         
      
          series: [ {
              data: [15, 71, 56, 69, 74, 76, 55, 68, 16, 64, 55, 54, 71, 56, 59, 44, 66, 75, 68, 96, 94, 95, 54,19],
              draggableY: true
          }]
      
      });


  }

  addProducer(event){
    console.log(this.prod_name);
    console.log(this.prod_cnp);
    console.log(this.prod_address);

    for(var i =0;i<24;i++){
        this.producerChart.series[0].data[i].y
        this.production[4*i]=Math.round(this.producerChart.series[0].data[i].y/4);
        this.production[4*i+1]=Math.round(this.producerChart.series[0].data[i].y/4);
        this.production[4*i+2]=Math.round(this.producerChart.series[0].data[i].y/4);
        this.production[4*i+3]=Math.round(this.producerChart.series[0].data[i].y/4);
    }
    console.log(this.production);


  }

  addConsumer(event){
    console.log('addc');
    }

  onTabClick(event: MatTabChangeEvent) {
    if(this.consumerChart==null){
        this.consumerChart = new Highcharts.Chart({
            
                chart: {
                    renderTo: 'consumerContainer',
                    animation: false,
                    height: 200,
                    backgroundColor: 'lightblue'
                    //margin: [0, 0, 0, 0]
                },
                legend: {
                  enabled: false
               },
               credits: {
                  enabled: false
              },
                
                title: {
                    text: 'Estimated Consumption During the day'
                },
                yAxis: {
                  allowDecimals: false,
                  title: {
                      text: 'KWh'
                  }
                },
            
                xAxis: {
                  title: {
                      text: 'Hour'
                  },
                    categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23']
                },
            
                plotOptions: {
                    series: {
                        dragMaxY:500,
                        dragMinY:0,
                        dragPrecisionY:1,
                        color: 'red',
                        point: {
                            events: {
            
                                drag: function (e) {
                                },
                                drop: function () {
                                  //console.log(chart.series[0].data[0].y);
                                  }
                            }
                        },
                        stickyTracking: false
                    },
                    line: {
                        cursor: 'ns-resize'
                    }
                },
            
               
            
                series: [ {
                    data: [15, 71, 56, 69, 74, 76, 55, 68, 16, 64, 55, 54, 71, 56, 59, 44, 66, 75, 68, 96, 94, 95, 54,19],
                    draggableY: true
                }]
            
            });
    }

  }

}
