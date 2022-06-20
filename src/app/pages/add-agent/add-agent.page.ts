import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Agent } from 'src/app/model/agent';
import { AgentService } from 'src/app/service/agent/agent.service';


@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.page.html',
  styleUrls: ['./add-agent.page.scss'],
})
export class AddAgentPage implements OnInit {

  inputFirstName = '';
  inputLastName = '';
  inputTelephoneNumber = '';
  inputUsername = '';
  inputPassword = '';

  agent: Agent;

  constructor(
    private location: Location,
    private toastController: ToastController,
    private agentService: AgentService
  ) { }

  ngOnInit() {
  }

  goBack(): void{

    this.location.back();
  }

  addAgent(): void {

    if(this.checkField(this.inputFirstName) || this.checkField(this.inputLastName) ||
        this.checkField(this.inputTelephoneNumber) || this.checkField(this.inputUsername) ||
        this.checkField(this.inputPassword)){
      this.showToast(
        1000,
        'Completați toate câmpurile',
        'toastUnsuccessful'
      );
      return;
    }

    if(!(this.onlyNumbers(this.inputTelephoneNumber))){
      this.showToast(
        1000,
        'Numărul de telefon trebuie să conțină doar cifre',
        'toastUnsuccessful'
      );
      return;
    }

    setTimeout(() => {
      this.agent = {

        firstName: this.inputFirstName,
        lastName: this.inputLastName,
        telephoneNumber: this.inputTelephoneNumber,
        username: this.inputUsername,
        password: this.inputPassword
      };

      this.agentService.save(this.agent)
        .subscribe(agent => {
          if(agent){
            this.showToast(
            2500,
              `Noul agent ${this.agent.firstName} a fost adăugat cu succes`,
              'toastSuccessful'
            );
            this.location.back();
          }
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
