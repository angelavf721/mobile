import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCasePage } from './add-case.page';

const routes: Routes = [
  {
    path: '',
    component: AddCasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCasePageRoutingModule {}
