package com.example.backend.service.impl;

import com.example.backend.entity.Dieta;
import com.example.backend.entity.User;
import com.example.backend.repository.DietaRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.DietaRequest;
import com.example.backend.response.DietaResponse;
import com.example.backend.service.DietaService;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.openpdf.text.Document;
import org.openpdf.text.Phrase;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.swing.text.*;
import java.util.List;

@Service
public class DietaServiceImpl implements DietaService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DietaRepository dietaRepository;
    @Override
    public DietaResponse create(DietaRequest request) {
        User aluno = userRepository.findById(request.alunoId())
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));
        User nutri = userRepository.findById(request.profissionalId())
                .orElseThrow(()-> new RuntimeException("nutri não encontrado"));
        Dieta dieta = new Dieta();
        dieta.setAlunoId(aluno);
        dieta.setProfissionalId(nutri);
        dieta.setDescricao(request.descricao());
        return new DietaResponse(dietaRepository.save(dieta));
    }

    @Override
    public DietaResponse update(DietaRequest request, Long id) {
        User aluno = userRepository.findById(request.alunoId())
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));
        User nutri = userRepository.findById(request.profissionalId())
                .orElseThrow(()-> new RuntimeException("nutri não encontrado"));
        Dieta dieta = dietaRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("dieta não encontrada"));
        dieta.setAlunoId(aluno);
        dieta.setProfissionalId(nutri);
        dieta.setDescricao(request.descricao());
        return new DietaResponse(dietaRepository.save(dieta));
    }

    @Override
    public List<DietaResponse> getDietaForUsers(Long userId) {
         List<DietaResponse> dietaResponses = dietaRepository.findById(userId)
                 .stream().map(DietaResponse::new).toList();
         return dietaResponses;
    }

    @Override
    public void delete(Long id) {
        Dieta dieta = dietaRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("dieta não encontrada"));
        dietaRepository.deleteById(dieta.getId());
    }

    @Override
    public DietaResponse updloadDieta(Long dietaId) {
        Dieta dieta = dietaRepository.findById(dietaId)
                .orElseThrow(()-> new RuntimeException("dieta não encontrada"));
       Document document = new Document();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document,byteArrayOutputStream);
        document.open();
        document.add(new Phrase("\nDieta:" + dieta.getId()));
        document.add(new Phrase("Descrição:" + dieta.getDescricao()));
        document.close();
        dieta.setArquivoPdf(byteArrayOutputStream.toByteArray());
        return new DietaResponse(dietaRepository.save(dieta));
    }

    @Override
    public byte[] downloadDieta(Long dietaId) {
        Dieta dieta = dietaRepository.findById(dietaId)
                .orElseThrow(()-> new RuntimeException("dieta não encontrada"));
        return  dieta.getArquivoPdf();
    }
}
