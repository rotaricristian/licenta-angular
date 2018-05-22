import {Component, OnInit, Input} from '@angular/core';
import * as shape from 'd3-shape';
import {Prosumer} from '../../interfaces.type';
import {ServerConnectionService} from '../../server-connection/server-connection.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'graph-area',
  templateUrl: './graph-area.component.html',
  styleUrls: ['./graph-area.component.css']
})
export class GraphAreaComponent implements OnInit {

  constructor(private serverService: ServerConnectionService, private router: Router) {}



  @Input() set refreshGraph(value: boolean) {
    this.updateGraph();
  }

  producers: any = [];
  consumers: any = [];
  // orientation 
  showLegend = false;
  public hierarchialGraph = {
    links: [

    ],
    nodes: [{
      id: 'nodul',
      label: 'lalala',
      color: '#A10A28'
    }
    ],
  };
  public colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C'],
  }

  curve: any = shape.curveBundle;
  autoCenter: boolean = true;

  ngOnInit() {
  }

  select($event) {
    console.log($event.id);
    this.router.navigate(['node', $event.id]);

  }

  updateGraph() {

    Observable.forkJoin(
      this.serverService.getAllConsumers(),
      this.serverService.getAllProducers()
    ).subscribe(response => {
      this.consumers = <any>response[0].body;
      this.producers = <any>response[1].body;


      this.hierarchialGraph.nodes = [];
      this.hierarchialGraph.links = [];
      for (var cons of this.consumers) {
        this.hierarchialGraph.nodes.push({
          id: '' + cons.cnp,
          label: '' + cons.name,
          color: '#A10A28'
        });
      }
      for (var prod of this.producers) {
        this.hierarchialGraph.nodes.push({
          id: '' + prod.cnp,
          label: '' + prod.name,
          color: '#5AA454'
        });
      }
      for (var i = 0; i < this.hierarchialGraph.nodes.length; i++) {
        var random;
        if (this.hierarchialGraph.nodes.length > 1) {
          do {
            random = Math.floor((Math.random() * (this.hierarchialGraph.nodes.length - 1)));
          } while (random == i);
          this.hierarchialGraph.links.push({
            source: '' + this.hierarchialGraph.nodes[i].id,
            target: this.hierarchialGraph.nodes[random].id
          });

          do {
            random = Math.floor((Math.random() * (this.hierarchialGraph.nodes.length - 1)));
          } while (random == i);
          this.hierarchialGraph.links.push({
            source: '' + this.hierarchialGraph.nodes[i].id,
            target: this.hierarchialGraph.nodes[random].id
          });
        }
      }

      console.log("nodes: ")
      console.log(this.hierarchialGraph.nodes)
      this.hierarchialGraph.links = [...this.hierarchialGraph.links];
      this.hierarchialGraph.nodes = [...this.hierarchialGraph.nodes];
    });
    // this.serverService.getAllConsumers().subscribe(
    //   data => { 
    //     this.consumers = data.body;
    //     console.log("consumers ")
    //     console.log(this.consumers)
    //    },
    //   err => {
    //         console.error('eroare la get consumers');}
    //       ,
    //   () => {
    //   }
    // );

    // this.serverService.getAllProducers().subscribe(
    //   data => { 
    //       this.producers = data.body;
    //       console.log("producers " )
    //       console.log(this.producers)
    //      },
    //   err => {
    //     console.error('eroare la get producers');}
    //       ,
    //   () => {
    //   }
    // );



  }

}
