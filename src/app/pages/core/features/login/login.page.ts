import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService) {
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
}
