import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Client } from 'src/app/model/client';
import { ClientService } from 'src/app/service/client/client.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.page.html',
  styleUrls: ['./add-client.page.scss'],
})
export class AddClientPage implements OnInit {
  inputName = '';
  inputVatNumber = '';
  inputBankName = '';
  inputBankNumber = '';
  inputAddress = '';
  inputTelephoneNumber = '';
  inputEmailAddress = '';

  client: Client;

  constructor(
    private location: Location,
    private toastController: ToastController,
    private clientService: ClientService
  ) { }

  ngOnInit() {
  }

  goBack(): void {

    this.location.back();
  }

  addClient(): void {
    if(this.checkField(this.inputName) || this.checkField(this.inputVatNumber) ||
      this.checkField(this.inputAddress) || this.checkField(this.inputTelephoneNumber) ||
      this.checkField(this.inputEmailAddress)){
      this.showToast(
        1000,
        'Completați toate câmpurile',
        'toastUnsuccessful'
      );
      return;
    }
    this.clientService.existsByVatOrIdNumber(this.inputVatNumber)
      .subscribe(exists => {
        if(exists === true){
          this.showToast(
            1000,
            'CUI existent. Clientul nu se poate adăuga',
            'toastUnsuccessful'
          );
          return;
        }
      });

    if(!(this.onlyNumbers(this.inputTelephoneNumber))){
      this.showToast(
        1000,
        'Numărul de telefon trebuie să conțină doar cifre',
        'toastUnsuccessful'
      );
      return;
    }
    if(this.checkField(this.inputBankName)){
      this.inputBankName = '';
    }
    if(this.checkField(this.inputBankNumber)){
      this.inputBankNumber = '';
    }
    setTimeout(() => {
      this.client = {
        name: this.inputName,
        address: this.inputAddress,
        vatOrIdNumber: this.inputVatNumber,
        bankName: this.inputBankName,
        bankAccount: this.inputBankNumber,
        telephoneNumber: this.inputTelephoneNumber,
        email: this.inputEmailAddress
      };
      this.clientService.save(this.client)
        .subscribe(client => {
          if(client){
            this.showToast(
            2500,
              `Clientul ${client.name} a fost salvat cu succes`,
              'toastSuccessful'
            );
          }
          else{
            this.showToast(
              2500,
                `Clientul ${client.name} nu a putut fi salvat`,
                'toastUnsuccessful'
              );
          }
          setTimeout(() => {
            this.location.back();
          }, 250);
        });
    }, 100);
  }

  private checkField(input: string): boolean {

    return input === '';
  }

  private onlyNumbers(input: string): boolean {
    return /^[0-9]+$/.test(input);
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
