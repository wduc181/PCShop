package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.UserDTO;
import com.project.pcshop.models.User;

public interface IAuthService {
    User createUser(UserDTO userDTO) throws Exception;
    String login(String phoneNumber, String password) throws Exception;
}
