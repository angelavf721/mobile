import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { ToastController } from '@ionic/angular';
import * as L from 'leaflet';
import { nanoid } from 'nanoid';
import { CaseService } from '../../../../services/cases/case.service';
import { DatePipe, Location } from '@angular/common';
import { FcmService } from 'src/app/services/push-notifications/fmc.service';

@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.page.html',
  styleUrls: ['./add-case.page.scss'],
})
export class AddCasePage implements OnInit {
  addContactForm: FormGroup;
  form: FormGroup;
  case: any;

  // MAP

  private map: any;
  private marker: any;

  constructor(
    private toastController: ToastController,
    private caseService: CaseService,
    private afStore: AngularFireStorage,
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private element: ElementRef
  ) {
    const selectedCase = this.router.getCurrentNavigation().extras.state?.case;
    if (selectedCase) {
      this.case = selectedCase;
    }
  }

  get nome(): AbstractControl {
    return this.form.get('nome');
  }

  get data(): AbstractControl {
    return this.form.get('data');
  }

  get contatos(): AbstractControl {
    return this.form.get('contatos');
  }

  get lat(): AbstractControl {
    return this.form.get('lat');
  }
  async presentToast(position: 'middle') {
    const toast = await this.toastController.create({
      message: 'Concluido!',
      duration: 1500,
      color: 'success',
      translucent: true,
      position,
    });

    await toast.present();
  }

  ngOnInit() {
    this.form = this.fb.group({
      nome: [this.case?.nome, Validators.required],
      data: [this.case?.data, Validators.required],
      contatos: [this.case?.contatos, Validators.required],
      lat: [this.case?.lat, Validators.required],
      lng: [this.case?.lng, Validators.required],
      imagemUrl: [this.case?.imagemUrl, Validators.required],
    });

    this.addContactForm = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
    });
  }

  setDate(event: any) {
    this.data.patchValue(event.detail.value);
    this.data.updateValueAndValidity();
  }

  ionViewDidEnter() {
    this.case = history?.state?.case;
    if (this.case) {
      this.form.patchValue({
        nome: this.case?.nome,
        data: this.case?.data,
        contatos: this.case?.contatos,
        lat: this.case?.lat,
        lng: this.case?.lng,
        imagemUrl: this.case?.imagemUrl,
      });
    }
    let lat: number;
    let lng: number;
    if (!this.case) {
      if (Capacitor.getPlatform() !== 'web') {
        Geolocation.getCurrentPosition({enableHighAccuracy: true}).then(
          (pos) => {
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            this.intiMap(lat, lng);
          },
          (err) => {
            this.intiMap(0, 0);
          }
        );
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            this.intiMap(lat, lng);
          },
          (err) => {
            this.intiMap(0, 0);
          }
        );
      }
    } else {
      this.intiMap(this.lat.value, this.form.value.lng);
      this.addMarker(this.lat.value, this.form.value.lng, true);
    }
  }

  intiMap(lat: number, lng: number) {
    this.map = L.map(!!this.case ? 'edit-map' : 'create-map').setView([lat || 0, lng || 0], 13);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });
    tiles.addTo(this.map);
    this.map.doubleClickZoom.disable();
    this.map.on('dblclick', (e) => this.addMarker(e.latlng.lat, e.latlng.lng));
  }

  addMarker(lat: number, lng: number, firstCheck: boolean = false) {
    if (!firstCheck && this.form.value.lat && this.form.value.lng) {
      this.map.removeLayer(this.marker);
    }
    this.form.controls['lat'].setValue(lat);
    this.form.controls['lng'].setValue(lng);
    this.form.updateValueAndValidity();
    const config = {
      icon: L.icon({
        iconSize: 25, //icon size [width.height]
        iconUrl: '../../../../../assets/icon/pin.png',
      }),
    };
    this.marker = L.marker([lat, lng], config).addTo(this.map);
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

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.case) {
        this.caseService.update(this.case._id, this.form.value).then(() => {
          this.presentToast('middle');
        });
      } else {
        this.caseService.create(this.form.value).then(() => {
          this.form.reset();
          this.presentToast('middle');
        });
      }
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  ionViewDidLeave() {
    this.element.nativeElement.remove();
    this.location.replaceState('');
    this.map.remove();
  }

  addContact(modal: any) {
    let value = this.form.value.contatos;
    if (value) {
      value.push({
        _id: nanoid(),
        ...this.addContactForm.value,
      });
    } else {
      value = [
        {
          _id: nanoid(),
          ...this.addContactForm.value,
        },
      ];
    }
    this.form.controls['contatos'].patchValue(value);
    this.addContactForm.reset();
    modal.dismiss();
  }

  removeContato(index: number) {
    let value = this.form.value.contatos;
    value.splice(index, 1)
    this.form.controls['contatos'].patchValue(value);
  }
}
