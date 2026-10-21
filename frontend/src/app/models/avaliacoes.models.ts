export interface MedidasRequest {
  altura: number;


  dobraPeitoral: number;
  dobraAxilarMedia: number;
  dobraTriceps: number | null;
  dobraBiceps: number | null;
  dobraSubescapular: number;
  dobraAbdominal: number;
  dobraSuprailiaca: number;
  dobraCoxa: number;
  dobraPanturrilha: number;


  peitoral: number;
  ombro: number;
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
      dobraPeitoral: null, dobraAxilarMedia: null, dobraTriceps: null, dobraBiceps: null,
      dobraSubescapular: null, dobraAbdominal: null, dobraSuprailiaca: null, dobraCoxa: null,
      dobraPanturrilha: null,
      peitoral: null, ombro: null, cintura: null, abdomen: null, quadril: null,
      bracoDireito: null, bracoEsquerdo: null, coxaDireita: null, coxaEsquerda: null,
      panturrilhaDireita: null, panturrilhaEsquerda: null
    }
  };
}


export function paraRequest(form: AvaliacaoForm): AvaliacaoRequest | null {
  if (!form.data || typeof form.pesoTotal !== 'number' || typeof form.medidas.altura !== 'number') {
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
  diferencaPeso: number;
  diferencaAltura: number;
  diferencaPercentualGordura: number;
  diferencaMassaMagra: number;
  diferencaMassaGorda: number;
  diferencaImc: number;
  diferencaPeitoral: number;   // antes: DiferencaTorax
  diferencaOmbro: number;      // novo
  diferencaCintura: number;
  diferencaAbdomen: number;
  diferencaQuadril: number;
  diferencaBracoDireito: number;
  diferencaBracoEsquerdo: number;
  diferencaCoxaDireita: number;
  diferencaCoxaEsquerda: number;
  diferencaPanturrilhaDireita: number;
  diferencaPanturrilhaEsquerda: number;
}

export interface AvaliacaoResponse {
  data: string;
  pesoTotal: number;
  percentualGordura: number;
  medidas: MedidasResponse;
  comparacao: ComparacaoResponse | null;
}
