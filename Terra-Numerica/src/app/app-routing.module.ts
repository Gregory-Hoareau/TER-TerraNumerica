import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestD3jsComponent } from './test-d3js/test-d3js.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/test-d3js'},
  {path: 'test-d3js', component: TestD3jsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
