import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from "@ionic/angular";
import { nanoid } from 'nanoid';
import { CaseService } from '../../../../services/cases/case.service';
import * as L from 'leaflet';


@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.page.html',
  styleUrls: ['./add-case.page.scss'],
})
export class AddCasePage implements OnInit {
  date: string;
  form: FormGroup;
  case: any;

  // MAP

  private map: any;
  private marker: any;

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
      lat: [''],
      lng: [''],
      photoURL: [this.case?.photoURL]
    });
  }

  ionViewDidEnter() {
    let lat: number;
    let lng: number;
    navigator.geolocation.getCurrentPosition(pos => {
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      this.intiMap(lat, lng);
    },
    err => {
      this.intiMap(0,0);
    });
  }

  intiMap(lat: number, lng: number) {
    this.map = L.map('map').setView([(lat || 0), (lng || 0)], 13);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });
    tiles.addTo(this.map);
    this.map.doubleClickZoom.disable(); 
    this.map.on('dblclick',(e) => this.addMarker(e.latlng.lat, e.latlng.lng));
  }
  
  addMarker(lat: number, lng: number) {
    if(this.form.value.lat && this.form.value.lng) {
      this.map.removeLayer(this.marker);
    }
    console.log("🚀 ~ file: add-case.page.ts:92 ~ AddCasePage ~ addMarker ~ lat:", lat)
    console.log("🚀 ~ file: add-case.page.ts:92 ~ AddCasePage ~ addMarker ~ lng:", lng)
    this.form.controls['lat'].setValue(lat);
    this.form.controls['lng'].setValue(lng);
    this.form.updateValueAndValidity();
    this.marker = L.marker([lat, lng]).addTo(this.map);
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
