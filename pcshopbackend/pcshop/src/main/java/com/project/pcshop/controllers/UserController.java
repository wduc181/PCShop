package com.project.pcshop.controllers;

import com.project.pcshop.common.ApiResponse;
import com.project.pcshop.dtos.user.UserUpdateDTO;
import com.project.pcshop.responses.UserResponse;
import com.project.pcshop.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getUser(
            @PathVariable("id") Long id
    ) throws Exception {
        UserResponse userResponse = userService.getUserById(id);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("User found with id = " + id)
                .responseObject(userResponse)
                .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<ApiResponse<?>> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        Page<UserResponse> userResponsesPage = userService.getUsers(page, limit);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .status(HttpStatus.OK)
                .message("Got user page")
                .responseObject(userResponsesPage)
                .build()
        );
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/changeInfo/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable("id") Long id,
            @RequestBody UserUpdateDTO userUpdateDTO
    ) throws Exception {
        UserResponse userResponse = userService.updateUser(id, userUpdateDTO);
        return ResponseEntity.ok(userResponse);
    }
}