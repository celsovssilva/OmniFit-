import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlunoServices } from '../../services/aluno.services';
import { AuthServices } from '../../services/auth.services';
import Swal from 'sweetalert2';

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
      error: () => this.mostrarErroGenerico('Não foi possível carregar os treinos.')
    });

    this.alunoService.getDietaForUsers().subscribe({
      next: (dados) => {
        this.dietasDoAluno = dados;
        this.cdr.markForCheck();
      },
      error: () => this.mostrarErroGenerico('Não foi possível carregar as dietas.')
    });

    this.alunoService.getAvaliacoes().subscribe({
      next: (dados) => {
        this.avaliacoesDoaluno = dados;
        this.cdr.markForCheck();
      },
      error: () => this.mostrarErroGenerico('Não foi possível carregar as avaliações.')
    });
  }

  baixarTreino(treinoId: number) {
    this.alunoService.getDownloadTreino(treinoId).subscribe({
      next: (arquivo) => this.salvarArquivo(arquivo, `treino-${treinoId}.pdf`),
      error: () => this.mostrarErroGenerico('Erro ao baixar o treino.')
    });
  }

  baixarDieta(dietaId: number) {
    this.alunoService.getDownloadDieta(dietaId).subscribe({
      next: (arquivo) => this.salvarArquivo(arquivo, `dieta-${dietaId}.pdf`),
      error: () => this.mostrarErroGenerico('Erro ao baixar a dieta.')
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

  private mostrarErroGenerico(mensagem: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensagem,
      confirmButtonColor: '#3085d6'
    });
  }
}
