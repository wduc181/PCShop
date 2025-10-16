package com.project.pcshop.controllers;

import com.project.pcshop.models.User;
import com.project.pcshop.services.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;

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
