package com.example.backend.request;

import com.example.backend.entity.TipoPerfil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Positive;

public record UserRequest(
         Long id,
        String nome,
        @Email
        String email,
         String senha,
         @Positive(message = "A idade não pode ser negativa")
         Integer idade,
         String peculiaridades,
        TipoPerfil tipoPerfil,
          Long profissionalId
) {
}
