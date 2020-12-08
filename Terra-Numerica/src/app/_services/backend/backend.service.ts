import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private API_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  get(route: string) {
    return this.http.get<Object[]>(`${this.API_URL}/${route}`);
  }

  getById(route: string, id: number) {
    return this.http.get<Object>(`${this.API_URL}/${route}/${id}`);
  }

  post(route: string, body) {
    return this.http.post<Object>(`${this.API_URL}/${route}`, body);
  }

}
