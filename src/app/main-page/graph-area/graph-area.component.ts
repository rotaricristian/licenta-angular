import { Component, OnInit } from '@angular/core';
import * as shape from 'd3-shape';

@Component({
  selector: 'graph-area',
  templateUrl: './graph-area.component.html',
  styleUrls: ['./graph-area.component.css']
})
export class GraphAreaComponent implements OnInit {

  constructor() { }

  producers;
  consumers;
  
  showLegend = false;
  public hierarchialGraph = {
    links: [  {
        source: '0',
        target: '1',
      }, {
        source: '0',
        target: '2'
      },{
        source: '1',
        target: '2'
      },{
        source: '3',
        target: '0'
      },{
        source: '3',
        target: '1'
      }
      ,{
        source: '3',
        target: '2'
      }
      
    ],
    nodes: [  {
        id: '0',
        label: '0'
      }, {
        id: '1',
        label: '1',
      }, {
        id: '2',
        label: '2',
      }, {
        id: '3',
        label: '3',
      }
    ],
  };
  public colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C'],
  }
  orientation: string = 'LR';
  curve: any = shape.curveBundle;
   autoCenter: boolean = true;

  ngOnInit() {
  }

  select($event){
    console.log("add")
    this.hierarchialGraph.nodes.push({
      id:'4',
      label:'4'
      });
    this.hierarchialGraph.links.push({
      source:'4',
      target:'0'
      },
      {
        source:'4',
        target:'2'
        },{
          source:'4',
          target:'3'
          },{
            source:'4',
            target:'1'
            }
      );
      this.hierarchialGraph.links = [...this.hierarchialGraph.links];
      this.hierarchialGraph.nodes = [...this.hierarchialGraph.nodes];
  }

}
