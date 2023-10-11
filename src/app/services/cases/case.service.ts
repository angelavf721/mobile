import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {Storage} from '@ionic/storage-angular';
import {Router} from '@angular/router';
import { User } from '../../../utils/models/user.model';
import { ModalController } from '@ionic/angular';
import { FcmService } from '../push-notifications/fmc.service';

interface Case {
  nome: string;
  data: string;
  suspeito: string;
  contatos: number;
  lat: number;
  lng: number;
  imagemUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  user: User;


  constructor(private db: AngularFireDatabase,
              private storage: Storage,
              private router: Router,
              private fcmServeice: FcmService) {
    console.log('#UpadatePage');
    this.storage.get('User').then(user => {
      this.user = user;
    });
  }

  create(body: Case) {
    const ref = this.db.database.ref('Casos/').push();
    const key = ref.key;
    return ref.set({
      userID: this.user._id,
      _id: key,
      ...body
    }).then(() => {
      this.router.navigate(['/home'])
    this.fcmServeice.enviarNotificacao(`Novo caso - `, body.nome, body.imagemUrl, key);
  });
  }

  update(caseID: string, body: Case) {
    console.log('UPDATE');
    return this.db.database.ref('Casos/' + caseID).update({
      ...body
    }).then(() => this.router.navigate(['/home']));
  }

  delete(caseID: string) {
    return this.db.database.ref('Casos/' + caseID).remove();
  }


}
