package com.project.pcshop.services.implementations;

import com.project.pcshop.dtos.authentication.AuthenticateLoginDTO;
import com.project.pcshop.exceptions.InvalidParamException;
import com.project.pcshop.responses.TokenResponse;
import com.project.pcshop.responses.UserResponse;
import com.project.pcshop.security.components.JwtTokenUtil;
import com.project.pcshop.dtos.authentication.AuthenticateChangePasswordDTO;
import com.project.pcshop.dtos.authentication.AuthenticateRegisterDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.PermissionDenyException;
import com.project.pcshop.entities.Role;
import com.project.pcshop.entities.User;
import com.project.pcshop.repositories.RoleRepository;
import com.project.pcshop.repositories.UserRepository;
import com.project.pcshop.services.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    @Override
    public UserResponse createUser(AuthenticateRegisterDTO authenticateRegisterDTO) throws Exception {
        if (!authenticateRegisterDTO.getPassword().equals(authenticateRegisterDTO.getConfirmPassword())) {
            throw new InvalidParamException("Passwords do not match");
        }
        String phoneNumber = authenticateRegisterDTO.getPhoneNumber();
        if(userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new InvalidParamException("Phone number already exists.");
        }

        Role role = roleRepository.findById(authenticateRegisterDTO.getRoleId())
                .orElseThrow(() ->new DataNotFoundException("role not found."));
        if (role.getName().toUpperCase().equals(Role.ADMIN)) {
            throw new PermissionDenyException("You are not allowed to register an admin account");
        }
        String password = authenticateRegisterDTO.getPassword();
        String encodedPassword = passwordEncoder.encode(password);

        User newUser = User.builder()
                .fullName(authenticateRegisterDTO.getFullname())
                .phoneNumber(authenticateRegisterDTO.getPhoneNumber())
                .password(authenticateRegisterDTO.getPassword())
                .email(authenticateRegisterDTO.getEmail())
                .address(authenticateRegisterDTO.getAddress())
                .dateOfBirth(authenticateRegisterDTO.getDateOfBirth())
                .role(role)
                .password(encodedPassword)
                .isActive(true)
                .build();

        userRepository.save(newUser);
        return UserResponse.fromUser(newUser);
    }

    @Override
    public TokenResponse login(AuthenticateLoginDTO authenticateLoginDTO) throws Exception {
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    authenticateLoginDTO.getPhoneNumber(),
                    authenticateLoginDTO.getPassword()
            );
            authenticationManager.authenticate(authenticationToken);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Wrong phone number or password");
        }

        User existingUser = userRepository.findByPhoneNumber(authenticateLoginDTO.getPhoneNumber())
                .orElseThrow(() -> new DataNotFoundException("User not found"));

        String token = jwtTokenUtil.generateToken(existingUser);

        return TokenResponse.fromUser(existingUser, token);
    }

    @Transactional
    @Override
    public UserResponse changePassword(Long id, AuthenticateChangePasswordDTO authenticateChangePasswordDTO) throws Exception {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->new DataNotFoundException("User not found."));

        String oldPassword = authenticateChangePasswordDTO.getPassword();
        if (!passwordEncoder.matches(oldPassword, existingUser.getPassword())) {
            throw new BadCredentialsException("Wrong password");
        }

        String encodedPassword = passwordEncoder.encode(authenticateChangePasswordDTO.getNewPassword());
        existingUser.setPassword(encodedPassword);

        userRepository.save(existingUser);

        return UserResponse.fromUser(existingUser);
    }
}
