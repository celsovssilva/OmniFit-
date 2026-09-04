package com.example.backend.request;

import com.example.backend.entity.TipoPerfil;
import jakarta.validation.constraints.*;

public record UserRequest(
         Long id,
        @NotBlank
        String nome,
        @Email
        String email,
         @NotBlank @Size(min = 6)
         String senha,
         @Positive(message = "A idade não pode ser negativa")
         Integer idade,
         String peculiaridades,
        TipoPerfil tipoPerfil,
          Long profissionalId
) {
}
