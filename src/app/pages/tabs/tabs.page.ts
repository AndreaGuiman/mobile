import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from 'src/app/service/agent/agent.service';
import { map } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { Agent } from 'src/app/model/agent';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;

  constructor(private route: ActivatedRoute,
    private router: Router) {
    }

  ngOnInit() {

    this.route.queryParams
      .subscribe(params => {
        this.userId = params.userId;
        this.userRole = params.userRole;
        this.agentId = params.agentId;
        this.agentName = params.agentName;
      });

    this.router.navigate(['tabs/dashboard'], { queryParams : {
      userId: this.userId,
      userRole: this.userRole,
      agentId: this.agentId,
      agentName: this.agentName
    }});
  }

  goToDashboard(): void {
    this.router.navigate(['tabs/dashboard'], { queryParams : {
      userId: this.userId,
      userRole: this.userRole,
      agentId: this.agentId,
      agentName: this.agentName
    }});
  }

  goToCategory(): void {
    this.router.navigate(['tabs/category'], { queryParams : {
      userId: this.userId,
      userRole: this.userRole,
      agentId: this.agentId,
      agentName: this.agentName
    }});
  }

  goToClients(): void {
    this.router.navigate(['tabs/clients'], { queryParams : {
      userId: this.userId,
      userRole: this.userRole,
      agentId: this.agentId,
      agentName: this.agentName
    }});
  }
}
