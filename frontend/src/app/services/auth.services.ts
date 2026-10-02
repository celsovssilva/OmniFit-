import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserRequest, UserResponse} from '../models/auth.models';

@Injectable({
  providedIn:"root"
})
export class AuthServices {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http:HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, userData);
  }

  update(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, profileData);
  }
  forgot(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot`, credentials);
  }
  reset(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset`, credentials);
  }

  createProfissional(userData: {
    id: number;
    nome: string;
    email: string;
    senha: string;
    idade: number;
    sexo: string;
    tipoPerfil: string
  }): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/createProfissional`, userData);
  }

}
