package com.example.backend.response;

import com.example.backend.entity.Exercicios;

public record ExerciciosResponse(
        String series,
        String repeticoes,
        String exercicio
) {
    public ExerciciosResponse(Exercicios exercicios){
        this(
          exercicios.getSeries(),
          exercicios.getRepeticoes(),
          exercicios.getExercicio()
        );
    }
}
