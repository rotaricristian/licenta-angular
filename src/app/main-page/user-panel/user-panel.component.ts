import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { ServerConnectionService } from '../../server-connection/server-connection.service';
import { Prosumer } from '../../interfaces.type';
import { Observable } from 'rxjs/Observable';

var Highcharts = require('highcharts');
require('highcharts-draggable-points')(Highcharts);

@Component({
  selector: 'user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements AfterViewInit {


    constructor(private serverService: ServerConnectionService) { }
    
    public loading = false;

    public prod_name :string = "";
    public prod_cnp :string = "";
    public prod_address :string = "";

    public cons_name :string = "";
    public cons_cnp :string = "";
    public cons_address :string = "";

    private curve: Array<number>=[];


    private consumerChart=null;
    private producerChart=null;
    private demandChart=null;
    private productionChart=null;
    private balanceChart=null;

    private _showCurves:boolean;

    @Input() set showCurves(value: boolean) {
        console.log('set')
        this._showCurves = value;
    }

    @Output() updateGraph: EventEmitter<any> = new EventEmitter<any>();
  

  ngAfterViewInit()  {
    this.producerChart = new Highcharts.Chart({
      
          chart: {
              renderTo: 'producerContainer',
              animation: false,
              height: 200,
              backgroundColor: '#DDDDDD'
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
              categories: [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23','24']
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

    for(var i =0;i<24;i++){
        this.curve[4*i]=Math.round(this.producerChart.series[0].data[i].y/4);
        this.curve[4*i+1]=Math.round(this.producerChart.series[0].data[i].y/4);
        this.curve[4*i+2]=Math.round(this.producerChart.series[0].data[i].y/4);
        this.curve[4*i+3]=Math.round(this.producerChart.series[0].data[i].y/4);
    }

    var prosumer :Prosumer ={
        name:'',
        cnp:'',
        homeAddress:'',
        baselineConsumption:[]
    }
    prosumer.name=this.prod_name;
    prosumer.cnp=this.prod_cnp;
    prosumer.homeAddress=this.prod_address;
    prosumer.baselineConsumption=this.curve;
    this.loading=true;
    this.serverService.addProducer(prosumer).subscribe(
              data => { 
                  this.updateGraph.emit();
                  console.log(data)},
              err => {
                    this.loading =false;
                    console.error(err);}
                  ,
              () => {
                  this.loading=false;
              }
            );


  }

  addConsumer(event){
    for(var i =0;i<24;i++){
        this.curve[4*i]=Math.round(this.consumerChart.series[0].data[i].y/4);
        this.curve[4*i+1]=Math.round(this.consumerChart.series[0].data[i].y/4);
        this.curve[4*i+2]=Math.round(this.consumerChart.series[0].data[i].y/4);
        this.curve[4*i+3]=Math.round(this.consumerChart.series[0].data[i].y/4);
    }

    var prosumer :Prosumer ={
        name:'',
        cnp:'',
        homeAddress:'',
        baselineConsumption:[]
    }
    prosumer.name=this.cons_name;
    prosumer.cnp=this.cons_cnp;
    prosumer.homeAddress=this.cons_address;
    prosumer.baselineConsumption=this.curve;
    this.loading=true;
    this.serverService.addConsumer(prosumer).subscribe(
              data => { console.log(data);
                this.updateGraph.emit();},
              err => {
                    this.loading =false;
                    console.error(err);}
                  ,
              () => {
                  this.loading=false;
              }
            );
    }

  onTabClick(event: MatTabChangeEvent) {
    if(event.index==1){
        if(this.consumerChart==null){
            this.consumerChart = new Highcharts.Chart({
                
                    chart: {
                        renderTo: 'consumerContainer',
                        animation: false,
                        height: 200,
                        backgroundColor: '#DDDDDD'
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
                        categories: [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23','24']
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
    } else if(event.index==2 && this._showCurves){
        this.createGridCharts();
    }

  }

  createGridCharts(){

     // if(this.productionChart!=null) return;
      var gridProd:any=[];
      var gridCons:any=[];
      var gridBalance:any=[];

      Observable.forkJoin(
        this.serverService.getGridProduction(),
        this.serverService.getGridBalance(),
        this.serverService.getGridDemand(),
    ).subscribe(response => {
        gridProd = <any>response[0].body;
        gridBalance = <any>response[1].body;
        gridCons = <any>response[2].body;


        this.productionChart = new Highcharts.Chart({
        
            chart: {
                renderTo: 'productionContainer',
                animation: false,
                height: 185,
                backgroundColor: '#DDDDDD'
                //margin: [0, 0, 0, 0]
            },
            legend: {
              enabled: false
           },
           credits: {
              enabled: false
          },
            
            title: {
                text: 'Total Estimated Grid Production'
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
                //categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23']
            },
        
            plotOptions: {
                series: {
                   // dragMaxY:500,
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
                data:gridProd,
                draggableY: false
            }]
        
        });

        this.demandChart = new Highcharts.Chart({
            
                chart: {
                    renderTo: 'consumptionContainer',
                    animation: false,
                    height: 185,
                    backgroundColor: '#DDDDDD'
                    //margin: [0, 0, 0, 0]
                },
                legend: {
                  enabled: false
               },
               credits: {
                  enabled: false
              },
                
                title: {
                    text: 'Total Estimated Grid Consumption'
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
                    //categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23']
                },
            
                plotOptions: {
                    series: {
                       // dragMaxY:500,
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
                    data: gridCons,
                    draggableY: false
                }]
            
            });
            this.balanceChart = new Highcharts.Chart({
                
                    chart: {
                        renderTo: 'balanceContainer',
                        animation: false,
                        height: 185,
                        backgroundColor: '#DDDDDD'
                        //margin: [0, 0, 0, 0]
                    },
                    legend: {
                      enabled: false
                   },
                   credits: {
                      enabled: false
                  },
                    
                    title: {
                        text: 'Estimated Grid Balance'
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
                        //categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23']
                    },
                
                    plotOptions: {
                        series: {
                           // dragMaxY:500,
                            dragMinY:0,
                            dragPrecisionY:1,
                            color: 'blue',
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
                        data:gridBalance,
                        draggableY: false
                    }]
                
                });
    });

  }

}
