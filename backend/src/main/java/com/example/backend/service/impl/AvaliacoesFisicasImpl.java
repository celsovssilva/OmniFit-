package com.example.backend.service.impl;

import com.example.backend.entity.AvaliacoesFisicas;
import com.example.backend.repository.AvaliacoesFisicasRepository;
import com.example.backend.request.AvaliacoesFisicasRequest;
import com.example.backend.response.AvaliacoesFisicasResponse;
import com.example.backend.service.AvaliacoesFisicasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvaliacoesFisicasImpl implements AvaliacoesFisicasService {
    @Autowired
    private AvaliacoesFisicasRepository avaliacoesFisicasRepository;
    @Override
    public AvaliacoesFisicasResponse create(AvaliacoesFisicasRequest request, Long alunoId) {
        List<AvaliacoesFisicas> avaliacoesFisicas = avaliacoesFisicasRepository.findByAlunoIdOrderByDataDesc(alunoId);
        if (!avaliacoesFisicas.isEmpty()){

        }
        return null;
    }
}
