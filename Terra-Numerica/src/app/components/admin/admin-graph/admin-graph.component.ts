import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/_services/backend/backend.service';
import { GraphFileValidatorService } from 'src/app/_services/graph-file-validator/graph-file-validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-graph',
  templateUrl: './admin-graph.component.html',
  styleUrls: ['./admin-graph.component.scss']
})
export class AdminGraphComponent implements OnInit {

  public inputFile: File;
  public fileContent;
  public line_in_file = 10;
  private reader: FileReader;
  public valide_file = undefined;
  public missingProperties = [];
  public invalidProperties = [];

  constructor(private backend: BackendService, private graphFileValidator: GraphFileValidatorService) { }

  ngOnInit(): void {
    this.reader = new FileReader();
  }

  fileChange(ev) {
    this.inputFile = ev.target.files[0];
    this.readFile();
  }

  private readFile() {
    this.reader.onload = (ev) => {
      this.fileContent = ev.target.result;
      this.checkFileContent();
    }
    if(this.inputFile)
      this.reader.readAsText(this.inputFile, 'utf-8');
    else {
      this.fileContent = undefined;
      this.valide_file = undefined;
    }
  }

  private checkFileContent() {
    console.warn('CHECKING FILE CONTENT');
    const jsonFileContent = JSON.parse(this.fileContent);
    this.graphFileValidator.setContentToValidate(jsonFileContent);
    this.missingProperties = this.graphFileValidator.missing_properties;
    this.invalidProperties = this.graphFileValidator.invalid_properties;
    this.valide_file = this.missingProperties.length === 0 && this.invalidProperties.length === 0;
  }

  uploadGraph() {
    if(this.fileContent)
      this.backend.post('graph', JSON.parse(this.fileContent)).subscribe((graph) => {
        Swal.fire({
          icon: 'success',
          title: 'Mise en ligne réussi !',
          text: 'Le graph est maintenant disponible pour les joueurs dans la catégorie "Aléatoire".'
        })
      },
      err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'La mise en ligne à échoué',
          text: 'La graph n\'a pas pu être mis en ligne'
        })
      })
    else 
      console.log('YOU MUST SELECT A FILE BEFORE UPLOADING IT')
  }

  isCard() {
    return this.fileContent ? 'card' : ''
  }

}
