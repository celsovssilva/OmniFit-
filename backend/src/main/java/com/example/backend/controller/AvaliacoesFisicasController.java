package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.request.AvaliacoesFisicasRequest;
import com.example.backend.response.AvaliacoesFisicasResponse;
import com.example.backend.service.AvaliacoesFisicasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/avaliacoesfisicas")
public class AvaliacoesFisicasController {
    @Autowired
    private AvaliacoesFisicasService avaliacoesFisicasService;

    @PostMapping("/create/{alunoId}")
    public AvaliacoesFisicasResponse createAvaliacoes(@RequestBody AvaliacoesFisicasRequest request, @PathVariable Long alunoId){
        return avaliacoesFisicasService.create(request,alunoId);
    }

    @PutMapping("/update/{alunoId}")
    public AvaliacoesFisicasResponse updateAvaliacoes(@RequestBody AvaliacoesFisicasRequest request, @PathVariable Long alunoId){
        return avaliacoesFisicasService.update(request,alunoId);
    }

    @GetMapping("/getUsersAvaliacoes")
    public List<AvaliacoesFisicasResponse> avaliacoesFisicasResponseList(Authentication authentication){
       User user = (User) authentication.getPrincipal();
       return avaliacoesFisicasService.getForUserAvaliacao(user.getId());
    }
}

