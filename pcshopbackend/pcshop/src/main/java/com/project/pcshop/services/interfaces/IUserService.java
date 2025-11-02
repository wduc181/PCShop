package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.UserUpdateDTO;
import com.project.pcshop.models.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserService {
    Page<User> getUsers(Pageable pageable);
    User updateUser(Long id, UserUpdateDTO userUpdateDTO) throws Exception;
    User getUserById(Long id) throws Exception;
}
