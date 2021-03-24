import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphConstructorService {

  readonly tools = ['add-node', 'add-link', 'remove']

  // {index: , x: , y: }
  private nodes = [];

  // {index: ,source: , target: } with index as the postion in the array, source the source node and target the target node
  private links = []; 

  constructor() { }

  toolAction(tool: string) {
    console.log(`Trying to use ${tool}`)
    //console.log('POSITION', position)
  }
}
