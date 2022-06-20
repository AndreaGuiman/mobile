import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/model/client';
import { Order } from 'src/app/model/order';
import { ClientService } from 'src/app/service/client/client.service';
import { OrderService } from 'src/app/service/order/order.service';

@Component({
  selector: 'app-client-history',
  templateUrl: './client-history.page.html',
  styleUrls: ['./client-history.page.scss'],
})
export class ClientHistoryPage implements OnInit {
  clientId: number;
  client: Client;

  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;

  orders: Order[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private clientService: ClientService,
    private orderService: OrderService) { }

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

  openOrder(order: Order): void {
    this.router.navigate([`order-details/${order.id}`], {
      queryParams: {
        userId: this.userId,
        userRole: this.userRole,
        agentId: this.agentId,
        agentName: this.agentName
      }
    });
  }

  private getById(): void {
    this.clientService.getById(this.clientId)
      .subscribe(client => {
        this.client = client;
        this.orderService.getClientHistory(this.clientId)
          .subscribe(orders => {
            this.orders = orders;
          });
      });
  }

  private initParams(params): void {
    this.userId = params.userId;
    this.userRole = params.userRole;
    this.agentId = params.agentId;
    this.agentName = params.agentName;
    console.log(params);
  }
}
