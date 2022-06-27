import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from 'src/app/model/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  id: number;

  private readonly baseUrl = 'http://localhost:8080/clients';
  // private readonly baseUrl = 'https://a14e-2a02-2f0e-dd0c-8d00-6800-740c-3ff8-2151.eu.ngrok.io/clients';
  private readonly httpOptions = {
    headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
    })
  };

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(this.baseUrl, this.httpOptions);
  }

  getById(id: number): Observable<Client> {
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.get<Client>(url, this.httpOptions);
  }

  save(client: Client): Observable<Client> {
    return this.httpClient.post<Client>(this.baseUrl, client, this.httpOptions);
  }

  getNamesBySearchValue(searchValue: string): Observable<string[]> {
    const url = `${this.baseUrl}/names/${searchValue}`;
    return this.httpClient.get<string[]>(url, this.httpOptions);
  }

  getIdByName(name: string): Observable<number> {
    const url = `${this.baseUrl}/name/${name}`;
    return this.httpClient.get<number>(url, this.httpOptions);
  }

  existsByVatOrIdNumber(vatOrIdNumber: string): Observable<boolean> {

    const url = `${this.baseUrl}/exists/${vatOrIdNumber}`;
    return this.httpClient.get<boolean>(url, this.httpOptions);
  }

  update(client: Client): Observable<boolean> {
    return this.httpClient.put<boolean>(this.baseUrl, client, this.httpOptions);
  }
}
