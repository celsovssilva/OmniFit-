import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../services/auth.services';
import { LoginRequest } from '../models/auth.models';
import { Component, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  senha = '';
  etapaAtual = 'LOGIN';
  emailRecuperacao = '';
  codigoPin = '';
  novaSenha = '';

  constructor(
    private authService: AuthServices,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  fazerLogin() {
    localStorage.removeItem('token_jwt');
    const dados: LoginRequest = { email: this.email, senha: this.senha };

    this.authService.login(dados).subscribe({
      next: (resposta) => {
        if (resposta.token) {
          localStorage.setItem('token_jwt', resposta.token);
          localStorage.setItem('tipo_perfil', resposta.tipoPerfil);

          if (resposta.tipoPerfil === "PERSONAL") {
            this.router.navigate(['/personal']);
          } else if (resposta.tipoPerfil === "NUTRI") {
            this.router.navigate(['/nutri']);
          } else {
            this.router.navigate(['/aluno']);
          }
        }
      },
      error: (erro) => {
        Swal.fire({
          icon: 'error',
          title: 'Acesso Negado',
          text: 'E-mail ou palavra-passe incorretos.',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  solicitarCodigo() {
    this.authService.forgot({ email: this.emailRecuperacao }).subscribe({
      next: (dados) => {
        this.etapaAtual = 'RESET_SENHA';
        this.cdr.detectChanges();
      },
      error: (erro) => {
        if (erro.status === 200) {
          this.etapaAtual = 'RESET_SENHA';
          this.cdr.detectChanges();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro na Recuperação',
            text: 'Não foi possível solicitar o código. Verifique se o e-mail está correto.',
            confirmButtonColor: '#3085d6'
          });
        }
      }
    });
  }

  confirmarNovaSenha() {
    const dadosReset = {
      email: this.emailRecuperacao,
      pin: this.codigoPin,
      novaSenha: this.novaSenha
    };

    this.authService.reset(dadosReset).subscribe({
      next: (resposta) => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Senha alterada com sucesso! Faça login com a sua nova senha.',
          confirmButtonColor: '#3085d6'
        });

        this.etapaAtual = 'LOGIN';
        this.codigoPin = '';
        this.novaSenha = '';
      },
      error: (erro) => {
        Swal.fire({
          icon: 'error',
          title: 'Código Inválido',
          text: 'Erro ao redefinir a senha. Verifique se o código está correto e não expirou.',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  irParaCadastro() {
    this.router.navigate(['/register']);
  }
}
