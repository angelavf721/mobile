import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCasePageRoutingModule } from './add-case-routing.module';

import { AddCasePage } from './add-case.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddCasePageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [AddCasePage]
})
export class AddCasePageModule {}
