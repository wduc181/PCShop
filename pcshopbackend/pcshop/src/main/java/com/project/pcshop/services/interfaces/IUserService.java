package com.project.pcshop.services.interfaces;

import com.project.pcshop.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserService {
    Page<User> getUsers(Pageable pageable);
}
