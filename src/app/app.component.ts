import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FcmService } from './services/push-notifications/fmc.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private storage: Storage,
    private platform: Platform,
    private fcm: FcmService) {
    console.log('#AppComponent');
    console.log('#AppComponent2');
    this.storage.create();
    this.initializeApp();
  }

  initializeApp() {
    console.log("🚀 ~ file: app.component.ts:20 ~ AppComponent ~ initializeApp ~ initializeApp:")
  }
}
