import { Component, OnInit } from '@angular/core';
import {ServerConnectionService} from "../../server-connection/server-connection.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "ngx-webstorage";
import {Value, ValueResponse} from "../../interfaces.type";
import {isUndefined} from "util";
import {Observable} from "rxjs/Observable";

const Highcharts = require('highcharts');
require('highcharts-draggable-points')(Highcharts);

@Component({
  selector: 'app-producer-page',
  templateUrl: './producer-page.component.html',
  styleUrls: ['./producer-page.component.css']
})
export class ProducerPageComponent implements OnInit {


  public HISTORY_BASE_CURVE: string;
  public HISTORY_BASE_INDEX: string;

  constructor(private serverService: ServerConnectionService, private router: Router, private localStorage: LocalStorageService) {
    this.HISTORY_BASE_CURVE = '~historyBaseCurve';
    this.HISTORY_BASE_INDEX = '~historyBaseIndex';
    this.producer = {
      name: '',
      homeAddress: '',
      cnp: '',
      baselineConsumption: [],
      accountPrivateKey: '',
      accountAddress: '',
      contractAddress: ''
    };
  }

  public loading = true;
  private url: string;
  public producer: Producer;
  public balance: number;
  public valueResponse: ValueResponse;

  public isValueChecked = false;
  public isDeviationOccurred = false;

  private producerBaseline: any = [];
  private curve: any[];
  public value;
  public index = 0;
  public cnp = '';

  //public currentIndex = 2;

  ngOnInit() {
    this.loading = true;
    this.url = this.router.url;
    this.cnp = this.url.split('/').pop();
    console.log(this.cnp + this.HISTORY_BASE_INDEX);
    let localIndex = this.localStorage.retrieve(this.cnp + this.HISTORY_BASE_INDEX);

    if (localIndex == null || isUndefined(localIndex)) {
      this.index = 0;
    } else {
      this.index = localIndex;
    }

    Observable.forkJoin(
      this.serverService.getProducer(this.cnp),
      this.serverService.getProducerBalance(this.cnp),
    ).subscribe(response => {
      this.producer = response[0].body as Producer;
      this.balance = response[1].body as number;

      this.producerBaseline = this.producer.baselineConsumption;

      console.log(this.producer);
      this.generateBaselineConsumption();
      this.loading = false;
    });

  }

  registerProduction(event) {
    console.log(this.value);
    console.log(this.index);
    this.loading = true;

    let valueRequest: Value = {
      value: 0,
      generalIndex: 0,
      cnp: ''
    };
    console.log(valueRequest.cnp);
    valueRequest.cnp = this.producer.cnp;
    valueRequest.generalIndex = this.index;
    valueRequest.value = this.value;

    console.log(valueRequest);

    this.serverService.registerProduction(valueRequest).subscribe(data => {
        console.log(data);
        this.valueResponse = data as ValueResponse;
        console.log(this.valueResponse);
        this.index++;
        this.isDeviationOccurred = this.valueResponse.deviationOccurred;

      },
      err => {
        console.log(err);
        this.loading = false;
      },
      () => {
        console.log('Intrat in complete!');
        this.updateHistoryCurveAndIndex();
        this.updateActualBalance();
        this.generateBaselineConsumption();
        this.isValueChecked = true;
        this.loading = false;
      });
  }

  /*updateHistoryCurveBasedOnIndex() {
    //let cnp = this.consumer.cnp;
    if (this.index == 7) {
      //call the new curve
      this.serverService.getConsumerCurrentCurve(this.cnp).subscribe(data => {
          console.log(data);
          console.log(data.body);
          this.currentCurve = data.body;
        },
        err => {
          console.log(err);
          this.loading = false;
        },
        () => {
          this.localStorage.clear(this.cnp + this.HISTORY_BASE_CURVE);
          this.updateHistoryCurveAndIndex();
        });
    } else {
      this.updateHistoryCurveAndIndex();
    }
  }*/

  updateHistoryCurveAndIndex() {
    let historyCurve = this.localStorage.retrieve(this.cnp + this.HISTORY_BASE_CURVE);

    if (historyCurve == null || isUndefined(historyCurve)) {
      historyCurve = [this.value];
    } else {
      historyCurve.push(this.value);
    }

    this.localStorage.store(this.cnp + this.HISTORY_BASE_CURVE, historyCurve);
    this.localStorage.store(this.cnp + this.HISTORY_BASE_INDEX, this.index);
  }

