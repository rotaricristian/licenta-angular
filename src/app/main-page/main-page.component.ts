import {Component, OnInit} from '@angular/core';
import {ServerConnectionService} from '../server-connection/server-connection.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  loading: boolean = true;

  refreshGraph: boolean = false;

  hideButton:boolean = false;

  constructor(private serverService: ServerConnectionService, private localStorage: LocalStorageService) {}

  ngOnInit() {
    
    this.serverService.deployGrid().subscribe(
      data => {
        this.localStorage.store('0',false);},
      err => {

        this.loading = false;
      },
      () => {
        this.hideButton = this.localStorage.retrieve('0');
        this.loading = false;
      }
    );

  }

  startSimulation() {
    this.loading = true;
    this.serverService.startSimulation().subscribe(
      data => { 
          },
      err => {
           }
          ,
      () => {
          this.loading=false;
          this.hideButton=true;
          this.localStorage.store('0',true);
      }
    );
  }

  updateGraph() {

    this.refreshGraph = !this.refreshGraph;
  }

}
