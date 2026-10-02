import { HttpInterceptorFn } from '@angular/common/http';

export const interceptor: HttpInterceptorFn = (req, next) => {
  // Busca o token do localStorage
  const token = localStorage.getItem('token_jwt');

  // Se o token existir, clona a requisição e adiciona o cabeçalho Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Se não houver token, envia a requisição original sem modificações
  return next(req);
};
