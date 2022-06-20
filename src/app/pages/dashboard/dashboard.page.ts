/* eslint-disable @typescript-eslint/member-ordering */
import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Agent } from 'src/app/model/agent';
import { AgentService } from 'src/app/service/agent/agent.service';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;
  window: any;
  agent: Agent;

  croppedImagepath = '';
  imgLoaded = false;
  isAdmin = false;
  showContent = true;

  constructor(private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute,
    private agentService: AgentService) {
   }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.initParams(params);
      });
      if(this.userId === undefined){
        this.router.navigate(['login']);
      }
      if(this.agentId !== undefined){
        this.agentService.getPhotoById(this.agentId)
        .subscribe(agent => {
          this.agent = agent;
          this.croppedImagepath = agent.photo;
          this.imgLoaded = true;
        });
      }
      if(this.userRole === 'ADMIN'){
        this.isAdmin = true;
      }
  }

  private initParams(params): void {
    this.userId = params.userId;
    this.userRole = params.userRole;
    this.agentId = params.agentId;
    this.agentName = params.agentName;
  }

  goToReports(): void{
    this.router.navigate(['/reports'], {
      queryParams: {
        userId: this.userId,
        userRole: this.userRole,
        agentId: this.agentId,
        agentName: this.agentName
      }
    });
  }

  goToOpenOrders(): void{
    this.router.navigate(['/orders/OPEN'], {
      queryParams: {
        userId: this.userId,
        userRole: this.userRole,
        agentId: this.agentId,
        agentName: this.agentName
      }
    });
  }

  goToSentOrders(): void{
    this.router.navigate(['/orders/SENT'], {
      queryParams: {
        userId: this.userId,
        userRole: this.userRole,
        agentId: this.agentId,
        agentName: this.agentName
      }
    });
  }

  goToCanceledOrders(): void{
    this.router.navigate(['/orders/CANCELED'], {
      queryParams: {
        userId: this.userId,
        userRole: this.userRole,
        agentId: this.agentId,
        agentName: this.agentName
      }
    });
  }

  addClient(): void {
    this.router.navigate(['/add-client'], {
      queryParams: {
        userId: this.userId,
        userRole: this.userRole,
        agentId: this.agentId,
        agentName: this.agentName
      }
    });
  }

  addProduct(): void {
    this.router.navigate(['/add-product'], {
      queryParams: {
        userId: this.userId,
        userRole: this.userRole,
        agentId: this.agentId,
        agentName: this.agentName
      }
    });
  }

  addAgent(): void {
    this.router.navigate(['/add-agent'], {
      queryParams: {
        userId: this.userId,
        userRole: this.userRole,
        agentId: this.agentId,
        agentName: this.agentName
      }
    });
  }

  logout(): void {

    this.showContent = false;
    this.authService.logout();
  }

  openPDF(): void {
    this.authService.getPDF()
    .subscribe(orderPDF => {
      const file = new Blob([orderPDF], { type: 'application/pdf'});
      const fileUrl = URL.createObjectURL(file);
      Browser.open({ url: fileUrl });
    });
  }
}
