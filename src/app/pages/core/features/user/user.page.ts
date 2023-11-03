import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { User } from 'src/utils/models/user.model';
import { Storage } from '@ionic/storage-angular';
import { nanoid } from 'nanoid';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { maskPredicate, phoneMask } from 'src/utils/maskito';
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  form: FormGroup;
  passwordForm: FormGroup;
  user: User;
  loading: boolean = true;

  phoneMask = phoneMask;
  maskPredicate = maskPredicate;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private storage: Storage,
    private db: AngularFireDatabase,
    private afStore: AngularFireStorage,
    private auth: AuthService,
    private toastController: ToastController
  ) {}

  ionViewDidEnter() {
    if(this.form.dirty && this.user){
      this.form.reset();
    }
    this.passwordForm.reset();
  }

  ngOnInit() {
    this.loadUser();
    this.passwordForm = this.fb.group({
      senha: ['', Validators.required],
      confirmaSenha: ['', Validators.required],
    });
  }

  createForm() {
    this.form = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      phoneNumber: [this.user.phoneNumber, Validators.required],
      imagemUrl: [this.user.imagemUrl]
    });
    this.loading = false;
  }

  loadUser() {
    return this.storage.get('User').then((user) => {
      this.db
        .object('Users/' + user._id)
        .valueChanges()
        .subscribe(res => {
          this.user = res as User;
          this.createForm();
        });
    });
  }

  openImagePicker(event: any) {
    if (event.target.files[0]) {
      this.afStore.upload(nanoid(), event.target.files[0]).then((res) => {
        res.ref.getDownloadURL().then((URL) => {
          this.form.get('imagemUrl').setValue(URL);
        });
      });
    }
  }

  updateData() {
    this.auth.updateUser(this.user._id, { ...this.user, ...this.form.value }).then(async () => {
      this.close();
      const toast = await this.toastController.create({
        message: 'Usuário atualizado!',
        duration: 1500,
        color: 'success',
        translucent: true,
        position: 'middle',
      });
      toast.present();
    });
  }

  updateSenha() {
    this.auth.updateUserPassword(this.passwordForm.value.senha).then(async () => {
      this.close();
      const toast = await this.toastController.create({
        message: 'Senha atualizada!',
        duration: 1500,
        color: 'success',
        translucent: true,
        position: 'middle',
      });
      toast.present();
    });
  }

  close() {
    return this.router.navigateByUrl('home');
  }
}
