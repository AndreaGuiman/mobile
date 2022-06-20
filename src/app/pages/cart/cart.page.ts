import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { ToastController } from '@ionic/angular';
import { Cart } from 'src/app/model/cart';
import { Product } from 'src/app/model/product';
import { ProductQuantity } from 'src/app/model/product-quantity';
import { CartService } from 'src/app/service/cart/cart.service';
import { OrderService } from 'src/app/service/order/order.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;

  cartId: number;
  products: Product[] = [];
  quantities: number[] = [];
  productQuantities: ProductQuantity[] = [];
  cart: Cart;

  add: boolean;

  totalPrice = 0;
  showSelectQuantity = false;
  quantity: number;
  productId: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private toastController: ToastController) {

     }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.initParams(params);
    });
    this.cartId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    setTimeout(() => {
      this.cartService.getCart(this.cartId)
        .subscribe(cart => {
          this.cart = cart;
          this.productQuantities = this.cart.productQuantities;
          this.productQuantities.forEach(productQuantity => {
            productQuantity.price = productQuantity.product.price * productQuantity.quantity;
            this.totalPrice += productQuantity.price;
          });
        });
    }, 250);
  }

  goBack(): void{
    this.location.back();
  }

  removeQuantity(productId: number): void {
    this.showSelectQuantity = true;
    this.productId = productId;
    this.add = false;
  }

  addQuantity(productId: number): void {
    this.showSelectQuantity = true;
    this.productId = productId;
    this.add = true;
  }

  removeProduct(productId: number): void {
    const size = this.cart.productQuantities.length;
    for(let i = 0; i < size; i++){
      if(this.cart.productQuantities[i].product.id === productId){
        this.totalPrice = this.totalPrice - this.cart.productQuantities[i].price;
        this.cart.productQuantities.splice(i, 1);
        break;
      }
    }
  }

  getValueFromInputQuantity(): void {
    if(this.quantity !== undefined){
      this.showSelectQuantity = false;
      if(this.quantity !== undefined){
        this.productService.getProductById(this.productId)
          .subscribe(product => {
            this.cartService.getCart(this.cart.id)
              .subscribe(cart => {
                let bool = false;
                const size = cart.productQuantities.length;
                for(let i = 0; i < size; i++){
                  if(cart.productQuantities[i].product.id === product.id){
                    if(this.add === true){
                      cart.productQuantities[i].quantity = +cart.productQuantities[i].quantity + +this.quantity;
                      cart.productQuantities[i].price = cart.productQuantities[i].product.price * cart.productQuantities[i].quantity;
                      this.totalPrice = +this.totalPrice + +(cart.productQuantities[i].product.price * this.quantity);
                    }
                    else{
                      cart.productQuantities[i].quantity = cart.productQuantities[i].quantity - this.quantity;
                      cart.productQuantities[i].price = cart.productQuantities[i].product.price * cart.productQuantities[i].quantity;
                      this.totalPrice = this.totalPrice - (cart.productQuantities[i].product.price * this.quantity);
                    }
                    bool = true;
                    break;
                  }
                }
                if(!bool){
                  this.cart.productQuantities.push({
                    product,
                    quantity: this.quantity
                  });
                }
                this.quantity = undefined;
              }
            );
          });
      }
    }
  }

  close(): void {
    this.showSelectQuantity = false;
  }

  deleteAll(): void {
    this.cart.productQuantities = [];
    this.productQuantities = [];
  }

  createOrder(): void {
    this.cart.dateOfOrder = new Date();
    this.cart.checkedOut = true;
    if(!(this.cart.productIds.length > 0)){
      this.cart.productQuantities.forEach(productQuantity => {
        this.cart.productIds.push(productQuantity.product.id);
        this.cart.quantities.push(productQuantity.quantity);
      });
    }
    this.cartService.saveCart(this.cart)
      .subscribe(id => {
        if(id !== -1){
          this.orderService.getPDF(id)
            .subscribe(orderPDF => {
              const file = new Blob([orderPDF], { type: 'application/pdf'});
              const fileUrl = URL.createObjectURL(file);
              Browser.open({ url: fileUrl });
              this.router.navigate([`tabs`], { queryParams: {
                userId: this.userId,
                userRole: this.userRole,
                agentId: this.agentId,
                agentName: this.agentName
              }});
              this.orderService.sendEmail(id);
            });
            return;
        }
        this.showToast(
          1250,
          'Comanda nu s-a putut salva',
          'toastUnsuccessful'
      );
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
