import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphFileValidatorService {

  // Properties that should be present
  private BASIC_PROPERTIES = ['typology', 'nodes', 'links'];
  private GRID_PROPERTIES = ['width', 'height'];
  private TREE_PROPERTY = ['arity'];

  // Validity constant
  private TYPOLOGY_VALUES = ['grid', 'tore', 'tree', 'cycle', 'common', 'copsAlwaysWin']
  private MIN_NODES_NUM = 4;
  private MAX_NODES_NUM = 70;

  private fileContent;

  constructor() { }

  setContentToValidate(fileContent) {
    this.fileContent = fileContent;
  }

  get missing_properties() {
    const missing = [];
    const present_properties = Object.keys(this.fileContent);
    //console.log('OBJECT PROPERTIES', present_properties);
    this.BASIC_PROPERTIES.forEach(prop => {
      if(!present_properties.includes(prop)) missing.push(prop);
    })

    switch(this.fileContent[this.BASIC_PROPERTIES[0]]) {
      case 'tore':
      case 'grid':
        this.GRID_PROPERTIES.forEach(prop => {
          if(!present_properties.includes(prop)) missing.push(prop);
        })
        break;
      case 'tree':
        this.TREE_PROPERTY.forEach(prop => {
          if(!present_properties.includes(prop)) missing.push(prop);
        })
        break;
      default:
        break;
    }
    return missing;
  }

  get invalid_properties() {
    const invalid = [];
    const typology = this.fileContent[this.BASIC_PROPERTIES[0]];
    const nodes = this.fileContent[this.BASIC_PROPERTIES[1]];
    const links = this.fileContent[this.BASIC_PROPERTIES[2]];
    if(typology && !this.TYPOLOGY_VALUES.includes(typology)) {
      invalid.push(`- ${typology} n'est pas une valeur connu de typologie. Les typologies possible sont les suivantes : ${this.TYPOLOGY_VALUES}`);
    }
    if(nodes && (nodes.length < this.MIN_NODES_NUM || nodes.length > this.MAX_NODES_NUM)) {
      invalid.push(`Le nombre de noeuds doit être compris entre ${this.MIN_NODES_NUM} et ${this.MAX_NODES_NUM}. Votre nombre de noeuds actuel est de ${nodes.length}`);
    }
    if(links && links.length === 0) {
      invalid.push(`Le tableau des liens est vide.`)
    }
    return invalid;
  }

}
