package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.UserDTO;
import com.project.pcshop.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface IUserService {
    User createUser(UserDTO userDTO) throws Exception;
    String login(String phoneNumber, String password) throws Exception;
    Page<User> getUsers(Pageable pageable);
}
