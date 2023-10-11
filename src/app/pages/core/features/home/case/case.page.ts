import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import * as L from 'leaflet';
import { FcmService } from 'src/app/services/push-notifications/fmc.service';
import { Case } from 'src/utils/models/case.model';
import { User } from '../../../../../../utils/models/user.model';
import { CaseService } from '../../../../../services/cases/case.service';

@Component({
  selector: 'app-case',
  templateUrl: './case.page.html',
  styleUrls: ['./case.page.scss'],
})
export class CasePage implements OnInit {
  handlerMessage = '';
  roleMessage = '';
  @Input() case: Case;
  user: User;
  usersToShare: User[] = [];
  sharedUsersId: string[] = [];

    // MAP

    private map: any;
    private marker: any;

  constructor(
    private modalController: ModalController,
    private storage: Storage,
    private caseService: CaseService,
    private alertController: AlertController,
    private db: AngularFireDatabase,
    private fmc: FcmService,
    private router: Router
  ) {}

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
    this.storage.get('User').then((user) => {
      this.user = user;
    });
  }

  ionViewDidEnter() {
    this.intiMap();
    this.addMarker();
  }

  intiMap() {
    this.map = L.map('mapa').setView([this.case.lat || 0, this.case.lng || 0], 13);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });
    tiles.addTo(this.map);
    this.map.doubleClickZoom.disable();
  }

  addMarker() {
    const config = {
      icon: L.icon({
        iconSize: 25, //icon size [width.height]
        iconUrl: '../../../../../assets/icon/pin.png',
      }),
    };
    this.marker = L.marker([this.case.lat, this.case.lng], config).addTo(this.map);
  }

  usuarioJaEstaSeleciondo(userID: string) {
    return this.sharedUsersId.includes(userID);
  }

  searchUser(event: any): void {
    this.usersToShare = [];
    this.db.database
      .ref('Users/')
      .get()
      .then((res) => {
        res.forEach((data) => {
          if (
            (event.detail.value && data.val().name.includes(event.detail.value)) ||
            (event.detail.value && data.val().email.includes(event.detail.value))
          ) {
            this.usersToShare.push(data.val());
          }
        });
      });
  }

  async compartilhar(user: User) {
    this.sharedUsersId.push(user._id);
    const UserDbRef = this.db.database.ref('Users/' + user._id);
    const userDB = (await UserDbRef.get()).val();
    this.fmc.enviarNotificacao(
      this.user.name + ' compartilhou um caso.',
      'Caso: ' + this.case.nome,
      this.case.imagemUrl,
      this.case._id,
      [userDB.userMobileTokenKey]
    );
  }

  close() {
    return this.modalController.dismiss();
  }

  async editarCaso() {
    this.close();
    this.router.navigate(['edit-case'], {
      state: {
        case: this.case,
      },
    });
  }
}
