import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../services/auth.services';
import { LoginRequest } from '../models/auth.models';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  senha = '';

  constructor(
    private authService: AuthServices,
    private router: Router
  ) {}

  fazerLogin() {
    const dados: LoginRequest = { email: this.email, senha: this.senha };

    this.authService.login(dados).subscribe({
      next: (resposta) => {
        if (resposta.token) {
          localStorage.setItem('token_jwt', resposta.token);
          alert('Login bem-sucedido! Token guardado.');
          this.router.navigate(['/personal'])


        }
      },
      error: (erro) => {
        alert('E-mail ou palavra-passe incorretos.');
      }
    });
  }
}
