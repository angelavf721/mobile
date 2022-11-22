import { AngularFireStorage } from "@angular/fire/compat/storage";
import {Component, OnInit} from '@angular/core';
import {CaseService} from '../../../../services/cases/case.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import { nanoid } from 'nanoid';

@Component({
  selector: 'app-update-case',
  templateUrl: './update-case.page.html',
  styleUrls: ['./update-case.page.scss'],
})
export class UpdateCasePage implements OnInit {
  form: FormGroup;
  case: any;
  date: any;
  constructor(private caseService: CaseService,
              private fb: FormBuilder,
              private afStore: AngularFireStorage,
              private toastController: ToastController) { }

  get nome(): any {
    return this.form.get('nome');
  }

  get data(): any {
    return this.form.get('data');
  }


  get contato(): any {
    return this.form.get('contato');
  }

  async presentToast(position: 'middle') {
    const toast = await this.toastController.create({
      message: 'Cadastrado com sucesso!',
      duration: 1500,
      color: 'success',
      translucent: true,
      position
    });
    await toast.present();
  }

  ngOnInit() {
    console.log(this.case);
    this.form = this.fb.group({
      nome: [this.case.name, Validators.required],
      data: [this.case.datas, Validators.required],
      suspeito: [this.case.suspeito, Validators.required],
      contato: [this.case.contato, Validators.required],
      photoURL: [this.case.photoURL]
    });
    console.log(this.form.value);
  }

  openImagePicker(event: any) {
    if(event.target.files[0]) {
      this.afStore.upload(nanoid(), event.target.files[0]).then(res => {
        res.ref.getDownloadURL().then(URL => {
          this.form.get('photoURL').setValue(URL);
        })
      })
    }
  }

  submit() {
    // eslint-disable-next-line no-underscore-dangle
    console.log('PORRA', this.form);
    if (this.form.valid) {
      this.caseService.update(
        // eslint-disable-next-line no-underscore-dangle
        this.case._id,
        this.form.get('nome').value,
        this.form.get('data').value,
        this.form.get('suspeito').value,
        this.form.get('contato').value,
      ).then(() => {
        this.presentToast('middle');
      });
    }
  }
}
