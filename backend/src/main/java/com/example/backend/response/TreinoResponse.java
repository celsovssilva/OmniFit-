package com.example.backend.response;

import com.example.backend.entity.Treinos;


public record TreinoResponse (
        Long alunoId,
        Long profissionalId,
        byte[] arquivoPdf
){
    public TreinoResponse(Treinos t){
        this(
                t.getAlunoId().getId(),
                t.getProfissionalId().getId(),
                t.getArquivoPdf()
        );
    }
}
