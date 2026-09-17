package com.example.backend.service;

import com.example.backend.request.DietaRequest;
import com.example.backend.response.DietaResponse;

import java.util.List;

public interface DietaService {
    DietaResponse create(DietaRequest request);
    DietaResponse update(DietaRequest request, Long id);
    List<DietaResponse> getDietaForUsers(Long userId);
    void delete(Long id);
    DietaResponse updloadDieta(Long dietaId);
    byte[] downloadDieta(Long dietaId);
}
