import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Storage } from '@ionic/storage-angular';
import { nanoid } from 'nanoid';
import { Notification } from 'src/utils/models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    private storage: Storage,
    private http: HttpClient,
    private zone: NgZone,
    private location: Location
  ) {}

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    const addListeners = async () => {
      this.storage.get('User').then((u) => {
        this.db.database
          .ref('Users/' + u._id)
          .get()
          .then(async (res) => {
            const user = res.val();
            await PushNotifications.addListener('registration', (token) => {
              console.info('Registration token: ', token.value);
              const tokenDbRef = this.db.database.ref('TokensToNotify/');
              tokenDbRef.get().then((res) => {
                const tokens = res.val();
                if (!tokens || tokens.length === 0) {
                  console.log(1);
                  tokenDbRef.set([token.value]);
                  this.addTokenToUser(token.value);
                }
                if (tokens && !user?.userMobileTokenKey) {
                  console.log(2);
                  tokenDbRef.set([...tokens, token.value]);
                  this.addTokenToUser(token.value);
                }
                if (
                  tokens &&
                  user?.userMobileTokenKey &&
                  !tokens.includes(user.userMobileTokenKey)
                ) {
                  console.log(3);
                  tokenDbRef.set([...tokens, token.value]);
                  this.addTokenToUser(token.value);
                }
              });
              this.storage.set('User', { ...user, userMobileTokenKey: token });
            });
          });
      });

      await PushNotifications.addListener('registrationError', (err) => {
        console.error('Registration error: ', err.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        this.storage.get('User').then(async (user) => {
          const UserDbRef = this.db.database.ref('Users/' + user._id);
          const userDB = (await UserDbRef.get()).val();
          if (!!userDB.notifications) {
            UserDbRef.update({
              ...user,
              notifications: [
                ...userDB.notifications,
                { ...JSON.parse(notification.data.notification), _id: nanoid() },
              ],
            });
          } else {
            UserDbRef.update({
              ...user,
              notifications: [{ ...JSON.parse(notification.data.notification), _id: nanoid() }],
            });
          }
        });
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', (res) => {
        console.log('Push notification action performed', res.actionId, res.inputValue);
        const notificacao = JSON.parse(res.notification.data.notification) as Notification;
        console.log(
          '🚀 ~ file: fmc.service.ts:77 ~ FcmService ~ awaitPushNotifications.addListener ~ notificacao:',
          notificacao
        );
        this.zone.run(() => {
          this.router.navigate(['/home'], { queryParams: { caseID: notificacao.path } })
        });
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
      addListeners();
    };
    
    registerNotifications();
  }

  addTokenToUser(token: string) {
    this.storage.get('User').then((user) => {
      this.db.database.ref('Users/' + user._id).update({ ...user, userMobileTokenKey: token });
      this.storage.set('User', { ...user, userMobileTokenKey: token });
    });
  }

  enviarNotificacao(title: string, ntfbody: string, image?: string, path?: string, sendToTokens?: string[]) {
    console.log("🚀 ~ file: fmc.service.ts:142 ~ FcmService ~ enviarNotificacao ~ enviarNotificacao:")
    this.storage.get('User').then((user) => {
      const tokenDbRef = this.db.database.ref('TokensToNotify/');
      const body = {
        registration_ids: [],
        notification: {
          title: title,
          body: ntfbody,
        },
        data: {
          notification: {
            mensagem: ntfbody,
            imagemUrl: image,
            path: path,
          } as Partial<Notification>,
        },
      };
      if (image) {
        body.notification['image'] = image;
      }
      tokenDbRef.get().then((res) => {
        const tokens = res.val().filter((token) => token !== user.userMobileTokenKey);
        body.registration_ids = sendToTokens || tokens;
        console.log(body);
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
