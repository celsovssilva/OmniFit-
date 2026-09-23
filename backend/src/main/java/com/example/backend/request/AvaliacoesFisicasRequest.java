package com.example.backend.request;

import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public record AvaliacoesFisicasRequest (
        Long alunoId,
        LocalDate data,
        @Positive(message = "O peso não pode ser negativo")
        Double pesoTotal,

        MedidasRequest medidas
){}