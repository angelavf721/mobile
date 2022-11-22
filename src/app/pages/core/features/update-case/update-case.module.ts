import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {UpdateCasePageRoutingModule} from './update-case-routing.module';

import {UpdateCasePage} from './update-case.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UpdateCasePageRoutingModule,
  ],
  declarations: [UpdateCasePage]
})
export class UpdateCasePageModule {
}
