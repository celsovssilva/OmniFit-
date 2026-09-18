package com.example.backend.service.impl;

import com.example.backend.entity.AvaliacoesFisicas;
import com.example.backend.entity.Medidas;
import com.example.backend.entity.User;
import com.example.backend.repository.AvaliacoesFisicasRepository;
import com.example.backend.repository.UserRepository;
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
    @Autowired
    private UserRepository userRepository;
    @Override
    public AvaliacoesFisicasResponse create(AvaliacoesFisicasRequest request, Long alunoId) {
        List<AvaliacoesFisicas> avaliacoesFisicas = avaliacoesFisicasRepository.findByAlunoIdOrderByDataDesc(alunoId);
        AvaliacoesFisicas avaliacoesAnteriores = null;
        if (!avaliacoesFisicas.isEmpty()){
            avaliacoesAnteriores = avaliacoesFisicas.get(0);
        }
        User aluno = userRepository.findById(request.alunoId())
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));
        User profissional = userRepository.findById(request.profissionalId())
                .orElseThrow(()-> new RuntimeException("profissional não encontrado"));
        AvaliacoesFisicas av = new AvaliacoesFisicas();
        Medidas medidas= new Medidas();
        av.setAlunoId(aluno);
        av.setData(request.data());
        av.setProfissionalId(profissional);
        av.setPercentualGordura(request.percentualGordura());
        av.setPesoTotal(request.pesoTotal());
        medidas.setAbdomen(request.medidas().abdomen());
        medidas.setAbdominal(request.medidas().abdominal());
        medidas.setAltura(request.medidas().altura());
        medidas.setCintura(request.medidas().cintura());
        medidas.setTorax(request.medidas().torax());
        medidas.setBracoDireito(request.medidas().bracoDireito());
        medidas.setBracoEsquerdo(request.medidas().bracoEsquerdo());
        medidas.setCoxaDireita(request.medidas().coxaDireita());
        medidas.setCoxaEsqueda(request.medidas().CoxaEsqueda());
        medidas.setImc(request.medidas().imc());
        medidas.setMassaGorda(request.medidas().massaGorda());
        medidas.setMassaMagra(request.medidas().massaMagra());
        medidas.setPanturilhaDireita(request.medidas().panturilhaDireita());
        medidas.setPanturrilhaEsquerda(request.medidas().panturrilhaEsquerda());
        medidas.setQuadril(request.medidas().quadril());
        medidas.setSuprailiaca(request.medidas().suprailiaca());
        medidas.setTricipital(request.medidas().tricipital());
        av.setMedidas(medidas);
        AvaliacoesFisicas avaliacaoSalva = avaliacoesFisicasRepository.save(av);
        return new AvaliacoesFisicasResponse(avaliacaoSalva);
    }

    @Override
    public AvaliacoesFisicasResponse update(AvaliacoesFisicasRequest request,Long id) {
        AvaliacoesFisicas fisicas = avaliacoesFisicasRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("avaliação não encontrada"));
        User aluno = userRepository.findById(request.alunoId())
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));
        User profissional = userRepository.findById(request.profissionalId())
                .orElseThrow(()-> new RuntimeException("profissional não encontrado"));
        Medidas medidas= new Medidas();
        fisicas.setAlunoId(aluno);
        fisicas.setData(request.data());
        fisicas.setProfissionalId(profissional);
        fisicas.setPercentualGordura(request.percentualGordura());
        fisicas.setPesoTotal(request.pesoTotal());
        medidas.setAbdomen(request.medidas().abdomen());
        medidas.setAbdominal(request.medidas().abdominal());
        medidas.setAltura(request.medidas().altura());
        medidas.setCintura(request.medidas().cintura());
        medidas.setTorax(request.medidas().torax());
        medidas.setBracoDireito(request.medidas().bracoDireito());
        medidas.setBracoEsquerdo(request.medidas().bracoEsquerdo());
        medidas.setCoxaDireita(request.medidas().coxaDireita());
        medidas.setCoxaEsqueda(request.medidas().CoxaEsqueda());
        medidas.setImc(request.medidas().imc());
        medidas.setMassaGorda(request.medidas().massaGorda());
        medidas.setMassaMagra(request.medidas().massaMagra());
        medidas.setPanturilhaDireita(request.medidas().panturilhaDireita());
        medidas.setPanturrilhaEsquerda(request.medidas().panturrilhaEsquerda());
        medidas.setQuadril(request.medidas().quadril());
        medidas.setSuprailiaca(request.medidas().suprailiaca());
        medidas.setTricipital(request.medidas().tricipital());
        fisicas.setMedidas(medidas);
        AvaliacoesFisicas avaliacaoSalva = avaliacoesFisicasRepository.save(fisicas);
        return new AvaliacoesFisicasResponse(avaliacaoSalva);
    }

    }

