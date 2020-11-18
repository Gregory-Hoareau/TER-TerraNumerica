import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestD3jsComponent } from './test-d3js/test-d3js.component';
import { GraphService } from './_services/graph/graph.service';

@NgModule({
  declarations: [
    AppComponent,
    TestD3jsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    GraphService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
