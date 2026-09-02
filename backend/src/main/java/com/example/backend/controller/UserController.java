package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.request.UserRequest;
import com.example.backend.response.UserResponse;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public UserResponse create(@Valid @RequestBody UserRequest userRequest){

        return userService.createUser(userRequest);
    }

    @PutMapping("/update")
    public UserResponse update(@Valid @RequestBody UserRequest userRequest, Authentication authentication){
        User user = (User) authentication.getPrincipal();
        return userService.updateUser(userRequest, user.getId());
    }

    @GetMapping("/getUsersForPersonal")
    public List<UserResponse> getUser(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        return userService.getUserForPersonal(user.getPersonalId());
    }

    @DeleteMapping("/delete")
    public void deleteUsers( Authentication authentication){
        User user = (User) authentication.getPrincipal();
        userService.deleteUser(user.getId());
    }
}
