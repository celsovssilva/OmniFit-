import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn:'root'
})

export class PersonalServices{
  private apiUrl = 'http://localhost:8080/api/'

}
