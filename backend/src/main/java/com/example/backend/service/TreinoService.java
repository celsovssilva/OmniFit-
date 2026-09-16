package com.example.backend.service;

import com.example.backend.entity.Treinos;
import com.example.backend.request.TreinoRequest;
import com.example.backend.response.TreinoResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface TreinoService {
    TreinoResponse create(TreinoRequest request);
    TreinoResponse update(TreinoRequest request, Long id);
    List<TreinoResponse> getTreinoForUsers(Long userId);
    void delete(Long id);
    TreinoResponse updloadTreino(Long treinoId);
}
