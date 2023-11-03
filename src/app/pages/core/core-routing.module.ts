import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'home/:caseID',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'add-case',
        loadChildren: () => import('./features/add-case/add-case.module').then(m => m.AddCasePageModule)
      },
      {
        path: 'edit-case',
        loadChildren: () => import('./features/add-case/add-case.module').then(m => m.AddCasePageModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./features/user/user.module').then( m => m.UserPageModule)
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
