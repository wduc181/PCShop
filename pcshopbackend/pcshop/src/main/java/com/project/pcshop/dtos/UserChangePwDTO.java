package com.project.pcshop.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserChangePwDTO {
    @NotBlank(message = "Password is required.")
    private String password;

    @JsonProperty("new_password")
    @NotBlank(message = "Invalid new password")
    private String newPassword;
}
