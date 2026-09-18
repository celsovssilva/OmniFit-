package com.example.backend.response;

public record ComparacaoResponse(
        Double diferencaPeso,
        Double diferencAltura,
        Double diferencaTorax,
        Double diferencaCintura,
        Double diferencaAbdomen,
        Double diferencaQuadril,
        Double diferencaBracoDireito,
        Double diferencaBracoEsquerdo,
        Double diferencaCoxaDireita,
        Double diferencaCoxaEsqueda,
        Double diferencaPanturilhaDireita,
        Double diferencaPanturrilhaEsquerda,
        Double diferencaTricipital,
        Double diferencaSuprailiaca,
        Double diferencaAbdominal
) {
}
