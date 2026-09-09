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
    public SecurityFilterChain securityFilterChain(HttpSecurity security){
        security
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req ->{
                    //users
                    req.requestMatchers(HttpMethod.POST,"/api/user/login").permitAll();
                    req.requestMatchers(HttpMethod.POST,"/api/user/create").permitAll();
                    req.requestMatchers(HttpMethod.PUT,"/api/user/update").authenticated();
                    req.requestMatchers(HttpMethod.POST,"/api/user/forgot").permitAll();
                    req.requestMatchers(HttpMethod.POST,"/api/user/reset").permitAll();
                    //treino
                    req.requestMatchers(HttpMethod.POST,"/api/treino/create").hasAnyRole("PERSONAL","ADMIN");
                    req.requestMatchers(HttpMethod.PUT,"/api/treino/update/{id}").hasAnyRole("PERSONAL","NUTRI","ADMIN");
                    req.requestMatchers(HttpMethod.GET,"/api/treino/getTreinoForUsers").hasAnyRole("PERSONAL","ADMIN");
                    req.requestMatchers(HttpMethod.DELETE,"/api/treino/delete/{id}").hasAnyRole("PERSONAL","ADMIN");

                });
                return security.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();

    }
    @Bean
    public PasswordEncoder passwordEncoder(){
        return  new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration){
        return authenticationConfiguration.getAuthenticationManager();
    }
}
