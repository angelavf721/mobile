import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCasePage } from './add-case.page';
import { RouterModule, Routes } from '@angular/router';
import { MaskitoModule } from '@maskito/angular';

const routes: Routes = [
  {
    path: '',
    component: AddCasePage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        MaskitoModule
    ],
  declarations: [AddCasePage]
})
export class AddCasePageModule {}
