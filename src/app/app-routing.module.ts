import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './common/components/error-page/error-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./mercarfrut/mercarfrut.module').then(m => m.MercarfrutModule)
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
