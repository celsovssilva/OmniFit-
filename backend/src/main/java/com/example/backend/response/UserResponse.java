package com.example.backend.response;

import com.example.backend.entity.TipoPerfil;
import com.example.backend.entity.User;

public record UserResponse(
        Long id,
       String nome,
       Integer idade,
       String peculiaridades,
       TipoPerfil tipoPerfil,
         Long profissionalId
) {
    public UserResponse(User u){
        this(
                u.getId(),
                u.getNome(),
                u.getIdade(),
                u.getPeculiaridades(),
                u.getTipoPerfil(),
                u.getPersonalId()
        );
    }
}
