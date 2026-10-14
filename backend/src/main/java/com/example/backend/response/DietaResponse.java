package com.example.backend.response;

import com.example.backend.entity.Dieta;


public record DietaResponse(
        Long id,
        Long alunoId,
        Long profissionalId,
        String descricao
) {
    public DietaResponse(Dieta d){
        this(
                d.getId(),
                d.getAlunoId().getId(),
                d.getProfissionalId().getId(),
                d.getDescricao()
        );
    }
}
