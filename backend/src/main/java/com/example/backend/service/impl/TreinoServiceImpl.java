package com.example.backend.service.impl;

import com.example.backend.entity.Exercicios;
import com.example.backend.entity.Treinos;
import com.example.backend.entity.User;
import com.example.backend.repository.TreinoRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.TreinoRequest;
import com.example.backend.response.TreinoResponse;
import com.example.backend.service.TreinoService;
import org.openpdf.text.Document;
import org.openpdf.text.Phrase;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class TreinoServiceImpl implements TreinoService {
    @Autowired
    private TreinoRepository treinoRepository;
    @Autowired
    private UserRepository userRepository;
    @Override
    public TreinoResponse create(TreinoRequest request) {
        User aluno = userRepository.findById(request.alunoId())
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));
        User personal = userRepository.findById(request.profissionalId())
                .orElseThrow(()-> new RuntimeException("personal não encontrado"));
        Treinos treinos = new Treinos();
        treinos.setAlunoId(aluno);
        treinos.setProfissionalId(personal);

        List<Exercicios> e = request.exerciciosRequests().stream().map(exerciciosRequest ->{
            Exercicios exercicios = new Exercicios();
            exercicios.setExercicio(exerciciosRequest.exercicio());
            exercicios.setRepeticoes(exerciciosRequest.repeticoes());
            exercicios.setSeries(exerciciosRequest.series());
            exercicios.setTreino(treinos);
            return exercicios;

        }).toList();
        treinos.setExercicios(e);
        Treinos treinoSalvo = treinoRepository.save(treinos);
        return  new TreinoResponse(treinoSalvo);
    }

    @Override
    public TreinoResponse update(TreinoRequest request, Long id) {
        Treinos treinos = treinoRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("treino inexistente"));
        User aluno = userRepository.findById(request.alunoId())
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));
        User personal = userRepository.findById(request.profissionalId())
                .orElseThrow(()-> new RuntimeException("personal não encontrado"));
        treinos.setAlunoId(aluno);
        treinos.setProfissionalId(personal);
        List<Exercicios> e = request.exerciciosRequests().stream().map(exerciciosRequest ->{
            Exercicios exercicios = new Exercicios();
            exercicios.setExercicio(exerciciosRequest.exercicio());
            exercicios.setRepeticoes(exerciciosRequest.repeticoes());
            exercicios.setSeries(exerciciosRequest.series());
            exercicios.setTreino(treinos);
            return exercicios;

        }).toList();
        treinos.setExercicios(e);
        return new TreinoResponse(treinoRepository.save(treinos));
    }

    @Override
    public List<TreinoResponse> getTreinoForUsers(Long userId) {
        List<TreinoResponse> treinoResponses  =treinoRepository.findByAlunoIdId(userId)
                .stream().map(TreinoResponse::new).toList();
        return  treinoResponses;
    }


    @Override
    public void delete(Long id) {
        Treinos treinos = treinoRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("treino não encontrado"));
        treinoRepository.deleteById(treinos.getId());
    }

    @Override
    public TreinoResponse updloadTreino(Long treinoId)  {
        Treinos treinos = treinoRepository.findById(treinoId)
                .orElseThrow(()-> new RuntimeException("treino inexistente"));
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document,outputStream);
        document.open();
        document.add(new Phrase("\nTreino:" + treinos.getId()));
        List<Exercicios> treinoResponses = treinos.getExercicios();
        for(Exercicios exercicios : treinoResponses){
            document.add(new Phrase(" Exercicío:" + exercicios.getExercicio()));
            document.add(new Phrase("\nRepetições:" + exercicios.getRepeticoes()));
            document.add(new Phrase("\nSéries:" + exercicios.getSeries() + "\n\n"));
        }
        document.close();
        treinos.setArquivoPdf(outputStream.toByteArray());


        return new TreinoResponse(treinoRepository.save(treinos));
    }

    @Override
    public byte[] downloadTreino(Long treinoId) {
        Treinos treinos = treinoRepository.findById(treinoId)
                .orElseThrow(()-> new RuntimeException("treino inexistente"));
     return  treinos.getArquivoPdf();

    }
}