  updateActualBalance() {
    console.log('In balance!');
    var balance = this.balance;
    this.serverService.getProducerBalance(this.producer.cnp).subscribe(data => {
        this.balance = data.body as number;
        // balanceGrid = data.body as number;
        // console.log("After balanceGrid " + balanceGrid);
      },
      err => {
        console.log(err);
        this.loading = false;
      },
      () => {
        // if ()
      });
  }

  generateBaselineConsumption() {
    console.log(this.producerBaseline);

    this.curve = new Highcharts.Chart(
      {
        chart: {
          style: {
            fontFamily: 'Roboto, sans-serif',
            color: "#607d8b"
          },
          renderTo: 'baselineConsumption',
          animation: false,
          height: 350,
          backgroundColor:'rgba(255, 255, 255, 0.0)',
          zoomType: 'xy'
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },

        title: {
          style: {
            color: '#607d8b',
            fontSize: "25px"
          },
          text: 'Baseline Production'
        },
        yAxis: {
          gridLineColor: '#607d8b',
          labels: {
            style: {
              color: '#607d8b',
              fontSize: "14px",
              fontFamily: 'Roboto, sans-serif'
            }
          },
          allowDecimals: false,
          title: {
            text: 'KWh',
            style: {
              color: '#607d8b',
              fontSize: "18px",
              fontFamily: 'Roboto, sans-serif'
            }
          }
        },
        tooltip: {
          shared: true,
          valueSuffix: ' KWh',
          style: {
            fontFamily: 'Roboto, sans-serif'
          }
        },
        xAxis: {
          labels: {
            style: {
              fontSize: "14px",
              color: '#607d8b',
              fontFamily: 'Roboto, sans-serif'
            }
          },
          title: {
            text: 'Index',
            style: {
              color: '#607d8b',
              fontSize: "18px",
              fontFamily: 'Roboto, sans-serif'
            }
          },
          plotBands: [{
            from: 0,
            to: this.index - 1,
            color: 'rgba(198, 199, 203, .2)'
          }]
        },

        plotOptions: {
          areaspline: {
            fillOpacity: 0.5
          },
          series: {
            dragMinY: 0,
            dragPrecisionY: 1,
            color: '#32CD32',
            point: {
              events: {

                drag: function (e) {
                },
                drop: function () {
                }
              }
            },
            stickyTracking: false
          },
          line: {
            cursor: 'ns-resize',
            dataLabels: {
              enabled: false,
              style: {
                color: '#607d8b',
                fontFamily: 'Roboto, sans-serif'
              }
            }
          }
        },
        series: [
          {
            name: 'Ideal',
            data: this.producerBaseline,
            draggableY: false
          },
          {
            name: 'Real',
            data: this.localStorage.retrieve(this.cnp + this.HISTORY_BASE_CURVE),
            draggableY: false,
            dashStyle: 'longdash',
            color: '#9370DB'
          }
        ]

      });
  }

  /*generateBaselineConsumption() {
    console.log(this.consumerBaseline);

    this.curve = new Highcharts.Chart(
      {

        chart: {
          renderTo: 'baselineConsumption',
          animation: false,
          height: 280,
          backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
          type: 'areaspline',
          zoomType: 'xy'
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
        tooltip: {
          shared: true,
          valueSuffix: ' KWh'
        },
        xAxis: {
          title: {
            text: 'Hour'
          }
        },

        plotOptions: {
          areaspline: {
            fillOpacity: 0.5
          },
          series: {
            dragMinY: 0,
            dragPrecisionY: 1,
            //color: 'red',
            point: {
              events: {

                drag: function (e) {
                },
                drop: function () {
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
          name: 'Default',
          data: this.consumerBaseline,
          draggableY: false
        }]

      });
  }*/

}

interface Producer {
  name: string;
  homeAddress: string;
  cnp: string;
  baselineConsumption: any;
  accountPrivateKey: string;
  accountAddress: string;
  contractAddress: string;
}
