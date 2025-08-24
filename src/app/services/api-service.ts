import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

export type User = {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

interface ApiResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: { url: string; text: string };
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://reqres.in/api/users';
  
  
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'reqres-free-v1'
    });
  }

  getUsers(page: number = 1, per_page: number = 6): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}?page=${page}&per_page=${per_page}`);
  }

  getUserByID(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createUser(data: any): Observable<any> {
    //this.getHeaders().set('Content-Type', 'application/json')
    return this.http.post(`${this.apiUrl}`, JSON.stringify(data));
  }

  updateUser(id: any, data: any): Observable<any> {
    //this.getHeaders().set('Content-Type', 'application/json')
    return this.http.put(`${this.apiUrl}/${id}`, JSON.stringify(data));
  }
}
