package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.UserChangePwDTO;
import com.project.pcshop.dtos.UserRegisterDTO;
import com.project.pcshop.models.entities.User;

public interface IAuthService {
    User createUser(UserRegisterDTO userRegisterDTO) throws Exception;
    String login(String phoneNumber, String password) throws Exception;
    User changePassword(Long id, UserChangePwDTO userChangePwDTO) throws Exception;
}
