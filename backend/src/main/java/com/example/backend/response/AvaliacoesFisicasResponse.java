package com.example.backend.response;

import com.example.backend.entity.AvaliacoesFisicas;

import java.time.LocalDate;

public record AvaliacoesFisicasResponse(
        LocalDate data,
        Double pesoTotal,
        Double percentualGordura,
        MedidasResponse medidas
) {
    public AvaliacoesFisicasResponse(AvaliacoesFisicas a){
        this(
                a.getData(),
                a.getPesoTotal(),
                a.getPercentualGordura(),
               new MedidasResponse(a.getMedidas()));
    }
}
