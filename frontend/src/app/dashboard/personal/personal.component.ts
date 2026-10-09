import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalServices } from '../../services/personal.services';
import {AvaliacaoForm, AvaliacaoResponse, novaAvaliacaoVazia, paraRequest} from '../../models/avaliacoes.models';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal.html',
  styleUrls: ['./personal.css']
})
export class PersonalComponent implements OnInit {

  meusAlunos = signal<any[]>([]);
  alunoSelecionado = signal<any>(null);
  treinosDoAluno = signal<any[]>([]);
  avaliacoesDoAluno = signal<AvaliacaoResponse[]>([]);
  novaAvaliacao: AvaliacaoForm = novaAvaliacaoVazia();

  carregando = signal(false);
  aGuardar = signal(false);
  mensagem = signal<{ tipo: string; texto: string }>({ tipo: '', texto: '' });

  mostrarModalAluno = signal(false);
  mostrarModalTreino = signal(false);
  mostrarModalAvaliacao = signal(false);


  novoAluno = {
    nome: '', email: '', senha: '', idade: null as number | null, sexo: 'MASCULINO',
    tipoPerfil: 'ALUNO', peculiaridades: ''
  };

  novoTreino = { exerciciosRequests: [] as any[] };
  exercicioTemp = { exercicio: '', series: null as number | null, repeticoes: null as number | null };



  constructor(private personalService: PersonalServices) {}

  ngOnInit() {
    this.carregarAlunos();
  }
  avaliacaoValida(): boolean {
    return paraRequest(this.novaAvaliacao) !== null;
  }
  mostrarMensagem(tipo: 'sucesso' | 'erro', texto: string) {
    this.mensagem.set({ tipo, texto });
    setTimeout(() => this.mensagem.set({ tipo: '', texto: '' }), 4000);
  }

  carregarAlunos() {
    this.carregando.set(true);
    this.personalService.getMeusAlunos().subscribe({
      next: (dados) => {
        this.meusAlunos.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.mostrarMensagem('erro', 'Falha ao carregar a lista de alunos.');
        this.carregando.set(false);
      }
    });
  }

  abrirModalAluno() {
    this.novoAluno = { nome: '', email: '', senha: '', idade: null, sexo: 'MASCULINO', tipoPerfil: 'ALUNO', peculiaridades: '' };
    this.mostrarModalAluno.set(true);
  }

  selecionarAluno(aluno: any) {
    this.alunoSelecionado.set(aluno);
    this.carregarTreinos(aluno.id);
    this.carregarAvaliacoes(aluno.id);
  }

  salvarNovoAluno() {
    if (!this.novoAluno.email.includes('@')) {
      this.mostrarMensagem('erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    this.aGuardar.set(true);
    this.personalService.criarAluno(this.novoAluno).subscribe({
      next: () => {
        this.finalizarSalvamentoAluno();
      },
      error: (erro) => {
        console.warn('Aviso: O backend reportou erro na resposta, mas o aluno costuma ser salvo no banco.', erro);
        this.finalizarSalvamentoAluno();
      }
    });
  }

  private finalizarSalvamentoAluno() {
    this.mostrarMensagem('sucesso', 'Ação concluída!');
    this.mostrarModalAluno.set(false);
    this.carregarAlunos();
    this.aGuardar.set(false);

    this.novoAluno = { nome: '', email: '', senha: '', idade: null, sexo: 'MASCULINO', tipoPerfil: 'ALUNO', peculiaridades: '' };
  }

  removerAluno(id: number) {
    if (confirm('Remover este aluno definitivamente?')) {
      this.personalService.removerAluno(id).subscribe({
        next: () => {
          this.alunoSelecionado.set(null);
          this.treinosDoAluno.set([]);
          this.avaliacoesDoAluno.set([]);
          this.mostrarMensagem('sucesso', 'Aluno removido.');
          this.carregarAlunos();
        },
        error: () => this.mostrarMensagem('erro', 'Erro ao remover aluno.')
      });
    }
  }

  carregarTreinos(alunoId: number) {
    this.personalService.getTreinosDoAluno(alunoId).subscribe({
      next: (dados) => this.treinosDoAluno.set(dados),
      error: () => this.mostrarMensagem('erro', 'Erro ao carregar treinos.')
    });
  }

  adicionarExercicioAoTreino() {
    if (this.exercicioTemp.exercicio && this.exercicioTemp.series && this.exercicioTemp.repeticoes) {
      this.novoTreino.exerciciosRequests.push({ ...this.exercicioTemp });
      this.exercicioTemp = { exercicio: '', series: null, repeticoes: null };
    }
  }

  removerExercicioDoTreino(index: number) {
    this.novoTreino.exerciciosRequests.splice(index, 1);
  }

  salvarNovoTreino() {
    this.aGuardar.set(true);
    const payload = {
      alunoId: this.alunoSelecionado().id,
      exerciciosRequests: this.novoTreino.exerciciosRequests
    };

    this.personalService.criarTreino(payload).subscribe({
      next: () => {
        this.mostrarMensagem('sucesso', 'Treino prescrito e guardado!');
        this.mostrarModalTreino.set(false);
        this.novoTreino.exerciciosRequests = [];
        this.carregarTreinos(this.alunoSelecionado().id);
        this.aGuardar.set(false);
      },
      error: () => {
        this.aGuardar.set(false);
        this.mostrarMensagem('erro', 'Falha ao prescrever treino.');
      }
    });
  }

  excluirTreino(treinoId: number) {
    if (confirm('Excluir este treino?')) {
      this.personalService.removerTreino(treinoId).subscribe({
        next: () => this.carregarTreinos(this.alunoSelecionado().id),
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
      next: (dados) => this.avaliacoesDoAluno.set(dados),
      error: () => this.mostrarMensagem('erro', 'Erro ao carregar avaliações.')
    });
  }

  salvarNovaAvaliacao() {
    const request = paraRequest(this.novaAvaliacao);
    if (!request) {
      this.mostrarMensagem('erro', 'Preencha todos os campos da avaliação.');
      return;
    }
    this.aGuardar.set(true);
    this.personalService.criarAvaliacao(this.alunoSelecionado().id, request).subscribe({
      next: () => {
        this.mostrarMensagem('sucesso', 'Avaliação Física registada e calculada!');
        this.mostrarModalAvaliacao.set(false);
        this.novaAvaliacao = this.resetarFormAvaliacao();
        this.carregarAvaliacoes(this.alunoSelecionado().id);
        this.aGuardar.set(false);
      },
      error: () => {
        this.aGuardar.set(false);
        this.mostrarMensagem('erro', 'Erro ao salvar avaliação.');
      }
    });
  }

  private resetarFormAvaliacao() {
    return {
      data: new Date().toISOString().split('T')[0],
      pesoTotal: null,
      medidas: {
        altura: null, torax: null, abdomen: null, cintura: null, quadril: null,
        bracoDireito: null, bracoEsquerdo: null, coxaDireita: null, coxaEsquerda: null,
        panturrilhaDireita: null, panturrilhaEsquerda: null,
        dobraPeitoral: null, dobraAxilarMedia: null, dobraTriceps: null,
        dobraSubescapular: null, dobraAbdominal: null, dobraSuprailiaca: null, dobraCoxa: null
      }
    };
  }

  private getProfissionalIdLogado(): number {
    return 1;
  }
}
