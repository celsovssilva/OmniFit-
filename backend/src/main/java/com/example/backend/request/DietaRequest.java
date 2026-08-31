package com.example.backend.request;

import com.example.backend.entity.User;

public record DietaRequest(
         Long Id,
         Long alunoId,
         Long profissionalId,
         String descricao
) {}
