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

  getProsumer(prosumer: Prosumer){

    return this.http.get('http://192.168.0.24:8090/energyGridBlockchain/grid', {
      observe: 'response'
    });
  }

  addConsumer(consumer:Prosumer){
    return this.http.post('http://192.168.0.24:8090/energyGridBlockchain/grid/consumer', 
     consumer
    );
  }

  addProducer(producer: Prosumer){
    return this.http.post('http://httpbin.org/post', {
      params: {
        Prosumer:producer
      },
      observe: 'response'
    })
   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAllProsumers(){
    return this.http.get('http://httpbin.org/get', {
      observe: 'response'
    })
   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
}
