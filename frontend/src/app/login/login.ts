
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../services/auth.services';
import { LoginRequest } from '../models/auth.models';
import { Component, ChangeDetectorRef } from '@angular/core';

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
          localStorage.getItem('token-jwt')
          localStorage.setItem('token_jwt', resposta.token);
          localStorage.setItem('tipo_perfil',resposta.tipoPerfil);
          if(resposta.tipoPerfil === "PERSONAL"){
            this.router.navigate(['/personal'])
          } else if (resposta.tipoPerfil === "NUTRI"){
            this.router.navigate(['/nutri'])
          } else {
            this.router.navigate(['/aluno'])
          }



        }
      },
      error: (erro) => {
        alert('E-mail ou palavra-passe incorretos.');
      }
    });
  }
  solicitarCodigo() {
    this.authService.forgot({ email: this.emailRecuperacao }).subscribe({
      next: (dados) => {
        console.log('Resposta do backend:', dados);
        this.etapaAtual = 'RESET_SENHA';


        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('O Angular reclamou do seguinte erro:', erro);
        if (erro.status === 200) {
          this.etapaAtual = 'RESET_SENHA';
          this.cdr.detectChanges(); // 👉 Coloque aqui também por garantia
        } else {
          alert('Erro! Abra o F12 e veja a aba Console.');
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
        alert('Senha alterada com sucesso! Faça login com a sua nova senha.');

        this.etapaAtual = 'LOGIN';

        this.codigoPin = '';
        this.novaSenha = '';
      },
      error: (erro) => {
        alert('Erro ao redefinir a senha. Verifique se o código está correto e não expirou.');
      }
    });
  }
  irParaCadastro() {
    this.router.navigate(['/register']);
  }
}
