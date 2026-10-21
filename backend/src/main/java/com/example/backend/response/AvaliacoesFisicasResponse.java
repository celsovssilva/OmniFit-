package com.example.backend.response;

import com.example.backend.entity.AvaliacoesFisicas;
import java.time.LocalDate;

public record AvaliacoesFisicasResponse(
        Long id,
        LocalDate data,
        Double pesoTotal,
        Double percentualGordura,
        MedidasResponse medidas,
        ComparacaoResponse comparacao
) {
    public AvaliacoesFisicasResponse(AvaliacoesFisicas atual, AvaliacoesFisicas anterior){
        this(
                atual.getId(),
                atual.getData(),
                atual.getPesoTotal(),
                atual.getPercentualGordura(),
                new MedidasResponse(atual.getMedidas()),
                anterior != null ? new ComparacaoResponse(
                        dif(atual.getPesoTotal(), anterior.getPesoTotal()),
                        dif(atual.getMedidas().getAltura(), anterior.getMedidas().getAltura()),
                        dif(atual.getPercentualGordura(), anterior.getPercentualGordura()),
                        dif(atual.getMedidas().getMassaMagra(), anterior.getMedidas().getMassaMagra()),
                        dif(atual.getMedidas().getMassaGorda(), anterior.getMedidas().getMassaGorda()),
                        dif(atual.getMedidas().getImc(), anterior.getMedidas().getImc()),
                        dif(atual.getMedidas().getPeitoral(), anterior.getMedidas().getPeitoral()),
                        dif(atual.getMedidas().getOmbro(), anterior.getMedidas().getOmbro()),   // novo
                        dif(atual.getMedidas().getCintura(), anterior.getMedidas().getCintura()),
                        dif(atual.getMedidas().getAbdomen(), anterior.getMedidas().getAbdomen()),
                        dif(atual.getMedidas().getQuadril(), anterior.getMedidas().getQuadril()),
                        dif(atual.getMedidas().getBracoDireito(), anterior.getMedidas().getBracoDireito()),
                        dif(atual.getMedidas().getBracoEsquerdo(), anterior.getMedidas().getBracoEsquerdo()),
                        dif(atual.getMedidas().getCoxaDireita(), anterior.getMedidas().getCoxaDireita()),
                        dif(atual.getMedidas().getCoxaEsquerda(), anterior.getMedidas().getCoxaEsquerda()),
                        dif(atual.getMedidas().getPanturrilhaDireita(), anterior.getMedidas().getPanturrilhaDireita()),
                        dif(atual.getMedidas().getPanturrilhaEsquerda(), anterior.getMedidas().getPanturrilhaEsquerda())
                ) : null
        );
    }


    private static Double dif(Double atual, Double anterior) {
        return (atual == null || anterior == null) ? null : atual - anterior;
    }
}