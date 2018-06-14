import {Component, OnInit} from '@angular/core';
import {ServerConnectionService} from '../../server-connection/server-connection.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Value, ValueResponse} from './../../interfaces.type';
import {LocalStorageService} from "ngx-webstorage";
import {isUndefined} from "util";

const Highcharts = require('highcharts');
require('highcharts-draggable-points')(Highcharts);

@Component({
  selector: 'app-consumer-page',
  templateUrl: './consumer-page.component.html',
  styleUrls: ['./consumer-page.component.css']
})
export class ConsumerPageComponent implements OnInit {

  public HISTORY_CURVE: string;
  public HISTORY_INDEX: string;

  constructor(private serverService: ServerConnectionService, private router: Router, private localStorage: LocalStorageService) {
    this.HISTORY_CURVE = '~historyCurve';
    this.HISTORY_INDEX = '~historyIndex';
    this.consumer = {
      name: '',
      homeAddress: '',
      cnp: '',
      baselineConsumption: [],
      curve: [],
      accountPrivateKey: '',
      accountAddress: '',
      contractAddress: ''
    };
  }

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
  public cnp = '';

  public categories1 = [0, 1, 2, 3, 4, 5, 6, 7];
  public categories2 = [8, 9, 10, 11, 12, 13, 14, 15];

  //public currentIndex = 2;

  ngOnInit() {
    this.loading = true;
    this.url = this.router.url;
    this.cnp = this.url.split('/').pop();
    console.log(this.cnp + this.HISTORY_INDEX);
    let localIndex = this.localStorage.retrieve(this.cnp + this.HISTORY_INDEX);

    if (localIndex == null || isUndefined(localIndex)) {
      this.index = 0;
    } else {
      this.index = localIndex;
    }

    Observable.forkJoin(
      this.serverService.getConsumer(this.cnp),
      this.serverService.getConsumerBalance(this.cnp),
      this.serverService.getConsumerCurrentCurve(this.cnp)
    ).subscribe(response => {
      this.consumer = response[0].body as Consumer;
      this.balance = response[1].body as number;
      this.currentCurve = response[2].body;

      this.consumerBaseline = this.consumer.baselineConsumption;

      console.log(this.consumer);
      this.generateCurrentCurve();
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
        this.valueResponse = data as ValueResponse;
        console.log(this.valueResponse);
        this.isDeviationOccurred = this.valueResponse.deviationOccurred;

      },
      err => {
        console.log(err);
        this.loading = false;
      },
      () => {
        console.log('Intrat in complete!');
        this.updateHistoryCurveBasedOnIndex();
      });
  }

  updateHistoryCurveBasedOnIndex() {
    //let cnp = this.consumer.cnp;
    if (this.index % 8 == 7) {
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
          this.localStorage.clear(this.cnp + this.HISTORY_CURVE);
          this.updateHistoryCurveAndIndex();
          this.generateCurrentCurve();
          this.updateActualBalance();
          this.isValueChecked = true;
          this.loading = false;
        });
    } else {
      this.updateHistoryCurveAndIndex();
      this.generateCurrentCurve();
      this.updateActualBalance();
      this.isValueChecked = true;
      this.loading = false;
    }
  }

  updateHistoryCurveAndIndex() {
    this.index++;
    let historyCurve = this.localStorage.retrieve(this.cnp + this.HISTORY_CURVE);

    if (historyCurve == null || isUndefined(historyCurve)) {
      historyCurve = [this.value];
    } else {
      historyCurve.push(this.value);
    }

    this.localStorage.store(this.cnp + this.HISTORY_CURVE, historyCurve);
    this.localStorage.store(this.cnp + this.HISTORY_INDEX, this.index);
  }

  updateActualBalance() {
    console.log('In balance!');
    var balance = this.balance;
    this.serverService.getConsumerBalance(this.consumer.cnp).subscribe(data => {
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

  generateCurrentCurve() {
    console.log(this.currentCurve);

    this.curve = new Highcharts.Chart(
      {

        chart: {
          style: {
            fontFamily: 'Roboto, sans-serif',
            color: "#607d8b"
          },
          renderTo: 'currentCurve',
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
          text: 'Current Curve'
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
          categories: this.index > 7 ? this.categories2 : this.categories1,
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
            color: '#e53935',
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
              enabled: true,
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
            data: this.currentCurve,
            draggableY: false
          },
          {
            name: 'Real',
            data: this.localStorage.retrieve(this.cnp + this.HISTORY_CURVE),
            draggableY: false,
            dashStyle: 'longdash',
            color: '#000090'
          }
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
          height: 280,
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
            color: '#c6c7cb',
            fontFamily: 'Roboto, sans-serif'
          },
          text: 'Baseline Consumption Curve'
        },
        yAxis: {
          allowDecimals: false,
          labels: {
            style: {
              color: '#c6c7cb',
              fontFamily: 'Roboto, sans-serif'
            }
          },
          title: {
            style: {
              color: '#c6c7cb',
              fontFamily: 'Roboto, sans-serif'
            },
            text: 'KWh'
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
              color: '#c6c7cb',
              fontFamily: 'Roboto, sans-serif'
            }
          },
          title: {
            text: 'Hour',
            style: {
              color: '#c6c7cb',
              fontFamily: 'Roboto, sans-serif'
            }
          }
        },

        plotOptions: {
          areaspline: {
            fillOpacity: 0.5
          },
          series: {
            dragMinY: 0,
            dragPrecisionY: 1,
            color: '#e53935',
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
                color: '#c6c7cb',
                fontFamily: 'Roboto, sans-serif'
              }
            }
          }
        },
        series: [{
          name: 'Default',
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
