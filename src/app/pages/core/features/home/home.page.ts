import {Component, Input, OnInit} from '@angular/core';
import {AlertController, AnimationController, ModalController} from '@ionic/angular';
import {AuthService} from '../../../../services/auth/auth.service';
import {Storage} from '@ionic/storage-angular';
import {User} from '../../../../../utils/models/user.model';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {CasePage} from './case/case.page';
import {AddCasePage} from "../add-case/add-case.page";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  enterAnimation: any;
  leaveAnimation: any;
  items: any[] = [];
  user: User;
  loading = true;
  searchedItems: any[] = [];


  @Input() case: any;
  constructor(private modalController: ModalController,
              private authService: AuthService,
              private alertController: AlertController,
              private db: AngularFireDatabase,
              private storage: Storage) {

    db.list('Casos/').valueChanges().subscribe(res => {
      this.items = res;
      this.searchedItems = res;
      // this.listItems = res;
      this.loading = false;

    });
  }


  ngOnInit() {
    console.log('#HOMEPAGE');
    console.log();
    this.storage.get('User').then(user => {
      this.user = user;
      console.log(this.user);
    });
  }

  async openCase(caseObj: any) {
    console.log(caseObj);
    const modal = await this.modalController.create({
      component: CasePage,
      componentProps: {
        case: caseObj
      }
    });
    await modal.present();
  }


  search(event: any) {
    console.log("🚀 -> search -> event", event.detail.value);
    this.searchedItems = this.items.filter(item => (item.name as string).includes(event.detail.value));
  }
  // list(event: any){
  //   this.listItems = this.items.co;
  // }

}
