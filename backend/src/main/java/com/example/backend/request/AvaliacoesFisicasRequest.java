package com.example.backend.request;


import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record AvaliacoesFisicasRequest (
         Long Id,
        Long alunoId,
        Long profissionalId,
         LocalDate data,
         @Positive(message = "O peso não pode ser negativo")
         Double pesoTotal,
         @Positive(message = "O percentual de gordura não pode ser negativo")
         Double percentualGordura,
        MedidasRequest medidas
){

}
