package com.example.backend.config;

import com.example.backend.entity.StatusConta;
import com.example.backend.entity.TipoPerfil;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Bean
    public CommandLineRunner init() {return args ->{
        boolean byTipoPerfil = userRepository.existsByTipoPerfil(TipoPerfil.ADMIN);
        if (!byTipoPerfil){
            User user = new User();
            user.setNome("Administrador");
            String senhaHash = passwordEncoder.encode("123456");
            user.setSenha(senhaHash);
            user.setTipoPerfil(TipoPerfil.ADMIN);
            user.setEmail("celsoviniciussilva151@gmail.com");
            user.setStatusConta(StatusConta.ATIVO);
            userRepository.save(user);

        }
    };
}
}
