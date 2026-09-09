package com.example.backend.request;

public record ExerciciosRequest(
        Long id,
        String series,
        String repeticoes,
        String exercicio
) {
}
