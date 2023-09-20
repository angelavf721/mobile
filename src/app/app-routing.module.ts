import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectToLoginPage = () => redirectUnauthorizedTo('login');

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/core/core.module').then(m => m.CorePageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectToLoginPage }
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/core/features/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./pages/core/features/cadastro/cadastro.module').then(m => m.CadastroPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
