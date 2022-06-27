/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/model/client';
import { ClientService } from 'src/app/service/client/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {

  clients: Client[] = [];

  viewSearchbar = false;
  clientNames: string[];

  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;

  constructor(private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.initParams(params);
      });
    if(this.userId === undefined){
        this.router.navigate(['login']);
    }

    this.getAll();
  }

  private initParams(params): void {
    this.userId = params.userId;
    this.userRole = params.userRole;
    this.agentId = params.agentId;
    this.agentName = params.agentName;
  }

  goToClientDetails(id: number): void{
    this.router.navigate([`/client-details/${id}`], { queryParams: {
        userId: this.userId,
        userRole: this.userRole,
        agentId: this.agentId,
        agentName: this.agentName
    }});
  }

  searchClients($event): void {
    this.viewSearchbar = true;
    const searchValue = $event.target.value;
    if(searchValue !== ''){
      this.getClientNamesBySearchValue(searchValue);
      return;
    }
    this.clientNames = [];
    this.viewSearchbar = false;
  }

  getClientNamesBySearchValue(searchValue: string): void {
    this.clientService.getNamesBySearchValue(searchValue)
      .subscribe(clientNames => {
        this.clientNames = clientNames;
      });
  }

  goToClientDetailsFromSearchBar(clientName: string): void {
    this.clientService.getIdByName(clientName)
      .subscribe(id => {
        this.router.navigate([`/client-details/${id}`], { queryParams: {
          userId: this.userId,
          userRole: this.userRole,
          agentId: this.agentId,
          agentName: this.agentName
       }});
       this.clientNames = [];
       this.viewSearchbar = false;
      });
  }

  private getAll(){
    this.clientService.getAll()
      .subscribe(clients => this.clients = clients);
  }
}
