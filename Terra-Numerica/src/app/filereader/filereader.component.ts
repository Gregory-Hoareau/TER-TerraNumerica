import { Component, OnInit } from '@angular/core';
import { GraphService } from '../_services/graph/graph.service';

@Component({
  selector: 'app-filereader',
  templateUrl: './filereader.component.html',
  styleUrls: ['./filereader.component.scss']
})
export class FilereaderComponent implements OnInit {

  inputFile: File = null;

  constructor(private graphService: GraphService) { 

  }

  ngOnInit(): void {
    
  }

  onSubmit() {
    if (this.inputFile) {
      if (this.inputFile.type === "application/json") {
        this.graphService.loadGraphFromFile(this.inputFile)
      }
    }
  }

  onFileChange(file) {
    this.inputFile = file;
  }

}
