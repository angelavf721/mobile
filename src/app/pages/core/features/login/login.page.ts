import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../services/auth/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  recuperarEmailValor: FormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private toastController: ToastController) {
  }
  get email(): any {
    return this.form.get('email');
  }

  get senha(): any {
    return this.form.get('senha');
  }
  ngOnInit() {
    this.form = this.fb.group({
      email: ['',[ Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });

  }

  login() {
    if (this.form.valid) {
      this.authService.loginWithEmail(this.form.get('email').value, this.form.get('senha').value);
    } else {
      this.form.markAsTouched();
    }
  }

  loginWithGoogle() {
    this.authService.googleSignIn();
  }

  recuperarSenha(modal: any, email: string) {
    this.authService.recuperarSenha(email).then(async () => {
      const toast = await this.toastController.create({
        message: 'Verifique o email cadastrado para resetar sua senha.',
        duration: 1500,
        color: 'success',
        translucent: true,
      });
  
      await toast.present();
    }).catch(async () => {
      const toast = await this.toastController.create({
        message: 'Nenhum cadastro com esse email.',
        duration: 1500,
        color: 'warning',
        translucent: true,
      });
      await toast.present();
    });
    modal.dismiss();

  }
}
