import {Component, Input, OnInit} from '@angular/core';
import {AlertController, AnimationController, ModalController} from '@ionic/angular';
import {AuthService} from '../../../../services/auth/auth.service';
import {Storage} from '@ionic/storage-angular';
import {User} from '../../../../../utils/models/user.model';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {CasePage} from './case/case.page';
import {AngularFirestore} from '@angular/fire/compat/firestore';



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
  savedCasesList: any[] = [];

  @Input() case: any;
  constructor(private modalController: ModalController,
              private authService: AuthService,
              private db: AngularFireDatabase,
              private storage: Storage) {
  }

  ngOnInit() {
    console.log('#HOMEPAGE');
    this.db.list('Casos/').valueChanges().subscribe(res => {
      this.items = res;
      this.searchedItems = res;
      this.loadUser();
    });
  }

  loadUser() {
    this.storage.get('User').then(user => {
      this.user = user;
      console.log(this.user);
      this.savedCasesList = this.items.filter(i => this.user.savedCasesId?.includes(i._id));
      console.log(this.savedCasesList);
      this.loading = false;
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

  addLista(id: string){
    const userHasId: boolean = !!this.user.savedCasesId?.find(savedId => savedId === id);
    if(userHasId) {
      this.user.savedCasesId = this.user.savedCasesId?.filter(savedId => savedId !== id);
    } else {
      if(!this.user.savedCasesId?.length) {
        this.user.savedCasesId = [];
        this.user.savedCasesId.push(id);
      } else {
        this.user.savedCasesId.push(id);
      }
    }
    this.authService.updateUser(this.user._id, {...this.user}).then(() => this.loadUser());
  }

  search(event: any) {
    this.searchedItems = this.items.filter(item => (item.name as string).includes(event.detail.value));
  }

  caseIsSaved(caseId: string): boolean {
    return this.user.savedCasesId?.includes(caseId);
  }

  async sair(){
    this.authService.logout();
  }

}
