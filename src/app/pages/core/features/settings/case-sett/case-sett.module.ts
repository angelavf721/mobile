import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaseSettPageRoutingModule } from './case-sett-routing.module';

import { CaseSettPage } from './case-sett.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaseSettPageRoutingModule
  ],
  declarations: [CaseSettPage]
})
export class CaseSettPageModule {}
