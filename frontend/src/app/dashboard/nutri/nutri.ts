import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NutriServices } from '../../services/nutri.services';
import { PERIMETROS, formatarDelta, classeDelta } from '../../utils/avaliacao.utils';
import { DietaResponse, DietaRequest } from '../../models/nutri.models';

@Component({
  selector: 'app-nutri',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nutri.html',
  styleUrl: './nutri.css'
})
export class Nutri implements OnInit {

  carregando = false;
  aGuardar = false;
  mensagem = { tipo: '', texto: '' };

  meusAlunos: any[] = [];
  alunoSelecionado: any = null;
  novoAluno = this.alunoVazio();
  mostrarModalAluno = false;
  alunoEditandoId: number | null = null;

  avaliacoesDoAluno: any[] = [];
  novaAvaliacao: any = this.resetarFormAvaliacao();
  mostrarModalAvaliacao = false;
  avaliacaoEditandoId: number | null = null;

  perimetros = PERIMETROS;
  formatarDelta = formatarDelta;
  classeDelta = classeDelta;

  dietasDoAluno: DietaResponse[] = [];
  novaDieta: Partial<DietaRequest> = { descricao: '' };
  mostrarModalDieta = false;
  dietaEditandoId: number | null = null;
  ficheiroSelecionado: File | null = null;

  mostrarModalVincular = false;
  emailBusca = '';
  alunoEncontrado: any = null;

  constructor(
    private nutriService: NutriServices,
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

  alunoVazio() {
    return { nome: '', email: '', senha: '', idade: null, sexo: 'MASCULINO', tipoPerfil: 'ALUNO', peculiaridades: '' };
  }

  carregarAlunos() {
    this.carregando = true;
    this.nutriService.getMeusAlunos().subscribe({
      next: (dados) => {
        this.meusAlunos = dados;
        this.carregando = false;

        if (this.alunoSelecionado) {
          this.alunoSelecionado = dados.find((a: any) => a.id === this.alunoSelecionado.id) ?? null;
        }
        this.cdr.markForCheck();
      },
      error: (e) => {
        console.error(e);
        this.carregando = false;
        this.mostrarMensagem('erro', 'Erro ao carregar alunos.');
        this.cdr.markForCheck();
      }
    });
  }

  selecionarAluno(aluno: any) {
    this.alunoSelecionado = aluno;
    this.dietasDoAluno = [];
    this.avaliacoesDoAluno = [];

    this.carregarDietas(aluno.id);
    this.carregarAvaliacoes(aluno.id);
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
      senha: '',
      idade: aluno.idade ?? null,
      sexo: aluno.sexo ?? 'MASCULINO',
      tipoPerfil: aluno.tipoPerfil ?? 'ALUNO',
      peculiaridades: aluno.peculiaridades ?? ''
    };
    this.mostrarModalAluno = true;
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
      chamada = this.nutriService.atualizarAluno(payload);
    } else {
      chamada = this.nutriService.criarAluno(this.novoAluno);
    }

