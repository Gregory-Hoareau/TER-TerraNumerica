import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/_services/backend/backend.service';
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

  constructor(private backend: BackendService) { }

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
    }
    if(this.inputFile)
      this.reader.readAsText(this.inputFile, 'utf-8');
    else 
      this.fileContent = undefined
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
