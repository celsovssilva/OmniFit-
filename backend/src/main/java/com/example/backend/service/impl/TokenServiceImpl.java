package com.example.backend.service.impl;

import com.example.backend.entity.User;
import com.example.backend.service.TokenService;
import com.nimbusds.jose.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TokenServiceImpl implements TokenService {
    @Value("${fit.jwt.secret}")
    private String secret;
    @Value("${fit.jwt.expiration}")
    private Long expiration;
    @Override
    public String generateToken(User user) {
        Algorithm

        return "";
    }

    @Override
    public String getSubject(String jwt) {
        return "";
    }
}
