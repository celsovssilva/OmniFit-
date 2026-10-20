export interface DietaRequest {
  id:number;
  alunoId: number;
  profissionalId: number;
  descricao: string;
}

export interface DietaResponse {
  id: number;
  alunoId: number;
  profissionalId: number;
  descricao: string;
  refeicoes?: any[];
  refeicoesRequests?: any[]
}
