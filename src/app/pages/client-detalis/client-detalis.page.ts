import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Client } from 'src/app/model/client';
import { CartService } from 'src/app/service/cart/cart.service';
import { ClientService } from 'src/app/service/client/client.service';

@Component({
  selector: 'app-client-detalis',
  templateUrl: './client-detalis.page.html',
  styleUrls: ['./client-detalis.page.scss'],
})
export class ClientDetalisPage implements OnInit {
  clientId: number;
  client: Client;

  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;

  edit = false;

  inputName = '';
  inputVatNumber = '';
  inputBankName = '';
  inputBankNumber = '';
  inputAddress = '';
  inputTelephoneNumber = '';
  inputEmailAddress = '';

  constructor(private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private location: Location,
    private toastController: ToastController) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.initParams(params);
    });
    this.clientId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.getById();
  }

  goBack(): void{
    this.location.back();
  }

  editAction(): void {
    this.edit = true;
  }

  update(): void {
    const clientToUpdate = {
      name: this.inputName,
      address: this.inputAddress,
      vatOrIdNumber: this.inputVatNumber,
      bankName: this.inputBankName,
      bankAccount: this.inputBankNumber,
      telephoneNumber: this.inputTelephoneNumber,
      email: this.inputEmailAddress
    };
    this.clientService.update(clientToUpdate)
      .subscribe(success => {
        if(success){
          this.showToast(
            2500,
              `Clientul a fost modificat cu succes`,
              'toastSuccessful'
            );
          this.edit = false;
          this.client = clientToUpdate;
        }
        else{
          this.showToast(
            2500,
              `Clientul nu a putut fi modificat`,
              'toastUnsuccessful'
            );
        }
      });
  }

  close(): void {
    this.edit = false;
  }

  createCommand(): void {
    this.router.navigate([`client-details/${this.clientId}/category`], { queryParams: {
      userId: this.userId,
      userRole: this.userRole,
      agentId: this.agentId,
      agentName: this.agentName
    }});
  }

  history(): void {
    this.router.navigate([`client-details/history/${this.clientId}`], { queryParams: {
      userId: this.userId,
      userRole: this.userRole,
      agentId: this.agentId,
      agentName: this.agentName
    }});
  }

  private getById(): void {
    this.clientService.getById(this.clientId)
      .subscribe(client => {
        this.client = client;
        this.inputName = this.client.name;
        this.inputVatNumber = this.client.vatOrIdNumber;
        this.inputAddress = this.client.address;
        this.inputTelephoneNumber = this.client.telephoneNumber;
        this.inputEmailAddress = this.client.email;
        this.inputBankName = this.client.bankName;
        this.inputBankNumber = this.client.bankAccount;
      });
  }

  private initParams(params): void {
    this.userId = params.userId;
    this.userRole = params.userRole;
    this.agentId = params.agentId;
    this.agentName = params.agentName;
  }

  private async showToast(duration: number, message: string, cssClass: string): Promise<void> {
    const toast = await this.toastController.create({
      duration,
      message,
      cssClass,
      animated: true,
      position: 'top',
    });
    await toast.present();
  }
}
