import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CorePage} from './core.page';

const routes: Routes = [
  {
    path: '',
    component: CorePage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'add-case',
        loadChildren: () => import('./features/add-case/add-case.module').then(m => m.AddCasePageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'pesquisar',
        loadChildren: () => import('./features/pesquisar/pesquisar.module').then( m => m.PesquisarPageModule)
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorePageRoutingModule {
}
