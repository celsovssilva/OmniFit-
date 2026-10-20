package com.example.backend.request;

import com.example.backend.response.RefeicaoResponse;

import java.time.LocalTime;

public record RefeicaoRequest(
        String alimento,
        String quantidade,
        LocalTime hora
){ }

