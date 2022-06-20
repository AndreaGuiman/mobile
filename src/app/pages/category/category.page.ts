import { Component, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/model/product';
import { identity, Observable } from 'rxjs';
import { ClientService } from 'src/app/service/client/client.service';
import { Client } from 'src/app/model/client';
import { Cart } from 'src/app/model/cart';
import { CartService } from 'src/app/service/cart/cart.service';
import { Location } from '@angular/common';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  userId: number;
  userRole: string;
  agentId: number;
  agentName: string;

  croppedImagepaths: string[] = [];

  categories: Category[] = [];
  clientId: number;
  cart: Cart =  {
    id: 0,
    idAgent: 0,
    idClient: 0,
    productQuantities: [],
    productIds: [],
    quantities: [],
    checkedOut: false,
    status: 'OPEN'
  };

  viewSearchbar = false;
  categoryName: string;
  productNames: any[];

  constructor(private router: Router, private categoryService: CategoryService,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private location: Location,
    private cartService: CartService,
    private productService: ProductService) {
    }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.initParams(params);
    });
    if(this.userId === undefined){
      this.router.navigate(['login']);
    }
    this.getCategories();
    this.clientId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    if(this.clientId){
      const tempCart = this.cartService.checkIfExistsAndIsNotCheckedOut(this.clientId);
      if(tempCart !== undefined){
        this.cart = tempCart;
      }
      else{
        this.cart.idAgent = this.agentId;
        this.cart.idClient = this.clientId;
        this.cart.id = this.cartService.getNextId();
        this.cart.checkedOut = false;
        this.cartService.add(this.cart);
      }
    }
    else{
      this.cart.id = NaN;
    }
  }

  getCategories(): void{
    this.categoryService.getAllWithoutProducts()
      .subscribe(categories => this.categories = categories);
  }

  goBack(): void{
    this.location.back();
  }

  goToCart(): void {
    this.router.navigate([`cart/${this.cart.id}`]);
  }

  goToProducts(category: Category): void{
    this.router.navigate([`client-details/${this.clientId}/${this.cart.id}/category/${category.name}`], {
      queryParams: {
        userId: this.userId,
        userRole: this.userRole,
        agentId: this.agentId,
        agentName: this.agentName
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
    this.productService.getNames(searchValue)
    .subscribe(names => {
      this.productNames = names;
    });
  }

  goToProductDetailsFromSearchBar(productName: string): void {
    this.productService.getIdAndCategoryName(productName)
      .subscribe(product => {
        this.router.navigate([`client-details/${this.clientId}/${this.cart.id}/category/${product.categoryName}` +
        `/product-details/${product.id}`], { queryParams: {
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

}
