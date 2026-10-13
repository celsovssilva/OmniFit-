import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalServices } from '../../services/personal.services';
import { PERIMETROS, formatarDelta, classeDelta } from '../../utils/avaliacao.utils';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal.html',
  styleUrl: './personal.css'
})
export class PersonalComponent implements OnInit {
  meusAlunos: any[] = [];
  alunoSelecionado: any = null;
  treinosDoAluno: any[] = [];
  avaliacoesDoAluno: any[] = [];


  perimetros = PERIMETROS;
  formatarDelta = formatarDelta;
  classeDelta = classeDelta;

  carregando = false;
  mostrarModalAluno = false;
  mostrarModalTreino = false;
  mostrarModalAvaliacao = false;

  aGuardar = false;
  mensagem = { tipo: '', texto: '' };

  alunoEditandoId: number | null = null;
  treinoEditandoId: number | null = null;
  avaliacaoEditandoId: number | null = null;

  novoAluno = this.alunoVazio();

  novoTreino = { exerciciosRequests: [] as any[] };
  exercicioTemp = this.exercicioVazio();

  novaAvaliacao: any = this.resetarFormAvaliacao();

  constructor(
    private personalService: PersonalServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarAlunos();
  }

  mostrarMensagem(tipo: 'sucesso' | 'erro', texto: string) {
    this.mensagem = { tipo, texto };
    this.cdr.markForCheck();
    setTimeout(() => {
      this.mensagem = { tipo: '', texto: '' };
      this.cdr.markForCheck();
    }, 4000);
  }



  carregarAlunos() {
    this.carregando = true;
    this.personalService.getMeusAlunos().subscribe({
      next: (dados) => {
        this.meusAlunos = dados;
        this.carregando = false;
        this.cdr.markForCheck();
        // Mantém o aluno selecionado atualizado após editar
        if (this.alunoSelecionado) {
          this.alunoSelecionado =
            dados.find((a) => a.id === this.alunoSelecionado.id) ?? null;
        }
      },
      error: (e) => {
        console.error(e);
        this.carregando = false;
        this.cdr.markForCheck();
        this.mostrarMensagem('erro', 'Erro ao carregar alunos.');
      }
    });
  }

  abrirModalAluno() {
    this.alunoEditandoId = null;
    this.novoAluno = this.alunoVazio();
    this.mostrarModalAluno = true;
  }

  editarAluno(aluno: any) {
    this.alunoEditandoId = aluno.id;
    this.novoAluno = {
      nome: aluno.nome ?? '',
      email: aluno.email ?? '',
      senha: '', // vazio = não altera a senha
      idade: aluno.idade ?? null,
      sexo: aluno.sexo ?? 'MASCULINO',
      tipoPerfil: aluno.tipoPerfil ?? 'ALUNO',
      peculiaridades: aluno.peculiaridades ?? ''
    };
    this.mostrarModalAluno = true;
  }

  selecionarAluno(aluno: any) {
    this.alunoSelecionado = aluno;
    this.treinosDoAluno = [];
    this.avaliacoesDoAluno = [];
    this.carregarTreinos(aluno.id);
    this.carregarAvaliacoes(aluno.id);
  }

  salvarNovoAluno() {
    if (!this.novoAluno.email.includes('@')) {
      this.mostrarMensagem('erro', 'Por favor, insira um endereço de e-mail válido.');
      return;
    }

    this.aGuardar = true;
    const editando = this.alunoEditandoId !== null;

    let chamada;
    if (editando) {
      const payload: any = { id: this.alunoEditandoId, ...this.novoAluno };
      if (!payload.senha) delete payload.senha;
      chamada = this.personalService.atualizarAluno(payload);
    } else {
      chamada = this.personalService.criarAluno(this.novoAluno);
    }

    chamada.subscribe({
      next: () => {
        this.mostrarMensagem('sucesso', editando ? 'Aluno atualizado!' : 'Aluno adicionado com sucesso!');
        this.mostrarModalAluno = false;
        this.alunoEditandoId = null;
        this.carregarAlunos();
        this.aGuardar = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.aGuardar = false;
        this.cdr.markForCheck();
        this.mostrarMensagem('erro', 'Não foi possível guardar. O e-mail já pode estar em uso.');
      }
    });
  }

