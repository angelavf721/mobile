import { AddCasePage } from "./../../add-case/add-case.page";
import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {CaseService} from '../../../../../services/cases/case.service';
import {User} from "../../../../../../utils/models/user.model";
import {Storage} from "@ionic/storage-angular";
import { Router } from "@angular/router";

@Component({
  selector: 'app-case',
  templateUrl: './case.page.html',
  styleUrls: ['./case.page.scss'],
})
export class CasePage implements OnInit {
  handlerMessage = '';
  roleMessage = '';
  @Input() case: any;
  user: User;

  constructor(private modalController: ModalController,
              private storage: Storage,
              private caseService: CaseService,
              private alertController: AlertController,
              private router: Router) {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Deseja realmente excluir o caso?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'Sim',
          role: 'confirm',
          handler: () => {
            this.caseService.delete(this.case._id).then(() => this.close());
          },
        },
      ],
    });
    await alert.present();
  }

  ngOnInit() {
    this.storage.get('User').then(user => {
      this.user = user;
    });
  }

  close() {
    return this.modalController.dismiss();
  }

  async editarCaso() {
    this.close();
    this.router.navigate(['edit-case'], {
      state: {
        case: this.case
      }
    });
  }


}
