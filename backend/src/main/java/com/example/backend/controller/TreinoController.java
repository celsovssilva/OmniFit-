package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.request.TreinoRequest;
import com.example.backend.response.TreinoResponse;
import com.example.backend.service.TreinoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/treino")
public class TreinoController {
    @Autowired
    private TreinoService treinoService;

    @PostMapping("/create")
    public TreinoResponse create(@Valid @RequestBody TreinoRequest treinoRequest){
        return treinoService.create(treinoRequest);
    }

    @PutMapping("/update/{id}")
    public TreinoResponse up(@Valid  @RequestBody TreinoRequest request, @PathVariable Long id){
        return treinoService.update(request, id);
    }

    @GetMapping("/getTreinoForUsers")
    public List<TreinoResponse> get(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        return treinoService.getTreinoForUsers(user.getId());
    }

    @DeleteMapping("/delete/{id}")
    public void delete(Long id){
        treinoService.delete(id);
    }

    @PostMapping("/upload/{treinoId}")
    public TreinoResponse upload(@PathVariable Long treinoId){
        return treinoService.updloadTreino(treinoId);
    }
}
