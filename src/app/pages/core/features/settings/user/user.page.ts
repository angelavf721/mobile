import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {


  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  close() {
    return this.modalController.dismiss();
  }

}
