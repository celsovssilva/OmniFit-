package com.example.backend.response;

public record LoginResponse(
        String token,
        String tipoPerfil
){}
