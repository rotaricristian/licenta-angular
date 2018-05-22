import { Component, OnInit } from '@angular/core';
import { ServerConnectionService } from '../server-connection/server-connection.service';

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  loading:boolean = true;
  showCurves:boolean=false;
  refreshGraph:boolean=false;

  constructor(private serverService: ServerConnectionService) { }

  ngOnInit() {
    this.serverService.deployGrid().subscribe(
      data => { console.log(data)},
      err => {

        this.loading=false;
      },
      () => {
          this.loading=false;

      }
    );
  }

  startSimulation(){
    console.log('startSimulation')
    this.showCurves=true;
  }

  updateGraph(){
    console.log('update graph')
    this.refreshGraph=!this.refreshGraph;
  }

}
