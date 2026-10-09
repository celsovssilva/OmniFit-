import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalServices {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getMeusAlunos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/getUsersForPersonal`);
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


  getTreinosDoAluno(alunoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/treino/getTreinoForUsers/${alunoId}`);
  }

  criarTreino(treinoData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/treino/create`, treinoData);
  }

  atualizarTreino(treinoId: number, treinoData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/treino/update/${treinoId}`, treinoData);
  }

  removerTreino(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/treino/delete/${id}`);
  }

  uploadFicheiroTreino(treinoId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/treino/upload/${treinoId}`, formData);
  }

  getAvaliacoes(alunoId: number): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/avaliacoesfisicas/getUsersAvaliacoes/${alunoId}`);
  }

  criarAvaliacao(alunoId: number, dadosAvaliacao: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/avaliacoesfisicas/create/${alunoId}`, dadosAvaliacao);
  }

  atualizarAvaliacao(alunoId: number, dadosAvaliacao: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/avaliacoesfisicas/update/${alunoId}`, dadosAvaliacao);
  }
}
