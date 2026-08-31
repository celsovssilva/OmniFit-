package com.example.backend.request;

import com.example.backend.entity.User;

public record Treinos(
         Long Id,
         User alunoId,
         User profissionalId,
         byte[] arquivoPdf
) {
}
