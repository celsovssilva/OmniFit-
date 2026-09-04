package com.example.backend.config;

import com.auth0.jwt.JWT;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter  extends OncePerRequestFilter  {
    @Autowired
    UserRepository userRepository;
    @Autowired
    TokenService tokenService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = recuperarToken(request);
        if(token != null) {
            var subject = tokenService.getSubject(token);
            User user = userRepository.findByEmail(subject).orElse(null);
            if (user != null) {
                var userNamePassword = new UsernamePasswordAuthenticationToken(user,null,user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(userNamePassword);

            }
        }

                filterChain.doFilter(request,response);
        }
    private String recuperarToken(HttpServletRequest request){
        var a = request.getHeader("Authorization");
        if(a != null){
            return a.replace("Bearer","").trim();
        }

        return null;
    }
}




