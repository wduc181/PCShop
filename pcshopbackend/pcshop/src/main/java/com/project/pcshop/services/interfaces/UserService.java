package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.user.UserUpdateDTO;
import com.project.pcshop.responses.UserResponse;
import org.springframework.data.domain.Page;

public interface UserService {
    UserResponse getUserById(Long id) throws Exception;
    Page<UserResponse> getUsers(Integer page, Integer limit);
    UserResponse updateUser(Long id, UserUpdateDTO userUpdateDTO) throws Exception;

}
