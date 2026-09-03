package com.example.backend.request;

public record ResetSenhaRequest(
        String email,
        String novaSenha,
        String pin
) {
}
