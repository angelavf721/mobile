import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroPageRoutingModule } from './cadastro-routing.module';

import { CadastroPage } from './cadastro.page';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CadastroPageRoutingModule,
        ReactiveFormsModule,
        MaskitoModule
    ],
  declarations: [CadastroPage]
})
export class CadastroPageModule {}
