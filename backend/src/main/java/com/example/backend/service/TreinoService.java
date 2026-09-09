package com.example.backend.service;

import com.example.backend.entity.Treinos;
import com.example.backend.request.TreinoRequest;
import com.example.backend.response.TreinoResponse;

import java.util.List;

public interface TreinoService {
    TreinoResponse create(TreinoRequest request);
    TreinoResponse update(TreinoRequest request, Long id);
    List<TreinoResponse> getTreinoForUsers(Long userId);
    void delete(Long id);
}
