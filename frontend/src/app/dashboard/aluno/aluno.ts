import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AlunoServices} from '../../services/aluno.services';

@Component({
  selector:'app-aluno',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl:'./aluno.html',
  styleUrl:'./aluno.css'
})
export class Aluno implements OnInit{
  treinosDoAluno: any[] = [];
  dietasDoAluno: any[] = [];
 constructor(private alunoService:AlunoServices) {}

  ngOnInit() {
    this.alunoService.getTreinos().subscribe({
      next: (dados) => {
        console.log('TREINOS QUE CHEGARAM DO BACKEND:', dados);
        this.treinosDoAluno = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar treinos:', erro);
      }
    })
    this.alunoService.getDietaForUsers().subscribe({
      next: (dados2) => {
        this.dietasDoAluno = dados2
      },
      error: (erro) => {
        console.error('Erro ao buscar dietas:', erro);
      }
    })
  }
  baixarTreino(treinoId: number) {
    this.alunoService.getDownloadTreino(treinoId).subscribe({
      next: (dadosDoFicheiro) => {

        const url = window.URL.createObjectURL(dadosDoFicheiro);
        const link = document.createElement('a');
        link.href= url;
        link.download= `treino-${treinoId}.pdf`
        link.click();
        window.URL.revokeObjectURL(url);

      },
      error: (erro) => {
        console.error('Erro ao baixar o treino:', erro);
      }
    });
  }

  baixarDieta(dietaId:number){
   this.alunoService.getDownloadDieta(dietaId).subscribe({
     next:(dadosArquivoDieta)=>{
      const url = window.URL.createObjectURL(dadosArquivoDieta);
      const link = document.createElement('a');
      link.href= url;
      link.download= `dieta-${dietaId}.pdf`
       link.click();
       window.URL.revokeObjectURL(url);
     },
     error: (erro) => {
       console.error('Erro ao baixar o treino:', erro);
     }
   })
  }


}
