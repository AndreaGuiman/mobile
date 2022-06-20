import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly baseUrl = 'http://localhost:8080/products';
  // private readonly baseUrl = 'https://bfb8-2a02-2f0e-dd0c-8d00-82b-c300-717f-8186.eu.ngrok.io/products';
  private readonly httpOptions = {
    headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
    })
  };

  constructor(private httpClient: HttpClient) { }

  getProductById(id: number): Observable<Product> {
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.get<Product>(url, this.httpOptions);
  }

  getNames(searchValue: string): Observable<string[]> {
    const url = `${this.baseUrl}/names/${searchValue}`;
    return this.httpClient.get<string[]>(url, this.httpOptions);
  }

  save(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.baseUrl, product, this.httpOptions);
  }

  getByName(name: string): Observable<Product> {
    const url = `${this.baseUrl}/pic/${name}`;
    return this.httpClient.get<Product>(url, this.httpOptions);
  }

  getNamesBySearchValue(name: string, category: string): Observable<string[]> {
    const url = `${this.baseUrl}/names/${name}/category/${category}`;
    return this.httpClient.get<string[]>(url, this.httpOptions);
  }

  getIdByNameAndCategory(name: string, category: string): Observable<number> {
    const url = `${this.baseUrl}/name/${name}/category/${category}`;
    return this.httpClient.get<number>(url, this.httpOptions);
  }

  getIdAndCategoryName(name: string): Observable<Product> {
    const url = `${this.baseUrl}/name/${name}`;
    return this.httpClient.get<Product>(url, this.httpOptions);
  }

  update(id: number, stock: number): Observable<boolean> {
    const url = `${this.baseUrl}/update/${id}/${stock}`;
    return this.httpClient.patch<boolean>(url, this.httpOptions);
  }
}
