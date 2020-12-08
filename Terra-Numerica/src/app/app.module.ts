import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestD3jsComponent } from './test-d3js/test-d3js.component';
import { GraphService } from './_services/graph/graph.service';
import { GameService } from './_services/game/game.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { CommonModule } from '@angular/common';
import { BackendService } from './_services/backend/backend.service';
import { RandomGraphService } from './_services/random-graph/random-graph.service';
import { HttpClientModule } from '@angular/common/http';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { TranslateService } from './_services/translate/translate.service';

@NgModule({
  declarations: [
    AppComponent,
    TestD3jsComponent,
    GameMenuComponent,
    GameBoardComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    GraphService,
    GameService,
    BackendService,
    RandomGraphService,
    TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