  removerAluno(id: number) {
    if (confirm('Remover este aluno definitivamente?')) {
      this.personalService.removerAluno(id).subscribe({
        next: () => {
          this.alunoSelecionado = null;
          this.mostrarMensagem('sucesso', 'Aluno removido.');
          this.carregarAlunos();
        },
        error: () => this.mostrarMensagem('erro', 'Erro ao remover aluno.')
      });
    }
  }


  carregarTreinos(alunoId: number) {
    this.personalService.getTreinosDoAluno(alunoId).subscribe({
      next: (dados) => {
        this.treinosDoAluno = dados;
        this.cdr.markForCheck();
      },
      error: () => this.mostrarMensagem('erro', 'Erro ao carregar treinos.')
    });
  }

  abrirModalTreino() {
    this.treinoEditandoId = null;
    this.novoTreino = { exerciciosRequests: [] };
    this.exercicioTemp = this.exercicioVazio();
    this.mostrarModalTreino = true;
  }

  editarTreino(treino: any) {
    const lista = treino.exercicios ?? treino.exerciciosRequests ?? [];
    this.treinoEditandoId = treino.id;
    this.novoTreino = {
      exerciciosRequests: lista.map((e: any) => ({
        exercicio: e.exercicio ?? e.nome ?? '',
        series: e.series,
        repeticoes: e.repeticoes
      }))
    };
    this.exercicioTemp = this.exercicioVazio();
    this.mostrarModalTreino = true;
  }

  fecharModalTreino() {
    this.mostrarModalTreino = false;
    this.treinoEditandoId = null;
    this.novoTreino = { exerciciosRequests: [] };
  }

  adicionarExercicioAoTreino() {
    if (this.exercicioTemp.exercicio && this.exercicioTemp.series && this.exercicioTemp.repeticoes) {
      this.novoTreino.exerciciosRequests.push({ ...this.exercicioTemp });
      this.exercicioTemp = this.exercicioVazio();
    }
  }

  removerExercicioDoTreino(index: number) {
    this.novoTreino.exerciciosRequests.splice(index, 1);
  }


  salvarNovoTreino() {
    if (!this.alunoSelecionado) {
      this.mostrarMensagem('erro', 'Selecione um aluno antes de prescrever o treino.');
      return;
    }

    this.aGuardar = true;
    const editando = this.treinoEditandoId !== null;
    const payload = {
      alunoId: this.alunoSelecionado.id,
      profissionalId: this.getProfissionalIdLogado(),
      exerciciosRequests: this.novoTreino.exerciciosRequests
    };

    const chamada = editando
      ? this.personalService.atualizarTreino(this.treinoEditandoId!, payload)
      : this.personalService.criarTreino(payload);

    chamada.subscribe({
      next: () => {
        this.mostrarMensagem(
          'sucesso',
          editando ? 'Treino atualizado!' : `Treino publicado para ${this.alunoSelecionado.nome}!`
        );
        this.fecharModalTreino();
        this.carregarTreinos(this.alunoSelecionado.id);
        this.aGuardar = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.aGuardar = false;
        this.cdr.markForCheck();
        this.mostrarMensagem('erro', 'Falha ao salvar o treino.');
      }
    });
  }

  excluirTreino(treinoId: number) {
    if (confirm('Excluir este treino?')) {
      this.personalService.removerTreino(treinoId).subscribe({
        next: () => {
          this.mostrarMensagem('sucesso', 'Treino excluído.');
          this.carregarTreinos(this.alunoSelecionado.id);
        },
        error: () => this.mostrarMensagem('erro', 'Erro ao excluir treino.')
      });
    }
  }

