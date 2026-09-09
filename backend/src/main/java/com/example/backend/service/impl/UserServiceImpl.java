package com.example.backend.service.impl;

import com.example.backend.entity.TipoPerfil;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.request.LoginRequest;
import com.example.backend.request.ResetSenhaRequest;
import com.example.backend.request.UserRequest;
import com.example.backend.response.LoginResponse;
import com.example.backend.response.ResetSenhaResponse;
import com.example.backend.response.UserResponse;
import com.example.backend.service.TokenService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
    @Autowired
    private JavaMailSender javaMailSender;
    @Override
    public UserResponse createUser(UserRequest user) {
        User u = new User();
        u.setNome(user.nome());
        if(this.userRepository.findByEmail(user.email()).isPresent()){
            throw new RuntimeException("email já existe");
        }
        u.setEmail(user.email());
        String senhaHash = passwordEncoder.encode(user.senha());
        u.setSenha(senhaHash);
        u.setIdade(user.idade());
        u.setTipoPerfil(user.tipoPerfil());
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        User usuarioLogado = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("user não encontrado"));
        if(user.tipoPerfil() == TipoPerfil.ALUNO){
            u.setPeculiaridades(user.peculiaridades());
            u.setPersonalId(usuarioLogado.getId());

        }
        return new UserResponse(userRepository.save(u));
    }

    @Override
    public UserResponse updateUser(UserRequest userRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("user não encontrado"));

            user.setNome(userRequest.nome());
        Optional<User> emailExist = userRepository.findByEmail(userRequest.email());
            if(emailExist.isPresent() || !emailExist.get().getId().equals(user.getId())){
                throw new RuntimeException("email já existe");
            }
            user.setEmail(userRequest.email());
            user.setIdade(userRequest.idade());
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            User usuarioLogado = (User) authentication.getPrincipal();
            if(userRequest.tipoPerfil() == TipoPerfil.ALUNO){
                user.setPeculiaridades(userRequest.peculiaridades());
                user.setPersonalId(usuarioLogado.getId());
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
            try {
                var auth = this.authenticationManager.authenticate(usernamePassword);
                User user = (User) auth.getPrincipal();
                var token = tokenService.generateToken(user);
                return new LoginResponse(token);
            } catch (Exception e) {
                throw new RuntimeException("o erro é: " + e);
            }

    }

    @Override
    public ResetSenhaResponse forgotPassword(ResetSenhaRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(()-> new RuntimeException("email não encontrado"));
        SecureRandom random = new SecureRandom();
        int numero = random.nextInt(1000000);
        String codigoRecuperacao = String.format("%06d", numero);
         LocalDateTime expiracaoCodigo =LocalDateTime.now().plusMinutes(15);
        user.setCodigoRedefinicao(codigoRecuperacao);
        user.setExpiracaoCodigo(expiracaoCodigo);
        userRepository.save(user);
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(user.getEmail());
        simpleMailMessage.setSubject("Código de recuperação");
        simpleMailMessage.setText("o código de recuperação é:" + " " + codigoRecuperacao + "o codigo expira em:" + " "+ expiracaoCodigo);
        javaMailSender.send(simpleMailMessage);
        return new ResetSenhaResponse("solicitação de mudança enviada");
    }

    @Override
    public ResetSenhaResponse resetPassword(ResetSenhaRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(()-> new RuntimeException("email não encontrado"));

        if (!request.pin().equals(user.getCodigoRedefinicao()) || user.getExpiracaoCodigo().isBefore(LocalDateTime.now())){
                throw new RuntimeException("codigo errado ou  tempo expirado");
        }

        String senhaHash = passwordEncoder.encode(request.novaSenha());
        user.setSenha(senhaHash);
        user.setCodigoRedefinicao(null);
        user.setExpiracaoCodigo(null);
        userRepository.save(user);

        return new ResetSenhaResponse("senha  alterada");
    }
}
