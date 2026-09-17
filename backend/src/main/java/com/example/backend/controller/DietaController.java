package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.request.DietaRequest;
import com.example.backend.response.DietaResponse;
import com.example.backend.service.DietaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/dieta")
public class DietaController {
    @Autowired
    private DietaService dietaService;

    @PostMapping("/create")
    public DietaResponse createDieta(@RequestBody DietaRequest dietaRequest){
            return dietaService.create(dietaRequest);
    }

    @PutMapping("/upload/{id}")
    public DietaResponse updateDieta(@RequestBody DietaRequest dietaRequest,@PathVariable Long id){
        return dietaService.update(dietaRequest,id);
    }

    @GetMapping("/getDietaForUsers")
    public List<DietaResponse> get(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        return dietaService.getDietaForUsers(user.getId());
    }
    @DeleteMapping("/delete/{id}")
    public void deleteDieta(Long id){
        dietaService.delete(id);
    }

    @PostMapping("/upload/{dietaId}")
    public DietaResponse upload(@PathVariable Long dietaId){
        return dietaService.updloadDieta(dietaId);
    }

    @GetMapping("/download/{dietaId}")
    public ResponseEntity<byte[]> download(@PathVariable Long dietaId){
        byte[] pdfBytes = dietaService.downloadDieta(dietaId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "treino-" + dietaId + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
