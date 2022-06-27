/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from 'src/app/model/order';
import { Graph } from 'src/app/model/graph';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = 'http://localhost:8080/orders';
  private readonly baseUrlPDF = 'http://localhost:8080/orders/pdf';
  // private readonly baseUrl = 'https://a14e-2a02-2f0e-dd0c-8d00-6800-740c-3ff8-2151.eu.ngrok.io/orders';
  // private readonly baseUrlPDF = 'https://a14e-2a02-2f0e-dd0c-8d00-6800-740c-3ff8-2151.eu.ngrok.io/orders/pdf';
  private readonly httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
  };

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.baseUrl, this.httpOptions);
  }

  getTopNProductsSoldByLoggedAgent(idAgent: number, numberOfProducts: number, month: string): Observable<Graph[]> {
    const url = `${this.baseUrl}/top-products-by-agent/${idAgent}/${numberOfProducts}/${month}`;
    return this.httpClient.get<Graph[]>(url, this.httpOptions);
  }

  getTopNProductsSoldByLoggedAgentPeriod(idAgent: number, numberOfProducts: number, monthPeriodStart: string, monthPeriodEnd):
      Observable<Graph[]> {
    const url = `${this.baseUrl}/top-products-by-agent/period/${idAgent}/${numberOfProducts}/${monthPeriodStart}/${monthPeriodEnd}`;
    return this.httpClient.get<Graph[]>(url, this.httpOptions);
  }

  getProductSoldByAgent(idAgent: number, product: string, month: string): Observable<Graph> {
    const url = `${this.baseUrl}/product-by-agent/${idAgent}/${product}/${month}`;
    return this.httpClient.get<Graph>(url, this.httpOptions);
  }

  getProductSoldByAgentPeriod(idAgent: number, product: string, monthPeriodStart: string, monthPeriodEnd): Observable<Graph[]> {
    const url = `${this.baseUrl}/product-by-agent/period/${idAgent}/${product}/${monthPeriodStart}/${monthPeriodEnd}`;
    return this.httpClient.get<Graph[]>(url, this.httpOptions);
  }

  getCategoriesForAgent(idAgent: number, numberOfProducts: number, month: string): Observable<Graph[]> {
    const url = `${this.baseUrl}/categories-by-agent/${idAgent}/${numberOfProducts}/${month}`;
    return this.httpClient.get<Graph[]>(url, this.httpOptions);
  }

  getCategoryForAgent(idAgent: number, category: string, month: string): Observable<Graph> {
    const url = `${this.baseUrl}/category-by-agent/${idAgent}/${category}/${month}`;
    return this.httpClient.get<Graph>(url, this.httpOptions);
  }

  getGraphAgents(numberOfAgents: number, month: string): Observable<Graph[]> {
    const url = `${this.baseUrl}/agents/${numberOfAgents}/${month}`;
    return this.httpClient.get<Graph[]>(url, this.httpOptions);
  }

  getGraphAgent(selectedAgentId: number, month: string): Observable<Graph> {
    const url = `${this.baseUrl}/agent/${selectedAgentId}/${month}`;
    return this.httpClient.get<Graph>(url, this.httpOptions);
  }

  getAllByShowOption(show: string, id: number): Observable<Order[]> {
    const url = `${this.baseUrl}/show/${show}/${id}`;
    return this.httpClient.get<Order[]>(url, this.httpOptions);
  }

  getById(id: number): Observable<Order> {
    const url = `${this.baseUrl}/id/${id}`;
    return this.httpClient.get<Order>(url, this.httpOptions);
  }

  getPDF(id: number): Observable<ArrayBuffer>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
     responseType : 'blob'});
    const url = `${this.baseUrlPDF}/${id}`;
    return this.httpClient.get<ArrayBuffer>(
      url,
      {
        headers,
        responseType :'blob' as 'json'
      }
    );
  }

  getClientHistory(idClient: number): Observable<Order[]>{
    const url = `${this.baseUrl}/client/history/${idClient}`;
    return this.httpClient.get<Order[]>(url, this.httpOptions);
  }

  cancelOrder(id: number): Observable<Order> {
    const url = `${this.baseUrl}/cancel/${id}`;
    return this.httpClient.patch<Order>(url, this.httpOptions);
  }

  sendEmail(id: number): void {
    const url = `${this.baseUrl}/email/${id}`;
    this.httpClient.post<void>(url, this.httpOptions).subscribe();
  }
}
