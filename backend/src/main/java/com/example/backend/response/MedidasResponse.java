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
        Double coxaEsquerda,
        Double panturrilhaDireita,
        Double panturrilhaEsquerda,
        Double dobraPeitoral,
        Double dobraAxilarMedia,
        Double dobraTriceps,
        Double dobraSubescapular,
        Double dobraAbdominal,
        Double dobraSuprailiaca,
        Double dobraCoxa
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
                m.getCoxaEsquerda(),
                m.getPanturrilhaDireita(),
                m.getPanturrilhaEsquerda(),
                m.getDobraPeitoral(),
                m.getDobraAxilarMedia(),
                m.getDobraTriceps(),
                m.getDobraSubescapular(),
                m.getDobraAbdominal(),
                m.getDobraSuprailiaca(),
                m.getDobraCoxa()
        );
    }
}