export interface Perimetro {
  rotulo: string;
  medida: string;
  dif: string;
}

export const PERIMETROS: Perimetro[] = [
  { rotulo: 'Peitoral',         medida: 'peitoral',            dif: 'diferencaPeitoral' },
  { rotulo: 'Ombro',            medida: 'ombro',               dif: 'diferencaOmbro' },
  { rotulo: 'Cintura',          medida: 'cintura',             dif: 'diferencaCintura' },
  { rotulo: 'Abdômen',          medida: 'abdomen',             dif: 'diferencaAbdomen' },
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

const preenchido = (v: unknown): boolean => typeof v === 'number' && v > 0;

export function validarAvaliacao(
  form: { pesoTotal: number | null; medidas: Record<string, number | null> },
  sexo: string | null | undefined
): string | null {
  const m = form.medidas;

  if (!preenchido(form.pesoTotal)) return 'Informe o peso.';
  if (!preenchido(m['altura'])) return 'Informe a altura (em metros).';

  const faltando: string[] = [];

  if ((sexo ?? '').toUpperCase() === 'FEMININO') {
    if (!preenchido(m['dobraAxilarMedia'])) faltando.push('Axilar Média');
    if (!preenchido(m['dobraSuprailiaca'])) faltando.push('Suprailíaca');
    if (!preenchido(m['dobraCoxa'])) faltando.push('Coxa');
    if (!preenchido(m['dobraPanturrilha'])) faltando.push('Panturrilha');
  } else {
    if (!preenchido(m['dobraSubescapular'])) faltando.push('Subescapular');
    if (!preenchido(m['dobraSuprailiaca'])) faltando.push('Suprailíaca');
    if (!preenchido(m['dobraPanturrilha'])) faltando.push('Panturrilha');
    if (!preenchido(m['dobraTriceps']) && !preenchido(m['dobraBiceps'])) {
      faltando.push('Tríceps (ou Bíceps)');
    }
  }

  return faltando.length
    ? `Preencha as dobras obrigatórias: ${faltando.join(', ')}.`
    : null;
}
