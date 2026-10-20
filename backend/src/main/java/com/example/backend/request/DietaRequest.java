package com.example.backend.request;


import com.example.backend.response.DietaResponse;

import java.util.List;

public record DietaRequest(
         Long Id,
         Long alunoId,
         Long nutriId,
         List<RefeicaoRequest> refeicoesRequests
) {}
