import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Output() onStartSimulation: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }


  startSimulation(){
    this.onStartSimulation.emit(true);
  }
  

}
