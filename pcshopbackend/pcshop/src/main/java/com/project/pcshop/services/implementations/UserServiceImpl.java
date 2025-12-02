package com.project.pcshop.services.implementations;

import com.project.pcshop.responses.UserResponse;
import com.project.pcshop.security.components.SecurityUtil;
import com.project.pcshop.dtos.user.UserUpdateDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.PermissionDenyException;
import com.project.pcshop.entities.User;
import com.project.pcshop.repositories.UserRepository;
import com.project.pcshop.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    @Override
    public UserResponse getUserById(Long id) throws Exception {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User not found"));

        Long userId = securityUtil.getCurrentUser();
        boolean isAdmin = securityUtil.currentUserIsAdmin();
        if (!(existingUser.getId().equals(userId) || isAdmin)){
            throw new PermissionDenyException("You don't have permission to get other user's info");
        }

        return UserResponse.fromUser(existingUser);
    }

    @Override
    public Page<UserResponse> getUsers(Integer page, Integer limit){
        PageRequest pageRequest = PageRequest.of(
                page - 1,
                limit,
                Sort.by("createdAt").descending()
        );
        Page<User> userPage = userRepository.findAll(pageRequest);
        return userPage.map(UserResponse::fromUser);
    }

    @Transactional
    @Override
    public UserResponse updateUser(Long id, UserUpdateDTO userUpdateDTO) throws Exception{
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

        userRepository.save(existingUser);
        return UserResponse.fromUser(existingUser);
    }
}
