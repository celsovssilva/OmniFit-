package com.example.backend.service;

import com.example.backend.request.AvaliacoesFisicasRequest;
import com.example.backend.response.AvaliacoesFisicasResponse;


public interface AvaliacoesFisicasService {
    AvaliacoesFisicasResponse create(AvaliacoesFisicasRequest request, Long alunoId);
}
