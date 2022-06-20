import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Cart } from 'src/app/model/cart';
import { Product } from 'src/app/model/product';
import { CartService } from 'src/app/service/cart/cart.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;

  categoryName: string;
  productId: number;
  product: Product;
  clientId: number;

  croppedImagepath = '';

  showSelectQuantity = false;
  quantity: number;
  cart: Cart;
  cartId: number;

  edit = false;
  inputStock: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location,
    private cartService: CartService,
    private toastControllelr: ToastController
    ) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.initParams(params);
    });
    this.categoryName = this.route.snapshot.paramMap.get('name');
    this.productId = parseInt(this.route.snapshot.paramMap.get('id_product'), 10);
    this.clientId = parseInt(this.route.snapshot.paramMap.get('id_client'), 10);
    this.cartId = parseInt(this.route.snapshot.paramMap.get('id_cart'), 10);
    if(!isNaN(this.cartId)){
      this.cartService.getCart(this.cartId)
        .subscribe(cart => {
          this.cart = cart;
        });
    }

    this.getProductById();
  }

  goBack(): void{
    this.location.back();
  }

  editAction(): void {

    this.edit = true;
  }

  update(): void {

    if(this.inputStock > 0){
      this.productService.update(this.product.id, this.inputStock)
      .subscribe(success => {
        if(success){
          this.showToast(
            2500,
              `Produsul a fost modificat cu succes`,
              'toastSuccessful'
            );
          this.edit = false;
          this.product.stock = this.inputStock;
        }
        else{
          this.showToast(
            2500,
              `Produsul nu a putut fi modificat`,
              'toastUnsuccessful'
            );
        }
      });
    }
  }

  goToCart(): void {
    this.router.navigate([`cart/${this.cartId}`], { queryParams: {
      userId: this.userId,
      userRole: this.userRole,
      agentId: this.agentId,
      agentName: this.agentName
  }});
  }

  getProductById(){
    this.productService.getProductById(this.productId)
      .subscribe(product => {
        this.product = product;
        this.croppedImagepath = product.productImage;
      });
  }

  addToCart(productId: number): void{
    this.showSelectQuantity = true;
    this.productId = productId;
  }

  getValueFromInputQuantity(): void {
    if(this.quantity !== undefined){
      this.showSelectQuantity = false;
      this.productService.getProductById(this.productId)
        .subscribe(product => {
          if(this.quantity > product.stock){
            this.showToast(
              3250,
              `Stocul produsului ${product.name} este mai mic decât cantitatea introdusă`,
              'toastUnsuccessful'
            );
            return;
          }
          this.cartService.getCart(this.cart.id)
            .subscribe(cart => {
              let bool = false;
              const size = cart.productQuantities.length;
              for(let i = 0; i < size; i++){
                if(cart.productQuantities[i].product.id === product.id){
                    cart.productQuantities[i].quantity = +this.quantity + +cart.productQuantities[i].quantity;
                    this.cart.productQuantities[i].quantity = cart.productQuantities[i].quantity;
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
              this.showToast(
                2250,
                `Produsul a fost adăugat cu succes în coș`,
                'toastSuccessful'
              );
              this.quantity = undefined;
            }
          );
        });
    }
  }

  close(): void {
    this.showSelectQuantity = false;
  }

  private initParams(params): void {
    this.userId = params.userId;
    this.userRole = params.userRole;
    this.agentId = params.agentId;
    this.agentName = params.agentName;
  }

  private async showToast(duration: number, message: string, cssClass: string): Promise<void> {
    const toast = await this.toastControllelr.create({
      duration,
      message,
      cssClass,
      animated: true,
      position: 'top',
    });

    await toast.present();
  }
}
