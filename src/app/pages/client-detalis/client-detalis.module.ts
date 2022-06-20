import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientDetalisPageRoutingModule } from './client-detalis-routing.module';

import { ClientDetalisPage } from './client-detalis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientDetalisPageRoutingModule
  ],
  declarations: [ClientDetalisPage]
})
export class ClientDetalisPageModule {}
