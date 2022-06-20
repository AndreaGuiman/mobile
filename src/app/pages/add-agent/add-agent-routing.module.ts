import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAgentPage } from './add-agent.page';

const routes: Routes = [
  {
    path: '',
    component: AddAgentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAgentPageRoutingModule {}
