import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order/order.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Browser } from '@capacitor/browser';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, PipeTransform {

  orders: Order[] = [];
  content: SafeResourceUrl;

  showOrders = '';

  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;
  type: string;
  orderType: string;

  constructor(private orderService: OrderService,
    private sanitizer: DomSanitizer,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute) {
    }

  transform(url) {

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnInit() {

    this.type = this.route.snapshot.paramMap.get('type');;
    this.route.queryParams
    .subscribe(params => {
      this.userId = params.userId;
      this.userRole = params.userRole;
      this.agentId = params.agentId;
      this.agentName = params.agentName;
      console.log(params);
      this.orderService.getAllByShowOption(this.type, this.agentId)
        .subscribe(orders => {
          this.orders = orders;
          this.orders.forEach(o => {
            o.price = Number((Math.round(o.price * 100)/100).toFixed(2));
          });
          switch(this.type){
            case 'OPEN':
              this.orderType = 'în curs de procesare';
              break;
            case 'SENT':
              this.orderType = 'finalizate';
              break;
            case 'CANCELED':
              this.orderType = 'anulate';
              break;
          }
        });
    });
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
}
