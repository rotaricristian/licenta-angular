import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Prosumer, Value} from './../interfaces.type';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';




@Injectable()
export class ServerConnectionService {

  private ip = 'http://localhost:8090';
  constructor(private http: HttpClient) {}

  deployGrid() {
    return this.http.get(this.ip + '/energyGridBlockchain/grid', {
      observe: 'response'
    });
  }

  getGridBalance() {
    return this.http.get(this.ip + '/energyGridBlockchain/grid/balanceCurve', {
      observe: 'response'
    });
  }

  getGridDemand() {
    return this.http.get(this.ip + '/energyGridBlockchain/grid/demandCurve', {
      observe: 'response'
    });
  }

  getGridProduction() {
    return this.http.get(this.ip + '/energyGridBlockchain/grid/productionCurve', {
      observe: 'response'
    });
  }

  getAllConsumers() {

    return this.http.get(this.ip + '/energyGridBlockchain/consumer', {
      observe: 'response'
    });
  }

  getAllProducers() {
    return this.http.get(this.ip + '/energyGridBlockchain/producer', {
      observe: 'response'
    });
  }

  addConsumer(consumer: Prosumer) {
    return this.http.post(this.ip + '/energyGridBlockchain/grid/consumer',
      consumer
    );
  }

  addProducer(producer: Prosumer) {
    return this.http.post(this.ip + '/energyGridBlockchain/grid/producer',
      producer
    );
  }

  getConsumer(CNP: string) {
    return this.http.get(this.ip + '/energyGridBlockchain/consumer/' + CNP, {
      observe: 'response'
    });
  }

  getConsumerCurrentCurve(CNP: string) {
    return this.http.get(this.ip + '/energyGridBlockchain/consumer/' + CNP + '/curve', {
      observe: 'response'
    });
  }

  getProducer(CNP: string) {
    return this.http.get(this.ip + '/energyGridBlockchain/producer/' + CNP, {
      observe: 'response'
    });
  }

  getConsumerBalance(CNP: string) {
    return this.http.get(this.ip + '/energyGridBlockchain/consumer/' + CNP + '/balance', {
      observe: 'response'
    });
  }

  getProducerBalance(CNP: string) {
    return this.http.get(this.ip + '/energyGridBlockchain/producer/' + CNP + '/balance', {
      observe: 'response'
    });
  }

  checkValue(value: Value) {
    return this.http.post(this.ip + '/energyGridBlockchain/consumer/value',
      value);
  }

}
