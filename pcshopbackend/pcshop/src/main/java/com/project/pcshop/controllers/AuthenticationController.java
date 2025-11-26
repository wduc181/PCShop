package com.project.pcshop.controllers;

import com.project.pcshop.common.ApiResponse;
import com.project.pcshop.dtos.authentication.AuthenticateChangePasswordDTO;
import com.project.pcshop.dtos.authentication.AuthenticateRegisterDTO;
import com.project.pcshop.dtos.authentication.AuthenticateLoginDTO;
import com.project.pcshop.exceptions.InvalidParamException;
import com.project.pcshop.responses.TokenResponse;
import com.project.pcshop.responses.UserResponse;
import com.project.pcshop.services.interfaces.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> createUser(
            @Valid @RequestBody AuthenticateRegisterDTO authenticateRegisterDTO
    )  throws Exception {
        if (!authenticateRegisterDTO.getPassword().equals(authenticateRegisterDTO.getConfirmPassword())) {
            throw new InvalidParamException("Passwords do not match");
        }

        UserResponse newUserResponse = authService.createUser(authenticateRegisterDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                .status(HttpStatus.CREATED)
                .message("Registration Successful")
                .responseObject(newUserResponse)
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(
            @Valid @RequestBody AuthenticateLoginDTO authenticateLoginDTO
    ) throws Exception{
        TokenResponse tokenResponse = authService.login(authenticateLoginDTO);
        return ResponseEntity.ok().body(ApiResponse.builder()
                    .status(HttpStatus.OK)
                    .message("Login Successful")
                    .responseObject(tokenResponse)
                    .build());
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<ApiResponse<?>> changePassword (
            @PathVariable("id") Long id,
            @Valid @RequestBody AuthenticateChangePasswordDTO authenticateChangePasswordDTO
    ) throws Exception {
        UserResponse userResponse = authService.changePassword(id, authenticateChangePasswordDTO);
        return ResponseEntity.ok(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Change Password Successful")
                .responseObject(userResponse)
                .build());
    }
}