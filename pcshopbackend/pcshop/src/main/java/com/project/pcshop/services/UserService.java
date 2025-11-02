package com.project.pcshop.services;

import com.project.pcshop.components.SecurityUtil;
import com.project.pcshop.dtos.UserUpdateDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.PermissionDenyException;
import com.project.pcshop.models.entities.User;
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
    private final SecurityUtil securityUtil;

    @Override
    public User getUserById(Long id) throws Exception {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User not found"));

        Long userId = securityUtil.getCurrentUser();
        boolean isAdmin = securityUtil.currentUserIsAdmin();
        if (!(existingUser.getId().equals(userId) || isAdmin)){
            throw new PermissionDenyException("You don't have permission to get other user's info");
        }

        return existingUser;
    }

    @Override
    public Page<User> getUsers(Pageable pageable){
        return userRepository.findAll(pageable);
    }

    @Override
    public User updateUser(Long id, UserUpdateDTO userUpdateDTO) throws Exception{
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User not found"));

        Long userId = securityUtil.getCurrentUser();
        boolean isAdmin = securityUtil.currentUserIsAdmin();
        if (!(existingUser.getId().equals(userId) || isAdmin)){
            throw new PermissionDenyException("You don't have permission to change info");
        }

        existingUser.setFullName(userUpdateDTO.getFullname());
        existingUser.setEmail(userUpdateDTO.getEmail());
        existingUser.setDateOfBirth(userUpdateDTO.getDateOfBirth());
        existingUser.setAddress(userUpdateDTO.getAddress());

        return userRepository.save(existingUser);
    }
}
