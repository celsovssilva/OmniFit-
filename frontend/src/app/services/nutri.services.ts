import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DietaRequest, DietaResponse} from '../models/nutri.models';

@Injectable({
  providedIn:"root"
})

export class NutriServices{
  private apiUrl='http://localhost:8080/api'

  constructor(private http:HttpClient) {}
  getMeusAlunos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/getUsersForNutri`);
  }

  criarAluno(alunoData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/create`, alunoData, {responseType: 'text'});
  }
  atualizarAluno(alunoData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/update`, alunoData,{responseType: 'text'});
  }
  removerAluno(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/user/delete`,{ body: { id } });
  }
  getAvaliacoes(alunoId: number): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/avaliacoesfisicas/getUsersAvaliacoes/${alunoId}`);
  }
  atualizarDieta(dietaId: number, dietaData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/treino/update/${dietaId}`, dietaData);
  }

  criarAvaliacao(alunoId: number, dadosAvaliacao: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/avaliacoesfisicas/create/${alunoId}`, dadosAvaliacao);
  }

  atualizarAvaliacao(id: number | null, dadosAvaliacao: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/avaliacoesfisicas/update/${id}`, dadosAvaliacao);
  }
  getDietasDoAluno(userId: number): Observable<DietaResponse[]> {
    return this.http.get<DietaResponse[]>(`${this.apiUrl}/dieta/getDietaForUsers/${userId}`);
  }

  uploadFicheiroDieta(dietaId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/dieta/upload/${dietaId}`, formData);
  }


  buscarAlunoPorEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.apiUrl}/buscar`, { params });
  }


  criarDieta(dietaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/dieta/create`, dietaData);
  }



  vincularAluno(alunoId: number) {
    return this.http.post<any>(`${this.apiUrl}/dieta/vincular/${alunoId}`, {});
  }
  removerDieta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/dieta/delete/${id}`);
  }


}

