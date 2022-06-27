import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = 'http://localhost:8080/users';
  // private readonly baseUrl = 'https://a14e-2a02-2f0e-dd0c-8d00-6800-740c-3ff8-2151.eu.ngrok.io/users';
  private readonly httpOptions = {
    headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
    })
  };
  constructor(private httpClient: HttpClient) { }

  getById(id: number): Observable<User> {

    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.get<User>(url, this.httpOptions);
  }
}
