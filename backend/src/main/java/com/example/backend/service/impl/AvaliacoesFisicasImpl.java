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

import java.util.ArrayList;
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
        AvaliacoesFisicas avaliacoesAnteriores = null ;
        if (!avaliacoesFisicas.isEmpty()){
            avaliacoesAnteriores = avaliacoesFisicas.get(0);
        }
        User aluno = userRepository.findById(request.alunoId())
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));


        AvaliacoesFisicas av = new AvaliacoesFisicas();
        Medidas medidas= new Medidas();

        av.setAluno(aluno);
        av.setData(request.data());
        av.setPesoTotal(request.pesoTotal());

        medidas.setAbdomen(request.medidas().abdomen());
        medidas.setAltura(request.medidas().altura());
        medidas.setCintura(request.medidas().cintura());
        medidas.setTorax(request.medidas().torax());
        medidas.setBracoDireito(request.medidas().bracoDireito());
        medidas.setBracoEsquerdo(request.medidas().bracoEsquerdo());
        medidas.setCoxaDireita(request.medidas().coxaDireita());
        medidas.setCoxaEsquerda(request.medidas().coxaEsquerda());
        medidas.setPanturrilhaDireita(request.medidas().panturrilhaDireita());
        medidas.setPanturrilhaEsquerda(request.medidas().panturrilhaEsquerda());
        medidas.setQuadril(request.medidas().quadril());


        medidas.setDobraPeitoral(request.medidas().dobraPeitoral());
        medidas.setDobraAxilarMedia(request.medidas().dobraAxilarMedia());
        medidas.setDobraTriceps(request.medidas().dobraTriceps());
        medidas.setDobraSubescapular(request.medidas().dobraSubescapular());
        medidas.setDobraAbdominal(request.medidas().dobraAbdominal());
        medidas.setDobraSuprailiaca(request.medidas().dobraSuprailiaca());
        medidas.setDobraCoxa(request.medidas().dobraCoxa());
        av.setMedidas(medidas);
        calcularComposicaoCorporal7Dobras(av,aluno.getIdade(),aluno.getSexo());

        AvaliacoesFisicas avaliacaoSalva = avaliacoesFisicasRepository.save(av);
        return new AvaliacoesFisicasResponse(avaliacaoSalva, avaliacoesAnteriores);
    }

    @Override
    public AvaliacoesFisicasResponse update(AvaliacoesFisicasRequest request,Long id) {
        AvaliacoesFisicas fisicas = avaliacoesFisicasRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("avaliação não encontrada"));
        User aluno = userRepository.findById(request.alunoId())
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));

        List<AvaliacoesFisicas> avaliacoesFisicas = avaliacoesFisicasRepository.findByAluno_IdOrderByDataDesc(request.alunoId());
        AvaliacoesFisicas avaliacaoAnterior = null;
        if (avaliacoesFisicas.size() > 1 ){
            avaliacaoAnterior = avaliacoesFisicas.get(1);
        }

        Medidas medidas= new Medidas();
        fisicas.setAluno(aluno);
        fisicas.setData(request.data());
        fisicas.setPesoTotal(request.pesoTotal());

        medidas.setAbdomen(request.medidas().abdomen());
        medidas.setAltura(request.medidas().altura());
        medidas.setCintura(request.medidas().cintura());
        medidas.setTorax(request.medidas().torax());
        medidas.setBracoDireito(request.medidas().bracoDireito());
        medidas.setBracoEsquerdo(request.medidas().bracoEsquerdo());
        medidas.setCoxaDireita(request.medidas().coxaDireita());
        medidas.setCoxaEsquerda(request.medidas().coxaEsquerda());
        medidas.setPanturrilhaDireita(request.medidas().panturrilhaDireita());
        medidas.setPanturrilhaEsquerda(request.medidas().panturrilhaEsquerda());
        medidas.setQuadril(request.medidas().quadril());

        medidas.setDobraPeitoral(request.medidas().dobraPeitoral());
        medidas.setDobraAxilarMedia(request.medidas().dobraAxilarMedia());
        medidas.setDobraTriceps(request.medidas().dobraTriceps());
        medidas.setDobraSubescapular(request.medidas().dobraSubescapular());
        medidas.setDobraAbdominal(request.medidas().dobraAbdominal());
        medidas.setDobraSuprailiaca(request.medidas().dobraSuprailiaca());
        medidas.setDobraCoxa(request.medidas().dobraCoxa());
        fisicas.setMedidas(medidas);
        calcularComposicaoCorporal7Dobras(fisicas,aluno.getIdade(),aluno.getSexo());

        AvaliacoesFisicas avaliacaoSalva = avaliacoesFisicasRepository.save(fisicas);
        return new AvaliacoesFisicasResponse(avaliacaoSalva,avaliacaoAnterior);
    }
    @Override
    public List<AvaliacoesFisicasResponse> getForUserAvaliacao(Long alunoId) {
        List<AvaliacoesFisicas> av = avaliacoesFisicasRepository.findByAluno_IdOrderByDataDesc(alunoId);
        List<AvaliacoesFisicasResponse> listaDeRespostas = new ArrayList<>();
        for(int i = 0;i < av.size();i++){
            AvaliacoesFisicas atual = av.get(i);
            AvaliacoesFisicas anterior = null;
            if(i < av.size() - 1){
                anterior = av.get(i + 1);
            }
            listaDeRespostas.add(new AvaliacoesFisicasResponse(atual, anterior));

        }
            return listaDeRespostas;
    }

    private void calcularComposicaoCorporal7Dobras(AvaliacoesFisicas avaliacao, int idade, String sexo) {
        double somaDobras = avaliacao.getMedidas().getDobraPeitoral() +
                avaliacao.getMedidas().getDobraAxilarMedia() +
                avaliacao.getMedidas().getDobraTriceps() +
                avaliacao.getMedidas().getDobraSubescapular() +
                avaliacao.getMedidas().getDobraAbdominal() +
                avaliacao.getMedidas().getDobraSuprailiaca() +
                avaliacao.getMedidas().getDobraCoxa();

        double densidadeCorporal = 0.0;


        if (sexo.equalsIgnoreCase("MASCULINO")) {
            densidadeCorporal = 1.1120000
                    - (0.00043499 * somaDobras)
                    + (0.00000055 * Math.pow(somaDobras, 2))
                    - (0.00028826 * idade);

        } else if (sexo.equalsIgnoreCase("FEMININO")) {
            densidadeCorporal = 1.0970000
                    - (0.00046971 * somaDobras)
                    + (0.00000056 * Math.pow(somaDobras, 2))
                    - (0.00012828 * idade);

        } else {
            throw new IllegalArgumentException("Sexo inválido para o cálculo de Pollock.");
        }


        double percentualGordura = ((4.95 / densidadeCorporal) - 4.50) * 100;

        double pesoTotal = avaliacao.getPesoTotal();
        double massaGorda = pesoTotal * (percentualGordura / 100);
        double massaMagra = pesoTotal - massaGorda;

        double imc = avaliacao.getPesoTotal() / Math.pow(avaliacao.getMedidas().getAltura(),2);
        avaliacao.setPercentualGordura(percentualGordura);
        avaliacao.getMedidas().setMassaGorda(massaGorda);
        avaliacao.getMedidas().setMassaMagra(massaMagra);
        avaliacao.getMedidas().setImc(imc);
    }

}

