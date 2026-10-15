import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem("token_jwt");
  const tipoPerfil = localStorage.getItem("tipo_perfil");

  if (token) {

    if (state.url.includes('/personal') && tipoPerfil !== 'PERSONAL') {
      router.navigate(['/login']);
      return false;
    }

    if (state.url.includes('/nutri') && tipoPerfil !== 'NUTRI') {
      router.navigate(['/login']);
      return false;
    }

    if (state.url.includes('/aluno') && tipoPerfil !== 'ALUNO') {
      router.navigate(['/login']);
      return false;
    }

    return true;

  } else {
    router.navigate(['/login']);
    return false;
  }
};
