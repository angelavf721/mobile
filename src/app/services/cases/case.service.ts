import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {Storage} from '@ionic/storage-angular';
import {Router} from '@angular/router';
import { User } from '../../../utils/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  user: User;


  constructor(private db: AngularFireDatabase,
              private storage: Storage,
              private router: Router,) {
    console.log('#UpadatePage');
    this.storage.get('User').then(user => {
      this.user = user;
    });
  }

  create(nome: string, data: string, suspeito: string, telefone: string,local: string, photoURL: string) {
    const ref = this.db.database.ref('Casos/').push();
    const key = ref.key;
    return ref.set({
      // eslint-disable-next-line no-underscore-dangle
      ownerID: this.user._id,
      _id: key,
      name: nome,
      datas: data,
      suspeito,
      contato: telefone,
      local: local,
      photoURL
    }).then(() => this.router.navigate(['/home']));
  }

  update(caseID: string, nome: string, data: string, suspeito: string, telefone: string, local: string, photoURL: string) {
    console.log('UPDATE');
    return this.db.database.ref('Casos/' + caseID).update({
      name: nome,
      datas: data,
      suspeito: suspeito,
      contato: telefone,
      local: local,
      photoURL
    }).then(() => window.location.reload());
  }

  delete(caseID: string) {
    return this.db.database.ref('Casos/' + caseID).remove();
  }


}
