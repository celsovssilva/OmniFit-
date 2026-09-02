package com.example.backend.request;



public record DietaRequest(
         Long Id,
         Long alunoId,
         Long profissionalId,
         String descricao
) {}
