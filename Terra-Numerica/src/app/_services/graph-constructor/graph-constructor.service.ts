import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { saveAs } from 'file-saver'

@Injectable({
  providedIn: 'root'
})
export class GraphConstructorService {

  readonly tools = ['add-node', 'add-link', 'remove'];
  readonly originalNodeColor = '#69b3a2';
  readonly selectedNodeColor = 'red'
  private graphTypes = {
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

    if (result.isConfirmed === true) {
      console.log('HERE', result.value)
      let args: number[] = [];
      switch (result.value) {
        case 'grid':
        case 'tore':
          args = await this.selectGridProperties();
          break;
        case 'tree':
          args = await this.selectTreeProperty();
          break;
        default:
          break;
      }
      this.save(result.value, args);
    }
  }

  private async selectGridProperties(): Promise<number[]> {
    let res: number[] = [];
    const resultSwal = await Swal.fire({
      title: 'Définir les propriétés de la grille',
      html: '<label>Longueur : </label><input id="swal-input1" class="swal2-input" type="number" min="3" value="3" /><br>'
            + '<label>Largeur : </label><input id="swal-input2" class="swal2-input"  type="number" min="3" value="3"/>',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value
        ]
      }
    })
    //console.log(resultSwal)
    resultSwal.value.forEach(n => {
      res.push(+n)
    })
    return res
  }

  private async selectTreeProperty(): Promise<number[]> {
    let res: number[] = [];
    const resultSwal = await Swal.fire({
      title: 'Définir l\'arité de l\'arbre',
      input: 'number',
      inputValue: 2,
      allowOutsideClick: false,
      allowEscapeKey: false,
    })
    //console.log(resultSwal);
    res.push(+resultSwal.value)
    return res;
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
        if (target === undefined) {
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

  private save(type: string, args: number[]) {
    const graphJson = this.convertGraphToJsonFile(type, args);
    console.log('JSON GRAPH', graphJson);
    const blobGraphFromJson = new Blob([graphJson], {type : 'application/json'})
    console.log('JSON BLOB', blobGraphFromJson);
    saveAs(blobGraphFromJson, 'graph.json');
  }

  private convertGraphToJsonFile(type: string, args: number[]) {
    this.nodes.forEach((node, i) => { node['index'] = i });
    this.links.forEach((link, i) => { link['index'] = i });
    let graphJson = {
      typology: type,
      nodes: this.nodes,
      links: this.links,
    }
    switch (type) {
      case 'grid':
      case 'tore':
        graphJson['width'] = args[0];
        graphJson['height'] = args[1];
        break;
      case 'tree':
        graphJson['arity'] = args[0];
      default:
        break;
    }
    return JSON.stringify(graphJson, null, 2)
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