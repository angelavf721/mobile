import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaseSettPage } from './case-sett.page';

const routes: Routes = [
  {
    path: '',
    component: CaseSettPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseSettPageRoutingModule {}
