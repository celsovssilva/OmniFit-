import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../services/auth.services';
import { UserRequest } from '../models/auth.models';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  nome = '';
  email = '';
  senha = '';
  idade: number = 0;
  sexo = 'MASCULINO'; // Valor inicial padrão
  tipoPerfil = 'PERSONAL'; // Garante que não enviamos 'ALUNO'

  constructor(
    private authService: AuthServices,
    private router: Router
  ) {}

  registar() {
    const dados: {
      id: number;
      nome: string;
      email: string;
      senha: string;
      idade: number;
      sexo: string;
      tipoPerfil: string
    } = {
      id: 0,
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      idade: this.idade,
      sexo: this.sexo,
      tipoPerfil: this.tipoPerfil,
    };

    this.authService.createProfissional(dados).subscribe({
      next: (resposta) => {
        alert('Conta criada com sucesso! Pode fazer login.');
        this.router.navigate(['/login']);
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao criar conta. O e-mail já pode estar em uso.');
      }
    });
  }
}
