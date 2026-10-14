import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DietaRequest, DietaResponse} from '../models/nutri.models';

@Injectable({
  providedIn:"root"
})

export class NutriServices{
  private apiUrl='http://localhost:8080/api'

  constructor(private http:HttpClient) {}
  getMeusAlunos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dieta/getDietaForUsers`);
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

  criarDieta(dados: { alunoId: any; profissionalId: number; descricao: string }): Observable<DietaResponse> {
    return this.http.post<DietaResponse>(`${this.apiUrl}/dieta/create`, dados);
  }

}

