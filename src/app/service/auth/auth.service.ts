import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = false;
  isAgent = false;
  isAdmin = false;
  user: User;

  private readonly baseUrl = 'http://localhost:8080/users';
  // private readonly baseUrl = 'https://a14e-2a02-2f0e-dd0c-8d00-6800-740c-3ff8-2151.eu.ngrok.io/users';
  private readonly httpOptions = {
    headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
    })
  };

  constructor(private httpClient: HttpClient,
    private router: Router) { }

  authenticate(user: User): Observable<User> {

    return this.httpClient.post<User>(this.baseUrl, user, this.httpOptions);
  }

  logout(): void {

    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isAgent = false;

    this.router.navigate(['login']);
  }

  getPDF(): Observable<ArrayBuffer>{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const headers = new HttpHeaders({ 'Content-Type': 'application/json',
     responseType : 'blob'});
    const url = 'https://f097-86-121-46-151.eu.ngrok.io/test';
    return this.httpClient.get<ArrayBuffer>(
      url,
      {
        headers,
        responseType :'blob' as 'json'
      }
    );
  }
}
