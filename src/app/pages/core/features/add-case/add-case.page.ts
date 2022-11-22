import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastController, ModalController } from "@ionic/angular";
import {CaseService} from '../../../../services/cases/case.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { nanoid } from 'nanoid'

@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.page.html',
  styleUrls: ['./add-case.page.scss'],
})
export class AddCasePage implements OnInit {
  date: string;
  form: FormGroup;
  case: any;

  constructor(private toastController: ToastController,
              private caseService: CaseService,
              private afStore: AngularFireStorage,
              private fb: FormBuilder) { }

  get nome(): any {
    return this.form.get('nome');
  }

  get data(): any {
    return this.form.get('data');
  }

  get contato(): any {
    return this.form.get('contato');
  }
  get local(): any {
    return this.form.get('local');
  }
  async presentToast(position: 'middle') {
    const toast = await this.toastController.create({
      message: 'Concluido!',
      duration: 1500,
      color:'success',
      translucent: true,
      position
    });

    await toast.present();
  }

  ngOnInit() {
    this.form = this.fb.group({
      nome: [this.case?.name, Validators.required],
      data: [this.case?.datas, Validators.required],
      suspeito: [this.case?.suspeito, Validators.required],
      contato: [this.case?.contato, Validators.required],
      local: [this.case?.local, Validators.required],
      photoURL: [this.case?.photoURL]
    });
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
    if (this.form.valid) {
      if(this.case) {
        console.log('A');
        this.caseService.update(
          this.case._id,
          this.form.get('nome').value,
          this.form.get('data').value,
          this.form.get('suspeito').value,
          this.form.get('contato').value,
          this.form.get('local').value,
          this.form.get('photoURL').value
        ).then(() => {
          this.presentToast('middle');
        });
      } else {
        console.log('B');
        this.caseService.create(
          this.form.get('nome').value,
          this.form.get('data').value,
          this.form.get('suspeito').value,
          this.form.get('contato').value,
          this.form.get('local').value,
          this.form.get('photoURL').value
        ).then(() => {
          this.form.reset();
          this.presentToast('middle');
        });
      }
    }
  }

}
