package com.project.pcshop.components;

import com.project.pcshop.models.User;
import com.project.pcshop.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

    private final UserRepository userRepository;

    public Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;

        String phone = auth.getName();
        if (phone == null) return null;

        return userRepository.findByPhoneNumber(phone)
                .map(User::getId)
                .orElse(null);
    }

    public boolean currentUserIsAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;

        for (GrantedAuthority authority : auth.getAuthorities()) {
            if (authority != null && "ROLE_ADMIN".equalsIgnoreCase(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }
}
