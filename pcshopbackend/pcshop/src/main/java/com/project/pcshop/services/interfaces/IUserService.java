package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.UserDTO;
import com.project.pcshop.models.User;
import org.springframework.stereotype.Service;

@Service
public interface IUserService {
    User createUser(UserDTO userDTO) throws Exception;
    String login(String phoneNumber, String password) throws Exception;
}
