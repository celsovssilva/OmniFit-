package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AvaliacoesFisicas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private User alunoId;
    private User profissionalId;
    private LocalDate data;
    private Double pesoTotal;
    private Double percentualGordura;
    @Embedded
    private Medidas medidas;

}
