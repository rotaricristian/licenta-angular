import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTabChangeEvent, MatSelectChange } from '@angular/material';
import { ServerConnectionService } from '../../server-connection/server-connection.service';
import { Prosumer } from '../../interfaces.type';
import { Observable } from 'rxjs/Observable';
import { FormControl, Validators } from '@angular/forms';

var Highcharts = require('highcharts');
require('highcharts-draggable-points')(Highcharts);

@Component({
  selector: 'user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements AfterViewInit {


    constructor(private serverService: ServerConnectionService) { }
    
    produtionControl = new FormControl('', [Validators.required]);

    productionOptions = [
        {value: 'solar', viewValue: 'Solar Panels'},
        {value: 'hydro', viewValue: 'Hydro Plant'},
        {value: 'wind', viewValue: 'Wind Turbine'}
    ];

    selectedProduction: string=null;

    consumptionOptions = [
        {value: 'fco', viewValue: 'FCO\'s Office'},
        {value: 'education', viewValue: 'Department of Education'},
        {value: 'archives', viewValue: 'National Archives Building'},
        {value: 'building', viewValue: 'Bristol Building'}
    ];

    selectedConsumption: string=null;

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

    // private _showCurves:boolean =false;

    // @Input() set showCurves(value: boolean) {
    //     console.log(this._showCurves)
    //     this._showCurves = value;
    // }

    @Output() updateGraph: EventEmitter<any> = new EventEmitter<any>();
  

  ngAfterViewInit()  {
    


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
                  this.prod_address='';
                  this.prod_name='';
                  this.prod_cnp='';
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
                this.updateGraph.emit();
                this.cons_address='';
                this.cons_cnp='';
                this.cons_name='';    
            },
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
       
    } else if(event.index==2){
        this.createGridCharts();
    }

  }

  createGridCharts(){

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
                style: {
                    fontFamily: 'Roboto, sans-serif',
                    color: "#c6c7cb"
                },
                renderTo: 'productionContainer',
                animation: false,
                height: 185,
                backgroundColor: '#40444f'
                //margin: [0, 0, 0, 0]
            },
            legend: {
              enabled: false
           },
           credits: {
              enabled: false
          },
            
            title: {
                style: {
                    color: '#c6c7cb'
                 
                 },
                text: 'Total Estimated Grid Production'
            },
            yAxis: {
                labels: {
                    style: {
                        color: '#c6c7cb',
                        fontFamily: 'Roboto, sans-serif'
                      
                    }},
              allowDecimals: false,
              title: {
                  text: 'KWh',
                  style: {
                    color: '#c6c7cb',
                    fontFamily: 'Roboto, sans-serif'
                  
                 },
              }
            },
        
            xAxis: {
                labels: {
                    style: {
                        color: '#c6c7cb',
                        fontFamily: 'Roboto, sans-serif'
                      
                    }},
              title: {
                  text: 'General Index',
                  style: {
                    color: '#c6c7cb',
                    fontFamily: 'Roboto, sans-serif'
                  
                 },
              },
                //categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23']
            },
        
            plotOptions: {
                series: {
                   // dragMaxY:500,
                    dragMinY:0,
                    dragPrecisionY:1,
                    color: '#43A047',
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
                    style: {
                        fontFamily: 'Roboto, sans-serif',
                        color: "#c6c7cb"
                    },
                    renderTo: 'consumptionContainer',
                    animation: false,
                    height: 185,
                    backgroundColor: '#40444f'
                    //margin: [0, 0, 0, 0]
                },
                legend: {
                  enabled: false
               },
               credits: {
                  enabled: false
              },
                
                title: {
                    style: {
                        color: '#c6c7cb'
                     
                     },
                    text: 'Total Estimated Grid Consumption'
                },
                yAxis: {
                    labels: {
                        style: {
                            color: '#c6c7cb',
                            fontFamily: 'Roboto, sans-serif'
                          
                        }},
                  allowDecimals: false,
                  title: {
                      text: 'KWh',
                      style: {
                        color: '#c6c7cb',
                        fontFamily: 'Roboto, sans-serif'
                      
                     },
                  }
                },
            
                xAxis: {
                    labels: {
                        style: {
                            color: '#c6c7cb',
                            fontFamily: 'Roboto, sans-serif'
                          
                        }},
                  title: {
                      text: 'General Index',
                      style: {
                        color: '#c6c7cb',
                        fontFamily: 'Roboto, sans-serif'
                      
                     },
                  },
                    //categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23']
                },
            
                plotOptions: {
                    series: {
                       // dragMaxY:500,
                        dragMinY:0,
                        dragPrecisionY:1,
                        color: '#e53935',
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
                        style: {
                            fontFamily: 'Roboto, sans-serif',
                            color: "#c6c7cb"
                        },
                        renderTo: 'balanceContainer',
                        animation: false,
                        height: 185,
                        backgroundColor: '#40444f'
                        //margin: [0, 0, 0, 0]
                    },
                    legend: {
                      enabled: false
                   },
                   credits: {
                      enabled: false
                  },
                    
                    title: {
                        style: {
                            color: '#c6c7cb'
                         
                         },
                        text: 'Estimated Grid Balance'
                    },
                    yAxis: {
                        labels: {
                            style: {
                                color: '#c6c7cb',
                                fontFamily: 'Roboto, sans-serif'
                              
                            }},
                      allowDecimals: false,
                      title: {
                          text: 'KWh',
                          style: {
                            color: '#c6c7cb',
                            fontFamily: 'Roboto, sans-serif'
                          
                         },
                      }
                    },
                
                    xAxis: {
                        labels: {
                            style: {
                                color: '#c6c7cb',
                                fontFamily: 'Roboto, sans-serif'
                              
                            }},
                      title: {
                          text: 'General Index',
                          style: {
                            color: '#c6c7cb',
                            fontFamily: 'Roboto, sans-serif'
                          
                         },
                      },
                        //categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23']
                    },
                
                    plotOptions: {
                        series: {
                           // dragMaxY:500,
                            dragMinY:0,
                            dragPrecisionY:1,
                            color: '#3949AB',
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

  createProductionChart(){
      if(this.selectedProduction!=null){
        let dataset=null;
        switch(this.selectedProduction) {
            case this.productionOptions[0].value:
                //solar
                dataset = [0, 0, 0, 0, 0, 1, 3, 5, 8, 10, 20, 37, 55, 60, 53, 50, 45, 37, 32, 20, 8, 3, 0, 0];
                break;
            case this.productionOptions[1].value:
                //hydro
                dataset = [715, 771, 756, 769, 774, 776, 755, 768, 716, 764, 755, 754, 771, 756, 759, 744, 766, 775, 768, 796, 794, 795, 754,719];
                break;
            case this.productionOptions[2].value:
                //wind
                dataset = [65, 54, 52, 15, 20, 19, 35, 34, 35, 33, 46, 66, 73, 58, 60, 47, 11, 9, 8, 21, 36, 80, 73, 75];
                break;
        }
        this.producerChart = new Highcharts.Chart({
            
                chart: {
                    style: {
                        fontFamily: 'Roboto, sans-serif',
                        color: "#c6c7cb"
                    },
                    renderTo: 'producerContainer',
                    animation: false,
                    height: 200,
                    backgroundColor: '#40444f'
                    //margin: [0, 0, 0, 0]
                },
                legend: {
                  enabled: false
               },
               credits: {
                  enabled: false
              },
                
                title: { 
                    style: {
                    color: '#c6c7cb'
                 
                 },
                    text: 'Estimated Production During the day'
                },
                yAxis: {
                    labels: {
                        style: {
                            color: '#c6c7cb',
                            fontFamily: 'Roboto, sans-serif'
                          
                        }},
                  allowDecimals: false,
                  title: {
                      text: 'KWh',
                      style: {
                        color: '#c6c7cb',
                        fontFamily: 'Roboto, sans-serif'
                      
                     },
                  }
                },
            
                xAxis: {
                    labels: {
                        style: {
                            color: '#c6c7cb',
                            fontFamily: 'Roboto, sans-serif'
                          
                        }},
                  title: {
                      text: 'Hour',
                      style: {
                        color: '#c6c7cb'
                      
                     },
                  },
                    //categories: [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23','24']
                },
            
                plotOptions: {
                    series: {
                        dragMaxY:1000,
                        dragMinY:0,
                        dragPrecisionY:1,
                        color: '#43A047',
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
                    data: dataset,
                    draggableY: true
                }]
            
            });
      }
  }

  createConsumptionChart(){
    if(this.selectedConsumption!=null){
      let dataset=null;
      switch(this.selectedConsumption) {
             case this.consumptionOptions[0].value:
                 //fco
                dataset = [299.1,303.2,301.4,302.2,316.3,346.1,399,485.5,543.7,550.7,532.8,550.6,543.8,542.9,534.8,524.8,483.9,426.1,383.9,373.7,367.2,356.6,336.2,337];
                break;
            case this.consumptionOptions[1].value:
                //education
                dataset = [50.85,53.02,52.48,53.02,53.56,66.54,78.44,77.9,82.23,96.84,95.76,94.13,94.68,93.05,93.59,84.4,77.36,70.87,64.38,54.64,52.48,47.61,48.15,47.61];
                break;
            case this.consumptionOptions[2].value:
                //archives
                dataset = [410.6,429.8,435.4,420.2,407,420.8,424.8,426.6,437.6,431.6,423,431.8,423.4,422.2,425.6,427.6,401.6,399.6,400.4,451.2,421.8,454.6,439.8,422.8];
                break;
            case this.consumptionOptions[3].value:
                //building1
                dataset = [26,31.8,30.4,30.1,26.7,26.6,27.9,43.8,47.2,51.9,51.5,55.9,56.7,53.9,55.6,50.2,48.9,46.2,24.2,23.4,23.2,24.2,25.7,24.7];
                break;
      }
      this.consumerChart = new Highcharts.Chart({
        
            chart: {
                style: {
                    fontFamily: 'Roboto, sans-serif',
                    color: "#c6c7cb"
                },
                renderTo: 'consumerContainer',
                animation: false,
                height: 200,
                backgroundColor: '#40444f',
            },
            legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
            
            title: {
                style: {
                    color: '#c6c7cb'
                 
                 },
                text: 'Estimated Consumption During the day'
            },
            yAxis: {
                labels: {
                    style: {
                        color: '#c6c7cb',
                        fontFamily: 'Roboto, sans-serif'
                      
                    }},
            allowDecimals: false,
            title: {
                text: 'KWh',
                style: {
                    color: '#c6c7cb',
                    fontFamily: 'Roboto, sans-serif'
                  
                 },
            }
            },
        
            xAxis: {
                labels: {
                    style: {
                        color: '#c6c7cb',
                        fontFamily: 'Roboto, sans-serif'
                      
                    }},
            title: {
                text: 'Hour',
                 style: {
                    color: '#c6c7cb',
                    fontFamily: 'Roboto, sans-serif'
                  
                 },
            },
                //categories: [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11','12','13','14','15','16','17','18','19','20','21','22','23','24']
            },
        
            plotOptions: {
                series: {
                    dragMaxY:1000,
                    dragMinY:0,
                    dragPrecisionY:1,
                    color: '#e53935',
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
                data: dataset,
                draggableY: true
            }]
        
        });
    }
}

  changeProduction($event: EventEmitter<MatSelectChange>) {
        this.selectedProduction=$event+'';
        this.createProductionChart();
    }

    changeConsumption($event: EventEmitter<MatSelectChange>) {
        this.selectedConsumption=$event+'';
        this.createConsumptionChart();
    }

}