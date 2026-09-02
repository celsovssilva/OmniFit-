package com.example.backend.service.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.example.backend.entity.User;
import com.example.backend.service.TokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

@Service
public class TokenServiceImpl implements TokenService {
    @Value("${fit.jwt.secret}")
    private String secret;
    @Value("${fit.jwt.expiration}")
    private Long expiration;
    @Override
    public String generateToken(User user) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        Instant dataExpiracao = Instant.now().plusMillis(expiration);
            try{
                var tokenCreate = JWT.create()
                        .withIssuer("api-fit")
                    .withClaim("role",user.getTipoPerfil().name())
                    .withSubject(user.getEmail())
                    .withClaim("id", user.getId())
                    .withExpiresAt(dataExpiracao);

                    return tokenCreate.sign(algorithm);
            } catch (JWTCreationException e) {
            throw new RuntimeException("erro ao criar token" + e);
}
    }

    @Override
    public String getSubject(String jwt) {
        try{
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("api-fit")
                    .build()
                    .verify(jwt)
                    .getSubject();
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("erro ao verificar token" + e);
        }
    }
}
