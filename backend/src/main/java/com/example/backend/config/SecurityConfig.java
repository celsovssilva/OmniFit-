package com.example.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity security) throws Exception {
        security
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {
                    // Users
                    req.requestMatchers(HttpMethod.POST, "/api/user/login").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/api/user/createProfissional").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/api/user/forgot").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/api/user/reset").permitAll();

                    // Users
                    req.requestMatchers(HttpMethod.POST, "/api/user/create").hasAnyRole("PERSONAL", "NUTRI", "ADMIN");
                    req.requestMatchers(HttpMethod.PUT, "/api/user/update").authenticated();
                    req.requestMatchers(HttpMethod.GET, "/api/user/getUsersForPersonal").hasAnyRole("PERSONAL", "ADMIN");
                    req.requestMatchers(HttpMethod.DELETE, "/api/user/delete").hasAnyRole("PERSONAL", "NUTRI", "ADMIN");

                    // Treino
                    req.requestMatchers(HttpMethod.POST, "/api/treino/create").hasAnyRole("PERSONAL", "ADMIN");
                    req.requestMatchers(HttpMethod.PUT, "/api/treino/update/{id}").hasAnyRole("PERSONAL", "ADMIN");
                    req.requestMatchers(HttpMethod.DELETE, "/api/treino/delete/{id}").hasAnyRole("PERSONAL", "ADMIN");
                    req.requestMatchers(HttpMethod.POST, "/api/treino/upload/{treinoId}").hasAnyRole("PERSONAL", "ADMIN");
                    req.requestMatchers(HttpMethod.GET, "/api/treino/getTreinoForUsers").authenticated();
                    req.requestMatchers(HttpMethod.GET, "/api/treino/download/{treinoId}").authenticated();

                    // Dieta
                    req.requestMatchers(HttpMethod.POST, "/api/dieta/create").hasAnyRole("NUTRI", "ADMIN");
                    req.requestMatchers(HttpMethod.PUT, "/api/dieta/update/{id}").hasAnyRole("NUTRI", "ADMIN");
                    req.requestMatchers(HttpMethod.DELETE, "/api/dieta/delete/{id}").hasAnyRole("NUTRI", "ADMIN");
                    req.requestMatchers(HttpMethod.POST, "/api/dieta/upload/{dietaId}").hasAnyRole("NUTRI", "ADMIN");
                    req.requestMatchers(HttpMethod.GET, "/api/dieta/getTreinoForUsers").authenticated();
                    req.requestMatchers(HttpMethod.GET, "/api/dieta/download/{dietaId}").authenticated();

                    // Avaliações Físicas
                    req.requestMatchers("/api/avaliacoesfisicas/create/{alunoId}").hasAnyRole("PERSONAL", "NUTRI", "ADMIN");
                    req.requestMatchers("/api/avaliacoesfisicas/update/{alunoId}").hasAnyRole("PERSONAL", "NUTRI", "ADMIN");
                    req.requestMatchers("/api/avaliacoesfisicas/getUsersAvaliacoes").authenticated();


                    req.anyRequest().authenticated();
                });

        return security.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class).build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}