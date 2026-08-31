package com.example.backend.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Medidas {
    private Double altura;
    private Double massaMagra;
    private Double massaGorda;
    private Double imc;
    private Double torax;
    private Double cintura;
    private Double abdomen;
    private Double quadril;
    private Double bracoDireito;
    private Double bracoEsquerdo;
    private Double coxaDireita;
    private Double CoxaEsqueda;
    private Double panturilhaDireita;
    private Double panturrilhaEsquerda;
    private Double tricipital;
    private Double suprailiaca;
    private Double abdominal;
}
