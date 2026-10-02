import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalServices } from '../../services/personal.services'; // Verifique se o caminho está correto

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

  constructor(private personalService: PersonalServices) {}

  ngOnInit() {
    this.carregarAlunos();
  }

  // ==========================================
  // GESTÃO DE ALUNOS
  // ==========================================
  carregarAlunos() {
    this.carregando = true;
    this.personalService.getMeusAlunos().subscribe({
      next: (dados) => {
        this.meusAlunos = dados; // Recebe diretamente do banco
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar alunos:', erro);
        this.carregando = false;
      }
    });
  }

  selecionarAluno(aluno: any) {
    this.alunoSelecionado = aluno;
    this.carregarAvaliacoes(aluno.id);

    // Nota: Nos endpoints que me passou, não havia a rota GET de treinos.
    // Quando criar o endpoint GET /api/treino/aluno/{id}, chamaremos aqui.
  }

  removerAluno(id: number) {
    if (confirm('Tem a certeza que deseja remover este aluno?')) {
      this.personalService.removerAluno(id).subscribe({
        next: () => {
          alert('Aluno removido com sucesso!');
          this.alunoSelecionado = null;
          this.carregarAlunos(); // Recarrega a lista do banco
        },
        error: (err) => {
          console.error('Erro ao remover aluno:', err);
          alert('Erro ao remover aluno.');
        }
      });
    }
  }

  // ==========================================
  // GESTÃO DE TREINOS
  // ==========================================
  excluirTreino(treinoId: number) {
    if (confirm('Excluir este treino?')) {
      this.personalService.removerTreino(treinoId).subscribe({
        next: () => {
          alert('Treino excluído!');
          // this.carregarTreinos(); // Recarregar após o delete
        },
        error: (err) => console.error('Erro ao excluir treino:', err)
      });
    }
  }

  gerarPdfTreino(treinoId: number) {
    const formData = new FormData(); // O Spring espera um request de upload
    this.personalService.uploadFicheiroTreino(treinoId, formData).subscribe({
      next: (res) => alert('PDF gerado e salvo no banco com sucesso!'),
      error: (err) => console.error('Erro ao gerar PDF', err)
    });
  }

  // ==========================================
  // GESTÃO DE AVALIAÇÕES FÍSICAS
  // ==========================================
  carregarAvaliacoes(alunoId: number) {
    this.personalService.getAvaliacoes().subscribe({
      next: (dados) => {
        // O backend devolve a lista com "atual" e "anterior".
        // Filtramos para mostrar apenas as do aluno selecionado.
        this.avaliacoesDoAluno = dados.filter((av: any) => av.atual.aluno.id === alunoId);
      },
      error: (err) => console.error('Erro ao buscar avaliações:', err)
    });
  }

  // ==========================================
  // FUNÇÕES VAZIAS (Apenas para o HTML compilar)
  // ==========================================
  abrirModalNovoAluno() {
    console.log('A tela de formulário de aluno será implementada aqui.');
  }

  abrirModalNovoTreino() {
    console.log('A tela de formulário de treino será implementada aqui.');
  }

  abrirModalNovaAvaliacao() {
    console.log('A tela de formulário de avaliação será implementada aqui.');
  }
}
