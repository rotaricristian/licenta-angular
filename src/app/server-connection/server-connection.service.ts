import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Prosumer} from './../interfaces.type';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';




@Injectable()
export class ServerConnectionService {

  constructor(private http: HttpClient) { }

  deployGrid(){
        return this.http.get('http://192.168.0.24:8090/energyGridBlockchain/grid', {
          observe: 'response'
        });
  }

  getGridBalance(){
    return this.http.get('http://192.168.0.24:8090/energyGridBlockchain/grid/balanceCurve', {
      observe: 'response'
    });
  }

  getGridDemand(){
    return this.http.get('http://192.168.0.24:8090/energyGridBlockchain/grid/demandCurve', {
      observe: 'response'
    });
  }

  getGridProduction(){
    return this.http.get('http://192.168.0.24:8090/energyGridBlockchain/grid/productionCurve', {
      observe: 'response'
    });
  }

  getAllConsumers(){

    return this.http.get('http://192.168.0.24:8090/energyGridBlockchain/consumer', {
      observe: 'response'
    });
  }

  getAllProducers(){
    return this.http.get('http://192.168.0.24:8090/energyGridBlockchain/producer', {
      observe: 'response'
    });
  }

  addConsumer(consumer:Prosumer){
    return this.http.post('http://192.168.0.24:8090/energyGridBlockchain/grid/consumer', 
     consumer
    );
  }

  addProducer(producer: Prosumer){
    return this.http.post('http://192.168.0.24:8090/energyGridBlockchain/grid/producer', 
    producer
   );
  }

}
