import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-case-sett',
  templateUrl: './case-sett.page.html',
  styleUrls: ['./case-sett.page.scss'],
})
export class CaseSettPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  close() {
    return this.modalController.dismiss();
  }
}
