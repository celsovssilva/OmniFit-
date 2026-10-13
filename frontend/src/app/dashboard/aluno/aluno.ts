import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlunoServices } from '../../services/aluno.services';
import { AuthServices } from '../../services/auth.services';

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aluno.html',
  styleUrl: './aluno.css'
})
export class Aluno implements OnInit {
  treinosDoAluno: any[] = [];
  dietasDoAluno: any[] = [];
  avaliacoesDoaluno: any[] = [];

  constructor(
    private alunoService: AlunoServices,
    private authServices: AuthServices,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.alunoService.getTreinos().subscribe({
      next: (dados) => {
        this.treinosDoAluno = dados;
        this.cdr.markForCheck();
      },
      error: (erro) => console.error('Erro ao buscar treinos:', erro)
    });

    this.alunoService.getDietaForUsers().subscribe({
      next: (dados) => {
        console.log('DIETAS QUE CHEGARAM DO BACKEND:', dados);
        this.dietasDoAluno = dados;
        this.cdr.markForCheck();
      },
      error: (erro) => console.error('Erro ao buscar dietas:', erro)
    });
    this.alunoService.getAvaliacoes().subscribe({
      next:(dados) => {
        this.avaliacoesDoaluno = dados;
        this.cdr.markForCheck();
      },
      error: (erro) => console.error('Erro ao buscar avaliações:', erro)
    })
  }

  baixarTreino(treinoId: number) {
    this.alunoService.getDownloadTreino(treinoId).subscribe({
      next: (arquivo) => this.salvarArquivo(arquivo, `treino-${treinoId}.pdf`),
      error: (erro) => console.error('Erro ao baixar o treino:', erro)
    });
  }

  baixarDieta(dietaId: number) {
    this.alunoService.getDownloadDieta(dietaId).subscribe({
      next: (arquivo) => this.salvarArquivo(arquivo, `dieta-${dietaId}.pdf`),
      error: (erro) => console.error('Erro ao baixar a dieta:', erro)
    });
  }

  private salvarArquivo(blob: Blob, nome: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nome;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  isPositivo(valor: number): boolean {
    return valor > 0;
  }
  getAbs(valor: number): number {
    return Math.abs(valor || 0);
  }


  toggleExpandir(av: any) {
    av.expandido = !av.expandido;
  }
}
