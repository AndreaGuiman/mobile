import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Order } from 'src/app/model/order';
import { Product } from 'src/app/model/product';
import { ProductQuantity } from 'src/app/model/product-quantity';
import { CategoryService } from 'src/app/service/category/category.service';
import { OrderService } from 'src/app/service/order/order.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;
  orderId: number;

  order: Order;
  showContent = false;
  products: Product[];
  quantities: number[];
  productQuantities: ProductQuantity[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private location: Location, private orderService: OrderService,
    private productService: ProductService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.orderId = parseInt(this.route.snapshot.paramMap.get('idOrder'), 10);
    this.route.queryParams
    .subscribe(params => {
      this.userId = params.userId;
      this.userRole = params.userRole;
      this.agentId = params.agentId;
      this.agentName = params.agentName;
      this.orderService.getById(this.orderId)
        .subscribe(order => {
          this.order = order;
          this.order.price = Number((Math.round(this.order.price * 100)/100).toFixed(2));
          this.showContent = true;
          this.products = order.products;
          this.quantities = order.quantities;
          const size = order.products.length;
          for(let i = 0; i < size; i++){
            const productQuantity = {
              product: order.products[i],
              quantity: order.quantities[i],
              price: order.products[i].price * order.quantities[i]
            };
            this.productQuantities.push(productQuantity);
          }
        });
    });
  }

  goBack(): void{
    this.location.back();
  }

  openProductDetails(product: Product): void {
    console.log(product);
    this.categoryService.getNameByProductId(product.id)
      .subscribe(categoryName => {
        this.productQuantities = [];
        this.router.navigate([`client-details/0/0/category/${categoryName}/product-details/${product.id}`], {
          queryParams: {
            userId: this.userId,
            userRole: this.userRole,
            agentId: this.agentId,
            agentName: this.agentName
          }
        });
      });
  }

  openPDF(order: Order): void {

    this.orderService.getPDF(order.id)
    .subscribe(orderPDF => {
      const file = new Blob([orderPDF], { type: 'application/pdf'});
      const fileUrl = URL.createObjectURL(file);
      Browser.open({ url: fileUrl });
    });
  }

  cancelOrder(id: number): void {
    this.orderService.cancelOrder(id)
      .subscribe(order => {
        this.order = order;
      });
  }
}
