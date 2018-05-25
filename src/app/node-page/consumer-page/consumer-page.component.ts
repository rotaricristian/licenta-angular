import {Component, OnInit, AfterViewInit} from '@angular/core';
import {ServerConnectionService} from '../../server-connection/server-connection.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Value, ValueResponse} from './../../interfaces.type';

const Highcharts = require('highcharts');
require('highcharts-draggable-points')(Highcharts);

@Component({
  selector: 'app-consumer-page',
  templateUrl: './consumer-page.component.html',
  styleUrls: ['./consumer-page.component.css']
})
export class ConsumerPageComponent implements OnInit {

  constructor(private serverService: ServerConnectionService, private router: Router) {}
  public loading = true;
  private url: string;
  public consumer: Consumer;
  public balance: number;
  public valueResponse: ValueResponse;

  public isValueChecked = false;
  public isDeviationOccurred = false;

  private consumerBaseline: any = [];
  private currentCurve: any = [];
  private curve: any = [];

  public value;
  public index = 0;
  //public currentIndex = 2;

  ngOnInit() {
    this.url = this.router.url;
    const cnp = this.url.split('/').pop();

    Observable.forkJoin(
      this.serverService.getConsumer(cnp),
      this.serverService.getConsumerBalance(cnp),
      this.serverService.getConsumerCurrentCurve(cnp)
    ).subscribe(response => {
      this.consumer = response[0].body as Consumer;
      this.balance = response[1].body as number;
      this.currentCurve = response[2].body;

      this.consumerBaseline = this.consumer.baselineConsumption;

      console.log(this.consumer);
      this.generateCurentCurve();
      this.generateBaselineConsumption();
      this.loading = false;
    });

  }

  checkValue(event) {
    console.log(this.value);
    console.log(this.index);
    this.loading = true;
    let valueRequest: Value = {
      value: 0,
      generalIndex: 0,
      cnp: ''
    };
    console.log(valueRequest.cnp);
    valueRequest.cnp = this.consumer.cnp;
    valueRequest.generalIndex = this.index;
    valueRequest.value = this.value;

    console.log(valueRequest);

    this.serverService.checkValue(valueRequest).subscribe(data => {
      console.log(data);
      this.valueResponse = data[0] as ValueResponse;
      this.index++;
      this.isDeviationOccurred = this.valueResponse.deviationOccurred;
    },
      err => {
        console.log(err);
        this.loading = false;
      },
      () => {
        //this.loading = false;
      });


    this.serverService.getConsumerBalance(this.consumer.cnp).subscribe(data => {
      this.balance = data.body as number;
    },
      err => {
        console.log(err);
        this.loading = false;
      },
      () => {
        this.loading = false;
      });
    this.generateCurentCurve();
    this.isValueChecked = true;
  }

  generateCurentCurve() {
    console.log(this.currentCurve);

    this.curve = new Highcharts.Chart(
      {

        chart: {
          renderTo: 'currentCurve',
          animation: false,
          height: 250,
          backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
          type: 'areaspline'
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },

        title: {
          text: 'Current Curve'
        },
        yAxis: {
          allowDecimals: false,
          title: {
            text: 'KWh'
          }
        },
        tooltip: {
          shared: true,
          valueSuffix: ' KWh'
        },
        xAxis: {
          title: {
            text: 'Index'
          },
          plotBands: [{
            from: 0,
            to: this.index,
            color: 'rgba(244, 149, 66, .2)'
          }]
        },

        plotOptions: {
          areaspline: {
            fillOpacity: 0.5
          },
          series: {
            dragMinY: 0,
            dragPrecisionY: 1,
            point: {
              events: {

                drag: function(e) {
                },
                drop: function() {
                }
              }
            },
            stickyTracking: false
          },
          line: {
            cursor: 'ns-resize'
          }
        },
        series: [{
          name: 'Ideal',
          data: this.currentCurve,
          draggableY: false
        }
          //          ,
          //        {
          //          name: 'Real',
          //          data: [4, 5, 13, 15, 17, 9, 10, 4],
          //          draggableY: false,
          //        }
        ]

      });
  }

  generateBaselineConsumption() {
    console.log(this.consumerBaseline);

    this.curve = new Highcharts.Chart(
      {

        chart: {
          renderTo: 'baselineConsumption',
          animation: false,
          height: 185,
          backgroundColor: '#DDDDDD'
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },

        title: {
          text: 'Baseline Consumption Curve'
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
          }
        },

        plotOptions: {
          series: {
            dragMinY: 0,
            dragPrecisionY: 1,
            color: 'red',
            point: {
              events: {

                drag: function(e) {
                },
                drop: function() {
                }
              }
            },
            stickyTracking: false
          },
          line: {
            cursor: 'ns-resize'
          }
        },
        series: [{
          data: this.consumerBaseline,
          draggableY: false
        }]

      });
  }

}

interface Consumer {
  name: string;
  homeAddress: string;
  cnp: string;
  baselineConsumption: any;
  curve: any[];
  accountPrivateKey: string;
  accountAddress: string;
  contractAddress: string;
}
