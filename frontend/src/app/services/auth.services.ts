import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginRequest,LoginResponse} from '../models/auth.models';

@Injectable({
  providedIn:"root"
})
export class AuthServices {
  private apiUrl = 'http://localhost:8080/api/user/login';

  constructor(private http:HttpClient) {}
  login(dados:LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.apiUrl, dados);
  }
}
