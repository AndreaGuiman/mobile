import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../model/category';
import { Product } from '../../model/product';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly baseUrl = 'http://localhost:8080/categories';
  // private readonly baseUrl = 'https://bfb8-2a02-2f0e-dd0c-8d00-82b-c300-717f-8186.eu.ngrok.io/categories';
  private readonly httpOptions = {
    headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
    })
};

  constructor(private httpClient: HttpClient) { }

  getAllWithoutProducts(): Observable<Category[]> {
    const url = `${this.baseUrl}/without`;
    return this.httpClient.get<Category[]>(url, this.httpOptions);
  }

  getAllProductsFromCategory(categoryName: string): Observable<Product[]> {
    const url = `${this.baseUrl}/${categoryName}`;
    return this.httpClient.get<Product[]>(url, this.httpOptions);
  }

  getAllNames(): Observable<string[]> {
    const url = `${this.baseUrl}/names`;
    return this.httpClient.get<string[]>(url, this.httpOptions);
  }

  getNameByProductId(id: number): Observable<string>{
    const url = `${this.baseUrl}/name/product/${id}`;
    return this.httpClient.get<string>(url, this.httpOptions);
  }

  getAllNamesBySearch(searchValue: string): Observable<string[]> {
    const url = `${this.baseUrl}/names/${searchValue}`;
    return this.httpClient.get<string[]>(url, this.httpOptions);
  }
}
