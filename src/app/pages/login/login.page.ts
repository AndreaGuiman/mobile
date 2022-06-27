import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ToastOptions } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Agent } from 'src/app/model/agent';
import { User } from 'src/app/model/user';
import { AgentService } from 'src/app/service/agent/agent.service';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  inputUsername = '';
  inputPassword = '';

  constructor(private authService: AuthService,
    private toastController: ToastController,
    private router: Router,
    private agentService: AgentService) { }

  ngOnInit() {
  }

  login(): void {
    const user: User = {
      username: this.inputUsername,
      password: this.inputPassword
    };
    this.authenticate(user);
  }

  private authenticate(user: User): any {
    if(this.checkField(this.inputUsername) || this.checkField(this.inputPassword)){
      this.showToast(
        1000,
        'Completați toate câmpurile',
        'toastUnsuccessful'
      );
      return;
    }

    this.authService.authenticate(user)
      .subscribe(tempUser => {
        if(tempUser.userRole === 'ADMIN' || tempUser.userRole === 'AGENT') {
          this.inputPassword = this.inputUsername = '';
          this.agentService.getByUserId(tempUser.id)
            .subscribe(agent => {
              this.router.navigate(['tabs'], { queryParams :
                {
                  userId: tempUser.id,
                  userRole: tempUser.userRole,
                  agentId: agent.id,
                  agentName: agent.name
                }})
                .then(() => {
                  this.showToast(
                    1000,
                    'Logare cu succes',
                    'toastSuccessful'
                  );
                  setTimeout(() => window.location.reload(), 1000);
                });
            });
        }
        else{
        this.showToast(
            1250,
            'Username sau parola greșite',
            'toastUnsuccessful'
        );
      }
      });
  }

  private checkField(input: string): boolean {

    return input === '';
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
