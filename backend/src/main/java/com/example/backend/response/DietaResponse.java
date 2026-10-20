package com.example.backend.response;

import com.example.backend.entity.Dieta;
import com.example.backend.request.RefeicaoRequest;

import java.util.List;


public record DietaResponse(
        Long id,
        Long alunoId,
        Long nutriId,
        List<RefeicaoResponse> refeicoesRequests
) {
    public DietaResponse(Dieta d){
        this(
                d.getId(),
                d.getAlunoId().getId(),
                d.getNutrilId().getNutriId(),
                d.getRefeicoes().stream().map(RefeicaoResponse::new).toList()
        );
    }


}
