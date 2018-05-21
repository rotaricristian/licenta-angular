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
  count=1;
  
  showLegend = false;
  public hierarchialGraph = {
    links: [  
      
    ],
    nodes: [  {
        id: '0',
        label: '0',
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

  select($event){
    console.log("add");
      this.hierarchialGraph.links.push({
        source:''+this.count,
        target:this.hierarchialGraph.nodes[Math.floor((Math.random() * (this.hierarchialGraph.nodes.length-1)) )].id
      });
      this.hierarchialGraph.links.push({
        source:''+this.count,
        target:this.hierarchialGraph.nodes[Math.floor((Math.random() * (this.hierarchialGraph.nodes.length-1)) )].id
      });

    this.hierarchialGraph.nodes.push({
      id:''+this.count,
      label:''+this.count,
      color:'#5AA454'
      });
      this.count++;
      this.hierarchialGraph.links = [...this.hierarchialGraph.links];
      this.hierarchialGraph.nodes = [...this.hierarchialGraph.nodes];
  }

}
