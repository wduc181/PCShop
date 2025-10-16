package com.project.pcshop.services;

import com.project.pcshop.components.JwtTokenUtil;
import com.project.pcshop.dtos.UserDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.PermissionDenyException;
import com.project.pcshop.models.Role;
import com.project.pcshop.models.User;
import com.project.pcshop.repositories.RoleRepository;
import com.project.pcshop.repositories.UserRepository;
import com.project.pcshop.services.interfaces.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public User createUser(UserDTO userDTO) throws Exception {
        String phoneNumber = userDTO.getPhoneNumber();
        if(userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new DataIntegrityViolationException("Phone number already exists.");
        }
        Role role = roleRepository.findById(userDTO.getRoleId())
                .orElseThrow(() ->new DataNotFoundException("role not found."));
        if (role.getName().toUpperCase().equals(Role.ADMIN)) {
            throw new PermissionDenyException("You are not allowed to register an admin account");
        }
        User newUser = User.builder()
                .fullName(userDTO.getFullname())
                .phoneNumber(userDTO.getPhoneNumber())
                .password(userDTO.getPassword())
                .email(userDTO.getEmail())
                .address(userDTO.getAddress())
                .dateOfBirth(userDTO.getDateOfBirth())
                .build();
        newUser.setRole(role);
        String password = userDTO.getPassword();
        String encodedPassword = passwordEncoder.encode(password);
        newUser.setPassword(encodedPassword);
        newUser.setIsActive(true);
        return userRepository.save(newUser);
    }

    @Override
    public String login(String phoneNumber, String password) throws Exception {
        Optional<User> user = userRepository.findByPhoneNumber(phoneNumber);
        if (user.isEmpty()) {
            throw new DataNotFoundException("Wrong phone number or password.");
        }
        User existingUser = user.get();

        if (!passwordEncoder.matches(password, existingUser.getPassword())) {
            throw new BadCredentialsException("Wrong phone number or password.");
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                existingUser, password, existingUser.getAuthorities());
        authenticationManager.authenticate(authenticationToken);
        return jwtTokenUtil.generateToken(existingUser);
    }
}
