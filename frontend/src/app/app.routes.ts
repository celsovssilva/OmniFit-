import { Routes } from '@angular/router';
import {Login} from './login/login'
import {PersonalComponent} from './dashboard/personal/personal.component';
import {Register} from './register/register.component';
import {Aluno} from './dashboard/aluno/aluno';
import {Nutri} from './dashboard/nutri/nutri';
import {authGuard} from './interceptor/auth.guard';

export const routes: Routes = [
  {path: 'login',component:Login},
  { path: 'register', component: Register },
  {path:'personal',component:PersonalComponent,canActivate:[authGuard]},
  {path:'nutri',component:Nutri,canActivate:[authGuard]},
  {path:'aluno',component: Aluno,canActivate:[authGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
