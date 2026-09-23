package com.example.backend.entity;

import jakarta.persistence.Embeddable;
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
    // Medidas gerais
    private Double altura;
    private Double torax;
    private Double cintura;
    private Double abdomen;
    private Double quadril;
    private Double bracoDireito;
    private Double bracoEsquerdo;
    private Double coxaDireita;
    private Double coxaEsquerda;
    private Double panturrilhaDireita;
    private Double panturrilhaEsquerda;


    private Double dobraPeitoral;
    private Double dobraAxilarMedia;
    private Double dobraTriceps;
    private Double dobraSubescapular;
    private Double dobraAbdominal;
    private Double dobraSuprailiaca;
    private Double dobraCoxa;


    private Double imc;
    private Double massaMagra;
    private Double massaGorda;
}