import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminBoardComponent } from './components/admin/admin-board/admin-board.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { GameDashboardComponent } from './components/game-dashboard/game-dashboard.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { TestD3jsComponent } from './test-d3js/test-d3js.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/menu'},
  {path: 'test-d3js', component: TestD3jsComponent},
  {path: 'board', component: GameBoardComponent},
  {path: 'menu', component: GameMenuComponent},
  //{path: 'dashboard', component: GameDashboardComponent},
  {path: 'admin', component: AdminBoardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
