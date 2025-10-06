package com.project.pcshop.controllers;

import com.project.pcshop.dtos.UserDTO;
import com.project.pcshop.dtos.UserLoginDTO;
import com.project.pcshop.models.User;
import com.project.pcshop.services.interfaces.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/users")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDTO userDTO, BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            if (!userDTO.getPassword().equals(userDTO.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("Password doesn't match.");
            }
            User newUser = userService.createUser(userDTO);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody UserLoginDTO userLoginDTO) {
        try {
            String token = userService.login(userLoginDTO.getPhoneNumber(), userLoginDTO.getPassword());

            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<List<User>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        PageRequest pageRequest = PageRequest.of(
                page - 1,
                limit,
                Sort.by("createdAt").descending()
        );

        Page<User> productPage = userService.getUsers(pageRequest);

        return ResponseEntity.ok(productPage.getContent());
    }
}
//admin token: eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU51bWJlciI6IjAwMDAwMDAwMDIiLCJzdWIiOiIwMDAwMDAwMDAyIiwiZXhwIjoxNzYyMDEzNTk3fQ.vPZfRfIzax_gHIJZ9r_MsbAZqW_KRW26stKs3jQRw1U
//user token: eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU51bWJlciI6IjEwMDAwMDAwMDEiLCJzdWIiOiIxMDAwMDAwMDAxIiwiZXhwIjoxNzYyMDE0OTA0fQ.BlTZWCfi1dzJ9fDktzHGxECfP-Q9YFqRsQKoJfk4H7k