import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Prosumer} from './../interfaces.type';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';



@Injectable()
export class ServerConnectionService {

  constructor(private http: HttpClient) { }

  

  getProsumer(prosumer: Prosumer){

    return this.http.get('http://httpbin.org/get', {
      params: {
        name: prosumer.name,
        cnp: prosumer.cnp
      },
      observe: 'response'
    })
   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  addConsumer(consumer:Prosumer){
    return this.http.post('http://httpbin.org/post', {
      params: {
        Prosumer:consumer
      },
      observe: 'response'
    })
   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
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
