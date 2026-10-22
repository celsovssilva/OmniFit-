package com.example.backend.service.impl;

import com.example.backend.entity.*;
import com.example.backend.repository.DietaRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.DietaRequest;
import com.example.backend.response.DietaResponse;
import com.example.backend.response.UserResponse;
import com.example.backend.service.DietaService;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.openpdf.text.Document;
import org.openpdf.text.Phrase;
import org.openpdf.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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

        User personalLogado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User nutri = userRepository.findById(personalLogado.getId())
                .orElseThrow(()-> new RuntimeException("nutri não encontrado no banco"));
        Dieta dieta = new Dieta();
        dieta.setAlunoId(aluno);
        dieta.setNutrilId(nutri);

        List<Refeicoes> refeicoes= request.refeicoesRequests().stream().map(refeicoesRequest ->{
            Refeicoes re = new Refeicoes();
            re.setAlimento(refeicoesRequest.alimento());
            re.setQuantidade(refeicoesRequest.quantidade());
            re.setHora(refeicoesRequest.hora());

            return re;
        }).toList();

        dieta.setRefeicoes(refeicoes);
        return new DietaResponse(dietaRepository.save(dieta));
    }

    @Override
    public DietaResponse update(DietaRequest request, Long id) {
        User aluno = userRepository.findById(request.alunoId())
                .orElseThrow(()-> new RuntimeException("aluno não encontrado"));
        User personalLogado = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User nutri = userRepository.findById(personalLogado.getId())
                .orElseThrow(()-> new RuntimeException("nutri não encontrado no banco"));
        Dieta dieta = dietaRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("dieta não encontrada"));

        dieta.setAlunoId(aluno);
        dieta.setNutrilId(nutri);
        List<Refeicoes> refeicoes= request.refeicoesRequests().stream().map(refeicoesRequest ->{
            Refeicoes re = new Refeicoes();
            re.setAlimento(refeicoesRequest.alimento());
            re.setQuantidade(refeicoesRequest.quantidade());
            re.setHora(refeicoesRequest.hora());

            return re;
        }).toList();
        dieta.setRefeicoes(refeicoes);
        return new DietaResponse(dietaRepository.save(dieta));
    }

    @Override
    public List<DietaResponse> getDietaForUsers(Long userId) {
         List<DietaResponse> dietaResponses = dietaRepository.findByAlunoIdId(userId)
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
                .orElseThrow(() -> new RuntimeException("Dieta não encontrada"));

        Document document = new Document();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, byteArrayOutputStream);
            document.open();
            document.add(new Phrase("=== PLANO ALIMENTAR (Dieta #" + dieta.getId() + ") ===\n\n"));

            if (dieta.getAlunoId() != null) {
                document.add(new Phrase("Aluno: " + dieta.getAlunoId().getNome() + "\n\n"));
            }

            document.add(new Phrase("Refeições:\n"));
            document.add(new Phrase("--------------------------------------------------\n"));

            if (dieta.getRefeicoes() != null && !dieta.getRefeicoes().isEmpty()) {
                for (Refeicoes r : dieta.getRefeicoes()) {
                    String horaStr = (r.getHora() != null) ? r.getHora().toString() : "Horário não informado";
                    String linhaRefeicao = String.format("• [%s] %s - Quantidade: %s\n",
                            horaStr,
                            r.getAlimento(),
                            r.getQuantidade());

                    document.add(new Phrase(linhaRefeicao));
                }
            } else {
                document.add(new Phrase("Nenhuma refeição cadastrada para esta dieta.\n"));
            }

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF da dieta: " + e.getMessage());
        }

        dieta.setArquivoPdf(byteArrayOutputStream.toByteArray());
        return new DietaResponse(dietaRepository.save(dieta));
    }

    @Override
    public byte[] downloadDieta(Long dietaId) {
        Dieta dieta = dietaRepository.findById(dietaId)
                .orElseThrow(()-> new RuntimeException("dieta não encontrada"));
        return  dieta.getArquivoPdf();
    }

    @Override
    public List<DietaResponse> getDieta(Long userId) {
        List<DietaResponse> dieta = dietaRepository.findByAlunoIdId(userId)
                .stream().map(DietaResponse::new).toList();
        return dieta;
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

    @Override
    public UserResponse vincularAluno(Long alunoId, Long nutriId) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        User logado = (User) authentication.getPrincipal();

        User aluno = userRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("aluno não encontrado"));
        aluno.setNutriId(logado.getId());
        return new UserResponse(userRepository.save(aluno));
    }

}
