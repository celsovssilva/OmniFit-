package com.example.backend.response;

import com.example.backend.entity.Treinos;
import com.example.backend.request.ExerciciosRequest;

import java.util.List;


public record TreinoResponse (
        Long alunoId,
        Long profissionalId,
        List<ExerciciosResponse> exerciciosRequests
){
    public TreinoResponse(Treinos t){
        this(
                t.getAlunoId().getId(),
                t.getProfissionalId().getId(),
                t.getExercicios().stream().map(ExerciciosResponse::new).toList()
        );
    }
}
