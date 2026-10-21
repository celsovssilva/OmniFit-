package com.example.backend.service.impl;

import com.example.backend.entity.AvaliacoesFisicas;
import com.example.backend.entity.Medidas;
import com.example.backend.entity.User;
import com.example.backend.repository.AvaliacoesFisicasRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.AvaliacoesFisicasRequest;
import com.example.backend.request.MedidasRequest;
import com.example.backend.response.AvaliacoesFisicasResponse;
import com.example.backend.service.AvaliacoesFisicasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class AvaliacoesFisicasImpl implements AvaliacoesFisicasService {
    @Autowired
    private AvaliacoesFisicasRepository avaliacoesFisicasRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public AvaliacoesFisicasResponse create(AvaliacoesFisicasRequest request, Long alunoId) {
        List<AvaliacoesFisicas> avaliacoesFisicas = avaliacoesFisicasRepository.findByAluno_IdOrderByDataDesc(alunoId);
        AvaliacoesFisicas avaliacoesAnteriores = null;
        if (!avaliacoesFisicas.isEmpty()) {
            avaliacoesAnteriores = avaliacoesFisicas.get(0);
        }
        User aluno = userRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("aluno não encontrado"));

        AvaliacoesFisicas av = new AvaliacoesFisicas();
        Medidas medidas = new Medidas();

        av.setAluno(aluno);
        av.setData(request.data());
        av.setPesoTotal(request.pesoTotal());

        preencherMedidas(medidas, request.medidas());
        av.setMedidas(medidas);
        calcularComposicaoCorporal(av, aluno.getIdade(), aluno.getSexo());

        AvaliacoesFisicas avaliacaoSalva = avaliacoesFisicasRepository.save(av);
        return new AvaliacoesFisicasResponse(avaliacaoSalva, avaliacoesAnteriores);
    }

    @Override
    public AvaliacoesFisicasResponse update(AvaliacoesFisicasRequest request, Long id) {
        AvaliacoesFisicas fisicas = avaliacoesFisicasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("avaliação não encontrada"));
        User aluno = userRepository.findById(request.alunoId())
                .orElseThrow(() -> new RuntimeException("aluno não encontrado"));

        List<AvaliacoesFisicas> avaliacoesFisicas = avaliacoesFisicasRepository.findByAluno_IdOrderByDataDesc(request.alunoId());
        AvaliacoesFisicas avaliacaoAnterior = null;
        if (avaliacoesFisicas.size() > 1) {
            avaliacaoAnterior = avaliacoesFisicas.get(1);
        }


        Medidas medidas = fisicas.getMedidas() != null ? fisicas.getMedidas() : new Medidas();

        fisicas.setAluno(aluno);
        fisicas.setData(request.data());
        fisicas.setPesoTotal(request.pesoTotal());

        preencherMedidas(medidas, request.medidas());
        fisicas.setMedidas(medidas);
        calcularComposicaoCorporal(fisicas, aluno.getIdade(), aluno.getSexo());

        AvaliacoesFisicas avaliacaoSalva = avaliacoesFisicasRepository.save(fisicas);
        return new AvaliacoesFisicasResponse(avaliacaoSalva, avaliacaoAnterior);
    }

    @Override
    public List<AvaliacoesFisicasResponse> getForUserAvaliacao(Long alunoId) {
        List<AvaliacoesFisicas> av = avaliacoesFisicasRepository.findByAluno_IdOrderByDataDesc(alunoId);
        List<AvaliacoesFisicasResponse> listaDeRespostas = new ArrayList<>();
        for (int i = 0; i < av.size(); i++) {
            AvaliacoesFisicas atual = av.get(i);
            AvaliacoesFisicas anterior = null;
            if (i < av.size() - 1) {
                anterior = av.get(i + 1);
            }
            listaDeRespostas.add(new AvaliacoesFisicasResponse(atual, anterior));
        }
        return listaDeRespostas;
    }

    @Override
    public List<AvaliacoesFisicasResponse> getForUser(Long alunoId) {
        List<AvaliacoesFisicas> av = avaliacoesFisicasRepository.findByAlunoId(alunoId);
        av.sort(Comparator.comparing(AvaliacoesFisicas::getData));
        List<AvaliacoesFisicasResponse> responses = new ArrayList<>();
        for (int i = 0; i < av.size(); i++) {
            AvaliacoesFisicas atual = av.get(i);
            AvaliacoesFisicas anterior = (i > 0) ? av.get(i - 1) : null;
            responses.add(new AvaliacoesFisicasResponse(atual, anterior));
        }
        Collections.reverse(responses);
        return responses;
    }

    private void preencherMedidas(Medidas medidas, MedidasRequest r) {
        medidas.setAltura(r.altura());

        medidas.setPeitoral(r.peitoral());
        medidas.setOmbro(r.ombro());
        medidas.setCintura(r.cintura());
        medidas.setAbdomen(r.abdomen());
        medidas.setQuadril(r.quadril());
        medidas.setBracoDireito(r.bracoDireito());
        medidas.setBracoEsquerdo(r.bracoEsquerdo());
        medidas.setCoxaDireita(r.coxaDireita());
        medidas.setCoxaEsquerda(r.coxaEsquerda());
        medidas.setPanturrilhaDireita(r.panturrilhaDireita());
        medidas.setPanturrilhaEsquerda(r.panturrilhaEsquerda());

        // dobras
        medidas.setDobraPeitoral(r.dobraPeitoral());
        medidas.setDobraAxilarMedia(r.dobraAxilarMedia());
        medidas.setDobraTriceps(r.dobraTriceps());
        medidas.setDobraSubescapular(r.dobraSubescapular());
        medidas.setDobraAbdominal(r.dobraAbdominal());
        medidas.setDobraSuprailiaca(r.dobraSuprailiaca());
        medidas.setDobraCoxa(r.dobraCoxa());
        medidas.setDobraPanturrilha(r.dobraPanturrilha());
        medidas.setDobraBiceps(r.dobraBiceps());
    }

    private void calcularComposicaoCorporal(AvaliacoesFisicas avaliacao, int idade, String sexo) {
        Medidas m = avaliacao.getMedidas();
        double densidadeCorporal;

        if (sexo.equalsIgnoreCase("MASCULINO")) {

            double soma = exigir(m.getDobraSubescapular(), "subescapular")
                    + tricepsOuBiceps(m)
                    + exigir(m.getDobraSuprailiaca(), "suprailíaca")
                    + exigir(m.getDobraPanturrilha(), "panturrilha");

            densidadeCorporal = 1.10726863
                    - (0.00081201 * soma)
                    + (0.00000212 * Math.pow(soma, 2))
                    - (0.00041761 * idade);

        } else if (sexo.equalsIgnoreCase("FEMININO")) {
            double soma = exigir(m.getDobraAxilarMedia(), "axilar média")
                    + exigir(m.getDobraSuprailiaca(), "suprailíaca")
                    + exigir(m.getDobraCoxa(), "coxa")
                    + exigir(m.getDobraPanturrilha(), "panturrilha");

            densidadeCorporal = 1.19547130
                    - (0.07513507 * Math.log10(soma))
                    - (0.00041072 * idade);

        } else {
            throw new IllegalArgumentException("Sexo inválido para o cálculo de Petroski.");
        }


        double percentualGordura = ((4.95 / densidadeCorporal) - 4.50) * 100;

        double pesoTotal = avaliacao.getPesoTotal();
        double massaGorda = pesoTotal * (percentualGordura / 100);
        double massaMagra = pesoTotal - massaGorda;
        double imc = pesoTotal / Math.pow(m.getAltura(), 2);

        avaliacao.setPercentualGordura(percentualGordura);
        m.setMassaGorda(massaGorda);
        m.setMassaMagra(massaMagra);
        m.setImc(imc);
    }


    private double tricepsOuBiceps(Medidas m) {
        if (m.getDobraTriceps() != null) return m.getDobraTriceps();
        if (m.getDobraBiceps() != null) return m.getDobraBiceps();
        throw new IllegalArgumentException("Informe a dobra do tríceps ou do bíceps.");
    }

    private double exigir(Double valor, String nome) {
        if (valor == null) {
            throw new IllegalArgumentException("Dobra obrigatória não informada: " + nome);
        }
        return valor;
    }
}