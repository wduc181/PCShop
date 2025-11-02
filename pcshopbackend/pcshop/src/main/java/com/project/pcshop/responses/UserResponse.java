package com.project.pcshop.responses;

import com.project.pcshop.models.entities.User;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String email;
    private LocalDate dateOfBirth;
    private String authority;
    private LocalDateTime createdAt;

    public static UserResponse fromUser(User user) {
        String name = user.getRole() != null ? user.getRole().getName() : null;
        String roleName = name != null ? name.trim().toUpperCase() : "USER";
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .email(user.getEmail())
                .dateOfBirth(user.getDateOfBirth())
                .authority(roleName)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
