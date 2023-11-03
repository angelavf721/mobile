import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from "firebase/auth";
import { Router } from '@angular/router';
import { User } from '../../../utils/models/user.model';
import { Storage } from '@ionic/storage-angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FcmService } from '../push-notifications/fmc.service';
import { ToastController } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
    private storage: Storage,
    private fcmService: FcmService,
    private toastController: ToastController
  ) {}

  createUserWithEmailAndPassword(email: string, password: string, name: string, telefone: string) {
    this.auth.createUserWithEmailAndPassword(email, password).then((res) => {
      const userToSave: User = {
        _id: res.user.uid,
        name,
        email: res.user.email,
        imagemUrl: res.user.photoURL,
        phoneNumber: telefone,
        savedCasesId: []
      };
      this.db.database.ref('Users/' + res.user.uid).set(userToSave);
      this.saveUserOnStorage(userToSave).then(() => {
        this.router.navigate(['/home']);
        this.fcmService.initPush();
      });
    }).catch(async (error) => {
      if(error.code === 'auth/email-already-in-use') {
        const toast = await this.toastController.create({
          message: 'Já existe um usuário com esse e-mail.',
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        await toast.present();
      }
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

  updateUserPassword(password: string) {
    return this.auth.currentUser.then(u => {
      u.updatePassword(password);
    });
  }

  recuperarSenha(email: string) {
    return this.auth.sendPasswordResetEmail(email);
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
    }).catch(async (error) => {
      if(error.code === 'auth/user-not-found') {
        const toast = await this.toastController.create({
          message: 'Não existe usuário com esse e-mail.',
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
        await toast.present();
      }
      if(error.code === 'auth/wrong-password') {
        const toast = await this.toastController.create({
          message: 'Senha incorreta.',
          duration: 1500,
          position: 'top',
          color: 'warning',
        });
        await toast.present();
      }
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

  async googleSignIn() {
    let googleUser = await GoogleAuth.signIn();
    const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
    const res = await this.auth.signInAndRetrieveDataWithCredential(credential);
    this.db.database
    .ref('Users/' + res.user.uid)
    .get()
    .then((userRes) => {
      const user = userRes.val();
      if(!!user) {
        this.saveUserOnStorage(user).then(() => {
          this.router.navigate(['/home']);
          this.fcmService.initPush();
        });
      } else {
        const userToSave: User = {
          _id: res.user.uid,
          name: res.user.displayName,
          email: res.user.email,
          imagemUrl: res.user.photoURL,
          phoneNumber: '',
          savedCasesId: []
        };
        this.db.database.ref('Users/' + res.user.uid).set(userToSave);
        this.saveUserOnStorage(userToSave).then(() => {
          this.router.navigate(['/home']);
          this.fcmService.initPush();
        });
      }
    });
    return res;
  }

}
