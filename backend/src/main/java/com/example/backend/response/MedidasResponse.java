package com.example.backend.response;

import com.example.backend.entity.Medidas;

public record MedidasResponse(
        Double altura,
        Double massaMagra,
        Double massaGorda,
        Double imc,
        Double torax,
        Double cintura,
        Double abdomen,
        Double quadril,
        Double bracoDireito,
        Double bracoEsquerdo,
        Double coxaDireita,
        Double CoxaEsqueda,
        Double panturilhaDireita,
        Double panturrilhaEsquerda,
        Double tricipital,
        Double suprailiaca,
        Double abdominal
){
    public MedidasResponse(Medidas m){
        this(
                m.getAltura(),
                m.getMassaMagra(),
                m.getMassaGorda(),
                m.getImc(),
                m.getTorax(),
                m.getCintura(),
                m.getAbdomen(),
                m.getQuadril(),
                m.getBracoDireito(),
                m.getBracoEsquerdo(),
                m.getCoxaDireita(),
                m.getCoxaEsqueda(),
                m.getPanturilhaDireita(),
                m.getPanturrilhaEsquerda(),
                m.getTricipital(),
                m.getSuprailiaca(),
                m.getAbdominal()
        );
    }
}
