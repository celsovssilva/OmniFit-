package com.example.backend.request;

public record MedidasRequest (
        Double altura,
        Double peitoral,
        Double ombro,
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
        Double dobraCoxa,
        Double dobraPanturrilha,
        Double dobraBiceps
) {}