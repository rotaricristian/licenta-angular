import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ServerConnectionService } from '../../server-connection/server-connection.service';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Output() onStartSimulation: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private serverService: ServerConnectionService,private localStorage: LocalStorageService) { }


  hideButton:boolean = false;

  ngOnInit() {
    this.hideButton = this.localStorage.retrieve('0');
  }


  startSimulation(){
    this.onStartSimulation.emit(true);
  }
  

}
