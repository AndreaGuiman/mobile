import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    // path: 'tabs/:id/:role/:idAgent/:name',
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: () => import('../dashboard/dashboard-routing.module').then(m => m.DashboardPageRoutingModule)
          }
        ]
      },
      {
        path: 'category',
        loadChildren: () => import('../category/category.module').then(m => m.CategoryPageModule),
      },
      {
        path: 'clients',
        loadChildren: () => import('../clients/clients-routing.module').then(m => m.ClientsPageRoutingModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
