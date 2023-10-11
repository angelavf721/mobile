import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../services/auth/auth.service';
import {AngularFireDatabase} from '@angular/fire/compat/database';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private db: AngularFireDatabase) {
    console.log(this.form);
  }
  get nome(): any {
    return this.form.get('nome');
  }

  get email(): any {
    return this.form.get('email');
  }

  get senha(): any {
    return this.form.get('senha');
  }

  get telefone(): any {
    return this.form.get('telefone');
  }

  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['',[ Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.min(6)]],
      telefone: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      this.authService.createUserWithEmailAndPassword(
        this.form.get('email').value,
        this.form.get('senha').value,
        this.form.get('nome').value,
        this.form.get('telefone').value,
      );
    }
  }

  ionViewDidLeave() {
    this.form.reset();
  }
}
