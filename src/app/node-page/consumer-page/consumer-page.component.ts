import { Component, OnInit } from '@angular/core';
import { ServerConnectionService } from '../../server-connection/server-connection.service';

@Component({
  selector: 'app-consumer-page',
  templateUrl: './consumer-page.component.html',
  styleUrls: ['./consumer-page.component.css']
})
export class ConsumerPageComponent implements OnInit {

  constructor(private serverService: ServerConnectionService) { }

  ngOnInit() {
  }

}
