import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import { CaseSettPage } from './case-sett/case-sett.page';
import { UserPage } from './user/user.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  async openUserS() {
    const modal = await this.modalController.create({
      component: UserPage,
    });
    await modal.present();
  }

  async openCaseS() {
    const modal = await this.modalController.create({
       component: CaseSettPage,
    });
    await modal.present();
  }

}
