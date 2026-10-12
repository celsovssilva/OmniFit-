export interface Perimetro {
  rotulo: string;
  medida: string;
  dif: string;
}

export const PERIMETROS: Perimetro[] = [
  { rotulo: 'Tórax',            medida: 'torax',               dif: 'diferencaTorax' },
  { rotulo: 'Cintura',          medida: 'cintura',             dif: 'diferencaCintura' },
  { rotulo: 'Abdómen',          medida: 'abdomen',             dif: 'diferencaAbdomen' },
  { rotulo: 'Quadril',          medida: 'quadril',             dif: 'diferencaQuadril' },
  { rotulo: 'Braço Dir.',       medida: 'bracoDireito',        dif: 'diferencaBracoDireito' },
  { rotulo: 'Braço Esq.',       medida: 'bracoEsquerdo',       dif: 'diferencaBracoEsquerdo' },
  { rotulo: 'Coxa Dir.',        medida: 'coxaDireita',         dif: 'diferencaCoxaDireita' },
  { rotulo: 'Coxa Esq.',        medida: 'coxaEsquerda',        dif: 'diferencaCoxaEsquerda' },
  { rotulo: 'Panturrilha Dir.', medida: 'panturrilhaDireita',  dif: 'diferencaPanturrilhaDireita' },
  { rotulo: 'Panturrilha Esq.', medida: 'panturrilhaEsquerda', dif: 'diferencaPanturrilhaEsquerda' }
];

export function formatarDelta(v: number | null | undefined, unidade = ''): string {
  if (v === null || v === undefined) return '—';
  if (v === 0) return '= igual';
  return `${v > 0 ? '▲ +' : '▼ '}${v.toFixed(2)}${unidade}`;
}


export function classeDelta(v: number | null | undefined, menorEhMelhor: boolean | null): string {
  if (!v || menorEhMelhor === null) return 'delta neutro';
  return (menorEhMelhor ? v < 0 : v > 0) ? 'delta bom' : 'delta ruim';
}
