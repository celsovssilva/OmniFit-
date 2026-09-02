package com.example.backend.service.impl;

import com.example.backend.entity.TipoPerfil;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.LoginRequest;
import com.example.backend.request.UserRequest;
import com.example.backend.response.LoginResponse;
import com.example.backend.response.UserResponse;
import com.example.backend.service.TokenService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;
    @Override
    public UserResponse createUser(UserRequest user) {
        User u = new User();
        u.setNome(user.nome());
        u.setEmail(user.email());
        String senhaHash = passwordEncoder.encode(u.getSenha());
        u.setSenha(senhaHash);
        u.setIdade(user.idade());
        u.setTipoPerfil(user.tipoPerfil());
        if(user.tipoPerfil() == TipoPerfil.ALUNO){
            u.setPeculiaridades(user.peculiaridades());
        }

        return new UserResponse(userRepository.save(u));
    }

    @Override
    public UserResponse updateUser(UserRequest userRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("user não encontrado"));
        user.setNome(userRequest.nome());
        if(!user.getEmail().isBlank()){
            throw new RuntimeException("email já existe");
        }
        user.setEmail(userRequest.email());
        user.setIdade(userRequest.idade());
        if(userRequest.tipoPerfil() == TipoPerfil.ALUNO){
            user.setPeculiaridades(userRequest.peculiaridades());
        }

        return new UserResponse(userRepository.save(user));
    }

    @Override
    public List<UserResponse> getUserForPersonal(Long personalId) {
     List<User> alunos = userRepository.findByPersonalId(personalId);
        return alunos.stream().map(UserResponse::new).toList();
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("user não encontrado"));
        userRepository.deleteById(user.getId());
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(loginRequest.email(),loginRequest.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        User user = (User) auth.getPrincipal();
        var Token = tokenService.generateToken(user);
        return new LoginResponse(Token);
    }
}
