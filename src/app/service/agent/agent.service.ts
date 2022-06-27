import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agent } from 'src/app/model/agent';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private readonly baseUrl = 'http://localhost:8080/agents';
  // private readonly baseUrl = 'https://a14e-2a02-2f0e-dd0c-8d00-6800-740c-3ff8-2151.eu.ngrok.io/agents';
  private readonly httpOptions = {
    headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
    })
  };

  constructor(
    private httpClient: HttpClient
  ) { }

  save(agent: Agent): Observable<Agent> {

    return this.httpClient.post<Agent>(this.baseUrl, agent, this.httpOptions);
  }

  getByUserId(id: number): Observable<Agent> {

    const url = `${this.baseUrl}/user-id/${id}`;
    return this.httpClient.get<Agent>(url, this.httpOptions);
  }

  getAllNames(): Observable<string[]> {

    const url = `${this.baseUrl}/names`;
    return this.httpClient.get<string[]>(url, this.httpOptions);
  }

  getByName(name: string): Observable<number> {
    const url = `${this.baseUrl}/name/${name}`;
    return this.httpClient.get<number>(url, this.httpOptions);
  }

  getPhotoById(id: number): Observable<Agent> {
    const url = `${this.baseUrl}/photo/${id}`;
    return this.httpClient.get<Agent>(url, this.httpOptions);
  }
}