    chamada.subscribe({
      next: () => {
        this.mostrarMensagem('sucesso', editando ? 'Paciente atualizado!' : 'Paciente adicionado com sucesso!');
        this.mostrarModalAluno = false;
        this.alunoEditandoId = null;
        this.carregarAlunos();
        this.aGuardar = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.aGuardar = false;
        this.mostrarMensagem('erro', 'Não foi possível guardar. O e-mail já pode estar em uso.');
        this.cdr.markForCheck();
      }
    });
  }

  removerAluno(id: number) {
    if (confirm('Remover este paciente definitivamente?')) {
      this.nutriService.removerAluno(id).subscribe({
        next: () => {
          this.alunoSelecionado = null;
          this.mostrarMensagem('sucesso', 'Paciente removido.');
          this.carregarAlunos();
        },
        error: () => this.mostrarMensagem('erro', 'Erro ao remover paciente.')
      });
    }
  }

  abrirModalVincular() {
    this.mostrarModalVincular = true;
    this.emailBusca = '';
    this.alunoEncontrado = null;
  }

  fecharModalVincular() {
    this.mostrarModalVincular = false;
    this.emailBusca = '';
    this.alunoEncontrado = null;
  }

  buscarAlunoPorEmail() {
    if (!this.emailBusca) {
      this.mostrarMensagem('erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    this.carregando = true;
    this.nutriService.buscarAlunoPorEmail(this.emailBusca).subscribe({
      next: (aluno) => {
        this.alunoEncontrado = aluno;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.alunoEncontrado = null;
        this.carregando = false;
        this.mostrarMensagem('erro', err.error?.message || 'Paciente não encontrado.');
        this.cdr.markForCheck();
      }
    });
  }

  vincularAlunoExistente() {
    if (!this.alunoEncontrado) return;

    this.aGuardar = true;


    // @ts-ignore
    this.nutriService.vincularAluno(this.alunoEncontrado.id).subscribe({
      next: () => {
        this.mostrarMensagem('sucesso', 'Paciente vinculado com sucesso!');
        this.fecharModalVincular();
        this.carregarAlunos();
        this.aGuardar = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mostrarMensagem('erro', 'Erro ao vincular o paciente.');
        this.aGuardar = false;
        this.cdr.markForCheck();
      }
    });
  }

  resetarFormAvaliacao() {
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

  carregarAvaliacoes(alunoId: number) {
    this.nutriService.getAvaliacoes(alunoId).subscribe({
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
      ? this.nutriService.atualizarAvaliacao(this.avaliacaoEditandoId, {
        alunoId: this.alunoSelecionado.id,
        ...this.novaAvaliacao
      })
      : this.nutriService.criarAvaliacao(this.alunoSelecionado.id, this.novaAvaliacao);

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
        this.mostrarMensagem('erro', 'Erro ao salvar avaliação.');
        this.cdr.markForCheck();
      }
    });
  }

  carregarDietas(alunoId: number) {
    this.nutriService.getDietasDoAluno(alunoId).subscribe({
      next: (dados) => {
        this.dietasDoAluno = dados;
        this.cdr.markForCheck();
      },
      error: () => this.mostrarMensagem('erro', 'Erro ao carregar dietas.')
    });
  }

  abrirModalDieta() {
    this.dietaEditandoId = null;
    this.novaDieta = { descricao: '' };
    this.ficheiroSelecionado = null;
    this.mostrarModalDieta = true;
  }

  fecharModalDieta() {
    this.mostrarModalDieta = false;
    this.dietaEditandoId = null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.ficheiroSelecionado = file;
    }
  }

  salvarNovaDieta() {
    if (!this.novaDieta.descricao) {
      this.mostrarMensagem('erro', 'A descrição da dieta é obrigatória.');
      return;
    }

    this.aGuardar = true;


    const request: { alunoId: any; descricao: string } = {
      alunoId: this.alunoSelecionado.id,
      descricao: this.novaDieta.descricao
    };

    this.nutriService.criarDieta(request).subscribe({
      next: (resposta) => {
        if (this.ficheiroSelecionado && resposta.id) {
          const formData = new FormData();
          formData.append('file', this.ficheiroSelecionado);

          this.nutriService.uploadFicheiroDieta(resposta.id, formData).subscribe({
            next: () => this.finalizarSalvamentoDieta(),
            error: () => {
              this.aGuardar = false;
              this.mostrarMensagem('erro', 'Dieta criada, mas erro ao anexar o PDF.');
              this.cdr.markForCheck();
            }
          });
        } else {
          this.finalizarSalvamentoDieta();
        }
      },
      error: () => {
        this.aGuardar = false;
        this.mostrarMensagem('erro', 'Erro ao guardar dieta.');
        this.cdr.markForCheck();
      }
    });
  }

  private finalizarSalvamentoDieta() {
    this.aGuardar = false;
    this.mostrarMensagem('sucesso', 'Plano alimentar guardado com sucesso!');
    this.carregarDietas(this.alunoSelecionado.id);
    this.fecharModalDieta();
    this.cdr.markForCheck();
  }
  excluirDieta(dietaId: number) {
    if (confirm('Tem a certeza que deseja excluir esta dieta?')) {
      this.nutriService.removerDieta(dietaId).subscribe({
        next: () => {
          this.mostrarMensagem('sucesso', 'Dieta excluída com sucesso.');
          this.carregarDietas(this.alunoSelecionado.id); // Atualiza a lista no ecrã
        },
        error: () => this.mostrarMensagem('erro', 'Erro ao excluir a dieta.')
      });
    }
  }
}
