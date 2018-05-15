import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  // busy: Promise<any>;

  showCurves:boolean=false;

  constructor() { }

  ngOnInit() {

    // this.busy = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     console.log("Async Work Complete");
    //     resolve();
    //   }, 3000);
    // });
  }

  startSimulation(){
    this.showCurves=true;
  }

}
