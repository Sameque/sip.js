import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterPageComponent } from './shared/pages/master-page/master-page.component';

const routes: Routes = [
  {
    path: '',
    component: MasterPageComponent,
    children: [
      {
        path: '',
        loadChildren: () => import("./home/home.module").then(m => m.HomeModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
