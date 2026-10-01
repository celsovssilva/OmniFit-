import { Routes } from '@angular/router';
import {Login} from './login/login'
import {PersonalComponent} from './dashboard/personal/personal.component';
import {Register} from './register/register.component';

export const routes: Routes = [
  {path: 'login',component:Login},
  { path: 'register', component: Register },
  {path:'personal',component:PersonalComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
