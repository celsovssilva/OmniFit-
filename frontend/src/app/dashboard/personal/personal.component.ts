import {Component, Injectable, OnInit} from '@angular/core';
import {UserResponse} from '../../models/auth.models';
import {PersonalServices} from '../../services/personal.services';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})



export class PersonalComponent implements OnInit{
  meusAlunos : UserResponse[] = [];

  constructor(private personalServices :PersonalServices) {
  }
    ngOnInit() {
        this.personalServices.getUsersForPersonal().subscribe({
          next: (resposta) =>{
            this.meusAlunos = resposta;
          }
        });
    }


}
