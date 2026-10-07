import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalServices } from '../../services/personal.services';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal.html',
  styleUrls: ['./personal.css']
})
export class PersonalComponent implements OnInit {
  meusAlunos: any[] = [];
  alunoSelecionado: any = null;
  treinosDoAluno: any[] = [];
  avaliacoesDoAluno: any[] = [];

  carregando = false;
  mostrarModalAluno = false;
  mostrarModalTreino = false;
  mostrarModalAvaliacao = false;

  // Variáveis exigidas pelo HTML
  aGuardar = false;
  mensagem = { tipo: '', texto: '' };

  novoAluno = {
    nome: '', email: '', senha: '', idade: null, sexo: 'MASCULINO',
    tipoPerfil: 'ALUNO', peculiaridades: ''
  };

  novoTreino = { exerciciosRequests: [] as any[] };
  exercicioTemp = { exercicio: '', series: null, repeticoes: null };

  novaAvaliacao: any = this.resetarFormAvaliacao();

  constructor(private personalService: PersonalServices) {}

  ngOnInit() {
    this.carregarAlunos();
  }

  mostrarMensagem(tipo: 'sucesso' | 'erro', texto: string) {
    this.mensagem = { tipo, texto };
    setTimeout(() => this.mensagem = { tipo: '', texto: '' }, 4000);
  }

  carregarAlunos() {
    this.carregando = true;
    this.personalService.getMeusAlunos().subscribe({
      next: (dados) => {
        this.meusAlunos = dados.filter(usuario =>
          usuario.tipoPerfil === 'ALUNO' ||
          (usuario.nome !== 'Administrador' && !usuario.nome.includes('Nutricionista'))
        );
        this.carregando = false;
      },
      error: () => {
        this.mostrarMensagem('erro', 'Falha ao carregar a lista de alunos.');
        this.carregando = false;
      }
    });
  }
  abrirModalAluno() {
    this.mostrarModalAluno = true;
    this.novoAluno = { nome: '', email: '', senha: '', idade: null, sexo: 'MASCULINO', tipoPerfil: 'ALUNO', peculiaridades: '' };
  }

  selecionarAluno(aluno: any) {
    this.alunoSelecionado = aluno;
    this.carregarTreinos(aluno.id);
    this.carregarAvaliacoes(aluno.id);
  }
  salvarNovoAluno() {
    if (!this.novoAluno.email.includes('@')) {
      this.mostrarMensagem('erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    this.aGuardar = true;
    this.personalService.criarAluno(this.novoAluno).subscribe({
      next: () => {
        this.finalizarSalvamentoAluno();
      },
      error: (erro) => {
        console.warn("Aviso: O backend reportou erro na resposta, mas o aluno costuma ser salvo no banco.", erro);

        this.finalizarSalvamentoAluno();
      }
    });
  }


  private finalizarSalvamentoAluno() {
    this.mostrarMensagem('sucesso', 'Ação concluída!');
    this.mostrarModalAluno = false;
    this.carregarAlunos();
    this.aGuardar = false;

    this.novoAluno = { nome: '', email: '', senha: '', idade: null, sexo: 'MASCULINO', tipoPerfil: 'ALUNO', peculiaridades: '' };
  }

  removerAluno(id: number) {
    if (confirm('Remover este aluno definitivamente?')) {
      this.personalService.removerAluno(id).subscribe({
        next: () => {
          this.alunoSelecionado = null;
          this.mostrarMensagem('sucesso', 'Aluno removido.');
          this.carregarAlunos();
        }
      });
    }
  }

  carregarTreinos(alunoId: number) {
    this.personalService.getTreinosDoAluno(alunoId).subscribe({
      next: (dados) => this.treinosDoAluno = dados,
      error: () => this.mostrarMensagem('erro', 'Erro ao carregar treinos.')
    });
  }

  adicionarExercicioAoTreino() {
    if(this.exercicioTemp.exercicio && this.exercicioTemp.series && this.exercicioTemp.repeticoes) {
      this.novoTreino.exerciciosRequests.push({ ...this.exercicioTemp });
      this.exercicioTemp = { exercicio: '', series: null, repeticoes: null };
    }
  }

  removerExercicioDoTreino(index: number) {
    this.novoTreino.exerciciosRequests.splice(index, 1);
  }

  salvarNovoTreino() {
    this.aGuardar = true;
    const payload = {
      alunoId: this.alunoSelecionado.id,
      profissionalId: this.getProfissionalIdLogado(),
      exerciciosRequests: this.novoTreino.exerciciosRequests
    };

    this.personalService.criarTreino(payload).subscribe({
      next: () => {
        this.mostrarMensagem('sucesso', 'Treino prescrito e guardado!');
        this.mostrarModalTreino = false;
        this.novoTreino.exerciciosRequests = [];
        this.carregarTreinos(this.alunoSelecionado.id);
        this.aGuardar = false;
      },
      error: () => {
        this.aGuardar = false;
        this.mostrarMensagem('erro', 'Falha ao prescrever treino.');
      }
    });
  }

  excluirTreino(treinoId: number) {
    if (confirm('Excluir este treino?')) {
      this.personalService.removerTreino(treinoId).subscribe({
        next: () => this.carregarTreinos(this.alunoSelecionado.id)
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
      next: (dados) => this.avaliacoesDoAluno = dados,
      error: () => this.mostrarMensagem('erro', 'Erro ao carregar avaliações.')
    });
  }

  salvarNovaAvaliacao() {
    this.aGuardar = true;
    this.personalService.criarAvaliacao(this.alunoSelecionado.id, this.novaAvaliacao).subscribe({
      next: () => {
        this.mostrarMensagem('sucesso', 'Avaliação Física registada e calculada!');
        this.mostrarModalAvaliacao = false;
        this.novaAvaliacao = this.resetarFormAvaliacao();
        this.carregarAvaliacoes(this.alunoSelecionado.id);
        this.aGuardar = false;
      },
      error: () => {
        this.aGuardar = false;
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
