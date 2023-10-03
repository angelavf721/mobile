import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { Router } from '@angular/router';
import { User } from '../../../utils/models/user.model';
import { Storage } from '@ionic/storage-angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FcmService } from '../push-notifications/fmc.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
    private storage: Storage,
    private fcmService: FcmService
  ) {}

  createUserWithEmailAndPassword(email: string, password: string, name: string, telefone: string) {
    this.auth.createUserWithEmailAndPassword(email, password).then((res) => {
      const userToSave: User = {
        _id: res.user.uid,
        name,
        email: res.user.email,
        imagemUrl: res.user.photoURL,
        phoneNumber: telefone,
      };
      this.db.database.ref('Users/' + res.user.uid).set(userToSave);
      this.saveUserOnStorage(userToSave).then(() => {
        this.router.navigate(['/home']);
        this.fcmService.initPush();
      });
    });
  }

  updateUser(userId: string, updatedUser: User) {
    return this.db.database
      .ref('Users/' + userId)
      .update(updatedUser)
      .then(() => {
        this.saveUserOnStorage(updatedUser);
      });
  }

  loginWithEmail(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password).then((res) => {
      this.db.database
        .ref('Users/' + res.user.uid)
        .get()
        .then((user) => {
          // LEMBRA DE USAR O .val();
          this.saveUserOnStorage(user.val()).then(() => {
            this.router.navigate(['/home']);
            this.fcmService.initPush();
          });
        });
    });
  }
  logout() {
    this.auth
      .signOut()
      .then(() => this.router.navigate(['/login']))
      .then(() => {
        this.saveUserOnStorage(undefined);
      });
  }

  saveUserOnStorage(user: User) {
    return this.storage.set('User', user);
  }

  // creat(nome: string, data: string, suspeito: string, telefone: string) {
  //   const caseSalve = {
  //     name: nome,
  //     datas: data,
  //     suspeitos: suspeito,
  //     contato: telefone
  //   };
  //   this.db.database.ref('Casos/').push(caseSalve).then(res => {
  //     console.log(caseSalve);
  //     console.log('Cadastrei');
  //   });
  //}
}
