import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { TestD3jsComponent } from './test-d3js/test-d3js.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/menu'},
  {path: 'test-d3js', component: TestD3jsComponent},
  {path: 'menu', component: GameMenuComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
