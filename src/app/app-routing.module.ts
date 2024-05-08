import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './common/components/error-page/error-page.component';
import {LoginComponent} from "./mercarfrut/pages/login/login.component";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./mercarfrut/mercarfrut.module').then(m => m.MercarfrutModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
