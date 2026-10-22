import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NutriServices } from '../../services/nutri.services';
import { PERIMETROS, formatarDelta, classeDelta, validarAvaliacao } from '../../utils/avaliacao.utils';
import { DietaResponse, DietaRequest } from '../../models/nutri.models';
import Swal from 'sweetalert2';

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
  novaDieta: { refeicoesRequests: any[] } = { refeicoesRequests: [] };
  refeicaoTemp = { alimento: '', quantidade: '', horario: '' };

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
      error: () => {
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
    Swal.fire({
      title: 'Tem a certeza?',
      text: 'Remover este paciente definitivamente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.nutriService.removerAluno(id).subscribe({
          next: () => {
            this.alunoSelecionado = null;
            this.mostrarMensagem('sucesso', 'Paciente removido.');
            this.carregarAlunos();
          },
          error: () => this.mostrarMensagem('erro', 'Erro ao remover paciente.')
        });
      }
    });
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
    const nutriId = this.getProfissionalIdLogado();

    this.nutriService.vincularAluno(this.alunoEncontrado.id, nutriId).subscribe({
      next: () => {
        this.mostrarMensagem('sucesso', 'Aluno vinculado com sucesso aos seus treinos!');
        this.fecharModalVincular();
        this.carregarAlunos();
        this.aGuardar = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mostrarMensagem('erro', 'Erro ao vincular o aluno.');
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
        altura: null, peitoral: null, ombro: null, abdomen: null, cintura: null, quadril: null,
        bracoDireito: null, bracoEsquerdo: null, coxaDireita: null, coxaEsquerda: null,
        panturrilhaDireita: null, panturrilhaEsquerda: null,
        dobraPeitoral: null, dobraAxilarMedia: null, dobraTriceps: null,
        dobraSubescapular: null, dobraAbdominal: null, dobraSuprailiaca: null, dobraCoxa: null,
        dobraPanturrilha: null, dobraBiceps: null
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
    const erro = validarAvaliacao(this.novaAvaliacao, this.alunoSelecionado?.sexo);
    if (erro) {
      this.mostrarMensagem('erro', erro);
      return;
    }

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
    this.novaDieta = { refeicoesRequests: [] };
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

  adicionarRefeicao() {
    if (this.refeicaoTemp.alimento && this.refeicaoTemp.quantidade) {
      this.novaDieta.refeicoesRequests.push({ ...this.refeicaoTemp });
      this.refeicaoTemp = { alimento: '', quantidade: '', horario: '' };
    } else {
      this.mostrarMensagem('erro', 'Preencha pelo menos o Alimento e a Quantidade.');
    }
  }

  removerRefeicao(index: number) {
    this.novaDieta.refeicoesRequests.splice(index, 1);
  }

  editarDieta(dieta: any) {
    const lista = dieta.refeicoes ?? dieta.refeicoesRequests ?? [];
    this.dietaEditandoId = dieta.id;
    this.novaDieta = {
      refeicoesRequests: lista.map((r: any) => ({
        alimento: r.alimento ?? r.nome ?? '',
        quantidade: r.quantidade ?? '',
        horario: r.horario ?? ''
      }))
    };
    this.mostrarModalDieta = true;
  }

  salvarNovaDieta() {
    this.aGuardar = true;
    const editando = this.dietaEditandoId !== null;

    const payload = {
      alunoId: this.alunoSelecionado.id,
      refeicoesRequests: this.novaDieta.refeicoesRequests
    };

    const chamada = editando
      ? this.nutriService.atualizarDieta(this.dietaEditandoId!, payload)
      : this.nutriService.criarDieta(payload);

    chamada.subscribe({
      next: () => {
        this.mostrarMensagem('sucesso', editando ? 'Dieta atualizada!' : 'Dieta publicada com sucesso!');
        this.carregarDietas(this.alunoSelecionado.id);
        this.fecharModalDieta();
        this.aGuardar = false;
        this.novaDieta = { refeicoesRequests: [] };
        this.cdr.markForCheck();
      },
      error: () => {
        this.aGuardar = false;
        this.mostrarMensagem('erro', 'Erro ao guardar dieta.');
        this.cdr.markForCheck();
      }
    });
  }

  gerarPdfDieta(dietaId: number) {
    const formData = new FormData();
    this.nutriService.uploadFicheiroDieta(dietaId, formData).subscribe({
      next: () => this.mostrarMensagem('sucesso', 'PDF gerado e guardado na base de dados com sucesso!'),
      error: () => this.mostrarMensagem('erro', 'Erro ao gerar PDF no servidor.')
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
    Swal.fire({
      title: 'Tem a certeza?',
      text: 'Deseja excluir esta dieta definitivamente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.nutriService.removerDieta(dietaId).subscribe({
          next: () => {
            this.mostrarMensagem('sucesso', 'Dieta excluída com sucesso.');
            this.carregarDietas(this.alunoSelecionado.id);
          },
          error: () => this.mostrarMensagem('erro', 'Erro ao excluir a dieta.')
        });
      }
    });
  }

  private getProfissionalIdLogado(): number {
    return 1;
  }
}
