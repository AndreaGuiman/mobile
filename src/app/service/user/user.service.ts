import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = 'http://localhost:8080/users';
  // private readonly baseUrl = 'https://bfb8-2a02-2f0e-dd0c-8d00-82b-c300-717f-8186.eu.ngrok.io/users';
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
