package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.request.LoginRequest;
import com.example.backend.request.ResetSenhaRequest;
import com.example.backend.request.UserRequest;
import com.example.backend.response.LoginResponse;
import com.example.backend.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser (UserRequest user);
    UserResponse updateUser(UserRequest userRequest,Long userId);
    List<UserResponse> getUserForPersonal(Long personalId);
    void deleteUser(Long userId);
    LoginResponse login(LoginRequest loginRequest);
     User forgotPassword(ResetSenhaRequest request);
}
