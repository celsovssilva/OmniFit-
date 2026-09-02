package com.example.backend.service;

import com.example.backend.entity.User;

public interface TokenService {
    String generateToken(User user);
    String getSubject(String jwt);
}
