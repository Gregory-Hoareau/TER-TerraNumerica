import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filereader',
  templateUrl: './filereader.component.html',
  styleUrls: ['./filereader.component.scss']
})
export class FilereaderComponent implements OnInit {

  graphConfigForm;

  constructor() { 

  }

  ngOnInit(): void {
    
  }

  onSubmit(event) {
    console.warn(event)
  }

  onFileChange(event) {
    console.warn(event)
  }

}
