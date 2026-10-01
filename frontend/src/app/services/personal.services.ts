import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserResponse} from '../models/auth.models';

@Injectable({
  providedIn:'root'
})

export class PersonalServices{
  private apiUrl = 'http://localhost:8080/api/user'

  constructor(private http:HttpClient) {}

  getUsersForPersonal(): Observable<UserResponse[]>{
    const token = localStorage.getItem('token_jwt');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${token}`
    })
    return  this.http.get<UserResponse[]>(`${this.apiUrl}/getUsersForPersonal`,{headers: headers});
  }
}
