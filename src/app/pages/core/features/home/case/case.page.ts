import { AddCasePage } from "./../../add-case/add-case.page";
import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {CaseService} from '../../../../../services/cases/case.service';

@Component({
  selector: 'app-case',
  templateUrl: './case.page.html',
  styleUrls: ['./case.page.scss'],
})
export class CasePage implements OnInit {

  @Input() case: any;

  constructor(private modalController: ModalController,
              private caseService: CaseService) {
  }

  ngOnInit() {
    console.log(this.case);
  }

  close() {
    return this.modalController.dismiss();
  }


  async editarCaso() {
    const modal = await this.modalController.create({
      component: AddCasePage,
      componentProps: {
        case: this.case
      }
    });
    await modal.present();
  }

  async apagarCaso() {
    this.caseService.delete(this.case._id).then(() => this.close());
  }
}
