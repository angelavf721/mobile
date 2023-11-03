import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ModalController, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FcmService } from 'src/app/services/push-notifications/fmc.service';
import { User } from '../../../../../utils/models/user.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { CasePage } from './case/case.page';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Case } from 'src/utils/models/case.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  enterAnimation: any;
  leaveAnimation: any;
  items: Case[] = [];
  user: User;
  usersToShare: User[] = [];
  loading = true;
  searchedItems: any[] = [];
  savedCasesList: any[] = [];
  recivedCaseID: string;

  @Input() case: any;
  constructor(
    private modalController: ModalController,
    public popoverController: PopoverController,
    private fcm: FcmService,
    private authService: AuthService,
    private db: AngularFireDatabase,
    private storage: Storage,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      if (!this.recivedCaseID) {
        this.recivedCaseID = params['caseID'];
      }
      if (this.recivedCaseID && this.items.length) {
        const caseToOpen = this.items.find((i) => i._id === this.recivedCaseID);
        this.openCase(caseToOpen);
        this.recivedCaseID = undefined;
        this.router.navigate([], { queryParams: {} });
      }

      if (this.recivedCaseID && !this.items.length) {
        this.db
          .list('Casos/')
          .valueChanges()
          .subscribe((res) => {
            this.items = res as Case[];
            this.searchedItems = res;
            const caseToOpen = this.items.find((i) => i._id === this.recivedCaseID);
            this.openCase(caseToOpen);
            this.recivedCaseID = undefined;
            this.router.navigate([], { queryParams: {} });
            this.loadUser();
          });
      }
    });
  }

  ngOnInit() {
    console.log('#HOMEPAGE');
    this.db
      .list('Casos/')
      .valueChanges()
      .subscribe((res) => {
        this.items = res as Case[];
        this.searchedItems = res;
        this.loadUser();
      });
      this.fcm.initPush();
  }

  loadUser() {
    this.storage.get('User').then((user) => {
      this.db.object('Users/' + user._id)
        .valueChanges()
        .subscribe((res) => {
          console.log("🚀 ~ file: home.page.ts:89 ~ HomePage ~ .subscribe ~ res:", res)
          this.user = res as User;
          if(this.user.savedCasesId) {
            this.savedCasesList = this.items.filter(i => this.user.savedCasesId?.includes(i._id));
          } else {
            this.savedCasesList = [];
          }
          this.auth.saveUserOnStorage(this.user);
        });
      this.loading = false;
    });
  }

  async openCase(caseObj: any) {
    const modal = await this.modalController.create({
      component: CasePage,
      componentProps: {
        case: caseObj,
      },
    });
    await modal.present();
  }

  addLista(id: string) {
    const userHasId: boolean = !!this.user.savedCasesId?.find((savedId) => savedId === id);
    if (userHasId) {
      this.user.savedCasesId = this.user.savedCasesId?.filter((savedId) => savedId !== id);
    } else {
      if (!this.user.savedCasesId?.length) {
        this.user.savedCasesId = [];
        this.user.savedCasesId.push(id);
      } else {
        this.user.savedCasesId.push(id);
      }
    }
    this.authService.updateUser(this.user._id, { ...this.user });
  }

  search(event: any) {
    this.searchedItems = this.items.filter((item) =>
      (item.nome as string).toLowerCase().includes(event.detail.value.toLowerCase())
    );
  }

  caseIsSaved(caseId: string): boolean {
    return this.user?.savedCasesId?.includes(caseId);
  }

  openCaseInNotification(caseID: string, notificationIndex: number): void {
    this.db.database.ref('Users/' + this.user._id + '/notifications/' + notificationIndex).remove();
    this.router.navigate(['/home'], { queryParams: { caseID } });
  }

  clearAllNotifications() {
    this.db.database.ref('Users/' + this.user._id + '/notifications').remove();
  }

  async sair() {
    this.authService.logout();
  }
}
