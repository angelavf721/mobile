import { Injectable } from '@angular/core';
import { Plugins, Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private auth: AngularFireAuth,
    private storage: Storage,
    private http: HttpClient
  ) {}

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    const addListeners = async () => {
      const user = await this.storage.get('User');
      await PushNotifications.addListener('registration', (token) => {
        console.info('Registration token: ', token.value);
        const tokenDbRef = this.db.database.ref('TokensToNotify/');
        tokenDbRef.get().then((res) => {
          const tokens = res.val();
          console.log(tokens);
          if (!tokens || tokens.length === 0) {
            tokenDbRef.set([token.value]);
          }
          if (!tokens.includes(user.userMobileTokenKey)) {
            tokenDbRef.set([...tokens, token.value]);
            this.addTokenToUser(token.value);
          }
        });
      });

      await PushNotifications.addListener('registrationError', (err) => {
        console.error('Registration error: ', err.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.inputValue
        );
        console.log(notification);
      });
    };

    const registerNotifications = async () => {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    };

    const getDeliveredNotifications = async () => {
      const notificationList = await PushNotifications.getDeliveredNotifications();
      console.log('delivered notifications', notificationList);
    };
    addListeners();
    registerNotifications();
    getDeliveredNotifications();
  }

  addTokenToUser(token: string) {
    this.storage.get('User').then((user) => {
      this.db.database.ref('Users/' + user._id).update({ ...user, userMobileTokenKey: token });
    });
  }

  enviarNotificacao(title: string, ntfbody: string, image?: string) {
    this.storage.get('User').then((user) => {
      const tokenDbRef = this.db.database.ref('TokensToNotify/');
      const body = {
        registration_ids: [],
        notification: {
          title: title,
          body: ntfbody,
        },
      };
      if(image) {
        body.notification['image'] = image;
      }
      tokenDbRef.get().then((res) => {
        const tokens = res.val().filter((token) => token !== user.userMobileTokenKey);
        body.registration_ids = tokens;
        this.http
          .post('https://fcm.googleapis.com/fcm/send', body, {
            headers: {
              Authorization:
                'key=AAAAwma-Qrs:APA91bHpEp9jFF2zCl2j4n7ZsQ78_R2GTZ9bV_8HcpDB8WpwfOJuFJ0OBa9D7xE1GoIP5PfIFT4z1oXnfuKI2GTTWcityWN-dV2rjGBDAQ-mdoenZPO_9JsaijmXeOz_facMeAwUpj9u',
            },
          })
          .subscribe();
      });
    });
  }
}
