import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/compat/storage';
import { HttpClientModule } from  '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyD7M-YoCTL1Qns--qlPeu0icxlqLeyuTcM',
      authDomain: 'bd-amber.firebaseapp.com',
      databaseURL: 'https://bd-amber-default-rtdb.firebaseio.com',
      projectId: 'bd-amber',
      storageBucket: 'bd-amber.appspot.com',
      messagingSenderId: '834947400379',
      appId: '1:834947400379:web:0f90a8854debc594f05f9e',
      measurementId: 'G-7HE6HJFJZK'
    }),
    AngularFireStorageModule,
    AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    { provide: BUCKET, useValue: 'gs://bd-amber.appspot.com' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
