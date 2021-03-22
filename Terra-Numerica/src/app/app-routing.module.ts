import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminBoardComponent } from './components/admin/admin-board/admin-board.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/menu'},
  {path: 'board', component: GameBoardComponent},
  {path: 'menu', component: GameMenuComponent},
  {path: 'admin', component: AdminBoardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
