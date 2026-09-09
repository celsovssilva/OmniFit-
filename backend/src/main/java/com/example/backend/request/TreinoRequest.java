package com.example.backend.request;

import com.example.backend.entity.User;

import java.util.List;

public record TreinoRequest(
         Long alunoId,
         Long profissionalId,
         List<ExerciciosRequest> exerciciosRequests

) {
}
