package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.authentication.AuthenticateChangePasswordDTO;
import com.project.pcshop.dtos.authentication.AuthenticateRegisterDTO;
import com.project.pcshop.models.entities.User;

public interface AuthService {
    User createUser(AuthenticateRegisterDTO authenticateRegisterDTO) throws Exception;
    String login(String phoneNumber, String password) throws Exception;
    User changePassword(Long id, AuthenticateChangePasswordDTO authenticateChangePasswordDTO) throws Exception;
}
