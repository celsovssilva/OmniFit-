import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn:"root"
})

export  class AlunoServices{

  private  apiUrlTreino ='http://localhost:8080/api/treino'
  private apiUrlDieta = 'http://localhost:8080/api/dieta'
  private apiUrlAv = 'http://localhost:8080/api/avaliacoesfisicas'

  constructor(private http:HttpClient) {}

  getTreinos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlTreino}/getTreinoForUsers`);
  }
  getDietaForUsers():Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrlDieta}/getDietaForUsers`);
}
getDownloadTreino(treinoId:number):Observable<Blob>{
    return this.http.get(`${this.apiUrlTreino}/download/${treinoId}`,{responseType:'blob'});
}

getDownloadDieta(dietaId:number):Observable<Blob>{
    return this.http.get(`${this.apiUrlDieta}/download/${dietaId}`,{responseType:'blob'});
}

}
