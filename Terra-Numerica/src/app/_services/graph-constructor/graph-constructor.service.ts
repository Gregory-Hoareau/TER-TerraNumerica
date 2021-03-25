import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class GraphConstructorService {

  readonly tools = ['add-node', 'add-link', 'remove'];
  readonly originalNodeColor = '#69b3a2';
  readonly selectedNodeColor = 'red'
  private graphTypes= {
    tree: 'Arbre',
    cycle: 'Cycle',
    grid: 'Grille',
    tore: 'Grille Torique',
    random: 'Autre',
  }

  // {index: , x: , y: }
  private nodes = [];

  // {index: ,source: , target: } with index as the postion in the array, source the source node and target the target node
  private links = [];

  constructor() { }

  async selectGraphType() {
    const result = await Swal.fire({
      title: 'Type du graphes',
      input: 'select',
      inputOptions: this.graphTypes,
      showCancelButton: true,
      cancelButtonText: 'Annuler'
    })

    if(result.isConfirmed === true) {
      console.log('HERE', result.value)
    }
  }

  toolAction(tool: string, source, target = undefined) {
    switch (tool) {
      case 'add-node':
        this.addNode(source.x, source.y);
        break;
      case 'add-link':
        this.addLink(source, target)
        break;
      case 'remove':
        if(target === undefined) {
          // Trying to remove a node
          this.removeNode(source.x, source.y)
        } else {
          // Trying to remove a link
          this.removeLink(source, target)
        }
        break;
      default:
        break;
    }
  }

  private save() {
    
  }

  private addNode(x, y) {
    const node = { x: x, y: y };
    this.nodes.push(node);
  }

  private addLink(source, target) {
    const link = { source: source, target: target };
    this.links.push(link);
  }

  private removeNode(x, y) {
    this.nodes = this.nodes.filter(node => node.x !== x || node.y !== y);
  }

  private removeLink(source, target) {
    this.links = this.links.filter(link => !this.checkCirclePosition(link.source, source) || !this.checkCirclePosition(link.target, target))
  }

  /**
   * 
   * @param c1 the position of the first circle
   * @param c2 the position of the second circle
   * 
   * @return true if the circle are at the same position. Otherwise return false
   */
  private checkCirclePosition(c1, c2) {
    return c1.x === c2.x && c1.y === c2.y
  }
}
