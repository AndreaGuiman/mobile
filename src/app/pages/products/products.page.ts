import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { Cart } from 'src/app/model/cart';
import { Product } from 'src/app/model/product';
import { ProductImage } from 'src/app/model/product-image';
import { CartService } from 'src/app/service/cart/cart.service';
import { CategoryService } from 'src/app/service/category/category.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;

  croppedImagepaths: string[] = [];
  quantity: number;
  productId: number;

  categoryName: string;
  products: Product[] = [];
  productsImage: ProductImage[] = [];
  cartId: number;
  cart: Cart;
  clientId: number;

  showSelectQuantity = false;

  viewSearchbar = false;
  productNames: string[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private location: Location,
    private toastController: ToastController
    ) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.initParams(params);
    });
    if(this.userId === undefined){
      this.router.navigate(['login']);
    }
    this.clientId = parseInt(this.route.snapshot.paramMap.get('id_client'), 10);
    this.categoryName = this.route.snapshot.paramMap.get('name');
    this.cartId = parseInt(this.route.snapshot.paramMap.get('id_cart'), 10);
    if(!isNaN(this.cartId)){
      this.cartService.getCart(this.cartId)
        .subscribe(cart => {
          this.cart = cart;
        });
    }
    this.getProductsFromCategory();
  }

  getProductsFromCategory(){
    this.categoryService.getAllProductsFromCategory(this.categoryName)
      .subscribe(products => {
        this.products = products;
        this.products.forEach(product => {
          const productImage = {
            product,
            image: product.productImage
          };
          this.productsImage.push(productImage);
        });
      });
  }

  goBack(): void{
    this.location.back();
  }

  goToCart(): void {
    this.router.navigate([`cart/${this.cart.id}`], { queryParams: {
      userId: this.userId,
      userRole: this.userRole,
      agentId: this.agentId,
      agentName: this.agentName
    }});
  }

  addToCart(productId: number): void{
    // this.cart.productsId.push(productId);
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

  goToProductDetails(id: number): void{
    this.categoryService.getNameByProductId(id)
    .subscribe(categoryName => {
      if(this.userId !== 0){
        this.router.navigate([`client-details/${this.clientId}/${this.cartId}/category/${categoryName}/product-details/${id}`], {
          queryParams: {
            userId: this.userId,
            userRole: this.userRole,
            agentId: this.agentId,
            agentName: this.agentName
          }
        });
      }
      else{
        this.router.navigate([`client-details/0/0/category/${categoryName}/product-details/${id}`], {
          queryParams: {
            userId: this.userId,
            userRole: this.userRole,
            agentId: this.agentId,
            agentName: this.agentName
          }
        });
      }
    });
  }

  searchProducts($event): void {
    this.viewSearchbar = true;
    const searchValue = $event.target.value;
    if(searchValue !== ''){
      this.getProductNamesBySearchValue(searchValue);
      return;
    }
    this.productNames = [];
    this.viewSearchbar = false;
  }

  getProductNamesBySearchValue(searchValue: string): void {
    this.productService.getNamesBySearchValue(searchValue, this.categoryName)
      .subscribe(productNames => {
        this.productNames = productNames;
      });
  }

  goToProductDetailsFromSearchBar(clientName: string): void {
    this.productService.getIdByNameAndCategory(clientName, this.categoryName)
      .subscribe(id => {
        this.router.navigate([`client-details/0/0/category/${this.categoryName}/product-details/${id}`], { queryParams: {
          userId: this.userId,
          userRole: this.userRole,
          agentId: this.agentId,
          agentName: this.agentName
       }});
       this.productNames = [];
       this.viewSearchbar = false;
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
