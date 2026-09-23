package com.example.backend.response;

import com.example.backend.entity.AvaliacoesFisicas;
import java.time.LocalDate;

public record AvaliacoesFisicasResponse(
        LocalDate data,
        Double pesoTotal,
        Double percentualGordura,
        MedidasResponse medidas,
        ComparacaoResponse comparacao
) {
    public AvaliacoesFisicasResponse(AvaliacoesFisicas atual, AvaliacoesFisicas anterior){
        this(
                atual.getData(),
                atual.getPesoTotal(),
                atual.getPercentualGordura(),
                new MedidasResponse(atual.getMedidas()),
                anterior != null ? new ComparacaoResponse(
                        atual.getPesoTotal() - anterior.getPesoTotal(),
                        atual.getMedidas().getAltura() - anterior.getMedidas().getAltura(),
                        atual.getPercentualGordura() - anterior.getPercentualGordura(),
                        atual.getMedidas().getMassaMagra() - anterior.getMedidas().getMassaMagra(),
                        atual.getMedidas().getMassaGorda() - anterior.getMedidas().getMassaGorda(),
                        atual.getMedidas().getImc() - anterior.getMedidas().getImc(),
                        atual.getMedidas().getTorax() - anterior.getMedidas().getTorax(),
                        atual.getMedidas().getCintura() - anterior.getMedidas().getCintura(),
                        atual.getMedidas().getAbdomen() - anterior.getMedidas().getAbdomen(),
                        atual.getMedidas().getQuadril() - anterior.getMedidas().getQuadril(),
                        atual.getMedidas().getBracoDireito() - anterior.getMedidas().getBracoDireito(),
                        atual.getMedidas().getBracoEsquerdo() - anterior.getMedidas().getBracoEsquerdo(),
                        atual.getMedidas().getCoxaDireita() - anterior.getMedidas().getCoxaDireita(),
                        atual.getMedidas().getCoxaEsquerda() - anterior.getMedidas().getCoxaEsquerda(),
                        atual.getMedidas().getPanturrilhaDireita() - anterior.getMedidas().getPanturrilhaDireita(),
                        atual.getMedidas().getPanturrilhaEsquerda() - anterior.getMedidas().getPanturrilhaEsquerda()
                ) : null
        );
    }
}