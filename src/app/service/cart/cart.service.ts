import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Cart } from 'src/app/model/cart';
import { Product } from 'src/app/model/product';
import { ProductQuantity } from 'src/app/model/product-quantity';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  carts: Cart[] = [];

  private readonly baseUrl = 'http://localhost:8080/orders';
  // private readonly baseUrl = 'https://a14e-2a02-2f0e-dd0c-8d00-6800-740c-3ff8-2151.eu.ngrok.io/orders';
  private readonly httpOptions = {
    headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
    })
};

  constructor(private httpClient: HttpClient) { }

  checkIfExistsAndIsNotCheckedOut(idClient: number): any{
    const size = this.carts.length;
    for(let i = 0; i < size; i++){
      if(this.carts[i].idClient === idClient && this.carts[i].checkedOut === false){
        return this.carts[i];
      }
    }
    return undefined;
  }

  add(cart: Cart): void{
    this.carts.push(cart);
  }

  getCart(cartId: number): Observable<Cart>{
    const cart = this.carts.find(tempCart => tempCart.id === cartId);
    return of(cart);
  }

  getNextId(): number{

    return this.carts.length + 1;
  }

  saveCart(cart: Cart): Observable<number>{

    return this.httpClient.post<number>(this.baseUrl, cart, this.httpOptions);
  }
}
