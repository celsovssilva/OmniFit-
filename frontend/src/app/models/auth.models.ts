

export interface LoginRequest {
  email: string;
  senha?: string;
}

export interface ResetSenhaRequest {
  email: string;
  novaSenha: string;
  pin: string;
}

export interface UserRequest {
  id: number;
  nome: string;
  email: string;
  senha: string;
  idade:number;
  peculiaridades: string;
  tipoPerfil: string;
  profissionalId:number;
  sexo:string;
}

export interface LoginResponse {
  token: string;
  tipoPerfil:string;
}

export interface ResetSenhaResponse {
  codigoRefinicao: string;
}

export interface UserResponse {
  id: number;
  nome: string;
  idade:number;
  peculiaridades: string;
  tipoPerfil: string;
  profissionalId: number;
  sexo:string;
}
