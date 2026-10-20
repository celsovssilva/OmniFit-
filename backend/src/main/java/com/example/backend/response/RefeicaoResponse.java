package com.example.backend.response;

import com.example.backend.entity.Refeicoes;
import com.example.backend.request.RefeicaoRequest;

import java.time.LocalTime;

public record RefeicaoResponse(
        String alimento,
        String quantidade,
        LocalTime hora
) {
    public RefeicaoResponse(Refeicoes r){
        this(
                r.getAlimento(),
                r.getQuantidade(),
                r.getHora()
        );
    }


}
