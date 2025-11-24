package com.project.pcshop.controllers;

import com.project.pcshop.dtos.authentication.AuthenticateChangePasswordDTO;
import com.project.pcshop.dtos.authentication.AuthenticateRegisterDTO;
import com.project.pcshop.dtos.authentication.AuthenticateLoginDTO;
import com.project.pcshop.models.entities.User;
import com.project.pcshop.responses.UserResponse;
import com.project.pcshop.services.interfaces.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@Valid @RequestBody AuthenticateRegisterDTO authenticateRegisterDTO, BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            if (!authenticateRegisterDTO.getPassword().equals(authenticateRegisterDTO.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("Password doesn't match.");
            }
            User newUser = authService.createUser(authenticateRegisterDTO);
            UserResponse newUserResponse = UserResponse.fromUser(newUser);
            return ResponseEntity.ok(newUserResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody AuthenticateLoginDTO authenticateLoginDTO) {
        try {
            String token = authService.login(authenticateLoginDTO.getPhoneNumber(), authenticateLoginDTO.getPassword());
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword (
            @PathVariable("id") Long id,
            @RequestBody AuthenticateChangePasswordDTO authenticateChangePasswordDTO,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            User user = authService.changePassword(id, authenticateChangePasswordDTO);
            UserResponse userResponse = UserResponse.fromUser(user);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}