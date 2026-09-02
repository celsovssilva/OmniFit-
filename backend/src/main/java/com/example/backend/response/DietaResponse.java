package com.example.backend.response;

import com.example.backend.entity.Dieta;


public record DietaResponse(
        Long alunoId,
        Long profissionalId,
        String descricao
) {
    public DietaResponse(Dieta d){
        this(
                d.getAlunoId().getId(),
                d.getProfissionalId().getId(),
                d.getDescricao()
        );
    }
}
