import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { ServerConnectionService } from '../../server-connection/server-connection.service';
import { Prosumer } from '../../interfaces.type';

var Highcharts = require('highcharts');
require('highcharts-draggable-points')(Highcharts);

@Component({
  selector: 'user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements AfterViewInit {

    public loading = false;

    public prod_name :string = "";
    public prod_cnp :string = "";
    public prod_address :string = "";
    private production: Array<number>=[];


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


  constructor(private serverService: ServerConnectionService) { }

  

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
        this.producerChart.series[0].data[i].y
        this.production[4*i]=Math.round(this.producerChart.series[0].data[i].y/4);
        this.production[4*i+1]=Math.round(this.producerChart.series[0].data[i].y/4);
        this.production[4*i+2]=Math.round(this.producerChart.series[0].data[i].y/4);
        this.production[4*i+3]=Math.round(this.producerChart.series[0].data[i].y/4);
    }

    var prosumer :Prosumer ={
        name:'',
        cnp:'',
        address:'',
        baseline:[]
    }
    prosumer.name=this.prod_name;
    prosumer.cnp=this.prod_cnp;
    prosumer.address=this.prod_address;
    prosumer.baseline=this.production;
    this.loading=true;
    console.log('start');
    this.serverService.addProducer(prosumer).subscribe(
              data => { console.log(data)},
              err => console.error(err),
              () => {
                  console.log('over');
                  this.loading=false;
              }
            );

  }

  addConsumer(event){
    console.log('addc');
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
      if(this.productionChart!=null) return;
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
                categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23']
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
                data: [15, 71, 56, 69, 74, 76, 55, 68, 16, 64, 55, 54, 71, 56, 59, 44, 66, 75, 68, 96, 94, 95, 54,19],
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
                    categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23']
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
                    data: [15, 71, 56, 69, 74, 76, 55, 68, 16, 64, 55, 54, 71, 56, 59, 44, 66, 75, 68, 96, 94, 95, 54,19],
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
                        categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23']
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
                        data: [15, 71, 56, 69, 74, 76, 55, 68, 16, 64, 55, 54, 71, 56, 59, 44, 66, 75, 68, 96, 94, 95, 54,19],
                        draggableY: false
                    }]
                
                });
  }

}
