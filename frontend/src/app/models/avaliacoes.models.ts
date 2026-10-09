

export interface MedidasRequest {
  altura: number;
  dobraPeitoral: number;
  dobraAxilarMedia: number;
  dobraTriceps: number;
  dobraSubescapular: number;
  dobraAbdominal: number;
  dobraSuprailiaca: number;
  dobraCoxa: number;


  torax: number;
  cintura: number;
  abdomen: number;
  quadril: number;
  bracoDireito: number;
  bracoEsquerdo: number;
  coxaDireita: number;
  coxaEsquerda: number;
  panturrilhaDireita: number;
  panturrilhaEsquerda: number;
}


export interface AvaliacaoRequest {
  alunoId?: number;
  data: string;
  pesoTotal: number;
  medidas: MedidasRequest;
}

type Anulavel<T> = { [K in keyof T]: T[K] | null };

export interface AvaliacaoForm {
  data: string;
  pesoTotal: number | null;
  medidas: Anulavel<MedidasRequest>;
}

export function novaAvaliacaoVazia(): AvaliacaoForm {
  return {
    data: new Date().toISOString().split('T')[0],
    pesoTotal: null,
    medidas: {
      altura: null,
      dobraPeitoral: null, dobraAxilarMedia: null, dobraTriceps: null,
      dobraSubescapular: null, dobraAbdominal: null, dobraSuprailiaca: null, dobraCoxa: null,
      torax: null, cintura: null, abdomen: null, quadril: null,
      bracoDireito: null, bracoEsquerdo: null, coxaDireita: null, coxaEsquerda: null,
      panturrilhaDireita: null, panturrilhaEsquerda: null
    }
  };
}


export function paraRequest(form: AvaliacaoForm): AvaliacaoRequest | null {
  const campos = [form.pesoTotal, ...Object.values(form.medidas)];
  if (!form.data || campos.some(v => typeof v !== 'number')) {
    return null;
  }
  return form as AvaliacaoRequest;
}


export interface MedidasResponse extends MedidasRequest {
  massaMagra: number;
  massaGorda: number;
  imc: number;
}


export interface ComparacaoResponse {
  pesoTotal: number;
  altura: number;
  percentualGordura: number;
  massaMagra: number;
  massaGorda: number;
  imc: number;
  torax: number;
  cintura: number;
  abdomen: number;
  quadril: number;
  bracoDireito: number;
  bracoEsquerdo: number;
  coxaDireita: number;
  coxaEsquerda: number;
  panturrilhaDireita: number;
  panturrilhaEsquerda: number;
}


export interface AvaliacaoResponse {
  data: string;
  pesoTotal: number;
  percentualGordura: number;
  medidas: MedidasResponse;
  comparacao: ComparacaoResponse | null;
}
