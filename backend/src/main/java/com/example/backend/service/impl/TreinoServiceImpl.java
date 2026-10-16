package com.example.backend.service.impl;

import com.example.backend.entity.Exercicios;
import com.example.backend.entity.TipoPerfil;
import com.example.backend.entity.Treinos;
import com.example.backend.entity.User;
import com.example.backend.repository.TreinoRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.TreinoRequest;
import com.example.backend.response.TreinoResponse;
import com.example.backend.response.UserResponse;
import com.example.backend.service.TreinoService;
import org.openpdf.text.*;
import org.openpdf.text.Font;
import org.openpdf.text.pdf.PdfPCell;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;

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


        User personalLogado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User personal = userRepository.findById(personalLogado.getId())
                .orElseThrow(()-> new RuntimeException("personal não encontrado no banco"));

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
        return new TreinoResponse(treinoSalvo);
    }

    @Override
    public TreinoResponse update(TreinoRequest request, Long id) {
        Treinos treinos = treinoRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("treino inexistente"));

        User aluno = userRepository.findById(request.alunoId())
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));


        User personalLogado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User personal = userRepository.findById(personalLogado.getId())
                .orElseThrow(()-> new RuntimeException("personal não encontrado no banco"));

        treinos.setAlunoId(aluno);
        treinos.setProfissionalId(personal); // Usa o personal real

        List<Exercicios> e = request.exerciciosRequests().stream().map(exerciciosRequest ->{
            Exercicios exercicios = new Exercicios();
            exercicios.setExercicio(exerciciosRequest.exercicio());
            exercicios.setRepeticoes(exerciciosRequest.repeticoes());
            exercicios.setSeries(exerciciosRequest.series());
            exercicios.setTreino(treinos);
            return exercicios;
        }).collect(Collectors.toList());

        treinos.getExercicios().clear();
        treinos.getExercicios().addAll(e);

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
    public TreinoResponse updloadTreino(Long treinoId) {
        Treinos treinos = treinoRepository.findById(treinoId)
                .orElseThrow(() -> new RuntimeException("treino inexistente"));

        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();


            Font tituloFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font cabecalhoFont = new Font(Font.HELVETICA, 12, Font.BOLD, Color.WHITE);
            Font celulaFont = new Font(Font.HELVETICA, 11, Font.NORMAL);
            Paragraph titulo = new Paragraph("Ficha de Treino", tituloFont);
            titulo.setAlignment(Element.ALIGN_CENTER);
            titulo.setSpacingAfter(20f);
            document.add(titulo);
            PdfPTable tabela = new PdfPTable(3);
            tabela.setWidthPercentage(100);
            tabela.setWidths(new float[]{3f, 1f, 1.5f});
            String[] cabecalhos = {"Exercício", "Séries", "Repetições"};
            for (String texto : cabecalhos) {
                PdfPCell cell = new PdfPCell(new Phrase(texto, cabecalhoFont));
                cell.setBackgroundColor(new Color(40, 40, 40));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cell.setPadding(8f);
                tabela.addCell(cell);
            }


            for (Exercicios exercicio : treinos.getExercicios()) {
                tabela.addCell(criarCelula(exercicio.getExercicio(), celulaFont, Element.ALIGN_LEFT));
                tabela.addCell(criarCelula(String.valueOf(exercicio.getSeries()), celulaFont, Element.ALIGN_CENTER));
                tabela.addCell(criarCelula(String.valueOf(exercicio.getRepeticoes()), celulaFont, Element.ALIGN_CENTER));
            }

            document.add(tabela);
            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar o PDF do treino", e);
        }

        treinos.setArquivoPdf(outputStream.toByteArray());
        return new TreinoResponse(treinoRepository.save(treinos));
    }

    private PdfPCell criarCelula(String texto, Font font, int alinhamento) {
        PdfPCell cell = new PdfPCell(new Phrase(texto, font));
        cell.setHorizontalAlignment(alinhamento);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(8f);
        return cell;
    }

    @Override
    public byte[] downloadTreino(Long treinoId) {
        Treinos treinos = treinoRepository.findById(treinoId)
                .orElseThrow(()-> new RuntimeException("treino inexistente"));
     return  treinos.getArquivoPdf();

    }

    @Override
    public List<TreinoResponse> getTreino(Long userId) {
        List<TreinoResponse> treinoResponses  =treinoRepository.findByAlunoIdId(userId)
                .stream().map(TreinoResponse::new).toList();
        return  treinoResponses;
    }
    @Override
    public UserResponse vincularAluno(Long alunoId, Long personalId) {
        User user = userRepository.findById(alunoId)
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));
        user.setPersonalId(personalId);
        return new UserResponse( userRepository.save(user));
    }
    @Override
    public UserResponse buscarAlunos(String email) {
        User buscarUser = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));
        if(buscarUser.getTipoPerfil() == TipoPerfil.NUTRI || buscarUser.getTipoPerfil() == TipoPerfil.PERSONAL){
            throw new RuntimeException("somente alunos podem ser vinculados");
        }
        return new UserResponse(buscarUser);
    }
}
