package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.authentication.AuthenticateChangePasswordDTO;
import com.project.pcshop.dtos.authentication.AuthenticateLoginDTO;
import com.project.pcshop.dtos.authentication.AuthenticateRegisterDTO;
import com.project.pcshop.responses.TokenResponse;
import com.project.pcshop.responses.UserResponse;

public interface AuthService {
    UserResponse createUser(AuthenticateRegisterDTO authenticateRegisterDTO) throws Exception;
    TokenResponse login(AuthenticateLoginDTO authenticateLoginDTO) throws Exception;
    UserResponse changePassword(Long id, AuthenticateChangePasswordDTO authenticateChangePasswordDTO) throws Exception;
}
