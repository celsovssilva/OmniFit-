package com.example.backend.service;

import com.example.backend.request.AvaliacoesFisicasRequest;
import com.example.backend.response.AvaliacoesFisicasResponse;

import java.util.List;


public interface AvaliacoesFisicasService {
    AvaliacoesFisicasResponse create(AvaliacoesFisicasRequest request, Long alunoId);
    AvaliacoesFisicasResponse update(AvaliacoesFisicasRequest request,Long id);
    List<AvaliacoesFisicasResponse> getForUserAvaliacao(Long alunoId);
}
