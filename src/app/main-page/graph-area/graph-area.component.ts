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
    nodes: [
    ],
  };
  public colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C'],
  };

  curve: any = shape.curveBundle;
  autoCenter: boolean = true;

  ngOnInit() {
    this.hierarchialGraph.nodes.push({
      id: '1',
      path: 'consumer',
      label: '1',
      color: '#e53935'
    });

    this.hierarchialGraph.nodes.push({
      id: '2',
      path: 'producer',
      label: '2',
      color: '#43A047'
    });

    this.hierarchialGraph.links.push({
      source: '1',
      target: '2'
    });
  }

  select($event) {
    this.router.navigate(['node/' + $event.path, $event.id]);

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
          path: 'consumer',
          label: '' + cons.name,
          color: '#e53935'
        });
      }
      for (var prod of this.producers) {
        this.hierarchialGraph.nodes.push({
          id: '' + prod.cnp,
          path: 'producer',
          label: '' + prod.name,
          color: '#43A047'
        });
      }
      for (var i = 0; i < this.hierarchialGraph.nodes.length; i++) {
        var random;
        if (this.hierarchialGraph.nodes.length > 1) {
          do {
            random = Math.floor((Math.random() * (this.hierarchialGraph.nodes.length)));
          } while (random == i);
          if (!this.contains(this.hierarchialGraph.nodes[i].id, this.hierarchialGraph.nodes[random].id)) {
            this.hierarchialGraph.links.push({
              source: '' + this.hierarchialGraph.nodes[i].id,
              target: this.hierarchialGraph.nodes[random].id
            });
          }

          do {
            random = Math.floor((Math.random() * (this.hierarchialGraph.nodes.length)));
          } while (random == i);
          if (!this.contains(this.hierarchialGraph.nodes[i].id, this.hierarchialGraph.nodes[random].id)) {
            this.hierarchialGraph.links.push({
              source: '' + this.hierarchialGraph.nodes[i].id,
              target: this.hierarchialGraph.nodes[random].id
            });
          }

        }

      }
      this.hierarchialGraph.links = [...this.hierarchialGraph.links];
      this.hierarchialGraph.nodes = [...this.hierarchialGraph.nodes];

    });

  }

  contains(k1, k2): boolean {
    for (let i = 0; i < this.hierarchialGraph.links.length; i++) {
      if (this.hierarchialGraph.links[i].source == k1 && this.hierarchialGraph.links[i].target == k2
        || this.hierarchialGraph.links[i].source == k2 && this.hierarchialGraph.links[i].target == k1) {
        return true;
      }
    }
    return false;
  }

}

