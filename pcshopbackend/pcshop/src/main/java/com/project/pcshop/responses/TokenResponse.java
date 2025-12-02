package com.project.pcshop.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.pcshop.entities.User;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TokenResponse {
    @JsonProperty("token")
    private String token;

    @JsonProperty("token_type")
    private String tokenType = "Bearer";

    @JsonProperty("id")
    private Long id;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("roles")
    private List<String> roles;

    public static TokenResponse fromUser(User user, String token) {
        return TokenResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .phoneNumber(user.getPhoneNumber())
                .roles(user.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList())
                .build();
    }
}