  gerarPdfTreino(treinoId: number) {
    const formData = new FormData();
    this.personalService.uploadFicheiroTreino(treinoId, formData).subscribe({
      next: () => this.mostrarMensagem('sucesso', 'PDF gerado e guardado na base de dados com sucesso!'),
      error: () => this.mostrarMensagem('erro', 'Erro ao gerar PDF no servidor.')
    });
  }



  carregarAvaliacoes(alunoId: number) {
    this.personalService.getAvaliacoes(alunoId).subscribe({
      next: (dados) => {
        this.avaliacoesDoAluno = dados;
        this.cdr.markForCheck();
      },
      error: () => this.mostrarMensagem('erro', 'Erro ao carregar avaliações.')
    });
  }

  abrirModalAvaliacao() {
    this.avaliacaoEditandoId = null;
    this.novaAvaliacao = this.resetarFormAvaliacao();
    this.mostrarModalAvaliacao = true;
  }

  editarAvaliacao(av: any) {
    const atual = av.atual ?? av;
    const base = this.resetarFormAvaliacao();

    const medidas: any = {};
    for (const chave of Object.keys(base.medidas)) {
      medidas[chave] = atual.medidas?.[chave] ?? null;
    }

    this.avaliacaoEditandoId = atual.id;
    this.novaAvaliacao = {
      data: atual.data ? String(atual.data).split('T')[0] : base.data,
      pesoTotal: atual.pesoTotal ?? null,
      medidas
    };
    this.mostrarModalAvaliacao = true;
  }

  fecharModalAvaliacao() {
    this.mostrarModalAvaliacao = false;
    this.avaliacaoEditandoId = null;
    this.novaAvaliacao = this.resetarFormAvaliacao();
  }

  salvarNovaAvaliacao() {
    this.aGuardar = true;
    const editando = this.avaliacaoEditandoId !== null;

    const chamada = editando
      ? this.personalService.atualizarAvaliacao(this.alunoSelecionado.id, {
        id: this.avaliacaoEditandoId,
        ...this.novaAvaliacao
      })
      : this.personalService.criarAvaliacao(this.alunoSelecionado.id, this.novaAvaliacao);

    chamada.subscribe({
      next: () => {
        this.mostrarMensagem('sucesso', editando ? 'Avaliação atualizada!' : 'Avaliação Física registada e calculada!');
        this.fecharModalAvaliacao();
        this.carregarAvaliacoes(this.alunoSelecionado.id);
        this.aGuardar = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.aGuardar = false;
        this.cdr.markForCheck();
        this.mostrarMensagem('erro', 'Erro ao salvar avaliação.');
      }
    });
  }


  private alunoVazio() {
    return {
      nome: '',
      email: '',
      senha: '',
      idade: null as number | null,
      sexo: 'MASCULINO',
      tipoPerfil: 'ALUNO',
      peculiaridades: ''
    };
  }

  private exercicioVazio() {
    return {
      exercicio: '',
      series: null as number | null,
      repeticoes: null as number | null
    };
  }

  private resetarFormAvaliacao() {
    return {
      data: new Date().toISOString().split('T')[0],
      pesoTotal: null as number | null,
      medidas: {
        altura: null, torax: null, abdomen: null, cintura: null, quadril: null,
        bracoDireito: null, bracoEsquerdo: null, coxaDireita: null, coxaEsquerda: null,
        panturrilhaDireita: null, panturrilhaEsquerda: null,
        dobraPeitoral: null, dobraAxilarMedia: null, dobraTriceps: null,
        dobraSubescapular: null, dobraAbdominal: null, dobraSuprailiaca: null, dobraCoxa: null
      } as Record<string, number | null>
    };
  }

  private getProfissionalIdLogado(): number {
    return 1;
  }
}
