package com.project.pcshop.services;

import com.project.pcshop.models.User;
import com.project.pcshop.repositories.UserRepository;
import com.project.pcshop.services.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;

    @Override
    public Page<User> getUsers(Pageable pageable){
        return userRepository.findAll(pageable);
    }
}
