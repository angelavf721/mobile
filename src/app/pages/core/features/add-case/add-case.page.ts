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
    private element: ElementRef,
    private fcmServeice: FcmService
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

  get contato(): AbstractControl {
    return this.form.get('contato');
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
    console.log("🚀 ~ file: add-case.page.ts:75 ~ AddCasePage ~ ngOnInit ~ ngOnInit:")
    this.form = this.fb.group({
      nome: [this.case?.nome, Validators.required],
      data: [this.case?.data, Validators.required],
      contato: [this.case?.contato, Validators.required],
      lat: [this.case?.lat, Validators.required],
      lng: [this.case?.lng, Validators.required],
      imagemUrl: [this.case?.imagemUrl],
    });
  }

  setDate(event: any) {
    this.data.patchValue(event.detail.value);
    this.data.updateValueAndValidity();
  }

  ionViewDidEnter() {
    this.case = history?.state?.case;
    if(this.case) {
      this.form.patchValue({
        nome: this.case?.nome,
        data: this.case?.data,
        contato: this.case?.contato,
        lat: this.case?.lat,
        lng: this.case?.lng,
        imagemUrl: this.case?.imagemUrl,
      })
    }
    let lat: number;
    let lng: number;
    if (!this.case) {
      if (Capacitor.getPlatform() !== 'web') {
        Geolocation.getCurrentPosition().then(
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
        console.log(
          '🚀 ~ file: add-case.page.ts:120 ~ AddCasePage ~ this.afStore.upload ~ res:',
          res
        );
        res.ref.getDownloadURL().then((URL) => {
          this.form.get('imagemUrl').setValue(URL);
        });
      });
    }
  }

  submit() {
    if (this.form.valid) {
      if (this.case) {
        this.caseService.update(this.case._id, this.form.value).then(() => {
          this.presentToast('middle');
        });
      } else {
        this.caseService.create(this.form.value).then(() => {
          this.fcmServeice.enviarNotificacao(`Novo caso`, this.form.value.nome, this.form.value.imagemUrl);
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
}
