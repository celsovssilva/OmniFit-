import { Routes } from '@angular/router';
import {Login} from './login/login'
import {PersonalComponent} from './dashboard/personal/personal.component';

export const routes: Routes = [
  {path: 'login',component:Login},
  {path:'personal',component:PersonalComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
