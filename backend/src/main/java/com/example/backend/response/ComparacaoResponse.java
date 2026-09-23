package com.example.backend.response;

public record ComparacaoResponse(
        Double diferencaPeso,
        Double diferencaAltura,
        Double diferencaPercentualGordura,
        Double diferencaMassaMagra,
        Double diferencaMassaGorda,
        Double diferencaImc,
        Double diferencaTorax,
        Double diferencaCintura,
        Double diferencaAbdomen,
        Double diferencaQuadril,
        Double diferencaBracoDireito,
        Double diferencaBracoEsquerdo,
        Double diferencaCoxaDireita,
        Double diferencaCoxaEsquerda,
        Double diferencaPanturrilhaDireita,
        Double diferencaPanturrilhaEsquerda
) {}