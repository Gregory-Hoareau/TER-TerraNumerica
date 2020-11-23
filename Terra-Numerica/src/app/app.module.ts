import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestD3jsComponent } from './test-d3js/test-d3js.component';
import { GraphService } from './_services/graph/graph.service';
import { GameService } from './_services/game/game.service';
import { FilereaderComponent } from './filereader/filereader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TestD3jsComponent,
    FilereaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule,
  ],
  providers: [
    GraphService,
    GameService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
